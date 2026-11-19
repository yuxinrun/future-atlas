/* Future Atlas — 页面交互与各页面渲染 */
(function () {
  'use strict';

  var D = window.AtlasData || {};
  var F = window.AtlasFilters || {};
  var page = document.body.getAttribute('data-page') || '';
  var BM_KEY = 'future-atlas-bookmarks';

  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function byId(id) { return document.getElementById(id); }

  /* ---------------- 全站通用交互 ---------------- */
  function initGlobal() {
    var header = $('.site-header');
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-scrolled', y > 24);
      var topBtn = $('.back-to-top');
      if (topBtn) topBtn.classList.toggle('is-visible', y > 420);

      var progress = $('.reading-progress');
      if (progress) {
        var height = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (height > 0 ? Math.min(y / height, 1) : 0) + ')';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var topBtn = $('.back-to-top');
    if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    var toggle = $('.menu-toggle');
    var menu = $('.mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
        var img = toggle.querySelector('img');
        if (img) img.src = 'assets/icons/' + (open ? 'ui-close.svg' : 'ui-menu.svg');
      });
      $$('a', menu).forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('is-open');
          document.body.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
      }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
      $$('.reveal').forEach(function (el) { io.observe(el); });
    } else {
      $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    }

    // 数字滚动
    if ('IntersectionObserver' in window) {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          var target = parseInt(el.getAttribute('data-count'), 10) || 0;
          var suffix = el.getAttribute('data-suffix') || '';
          var start = performance.now(), duration = 1100;
          function step(now) {
            var p = Math.min((now - start) / duration, 1);
            var value = Math.round(target * (1 - Math.pow(1 - p, 3)));
            el.textContent = value + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          countObserver.unobserve(el);
        });
      }, { threshold: .5 });
      $$('[data-count]').forEach(function (el) { countObserver.observe(el); });
    }

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-bookmark]');
      if (btn) toggleBookmark(btn.getAttribute('data-bookmark'), btn);
      var reset = e.target.closest('[data-reset-filters]');
      if (reset) window.location.reload();
    });
    refreshBookmarks();
  }

  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BM_KEY) || '[]'); } catch (e) { return []; }
  }
  function toggleBookmark(id, btn) {
    var list = getBookmarks();
    var i = list.indexOf(id);
    if (i === -1) list.push(id); else list.splice(i, 1);
    try { localStorage.setItem(BM_KEY, JSON.stringify(list)); } catch (e) {}
    refreshBookmarks();
  }
  function refreshBookmarks() {
    var list = getBookmarks();
    $$('[data-bookmark]').forEach(function (btn) {
      var saved = list.indexOf(btn.getAttribute('data-bookmark')) !== -1;
      btn.classList.toggle('is-saved', saved);
      btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
      btn.setAttribute('title', saved ? '取消收藏' : '收藏此内容');
      var icon = btn.querySelector('img[src*="icons/ui-bookmark"]');
      if (icon) icon.src = 'assets/icons/ui-bookmark' + (saved ? 'Filled' : '') + '.svg';
    });
  }

  /* ---------------- 卡片模板 ---------------- */
  function articleCard(a, cls) {
    return '<article class="card card-hover ' + (cls || '') + '">' +
      '<a href="article.html?id=' + encodeURIComponent(a.id) + '" class="card-media"><img src="' + a.image + '" alt="' + h(a.title) + '" loading="lazy"><span class="card-media-title">' + h(a.title) + '</span></a>' +
      '<div class="card-body"><div class="card-meta"><span class="tag">' + h(F.categoryName(a.category)) + '</span><span class="dot"></span><span>' + h(a.date) + '</span><span class="dot"></span><span>' + a.readTime + ' 分钟</span></div>' +
      '<h3 class="card-title"><a href="article.html?id=' + encodeURIComponent(a.id) + '">' + h(a.title) + '</a></h3>' +
      '<p class="card-excerpt">' + h(a.summary) + '</p>' +
      '<div class="card-footer"><a class="card-read" href="article.html?id=' + encodeURIComponent(a.id) + '">阅读全文 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
      '<button class="btn-bookmark" data-bookmark="' + a.id + '" aria-label="收藏"><img src="assets/icons/ui-bookmark.svg" alt="" style="width:16px;height:16px"></button></div></div></article>';
  }

  function observationCard(a, index) {
    return '<article class="card card-hover observation-card">' +
      '<a href="article.html?id=' + encodeURIComponent(a.id) + '" class="card-media"><span class="observation-index">0' + index + '</span><img src="' + a.image + '" alt="' + h(a.title) + '" loading="lazy"><span class="card-media-title">' + h(a.title) + '</span></a>' +
      '<div class="card-body"><div class="card-meta"><span class="tag">' + h(F.categoryName(a.category)) + '</span><span class="dot"></span><span>' + a.readTime + ' 分钟阅读</span></div>' +
      '<h3 class="card-title" style="font-size:17px"><a href="article.html?id=' + encodeURIComponent(a.id) + '">' + h(a.title) + '</a></h3>' +
      '<p class="card-excerpt">' + h(a.summary) + '</p></div></article>';
  }

  function categoryCard(c, count) {
    return '<a class="category-card" href="trends.html?category=' + c.id + '" style="--card-accent:' + c.color + '">' +
      '<img class="category-icon" src="' + c.icon + '" alt="' + h(c.name) + '" loading="lazy">' +
      '<h3>' + h(c.name) + '</h3><p>' + h(c.desc) + '</p>' +
      '<div class="category-foot"><span>' + count + ' 篇趋势文章</span><span class="arrow">→</span></div></a>';
  }

  function predictionCard(p) {
    var d = D;
    return '<article class="card card-hover prediction-card" data-prediction-card="' + p.id + '">' +
      '<div class="card-top"><span class="badge badge-year">' + p.year + ' · ' + h(p.horizon) + '</span><span class="badge badge-' + p.scenario + '">' + h((d.scenarioLabels || {})[p.scenario]) + '</span></div>' +
      '<h3>' + h(p.title) + '</h3><p class="summary">' + h(p.summary) + '</p>' +
      '<div class="card-tags"><span class="tag">' + h(F.predictionCategoryName(p.category)) + '</span><span class="tag">' + h(p.status) + '</span></div>' +
      '<div class="prediction-source">来源：' + h(p.source) + '<br>可信度：' + h((d.confidenceLabels || {})[p.confidence]) + '</div>' +
      '<div class="card-bottom">' + F.confidenceDots(p.confidence) + '<button class="card-read" data-prediction-open="' + p.id + '">查看详情 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div></article>';
  }

  function bookCard(b) {
    return '<article class="card card-hover book-card" id="book-' + b.id + '">' +
      '<div class="book-cover"><img src="' + b.cover + '" alt="' + h(b.title) + ' 封面" loading="lazy"></div>' +
      '<h3><a href="books.html?focus=' + encodeURIComponent(b.id) + '">' + h(b.title) + '</a></h3><div class="book-author">' + h(b.author) + '</div>' +
      '<div class="book-year">' + b.year + ' 年出版 · 中文版 ' + b.chineseYear + '</div>' +
      '<div class="card-tags" style="justify-content:center">' + (b.tags || []).slice(0, 2).map(function (t) { return '<span class="tag">' + h(t) + '</span>'; }).join('') + '</div>' +
      '<p class="card-excerpt" style="margin-top:12px">' + h(b.intro) + '</p>' +
      '<div class="card-footer" style="width:100%;margin-top:auto"><span class="card-read">推荐指数 ' + b.rating + '</span><span class="tag">' + h(F.categoryName(b.category)) + '</span></div></article>';
  }

  function resourceCard(r) {
    return '<article class="card resource-card" id="resource-' + r.id + '">' +
      '<div class="resource-logo"><img src="' + r.icon + '" alt="" loading="lazy"></div>' +
      '<div class="resource-body"><div class="resource-head"><div><h3>' + h(r.name) + '</h3><div class="resource-en">' + h(r.nameEn) + '</div></div>' +
      '<span class="tag">' + h(r.linkType === 'official' ? '官方网站' : '第三方资料') + '</span></div>' +
      '<p>' + h(r.intro) + '</p><div class="resource-focus">' + (r.focus || []).map(function (f) { return '<span class="tag">' + h(f) + '</span>'; }).join('') + '</div>' +
      '<div class="resource-foot"><span class="tag">' + h(r.region) + '</span><a class="resource-site" href="' + r.url + '" target="_blank" rel="noopener noreferrer">' + h(r.url.replace(/^https?:\/\//, '').replace(/\/$/, '')) + ' <img src="assets/icons/ui-external.svg" alt="" style="width:13px;height:13px"></a></div></div></article>';
  }

  function topicCard(t, i) {
    return '<a class="topic-card" href="' + t.url + '" id="topic-' + t.id + '">' +
      '<img src="' + t.image + '" alt="' + h(t.title) + '" loading="lazy">' +
      '<span class="topic-num">' + (i < 9 ? '0' : '') + (i + 1) + ' / 08</span>' +
      '<h3>' + h(t.title) + '</h3><p>' + h(t.desc) + '</p>' +
      '<span class="topic-link">进入专题 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>';
  }

  /* ---------------- 预测详情弹层 ---------------- */
  function initPredictionModal() {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-label="预测详情"><div class="modal-top"><span class="badge badge-year" data-modal-year></span><button class="icon-btn" data-modal-close aria-label="关闭"><img src="assets/icons/ui-close.svg" alt=""></button></div><div data-modal-content></div></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('[data-modal-close]').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    function open(id) {
      var p = (D.predictions || []).find(function (x) { return x.id === id; });
      if (!p) return;
      var d = D;
      overlay.querySelector('[data-modal-year]').textContent = p.year + ' · ' + p.horizon;
      overlay.querySelector('[data-modal-content]').innerHTML =
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px"><span class="badge badge-' + p.scenario + '">' + h((d.scenarioLabels || {})[p.scenario]) + '</span><span class="badge badge-' + (p.status === 'fact' ? 'fact' : p.status === 'plan' ? 'plan' : p.status === 'prediction' ? 'prediction' : 'scenario') + '">' + h(p.status) + '</span></div>' +
        '<h2>' + h(p.title) + '</h2><p style="color:var(--text-muted);line-height:1.85">' + h(p.summary) + '</p>' +
        '<div class="modal-section"><h4>预测来源与发布</h4><p>' + h(p.source) + '（' + h(p.published) + '）' + (p.predictor ? ' · 预测者：' + h(p.predictor) : '') + '</p></div>' +
        '<div class="modal-section"><h4>依据与证据</h4><p>' + h(p.evidence) + '</p></div>' +
        '<div class="modal-section"><h4>不确定性说明</h4><div class="modal-notice">' + h(p.uncertainty) + '</div></div>' +
        '<div class="modal-section"><h4>可信度评估</h4><p>' + F.confidenceDots(p.confidence) + ' ' + h((d.confidenceLabels || {})[p.confidence]) + ' · ' + h(F.predictionCategoryName(p.category)) + '</p></div>' +
        (p.relatedArticle ? '<div class="modal-section"><a class="btn btn-ghost btn-sm" href="article.html?id=' + encodeURIComponent(p.relatedArticle) + '">阅读相关文章 <img src="assets/icons/ui-arrowRight.svg" alt="" style="width:15px;height:15px"></a></div>' : '');
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() { overlay.classList.remove('is-open'); document.body.style.overflow = ''; }
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-prediction-open]');
      if (btn) open(btn.getAttribute('data-prediction-open'));
    });
    window.AtlasPredictionModal = { open: open, close: close };
  }

  /* ---------------- 首页 ---------------- */
  function initHome() {
    var articles = D.articles || [];
    var featured = articles.filter(function (a) { return a.featured; });
    var mainStory = featured[0] || articles[0];
    if (mainStory) {
      var host = byId('featured-story');
      if (host) host.innerHTML = articleCard(mainStory, 'feature-card');
    }
    var obsHost = byId('observation-grid');
    if (obsHost) {
      var picks = (featured.slice(1, 3).concat(articles.filter(function (a) { return !a.featured; }).slice(0, 1))).slice(0, 3);
      obsHost.innerHTML = picks.map(function (a, i) { return observationCard(a, i + 1); }).join('');
    }
    var catHost = byId('category-grid');
    if (catHost) catHost.innerHTML = (D.categories || []).map(function (c) {
      return categoryCard(c, articles.filter(function (a) { return a.category === c.id; }).length);
    }).join('');

    var predHost = byId('prediction-grid');
    if (predHost) {
      var horizons = ['5年', '10年', '20年', '50年', '100年'];
      var picks = horizons.map(function (hz) { return (D.predictions || []).find(function (p) { return p.horizon === hz; }); }).filter(Boolean);
      predHost.innerHTML = picks.map(predictionCard).join('');
    }

    var bookHost = byId('books-grid');
    if (bookHost) bookHost.innerHTML = (D.books || []).slice(0, 4).map(bookCard).join('');
    var resHost = byId('resources-grid');
    if (resHost) resHost.innerHTML = (D.resources || []).slice(0, 4).map(resourceCard).join('');
    var topicHost = byId('topics-grid');
    if (topicHost) {
      topicHost.innerHTML = (D.topics || []).map(function (t) {
        t.url = t.url || 'index.html#topics';
        return topicCard(t, (D.topics || []).indexOf(t));
      }).join('');
    }

    var homeTimeline = byId('home-timeline');
    if (homeTimeline) {
      var years = [2026, 2030, 2040, 2050, 2070, 2100];
      homeTimeline.innerHTML = '<div class="timeline-wrap" style="padding-top:6px">' + years.map(function (y) {
        var ev = (D.timeline || []).find(function (t) { return t.year === y; });
        return '<a class="timeline-entry" href="timeline.html#year-' + y + '" style="width:100%;padding:0 0 20px 40px;display:block">' +
          '<div class="timeline-node" style="cursor:pointer"><div class="timeline-node-top"><span class="badge badge-' + (ev ? ev.status : 'scenario') + '">' + y + '</span></div>' +
          '<h3>' + h(ev ? ev.title : '未来节点') + '</h3><p>' + h(ev ? ev.description : '') + '</p></div></a>';
      }).join('') + '</div>';
    }
  }

  /* ---------------- 趋势列表页 ---------------- */
  function initTrends() {
    var state = { category: 'all', tag: 'all', sort: 'latest', query: '', visible: 9 };
    var params = new URLSearchParams(window.location.search);
    if (params.get('category')) state.category = params.get('category');
    if (params.get('tag')) state.tag = params.get('tag');

    F.renderChips(byId('category-chips'), D.categories || [], state.category, function (v) { state.category = v; state.visible = 9; render(); });
    var allTags = [];
    (D.articles || []).forEach(function (a) { (a.tags || []).forEach(function (t) { if (allTags.indexOf(t) === -1) allTags.push(t); }); });
    F.renderChips(byId('tag-chips'), allTags.slice(0, 14), state.tag, function (v) { state.tag = v; state.visible = 9; render(); }, '全部标签');
    var sortEl = byId('sort-select');
    if (sortEl) sortEl.addEventListener('change', function () { state.sort = sortEl.value; render(); });
    var searchEl = byId('list-search');
    if (searchEl) searchEl.addEventListener('input', function () { state.query = searchEl.value; state.visible = 9; render(); });

    function render() {
      var items = (D.articles || []).filter(function (a) {
        if (state.category !== 'all' && a.category !== state.category) return false;
        if (state.tag !== 'all' && (a.tags || []).indexOf(state.tag) === -1) return false;
        return true;
      });
      items = F.filterByText(items, state.query, ['title', 'summary', 'tags', 'source']);
      items = F.sortItems(items, state.sort);
      var count = byId('result-count');
      if (count) count.innerHTML = '共 <strong>' + items.length + '</strong> 篇趋势文章';
      var host = byId('article-list');
      if (!host) return;
      if (!items.length) { host.innerHTML = F.emptyState(); byId('load-more-wrap').innerHTML = ''; return; }
      host.innerHTML = items.slice(0, state.visible).map(function (a) { return articleCard(a); }).join('');
      var wrap = byId('load-more-wrap');
      if (wrap) wrap.innerHTML = state.visible < items.length ? '<button class="btn btn-ghost btn-lg" id="load-more-btn">加载更多（还有 ' + (items.length - state.visible) + ' 篇）</button>' : '<p style="color:var(--text-dim);font-size:13px">已经到底了 · 共 ' + items.length + ' 篇</p>';
      var more = byId('load-more-btn');
      if (more) more.addEventListener('click', function () { state.visible += 6; render(); });
      refreshBookmarks();
      var active = byId('active-filters');
      if (active) F.renderActiveFilters(active, { 分类: state.category === 'all' ? '' : F.categoryName(state.category), 标签: state.tag === 'all' ? '' : state.tag }, function (key) {
        if (key === '分类') { state.category = 'all'; F.renderChips(byId('category-chips'), D.categories || [], 'all', function (v) { state.category = v; render(); }); }
        if (key === '标签') state.tag = 'all';
        render();
      });
    }
    render();
  }

  /* ---------------- 预测页 ---------------- */
  function initPredictions() {
    var state = { year: 'all', category: 'all', scenario: 'all', query: '' };
    var params = new URLSearchParams(window.location.search);
    if (params.get('category')) state.category = params.get('category');
    var years = [];
    (D.predictions || []).forEach(function (p) { if (years.indexOf(p.year) === -1) years.push(p.year); });
    years.sort(function (a, b) { return a - b; });
    F.renderChips(byId('year-chips'), years.map(function (y) { return { id: String(y), name: y + ' 年' }; }), state.year, function (v) { state.year = v; render(); }, '全部年份');
    F.renderChips(byId('pred-category-chips'), D.predictionCategories || [], state.category, function (v) { state.category = v; render(); });
    F.renderChips(byId('scenario-chips'), [{ id: 'optimistic', name: '乐观情景' }, { id: 'baseline', name: '基准情景' }, { id: 'pessimistic', name: '悲观情景' }], state.scenario, function (v) { state.scenario = v; render(); }, '全部情景');
    var searchEl = byId('prediction-search');
    if (searchEl) searchEl.addEventListener('input', function () { state.query = searchEl.value; render(); });

    function render() {
      var items = (D.predictions || []).filter(function (p) {
        if (state.year !== 'all' && String(p.year) !== state.year) return false;
        if (state.category !== 'all' && p.category !== state.category) return false;
        if (state.scenario !== 'all' && p.scenario !== state.scenario) return false;
        return true;
      });
      items = F.filterByText(items, state.query, ['title', 'summary', 'source', 'tags', 'status']);
      items = F.sortItems(items, 'year-asc');
      var count = byId('result-count');
      if (count) count.innerHTML = '共 <strong>' + items.length + '</strong> 条未来预测';
      var host = byId('prediction-list');
      if (host) host.innerHTML = items.length ? items.map(predictionCard).join('') : F.emptyState();
    }
    render();
    var focus = F.readFocusParam('focus');
    if (focus) {
      setTimeout(function () {
        var el = document.querySelector('[data-prediction-card="' + focus + '"]');
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (window.AtlasPredictionModal) window.AtlasPredictionModal.open(focus); }
      }, 180);
    }
  }

  /* ---------------- 书籍页 ---------------- */
  function initBooks() {
    var state = { category: 'all', query: '', sort: 'rating' };
    F.renderChips(byId('book-category-chips'), D.categories || [], state.category, function (v) { state.category = v; render(); });
    var searchEl = byId('book-search');
    if (searchEl) searchEl.addEventListener('input', function () { state.query = searchEl.value; render(); });
    var sortEl = byId('book-sort');
    if (sortEl) sortEl.addEventListener('change', function () { state.sort = sortEl.value; render(); });

    function render() {
      var items = (D.books || []).filter(function (b) { return state.category === 'all' || b.category === state.category; });
      items = F.filterByText(items, state.query, ['title', 'originalTitle', 'author', 'authorEn', 'intro', 'tags']);
      items = F.sortItems(items, state.sort);
      var count = byId('result-count');
      if (count) count.innerHTML = '共 <strong>' + items.length + '</strong> 本推荐书籍';
      var host = byId('book-list');
      if (host) host.innerHTML = items.length ? items.map(bookCard).join('') : F.emptyState();
    }
    render();
    var focus = F.readFocusParam('focus');
    if (focus) setTimeout(function () { var el = byId('book-' + focus); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 160);
  }

  /* ---------------- 资源页 ---------------- */
  function initResources() {
    var state = { category: 'all', linkType: 'all', query: '' };
    var cats = [{ id: 'institute', name: '研究机构' }, { id: 'thinktank', name: '智库' }, { id: 'org', name: '国际组织' }, { id: 'agency', name: '航天机构' }, { id: 'company', name: '科技企业' }, { id: 'media', name: '科技媒体' }, { id: 'database', name: '科学数据库' }, { id: 'reference', name: '第三方资料' }];
    F.renderChips(byId('resource-category-chips'), cats, state.category, function (v) { state.category = v; render(); });
    F.renderChips(byId('linktype-chips'), [{ id: 'official', name: '官方网站' }, { id: 'reference', name: '第三方资料' }], state.linkType, function (v) { state.linkType = v; render(); }, '全部类型');
    var searchEl = byId('resource-search');
    if (searchEl) searchEl.addEventListener('input', function () { state.query = searchEl.value; render(); });

    function render() {
      var items = (D.resources || []).filter(function (r) {
        if (state.category !== 'all' && r.category !== state.category) return false;
        if (state.linkType !== 'all' && r.linkType !== state.linkType) return false;
        return true;
      });
      items = F.filterByText(items, state.query, ['name', 'nameEn', 'intro', 'focus', 'region']);
      var count = byId('result-count');
      if (count) count.innerHTML = '共 <strong>' + items.length + '</strong> 个研究机构与网站';
      var host = byId('resource-list');
      if (host) host.innerHTML = items.length ? items.map(resourceCard).join('') : F.emptyState();
    }
    render();
    var focus = F.readFocusParam('focus');
    if (focus) setTimeout(function () { var el = byId('resource-' + focus); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 160);
  }

  /* ---------------- 时间轴页 ---------------- */
  function initTimeline() {
    var state = { category: 'all', status: 'all', query: '' };
    if (!window.AtlasTimeline) return;
    var cats = [{ id: 'tech', name: '科技' }, { id: 'society', name: '社会' }, { id: 'economy', name: '经济' }, { id: 'environment', name: '环境' }, { id: 'energy', name: '能源' }, { id: 'transport', name: '交通' }, { id: 'health', name: '医疗' }, { id: 'space', name: '太空' }];
    F.renderChips(byId('timeline-category-chips'), cats, state.category, function (v) { state.category = v; render(); });
    F.renderChips(byId('timeline-status-chips'), [{ id: 'fact', name: '已发生事实' }, { id: 'plan', name: '官方规划' }, { id: 'prediction', name: '专家预测' }, { id: 'scenario', name: '假设情景' }], state.status, function (v) { state.status = v; render(); }, '全部类型');
    var searchEl = byId('timeline-search');
    if (searchEl) searchEl.addEventListener('input', function () { state.query = searchEl.value; render(); });

    function render() {
      var host = byId('timeline-container');
      var ids = window.AtlasTimeline.render(host, state);
      var count = byId('result-count');
      if (count) count.innerHTML = '共 <strong>' + (ids ? ids.length : 0) + '</strong> 个时间节点';
    }
    render();
    var focus = F.readFocusParam('focus');
    if (focus) setTimeout(function () { window.AtlasTimeline.focus(focus); }, 200);
  }

  /* ---------------- 文章详情页 ---------------- */
  function initArticle() {
    var id = new URLSearchParams(window.location.search).get('id');
    var article = (D.articles || []).find(function (a) { return a.id === id; }) || D.articles[0];
    var host = byId('article-root');
    if (!host || !article) return;

    document.title = article.title + ' — Future Atlas 未来图谱';
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', article.summary);
    var heroTitle = $('.page-hero h1');
    if (heroTitle) heroTitle.textContent = article.title;
    var heroDesc = $('.page-hero p');
    if (heroDesc) heroDesc.textContent = article.summary;
    var toc = (article.body || []).map(function (s, i) { return { id: 'section-' + i, title: s.heading }; });

    var related = (D.articles || []).filter(function (a) { return a.id !== article.id && (a.category === article.category || (a.tags || []).some(function (t) { return (article.tags || []).indexOf(t) !== -1; })); }).slice(0, 3);
    var prediction = (D.predictions || []).find(function (p) { return p.relatedArticle === article.id; });
    var book = (D.books || []).find(function (b) { return b.relatedArticle === article.id; });

    var html =
      '<div class="article-layout">' +
      '<aside class="article-sidebar">' +
      '<div class="side-card"><h4>本文目录</h4><nav class="toc-list">' + toc.map(function (t, i) { return '<a href="#' + t.id + '" class="' + (i === 0 ? 'is-active' : '') + '">' + h(t.title) + '</a>'; }).join('') + '</nav></div>' +
      '<div class="side-card"><h4>收藏本文</h4><button class="btn btn-ghost btn-sm btn-block" data-bookmark="' + article.id + '"><img src="assets/icons/ui-bookmark.svg" alt="" style="width:15px;height:15px"> 加入收藏夹</button></div>' +
      '</aside>' +
      '<main class="article-main">' +
      '<header class="article-header"><div class="card-meta"><span class="tag">' + h(F.categoryName(article.category)) + '</span>' + (article.tags || []).map(function (t) { return '<span class="tag">' + h(t) + '</span>'; }).join('') + '</div>' +
      '<h1>' + h(article.title) + '</h1><p class="article-lead">' + h(article.summary) + '</p>' +
      '<div class="article-meta"><span class="author-avatar">' + h(article.author.slice(0, 1)) + '</span><span>' + h(article.author) + '</span><span>·</span><span>' + h(article.source) + '</span><span>·</span><span>发布于 ' + h(article.date) + '</span><span>·</span><span>约 ' + article.readTime + ' 分钟</span></div></header>' +
      '<div class="article-hero-wrap"><img class="article-hero-img" src="' + article.image + '" alt="' + h(article.title) + ' 配图"><span class="card-media-title article-hero-title">' + h(article.title) + '</span></div>' +
      '<div class="article-body">' +
      (article.keyPoints ? '<div class="key-points"><h4>核心要点</h4><ul>' + article.keyPoints.map(function (k) { return '<li>' + h(k) + '</li>'; }).join('') + '</ul></div>' : '') +
      (article.body || []).map(function (s, i) {
        return '<section id="section-' + i + '"><h2>' + h(s.heading) + '</h2>' + s.paragraphs.map(function (p) { return '<p>' + h(p) + '</p>'; }).join('') +
          (i === 1 ? '<figure class="figure-block"><img src="assets/icons/timeline-graphic.svg" alt="未来演进示意图" loading="lazy"><figcaption>示意图：技术与社会趋势的长期演进并非线性，Future Atlas 原创绘制。</figcaption></figure>' : '') +
          '</section>';
      }).join('') +
      '<div class="article-quote"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 7H5a2 2 0 0 0-2 2v3h5v5H4M19 7h-4a2 2 0 0 0-2 2v3h5v5h-4"/></svg><br>未来不是被预测出来的，而是由今天的选择一点点塑造出来的。</div>' +
      '<div class="article-tags">' + (article.tags || []).map(function (t) { return '<a class="tag" href="trends.html?tag=' + encodeURIComponent(t) + '">' + h(t) + '</a>'; }).join('') + '</div>' +
      '<div class="article-actions"><button class="btn btn-ghost btn-sm" data-bookmark="' + article.id + '"><img src="assets/icons/ui-bookmark.svg" alt="" style="width:15px;height:15px"> 收藏</button><button class="btn btn-quiet btn-sm" data-search-open><img src="assets/icons/ui-search.svg" alt="" style="width:15px;height:15px"> 全站搜索</button></div>' +
      '</div></main>' +
      '<aside class="article-aside">' +
      (prediction ? '<div class="side-card"><h4>相关预测</h4><a href="predictions.html?focus=' + encodeURIComponent(prediction.id) + '" style="font-size:13px;line-height:1.6;color:var(--text-muted)"><span class="badge badge-year" style="margin-bottom:8px">' + prediction.year + '</span><br>' + h(prediction.title) + '</a></div>' : '') +
      (book ? '<div class="side-card"><h4>相关书籍</h4><a href="books.html?focus=' + encodeURIComponent(book.id) + '" style="display:block"><img src="' + book.cover + '" alt="' + h(book.title) + '" style="width:100%;border-radius:8px;margin-bottom:10px"><span style="font-size:12.5px;line-height:1.5">' + h(book.title) + '</span></a></div>' : '') +
      '<div class="side-card"><h4>来源与参考</h4><p style="font-size:12.5px;color:var(--text-muted);line-height:1.7;margin:0">' + h(article.source) + '。本文为 Future Atlas 编辑部原创解读，引用数据请以原始来源为准。</p></div>' +
      '</aside></div>' +
      '<div class="divider"></div><section class="section-tight" style="padding-top:0"><div class="section-head"><div><span class="eyebrow">继续阅读</span><h2 class="section-title">相关文章</h2></div></div>' +
      '<div class="related-grid">' + (related.length ? related.map(function (a) { return '<a class="related-mini" href="article.html?id=' + encodeURIComponent(a.id) + '"><h4>' + h(a.title) + '</h4><p>' + h(F.categoryName(a.category)) + ' · ' + a.readTime + ' 分钟</p></a>'; }).join('') : '<p style="color:var(--text-muted)">暂无更多同主题文章。</p>') + '</div></section>';
    host.innerHTML = html;

    if ('IntersectionObserver' in window) {
      var links = $$('.toc-list a');
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      $$('.article-body section').forEach(function (s) { obs.observe(s); });
    }
    refreshBookmarks();
  }

  /* ---------------- 启动 ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initGlobal();
    initPredictionModal();
    switch (page) {
      case 'home': initHome(); break;
      case 'trends': initTrends(); break;
      case 'predictions': initPredictions(); break;
      case 'books': initBooks(); break;
      case 'resources': initResources(); break;
      case 'timeline': initTimeline(); break;
      case 'article': initArticle(); break;
      default: break;
    }
    refreshBookmarks();
  });
})();
