# Skychopath theme

這裡就是 skyhong.tw 使用的主題，也是獨立 Git repo。Ghost 直接將此資料夾掛載為 `/var/lib/ghost/content/themes/skychopath-theme`，沒有第二份日常部署副本。

目前以官方 Source **v1.7.4** 為基底，個人版本 **1.7.4-skychopath.2**。官方歷史與個人修改的提交均保留。個人 GitHub repo 是 [skyhong2002/skychopath-theme](https://github.com/skyhong2002/skychopath-theme)，已設定為 `origin`，本機 `main` 追蹤 `origin/main`；`source-upstream` 僅供取得官方更新，已停用推送。

GitHub 原有的 2025 年個人修改歷史已合併至目前版本；整合保留本機 Source 1.7.4 與 Ghost Page 首頁架構。提交後以 `git push origin main` 同步至 GitHub（伺服器需具備推送認證）。從 GitHub 取得更新時先執行 `git fetch origin` 並檢查差異；合併會直接影響線上主題，仍須遵循下方建置與重載步驟。

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
| 頁尾社群圖示 | `partials/skychopath/social-links.hbs`（不顯示 X／Facebook；後台帳號資料保留） |
| 網址路由／轉址 | Ghost 後台上傳；實際檔案位於主題 repo 外的 `../ghost-docker/content/settings/routes.yaml` 與 `../ghost-docker/content/data/redirects.json` |

自訂樣式在官方 CSS 後載入，自訂 JavaScript 為獨立 defer 腳本。主要接入點是 `home.hbs`、`default.hbs` 和 `partials/components/footer.hbs`。優先把個人修改放進 `partials/skychopath/` 與 `assets/custom/`，可減少未來合併官方更新的衝突。

## 修改與生效

```bash
cd /var/www/skyhong-blog/theme
# 首次安裝或 lockfile 改變時
bun install --frozen-lockfile
# 修改後建置並執行 Ghost 主題檢查
bun run test
git add .
git commit -m 'Describe the theme change'
# 讓 Ghost 重新載入模板
docker restart ghost-docker-7fw0la-ghost-1
```

主題工具統一使用 **[Bun 1.4.2](https://bun.com/docs/installation)**，版本記錄在 `package.json` 的 `packageManager`，CI 也讀取同一設定。使用 `bun.lock` 鎖定依賴；新增或更新依賴後提交 lockfile。Gulp 與 GScan 均由 Bun 執行，Ghost CMS 本體使用官方 Docker 映像內的 Node.js。

請使用 `bun run test` 執行「建置＋Ghost 主題檢查」；`bun test` 是 Bun 內建測試器，並非本專案的檢查指令。`bun run dev` 可監看並建置檔案，不會啟動另一台 Ghost。

這是線上主題：儲存個人 CSS／JS 後，重新整理即可讀取；瀏覽器快取可能需要強制重新整理。修改 `assets/css/` 或 `assets/js/` 後先跑 `bun run build`；修改模板或主題設定後重啟 Ghost。Git 切換分支、合併或還原，也會改變這份線上檔案。`bun run zip` 只用於額外匯出，不是本站部署步驟。

Ghost 以 UID/GID `1000:1000` 執行，主題掛載為唯讀；主機上的 repo 仍可正常編輯。請在這裡改主題，避免透過 Ghost 後台上傳 ZIP 覆寫這個掛載。Compose 設定在 repo 外的 `../ghost-docker/`，更新 Ghost 映像時保留掛載與 user 設定。

首頁透過路由載入已發布的 `home` Page。若模板收到的資料沒有 Page，會顯示網站名稱與暫時無法顯示的提示；正文仍只在 Ghost 後台維護。若 Ghost 因路由錯誤直接回傳錯誤頁，需修正路由／發布狀態，模板提示無法攔截該情況。

## 更新官方 Source

先提交現有修改，選定官方正式版標籤後取得並合併。例如以下 `vX.Y.Z` 應替換為要更新的版本：

```bash
git fetch source-upstream tag vX.Y.Z
git merge vX.Y.Z
```

有衝突時處理上述接入點，保留個人主題名稱、作者、custom 設定與 Bun 建置方式；不繼承官方發行工具。更新 `package.json` 的個人版本及 `skychopath.upstreamTag`，依賴變動時同步更新 lockfile。執行 `bun run test`、提交並重啟 Ghost，檢查首頁、文章與受影響頁面。未完成的合併可用 `git merge --abort` 取消。

由於這份工作目錄就是線上檔案，大幅升級若需要先測試，可另外使用暫時的 worktree／測試 Ghost；日常不需要維護第二份主題。

## 備份與還原

已提交的修改可用 `git revert <commit>` 還原，再建置與重啟 Ghost。Git 只保存主題，文章、圖片、後台設定和資料庫仍需要另外備份。

2026-09-13 改為直接掛載前的完整根 repo、舊工具、Compose 與主題保存在 `../ghost-docker/.maintenance/direct-theme-20260913/`。歷史備份不參與日常執行。
