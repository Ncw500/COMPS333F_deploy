# COMPS333F Web UI Framework

版本：1.0.0（見 `/deployed/assets/VERSION`）

## 目的
- 抽離共用樣式（CSS）與交互（JS），提供一致的 Markdown 呈現、代碼高亮、頁面佈局與功能（目錄、錨點、主題切換、返回頂部）。
- 降低每個 Lecture 頁面重複碼，便於擴展到更多 Markdown 文件。

## 結構
- `deployed/assets/css/framework.css`：主題變數、版頭、容器、Hero、右側 TOC、內容標題、返回頂部、無障礙、卡片、響應式。
- `deployed/assets/js/framework.js`：
  - `UI.initTheme()`：主題切換（localStorage 持久化）。
  - `UI.slugify(text)`：標題轉錨點 id。
  - `UI.addAnchors(rootSelector)`：為 h1~h6 生成錨點與鏈接圖示。
  - `UI.buildTOC(rootSelector, tocSelector)`：建立目錄清單並支援高亮。
  - `UI.applySyntaxHighlighting()`：載入並套用 highlight.js。
  - `UI.initBackToTop(btnId)`：返回頂部顯示與操作。
  - `UI.initTOCToggle(btnId, tocId)`：右側 TOC 開關與動畫。
  - `UI.ensureMathJax()`：載入並渲染 MathJax。
  - `UI.ensureMarked()`：載入 marked.js（必要時）。
  - `UI.renderMarkdownFrom(url, contentSelector)`：從 URL 渲染 Markdown。
  - `UI.initPage(options)`：便利初始化（useMarkdown: true 會載入 `options.markdownUrl`）。

## 使用方式
### A. 靜態教學頁面
1. 在 `<head>` 引入：
   - `link rel="stylesheet" href="/deployed/assets/css/framework.css"`
2. 在頁尾引入並初始化：
   - `script src="/deployed/assets/js/framework.js"`
   - `UI.initPage()`
3. 保留結構 id：`#content`、`#toc`、`#toc-list`、`#toc-toggle`、`#back-to-top`。

### B. 從 Markdown 動態渲染
1. 在頁面中準備空容器：`<article id="content"></article>`，右側目錄 `#toc` 與切換按鈕 `#toc-toggle`。
2. 初始化：
   ```html
   <script src="/deployed/assets/js/framework.js"></script>
   <script>
     document.addEventListener('DOMContentLoaded', () => {
       UI.initPage({ useMarkdown: true, markdownUrl: '/deployed/path/to/file.md' });
     });
   </script>
   ```

## 導航首頁
- `deployed/index.html`：引用框架 CSS/JS，並使用 `deployed/assets/js/home.js` 讀取 `deployed/lectures.json` 渲染卡片列表與搜尋。
- 新增 Lecture：只需在 `lectures.json` 追加資料物件，首頁即自動顯示。

## 一致性與可訪問性
- 鍵盤可操作：TOC 切換、返回頂部、主題按鈕皆支援 `Enter/Space`。
- 無障礙語義：header/nav/main/article/aria-label 與 `aria-live` 用於動態列表。
- 暗/亮主題：遵循系統偏好並可手動切換。

## 測試步驟
1. 打開 `http://localhost:8081/deployed/index.html`：
   - 確認卡片列表載入、搜尋輸入過濾、點擊跳轉。
2. 打開 `http://localhost:8081/deployed/lecture02-optimized.html`：
   - 檢查目錄生成、錨點跳轉、語法高亮、MathJax 公式、返回頂部、主題切換。
3. 新增測試 Markdown：
   - 建立 `deployed/test.md`，在新頁面呼叫 `UI.initPage({ useMarkdown: true, markdownUrl: '/deployed/test.md' })` 驗證可套用。

## 版本控制
- 版本檔：`deployed/assets/VERSION`（目前 `1.0.0`）。
- 版本更新原則：
  - `MAJOR`：破壞性變更（API、選項、命名）。
  - `MINOR`：新功能（保持相容）。
  - `PATCH`：修正錯誤或樣式微調。

## 注意事項
- 若頁面原本含有大量內嵌樣式或腳本，重構過程可逐步移除並交由框架管理，建議優先替換初始化腳本為 `UI.initPage`，其次再移除重複的 CSS。
- CDN 受限時（如 ORB），可改用 cdnjs 或自託管資源。