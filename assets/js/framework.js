/**
 * COMPS333F UI Framework JS
 * Version: 1.0.0
 * 說明：抽離共同交互（主題、目錄、返回頂部、錨點、Markdown 渲染、語法高亮、MathJax）。
 * 使用方式：在頁面引入本檔後，呼叫 UI.initPage 或依需求呼叫各功能。
 */
(function (global) {
  const UI = {};

  /**
   * 功能：載入外部腳本
   * @param {string} src - 腳本 URL
   * @returns {Promise<void>}
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Fail to load ${src}`));
      document.head.appendChild(s);
    });
  }

  /**
   * 功能：載入外部樣式
   * @param {string} href - 樣式 URL
   */
  function loadStyle(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  /**
   * 功能：初始化主題切換（深/淺色），並持久化到 localStorage
   */
  UI.initTheme = function initTheme() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme');
    const html = document.documentElement;
    const applyTheme = (mode) => {
      html.classList.toggle('theme-dark', mode === 'dark');
      html.dataset.theme = mode;
      localStorage.setItem('theme', mode);
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
    };
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const toggle = () => applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
      btn.addEventListener('click', toggle);
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    }
  };

  /**
   * 功能：將文字轉為 slug id（保留中文與英數，空白轉連字號）
   * @param {string} text - 標題文字
   * @returns {string} slug id
   */
  UI.slugify = function slugify(text) {
    return text.toLowerCase().replace(/[\s]+/g, '-').replace(/[^\w\-一-龥]/g, '-').replace(/\-+/g, '-').replace(/^\-+|\-+$/g, '');
  };

  /**
   * 功能：為內容區內的 h1~h6 生成錨點並追加鏈接圖示
   * @param {string} rootSelector - 內容容器選擇器
   */
  UI.addAnchors = function addAnchors(rootSelector = '#content') {
    const headings = document.querySelectorAll(`${rootSelector} h1, ${rootSelector} h2, ${rootSelector} h3, ${rootSelector} h4, ${rootSelector} h5, ${rootSelector} h6`);
    headings.forEach(h => {
      const text = h.textContent.trim();
      const id = UI.slugify(text);
      h.id = id;
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.className = 'anchor-link';
      a.setAttribute('aria-label', `鏈接到「${text}」章節`);
      a.textContent = '🔗';
      h.appendChild(a);
    });
  };

  /**
   * 功能：建立層級目錄清單，支援章節高亮
   * @param {string} rootSelector - 內容容器選擇器
   * @param {string} tocSelector - 目錄 ul 選擇器
   */
  UI.buildTOC = function buildTOC(rootSelector = '#content', tocSelector = '#toc-list') {
    const headings = Array.from(document.querySelectorAll(`${rootSelector} h1, ${rootSelector} h2, ${rootSelector} h3, ${rootSelector} h4, ${rootSelector} h5, ${rootSelector} h6`));
    const $list = document.querySelector(tocSelector);
    if (!$list) return;
    $list.innerHTML = '';
    const stack = [{ level: 0, ul: $list }];
    headings.forEach(h => {
      const level = parseInt(h.tagName.substring(1), 10);
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent.replace('🔗', '').trim();
      a.addEventListener('click', () => {
        document.querySelectorAll('nav#toc a').forEach(x => x.classList.remove('current'));
        a.classList.add('current');
      });
      li.appendChild(a);
      while (stack[stack.length - 1].level >= level) stack.pop();
      const parent = stack[stack.length - 1].ul;
      parent.appendChild(li);
      const ul = document.createElement('ul');
      li.appendChild(ul);
      stack.push({ level, ul });
    });
  };

  /**
   * 功能：語法高亮（嘗試載入 highlight.js 與樣式）
   */
  UI.applySyntaxHighlighting = function applySyntaxHighlighting() {
    // 確保樣式
    loadStyle('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css');
    // 確保腳本
    const doHighlight = () => { if (global.hljs && hljs.highlightAll) hljs.highlightAll(); };
    if (!global.hljs) {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js').then(doHighlight).catch(() => {});
    } else {
      doHighlight();
    }
  };

  /**
   * 功能：初始化返回頂部按鈕顯示與操作
   * @param {string} btnId - 按鈕元素 ID
   */
  UI.initBackToTop = function initBackToTop(btnId = 'back-to-top') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const toggle = () => { const show = window.scrollY > 600; btn.classList.toggle('show', show); };
    toggle();
    window.addEventListener('scroll', toggle);
    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    btn.addEventListener('click', scrollTop);
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollTop(); } });
  };

  /**
   * 功能：初始化目錄切換（固定右側、動畫切換）
   * @param {string} btnId - 切換按鈕 ID
   * @param {string} tocId - 目錄容器 ID
   */
  UI.initTOCToggle = function initTOCToggle(btnId = 'toc-toggle', tocId = 'toc') {
    const btn = document.getElementById(btnId);
    const toc = document.getElementById(tocId);
    if (!btn || !toc) return;
    const apply = (expanded) => { btn.setAttribute('aria-expanded', expanded ? 'true' : 'false'); toc.classList.toggle('is-open', expanded); };
    const toggle = () => apply(btn.getAttribute('aria-expanded') !== 'true');
    btn.addEventListener('click', toggle);
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    apply(false);
  };

  /**
   * 功能：確保 MathJax 可用，並渲染頁面公式
   * @returns {Promise<void>}
   */
  UI.ensureMathJax = async function ensureMathJax() {
    if (!global.MathJax) {
      global.MathJax = { tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$','$$'], ['\\[','\\]']] }, options: { renderActions: { addMenu: [] } } };
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js');
      } catch (e) { /* ignore */ }
    }
    if (global.MathJax && global.MathJax.typesetPromise) {
      await global.MathJax.typesetPromise();
    }
  };

  /**
   * 功能：確保 marked.js 可用
   */
  UI.ensureMarked = async function ensureMarked() {
    if (!global.marked) {
      await loadScript('https://cdn.jsdelivr.net/npm/marked@12/marked.min.js');
    }
  };

  /**
   * 功能：從 URL 載入 Markdown，轉為 HTML 並套用輔助功能
   * @param {string} url - Markdown 檔案 URL
   * @param {string} contentSelector - 內容容器選擇器
   */
  UI.renderMarkdownFrom = async function renderMarkdownFrom(url, contentSelector = '#content') {
    try {
      await UI.ensureMarked();
      const resp = await fetch(url, { cache: 'no-store' });
      if (!resp.ok) throw new Error('fail to fetch md');
      const md = await resp.text();
      global.marked.setOptions({ gfm: true, breaks: false });
      const html = global.marked.parse(md);
      const $content = document.querySelector(contentSelector);
      $content.innerHTML = html;
      UI.addAnchors(contentSelector);
      UI.buildTOC(contentSelector);
      UI.applySyntaxHighlighting();
      await UI.ensureMathJax();
    } catch (e) {
      // 貼心退路：保留既有內容，不覆蓋
    }
  };

  /**
   * 功能：頁面初始化便捷方法
   * @param {{useMarkdown?: boolean, markdownUrl?: string}} options - 初始化選項
   */
  UI.initPage = async function initPage(options = {}) {
    UI.initTheme();
    UI.initBackToTop();
    UI.initTOCToggle();
    if (options.useMarkdown && options.markdownUrl) {
      await UI.renderMarkdownFrom(options.markdownUrl);
    } else {
      UI.addAnchors();
      UI.buildTOC();
      UI.applySyntaxHighlighting();
      await UI.ensureMathJax();
    }
  };

  // 將 UI 暴露為全域物件
  global.UI = UI;
})(window);