/* 全站搜索索引与搜索面板 */
(function () {
  'use strict';

  function stripHtml(s) { return String(s || '').replace(/<[^>]+>/g, ''); }

  function buildIndex() {
    var d = window.AtlasData || {};
    var index = [];
    (d.articles || []).forEach(function (a) {
      index.push({
        type: 'article', typeName: '趋势文章',
        title: a.title, desc: a.summary, tags: a.tags || [],
        url: 'article.html?id=' + encodeURIComponent(a.id),
        icon: 'assets/icons/ui-book.svg'
      });
    });
    (d.predictions || []).forEach(function (p) {
      index.push({
        type: 'prediction', typeName: '未来预测',
        title: p.title, desc: p.summary, tags: p.tags || [],
        url: 'predictions.html?focus=' + encodeURIComponent(p.id),
        icon: 'assets/icons/ui-clock.svg'
      });
    });
    (d.books || []).forEach(function (b) {
      index.push({
        type: 'book', typeName: '书籍',
        title: b.title, desc: b.intro, tags: b.tags || [],
        url: 'books.html?focus=' + encodeURIComponent(b.id),
        icon: 'assets/icons/ui-book.svg'
      });
    });
    (d.resources || []).forEach(function (r) {
      index.push({
        type: 'resource', typeName: '研究机构',
        title: r.name, desc: r.intro, tags: (r.focus || []).concat([r.nameEn || '']),
        url: 'resources.html?focus=' + encodeURIComponent(r.id),
        icon: 'assets/icons/ui-globe.svg'
      });
    });
    (d.topics || []).forEach(function (t) {
      index.push({
        type: 'topic', typeName: '深度专题',
        title: t.title, desc: t.desc, tags: t.tags || [],
        url: 'index.html#topics',
        icon: 'assets/icons/ui-compass.svg'
      });
    });
    (d.timeline || []).forEach(function (t) {
      index.push({
        type: 'timeline', typeName: '时间轴',
        title: t.year + ' · ' + t.title, desc: t.description, tags: [],
        url: 'timeline.html?focus=' + encodeURIComponent(t.id),
        icon: 'assets/icons/ui-calendar.svg'
      });
    });
    return index;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function search(query, index) {
    var q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    var terms = q.split(/\s+/).filter(Boolean);
    return (index || buildIndex()).map(function (item) {
      var haystack = [item.title, item.desc, item.typeName].concat(item.tags || []).join(' ').toLowerCase();
      var score = 0;
      terms.forEach(function (term) {
        if (item.title.toLowerCase().indexOf(term) !== -1) score += 6;
        if ((item.tags || []).some(function (t) { return t.toLowerCase().indexOf(term) !== -1; })) score += 4;
        if (haystack.indexOf(term) !== -1) score += 1;
      });
      return { item: item, score: terms.every(function (t) { return haystack.indexOf(t) !== -1; }) ? score : 0 };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 12)
      .map(function (r) { return r.item; });
  }

  var overlay = null, inputEl = null, resultsEl = null, indexCache = null;

  function renderResults(query) {
    if (!resultsEl) return;
    var results = search(query, indexCache || (indexCache = buildIndex()));
    if (!query.trim()) {
      resultsEl.innerHTML = '<div class="empty-state" style="padding:40px 20px"><h3>输入关键词开始搜索</h3><p>可搜索未来趋势、预测、书籍、研究机构与时间轴事件。</p></div>';
      return;
    }
    if (!results.length) {
      resultsEl.innerHTML = '<div class="empty-state" style="padding:40px 20px"><div class="empty-icon"><img src="assets/icons/ui-search.svg" alt="" style="width:30px;height:30px"></div><h3>没有找到相关内容</h3><p>换个关键词试试，或浏览首页的分类专题。</p><a href="index.html" class="btn btn-ghost btn-sm">返回首页</a></div>';
      return;
    }
    var html = '<p class="result-count" style="margin-bottom:14px">找到 <strong>' + results.length + '</strong> 条与「' + escapeHtml(query) + '」相关的内容</p><div class="grid" style="gap:10px">';
    results.forEach(function (r) {
      html += '<a href="' + r.url + '" class="related-mini" style="display:flex;gap:14px;align-items:flex-start">' +
        '<img src="' + r.icon + '" alt="" style="width:34px;height:34px;padding:7px;border:1px solid var(--border);border-radius:8px;background:var(--bg-soft);flex-shrink:0">' +
        '<div style="min-width:0"><span class="tag" style="margin-bottom:5px">' + escapeHtml(r.typeName) + '</span>' +
        '<h4 style="margin:0 0 4px">' + escapeHtml(r.title) + '</h4>' +
        '<p>' + escapeHtml(r.desc.slice(0, 90)) + (r.desc.length > 90 ? '…' : '') + '</p></div></a>';
    });
    resultsEl.innerHTML = html + '</div>';
  }

  function open(prefill) {
    if (!overlay) buildOverlay();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (typeof prefill === 'string') inputEl.value = prefill;
    renderResults(inputEl.value);
    setTimeout(function () { inputEl.focus(); }, 60);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-label="全站搜索" style="width:min(100%,760px)">' +
      '<div class="modal-top"><h2 style="margin:0;font-size:20px;display:flex;align-items:center;gap:10px"><img src="assets/icons/ui-search.svg" alt="" style="width:21px;height:21px;color:var(--primary)">全站搜索</h2>' +
      '<button class="icon-btn" data-search-close aria-label="关闭搜索"><img src="assets/icons/ui-close.svg" alt=""></button></div>' +
      '<div class="search-bar"><img src="assets/icons/ui-search.svg" alt=""><input type="search" data-search-input placeholder="搜索未来科技、趋势、预测、书籍……" aria-label="搜索关键词"><button class="btn btn-primary btn-sm" data-search-go>搜索</button></div>' +
      '<div data-search-results style="margin-top:24px;max-height:56vh;overflow-y:auto"></div>' +
      '<p style="font-size:11.5px;color:var(--text-dim);margin:18px 0 0">提示：按 Esc 关闭，按 Enter 跳转到第一条结果。</p>' +
      '</div>';
    document.body.appendChild(overlay);
    inputEl = overlay.querySelector('[data-search-input]');
    resultsEl = overlay.querySelector('[data-search-results]');
    overlay.querySelector('[data-search-close]').addEventListener('click', close);
    overlay.querySelector('[data-search-go]').addEventListener('click', function () {
      var first = resultsEl.querySelector('a');
      if (first) window.location.href = first.href;
    });
    inputEl.addEventListener('input', function () { renderResults(inputEl.value); });
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter') { var first = resultsEl.querySelector('a'); if (first) window.location.href = first.href; }
    });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-search-open]');
      if (btn) { e.preventDefault(); open(); }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
      if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) close();
    });
    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) open(params.get('q'));
  });

  window.AtlasSearch = { search: search, open: open, close: close, buildIndex: buildIndex, escapeHtml: escapeHtml };
})();
