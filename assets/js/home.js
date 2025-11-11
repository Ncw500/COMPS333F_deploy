/**
 * COMPS333F Home Page JS
 * 功能：載入 lectures.json，渲染卡片列表，提供搜尋與無障礙操作。
 */
(function () {
  /**
   * 功能：抓取 JSON 資料
   * @param {string} url - JSON 路徑
   * @returns {Promise<Array>} lectures
   */
  async function fetchLectures(url) {
    const resp = await fetch(url, { cache: 'no-store' });
    if (!resp.ok) throw new Error('讀取 lectures.json 失敗');
    return resp.json();
  }

  /**
   * 功能：渲染課程卡片清單
   * @param {Array} items - 課程資料陣列
   * @param {HTMLElement} container - 容器
   */
  function renderLectures(items, container) {
    container.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'card-list';
    items.forEach(item => {
      const card = document.createElement('a');
      card.className = 'card';
      card.href = item.path;
      card.setAttribute('aria-label', `${item.title}，點擊前往頁面`);
      card.innerHTML = `
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.description}</p>
        <div class="card-meta">
          <span>${(item.tags || []).join(' · ')}</span>
          <span>${item.updated ? `更新：${item.updated}` : ''}</span>
        </div>
      `;
      list.appendChild(card);
    });
    container.appendChild(list);
  }

  /**
   * 功能：綁定搜尋輸入框，動態過濾列表
   * @param {Array} items - 原始資料
   * @param {HTMLElement} input - 搜尋輸入
   * @param {HTMLElement} container - 列表容器
   */
  function attachSearch(items, input, container) {
    const doFilter = () => {
      const q = input.value.trim().toLowerCase();
      const filtered = items.filter(x =>
        x.title.toLowerCase().includes(q) ||
        (x.description || '').toLowerCase().includes(q) ||
        (x.tags || []).some(t => t.toLowerCase().includes(q))
      );
      renderLectures(filtered, container);
    };
    input.addEventListener('input', doFilter);
  }

  /**
   * 功能：首頁初始化（主題與返回頂部由框架處理）
   */
  async function initHome() {
    UI.initTheme();
    UI.initBackToTop();
    const container = document.getElementById('lecture-list');
    const search = document.getElementById('search');
    try {
      const items = await fetchLectures('/deployed/lectures.json');
      renderLectures(items, container);
      if (search) attachSearch(items, search, container);
    } catch (e) {
      container.innerHTML = '<p>載入課程列表失敗，請稍後重試。</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', initHome);
})();