# Skychopath theme

這裡就是 skyhong.tw 使用的主題，也是獨立 Git repo。Ghost 直接將此資料夾掛載為 `/var/lib/ghost/content/themes/skychopath-theme`，沒有第二份日常部署副本。

目前以官方 Source **v1.7.4** 為基底，個人版本 **1.7.4-skychopath.1**。官方歷史與個人修改的提交均保留。Git 目前只在這台伺服器，尚未設定自己的 `origin`；`source-upstream` 僅供取得官方更新，已停用推送。

## 平常改哪裡

| 內容 | 編輯位置 |
| --- | --- |
| 首頁文字、照片、聯絡方式 | Ghost 後台 → Pages →「歡迎來到 Skychopath.」（保留 slug `home` 與已發布狀態） |
| 文章、About、英文介紹、留言板 | Ghost 後台 Pages／Posts |
| 配色、Logo、導覽 | Ghost 後台品牌／主題設定 |
| Google Analytics | Ghost 後台 Code Injection |
| 個人 CSS／JavaScript | `assets/custom/skyhong.css`、`assets/custom/skyhong.js` |
| 首頁排版與側欄 | `partials/skychopath/home.hbs` |
| 頁尾連結 | `partials/skychopath/footer-links.hbs` |
| 網址路由／轉址 | Ghost 後台上傳；實際檔案位於主題 repo 外的 `../ghost-docker/content/settings/routes.yaml` 與 `../ghost-docker/content/data/redirects.json` |

自訂樣式在官方 CSS 後載入，自訂 JavaScript 為獨立 defer 腳本。主要接入點是 `home.hbs`、`default.hbs` 和 `partials/components/footer.hbs`。優先把個人修改放進 `partials/skychopath/` 與 `assets/custom/`，可減少未來合併官方更新的衝突。

## 修改與生效

```bash
cd /var/www/skyhong-blog/theme
# 首次安裝或 lockfile 改變時
npm ci
# 修改後建置並執行 Ghost 主題檢查
npm test
git add .
git commit -m 'Describe the theme change'
# 讓 Ghost 重新載入模板
docker restart ghost-docker-7fw0la-ghost-1
```

需要 Node `^22.22.3` 或 `^24.15.0`。`npm run dev` 可監看並建置檔案，不會啟動另一台 Ghost。

這是線上主題：儲存個人 CSS／JS 後，重新整理即可讀取；瀏覽器快取可能需要強制重新整理。修改 `assets/css/` 或 `assets/js/` 後先跑 `npm run build`；修改模板或主題設定後重啟 Ghost。Git 切換分支、合併或還原，也會改變這份線上檔案。`npm run zip` 只用於額外匯出，不是本站部署步驟。

Ghost 以 UID/GID `1000:1000` 執行，主題掛載為唯讀；主機上的 repo 仍可正常編輯。請在這裡改主題，避免透過 Ghost 後台上傳 ZIP 覆寫這個掛載。Compose 設定在 repo 外的 `../ghost-docker/`，更新 Ghost 映像時保留掛載與 user 設定。

## 更新官方 Source

先提交現有修改，選定官方正式版標籤後取得並合併。例如以下 `vX.Y.Z` 應替換為要更新的版本：

```bash
git fetch source-upstream tag vX.Y.Z
git merge vX.Y.Z
```

有衝突時處理上述接入點，保留個人主題名稱、作者、custom 設定與 npm 建置方式；不繼承官方發行工具。更新 `package.json` 的個人版本及 `skychopath.upstreamTag`，依賴變動時同步更新 lockfile。執行 `npm test`、提交並重啟 Ghost，檢查首頁、文章與受影響頁面。未完成的合併可用 `git merge --abort` 取消。

由於這份工作目錄就是線上檔案，大幅升級若需要先測試，可另外使用暫時的 worktree／測試 Ghost；日常不需要維護第二份主題。

## 備份與還原

已提交的修改可用 `git revert <commit>` 還原，再建置與重啟 Ghost。Git 只保存主題，文章、圖片、後台設定和資料庫仍需要另外備份。

2026-09-13 改為直接掛載前的完整根 repo、舊工具、Compose 與主題保存在 `../ghost-docker/.maintenance/direct-theme-20260913/`。歷史備份不參與日常執行。
