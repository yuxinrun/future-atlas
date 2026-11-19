/* 列表页通用筛选、排序、标签与空状态工具 */
(function () {
  'use strict';

  function byId(id) { return document.getElementById(id); }

  function categoryName(id) {
    var list = (window.AtlasData && window.AtlasData.categories) || [];
    var found = list.find(function (c) { return c.id === id; });
    return found ? found.name : id;
  }

  function predictionCategoryName(id) {
    var list = (window.AtlasData && window.AtlasData.predictionCategories) || [];
    var found = list.find(function (c) { return c.id === id; });
    return found ? found.name : id;
  }

  function renderChips(el, items, activeKey, onChange, allLabel) {
    if (!el) return;
    var html = '<button type="button" class="filter-chip' + (activeKey === 'all' ? ' is-active' : '') + '" data-value="all">' + (allLabel || '全部') + '</button>';
    items.forEach(function (item) {
      var value = typeof item === 'string' ? item : item.id;
      var label = typeof item === 'string' ? item : item.name;
      html += '<button type="button" class="filter-chip' + (activeKey === value ? ' is-active' : '') + '" data-value="' + value + '">' + label + '</button>';
    });
    el.innerHTML = html;
    el.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        el.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        onChange(chip.dataset.value);
      });
    });
  }

  function renderActiveFilters(el, active, onRemove) {
    if (!el) return;
    var keys = Object.keys(active).filter(function (k) { return active[k] && active[k] !== 'all' && active[k] !== ''; });
    if (!keys.length) { el.innerHTML = ''; return; }
    el.innerHTML = keys.map(function (k) {
      return '<span class="active-filter">' + k + '：' + active[k] + '<button type="button" data-key="' + k + '" aria-label="移除筛选">×</button></span>';
    }).join('');
    el.querySelectorAll('button[data-key]').forEach(function (b) {
      b.addEventListener('click', function () { onRemove(b.dataset.key); });
    });
  }

  function filterByText(items, query, fields) {
    var q = String(query || '').trim().toLowerCase();
    if (!q) return items;
    var terms = q.split(/\s+/).filter(Boolean);
    return items.filter(function (item) {
      var text = fields.map(function (f) { return String(item[f] || (Array.isArray(item[f]) ? item[f].join(' ') : '') || ''); }).join(' ').toLowerCase();
      return terms.every(function (t) { return text.indexOf(t) !== -1; });
    });
  }

  function sortItems(items, mode) {
    var arr = items.slice();
    if (mode === 'latest') return arr.sort(function (a, b) { return String(b.date || b.year || b.published || '').localeCompare(String(a.date || a.year || a.published || '')); });
    if (mode === 'popular') return arr.sort(function (a, b) { return (b.views || 0) - (a.views || 0); });
    if (mode === 'featured') return arr.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || String(b.date || '').localeCompare(String(a.date || '')); });
    if (mode === 'rating') return arr.sort(function (a, b) { return (b.rating || 0) - (a.rating || 0); });
    if (mode === 'title') return arr.sort(function (a, b) { return String(a.title || '').localeCompare(String(b.title || ''), 'zh-CN'); });
    if (mode === 'year-asc') return arr.sort(function (a, b) { return (a.year || 0) - (b.year || 0); });
    if (mode === 'year-desc') return arr.sort(function (a, b) { return (b.year || 0) - (a.year || 0); });
    return arr;
  }

  function emptyState(message, actionHtml) {
    return '<div class="empty-state"><div class="empty-icon"><img src="assets/icons/ui-search.svg" alt="" style="width:32px;height:32px"></div>' +
      '<h3>没有匹配的内容</h3><p>' + (message || '试试调整筛选条件或搜索关键词，也许会有新的发现。') + '</p>' +
      (actionHtml || '<button type="button" class="btn btn-ghost btn-sm" data-reset-filters>清除全部筛选</button>') + '</div>';
  }

  function readFocusParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  function confidenceDots(level) {
    var n = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
    var html = '<span class="confidence-meter" title="可信度指示">';
    for (var i = 1; i <= 3; i++) html += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return html + '</span>';
  }

  window.AtlasFilters = {
    byId: byId,
    categoryName: categoryName,
    predictionCategoryName: predictionCategoryName,
    renderChips: renderChips,
    renderActiveFilters: renderActiveFilters,
    filterByText: filterByText,
    sortItems: sortItems,
    emptyState: emptyState,
    readFocusParam: readFocusParam,
    confidenceDots: confidenceDots
  };
})();
