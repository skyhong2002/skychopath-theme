# Skychopath theme

- Read README.md. This repository is directly mounted into the production Ghost container; modifications can affect the live site immediately.
- Prefer `partials/skychopath/` and `assets/custom/` for personal changes. Keep upstream template changes limited to required integration points.
- Homepage text belongs to the published Ghost Page with slug `home`, not a second hardcoded template copy. Preserve Ghost helpers and existing custom setting keys.
- Keep package name `skychopath-theme`, personal author metadata, Bun and bun.lock. Do not hand-edit `assets/built/`; build it with `bun run build`.
- Upstream Source history is native Git ancestry. Fetch and merge selected upstream releases; no subtree, copy deployment or official ZIP replacement is needed. Resolve conflicts before reloading Ghost.
- Run `bun run test` for theme code changes. Restart only this project's Ghost when templates need reloading, then check affected public pages. Do not create or push a personal remote without user authorization; source-upstream is fetch-only.
- Never commit secrets, database exports, runtime content, node_modules or backups. Do not alter unrelated services.
- Use the Bun version pinned in `package.json` for dependency installation and all theme tools, including CI. Use `bun install --frozen-lockfile` and `bun run test`; bare `bun test` does not run the theme checks. The user explicitly switched this project from npm/pnpm to Bun on 2026-09-13. Ghost itself continues using its official Docker runtime.
- Put temporary theme checkouts outside the system temp directory (for example under `/home/ubuntu/.cache/`). GScan 6.6.1 deletes ignored entries such as `node_modules`, `.git`, and `AGENTS.md` when the scanned theme is under `os.tmpdir()`.

## 使用者意圖與正式站脈絡（2026-09-13 核對）

- 使用者 Sky Hong 維護的個人網站是 `https://skyhong.tw`。這個工作階段位於正式伺服器，正在維護已上線的 Ghost CMS；此 repo 是網站使用中的客製主題，不是獨立的示範網站或待部署的前端專案。
- 使用者已明確選擇簡單的直接掛載方式：只在 `theme/` 管理 Git，Ghost 讀取同一份檔案。不要自行恢復日常複製部署、ZIP 上傳、第二份主題來源或根目錄 Git repo。大幅更新可使用暫時 worktree／隔離 Ghost 驗證，但正式站仍使用此 repo。
- `/var/www/skyhong-blog/` 是執行環境；`/var/www/skyhong-blog/theme/` 才是日常開啟的 Git 專案；`../ghost-docker/` 管理 CMS、資料庫與代理設定。`/home/ubuntu/skyhong-blog` 是指向 `/var/www/skyhong-blog` 的 symlink，不是另一套部署。
- 儲存、Git 切換／合併、建置都可能改到正式站。開始修改前與套用變更前檢查工作目錄狀態，保留使用者或其他工作階段的變更。依本次任務範圍執行，歷史 session 的操作授權不代表本次要求更新所有服務。

## 正式環境操作定位

以下名稱與掛載已由實際容器核對；後續操作前重新確認，版本不是永久固定目標。

- Compose project：`ghost-docker-7fw0la`；設定檔：`/var/www/skyhong-blog/ghost-docker/docker-compose.yml`。Compose 指令明確帶上 `-p ghost-docker-7fw0la -f /var/www/skyhong-blog/ghost-docker/docker-compose.yml`。過往曾因省略 project name 而誤建另一套 `ghost-docker-*` 容器，不能只靠目前目錄推測名稱。
- Ghost：`ghost-docker-7fw0la-ghost-1`，核對時映像為 `ghost:6.63.0-alpine`，執行使用者 `1000:1000`。
- 主題掛載：`/var/www/skyhong-blog/theme` → `/var/lib/ghost/content/themes/skychopath-theme`，容器內唯讀。這不會阻止主機端編輯影響網站；更新 Compose 時保留此掛載與 UID/GID，避免 entrypoint 對唯讀主題執行 chown。
- MySQL：`ghost-docker-7fw0la-db-1`，核對時為 `mysql:8.0.46`；既有資料 volume 是 `ghost-docker_db_data`。CMS 更新須保留既有資料來源，不得改接空 volume。
- 網站入口經 Dokploy／Traefik，再到 `ghost-docker-7fw0la-ghost-proxy-1`（核對時為 `nginx:1.30.4-alpine`），最後到 Ghost `2368`。`../ghost-docker/ghost-proxy.conf` 同時處理 www 轉址、JWKS、WebFinger、ActivityPub 與 host-meta，不能把代理簡化為只轉送首頁。Dokploy／Traefik 是共用服務，不隨主題維護重啟。
- `../ghost-docker/content/settings/routes.yaml` 將 `/` 綁定到 `template: home` 與 `data: page.home`；首頁依賴已發布、slug 為 `home` 的 Page。文章、圖片、導覽、品牌設定與 Code Injection 由 Ghost 管理，主題 Git 無法取代內容／資料庫備份。
- 主題模板重載只需重啟這個 Ghost。CMS／資料庫升級另按基礎設施任務處理：先備份並驗證遷移，保留內容掛載和資料 volume，再檢查正式站受影響頁面；不要讓舊版 Ghost 直接讀取已升級的資料庫。

## 歷史決定與查證來源

T3 Code 的本機紀錄位於 `/home/ubuntu/.t3/userdata/state.sqlite`，以唯讀方式查詢。舊專案／對話即使標記刪除，紀錄仍可能存在；不得為了查閱而修改 T3 資料庫。只把必要的專案脈絡寫進 repo，不加入原始對話、其他專案清單或憑證。

- `a7d34be3-7b26-4df9-ad5c-4ca7b745fca7`，「了解 Repo 用途」，2026-09-13：網站與 Source 更新、客製化拆分、首頁改由 Ghost Page 管理，最後依使用者要求改成獨立主題 repo 直接掛載。此對話前半段提到的複製部署工具與根目錄 Git，已被後半段的決定取代。
- `4fd87d12-3af9-4fe2-8c3f-c5781b4c666d`，「同步已发布的仓库状态」，2026-09-13：接回既有 `skyhong2002/skychopath-theme`，保留 2025 年遠端歷史及目前線上架構，整合提交 `b9b6254`。該次本機整合完成，但推送因認證未成功；不要把「已部署」視為「已同步 GitHub」，後續同步先查證遠端狀態。
- `4174fb2c-ca81-5044-bfe8-ddf9ee851573`，「Update Ghost security patch」，2026-06-24：Ghost 更新與 Compose project 名稱誤用的修正紀錄。這是匯入 T3 的舊 Codex 對話。
- `f495f3d4-a79a-53ec-b3bc-79c158cf44d1`，「改用 Dokploy 管理 Docker」，2026-05-24～25：建立 Ghost／Nginx／Traefik 架構並對齊 `ghost-docker-7fw0la`。舊部署腳本與版本只供追溯，不能直接當作現行操作步驟。
- 現行操作以本檔、README、Git 與實際容器／路由狀態為準。`../ghost-docker/UPDATE-2026-09-13.md` 是當天較早的更新報告；之後又完成主題拆分與直接掛載，不能用該報告中的舊目錄、依賴警示數量或內容筆數推定目前狀態。
