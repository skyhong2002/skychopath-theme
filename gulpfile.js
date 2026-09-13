const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');
const {readdirSync} = require('node:fs');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-zip').default;
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const beeper = require('beeper').default;

// postcss plugins
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const easyimport = require('postcss-easy-import');


function serve(done) {
    livereload.listen();
    done();
}

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function hbs(done) {
    pump([
        src(['*.hbs', 'partials/**/*.hbs']),
        livereload()
    ], handleError(done));
}

function css(done) {
    pump([
        src('assets/css/screen.css', {sourcemaps: true}),
        postcss([
            easyimport,
            autoprefixer(),
            cssnano()
        ]),
        dest('assets/built/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}

function js(done) {
    pump([
        // Keep library-first ordering deterministic across runtimes/filesystems.
        src(['assets/js/lib', 'assets/js'].flatMap(directory =>
            readdirSync(directory).filter(file => file.endsWith('.js')).sort()
                .map(file => `${directory}/${file}`)
        ), {sourcemaps: true}),
        concat('source.js'),
        uglify(),
        dest('assets/built/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}

function zipper(done) {
    const filename = require('./package.json').name + '.zip';

    pump([
        src([
            '**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**',
            '!yarn-error.log',
            '!yarn.lock',
            '!bun.lock',
            '!gulpfile.js',
            '!README.md',
            '!AGENTS.md',
            '!.git', '!.git/**',
            '!renovate.json',
            '!routes.yaml'
        ]),
        zip(filename),
        dest('dist/')
    ], handleError(done));
}

const cssWatcher = () => watch('assets/css/**', css);
const jsWatcher = () => watch('assets/js/**', js);
const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs'], hbs);
const customWatcher = () => watch('assets/custom/**', hbs);
const watcher = parallel(cssWatcher, jsWatcher, hbsWatcher, customWatcher);
const build = series(css, js);

exports.build = build;
exports.zip = series(build, zipper);
exports.default = series(build, serve, watcher);
