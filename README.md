# Skychopath theme

Sky Hong 的個人 Ghost 主題，基於官方 Source v1.7.4。MIT 授權與官方著作權聲明見 LICENSE。

- 個人模板：partials/skychopath/
- 個人 CSS：assets/custom/skyhong.css
- 個人 JavaScript：assets/custom/skyhong.js
- 首頁內容：Ghost 後台 Pages → 歡迎來到 Skychopath.（slug: home）
- 路由來源：專案根目錄 config/，不放進主題 ZIP

需要 Node ^22.22.3 或 ^24.15.0。使用 npm ci 安裝，npm run dev 監看，npm run test:ci 驗證，npm run zip 產生 dist/skychopath-theme.zip。

請從專案根目錄執行 scripts/deploy-theme.sh 部署；完整工作流程見 ../README.md 和 ../docs/THEME-MAINTENANCE.md。此資料夾是開發來源，線上使用打包後安裝的版本。
