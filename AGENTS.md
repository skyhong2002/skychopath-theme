# Skychopath theme

- Read README.md. This repository is directly mounted into the production Ghost container; modifications can affect the live site immediately.
- Prefer `partials/skychopath/` and `assets/custom/` for personal changes. Keep upstream template changes limited to required integration points.
- Homepage text belongs to the published Ghost Page with slug `home`, not a second hardcoded template copy. Preserve Ghost helpers and existing custom setting keys.
- Keep package name `skychopath-theme`, personal author metadata, npm and package-lock.json. Do not hand-edit `assets/built/`; build it with npm.
- Upstream Source history is native Git ancestry. Fetch and merge selected upstream releases; no subtree, copy deployment or official ZIP replacement is needed. Resolve conflicts before reloading Ghost.
- Run `npm test` for theme code changes. Restart only this project's Ghost when templates need reloading, then check affected public pages. Do not create or push a personal remote without user authorization; source-upstream is fetch-only.
- Never commit secrets, database exports, runtime content, node_modules or backups. Do not alter unrelated services.
