/* 交互式未来时间轴 */
(function () {
  'use strict';

  var categoryLabels = {
    tech: '科技', society: '社会', economy: '经济', environment: '环境',
    energy: '能源', transport: '交通', health: '医疗', space: '太空'
  };

  function statusLabel(status) {
    var d = window.AtlasData || {};
    return (d.statusLabels && d.statusLabels[status]) || status;
  }

  function statusClass(status) {
    return 'badge-' + (status || 'scenario');
  }

  function render(container, filters) {
    if (!container) return;
    var d = window.AtlasData || {};
    var items = (d.timeline || []).filter(function (t) {
      if (filters.category && filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.status && filters.status !== 'all' && t.status !== filters.status) return false;
      if (filters.query) {
        var hay = [t.title, t.description, t.year, statusLabel(t.status)].join(' ').toLowerCase();
        if (hay.indexOf(filters.query.toLowerCase()) === -1) return false;
      }
      return true;
    });

    if (!items.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon"><img src="assets/icons/ui-calendar.svg" alt="" style="width:32px;height:32px"></div><h3>该条件下暂无时间节点</h3><p>试着放宽分类或状态筛选。</p></div>';
      return '';
    }

    var years = [];
    items.forEach(function (t) { if (years.indexOf(t.year) === -1) years.push(t.year); });
    years.sort(function (a, b) { return a - b; });

    var html = '<div class="timeline-wrap">';
    years.forEach(function (year) {
      var yearItems = items.filter(function (t) { return t.year === year; });
      html += '<section class="timeline-year-group" id="year-' + year + '"><div class="timeline-year-badge">' + year + '</div>';
      yearItems.forEach(function (t) {
        var detail = '<p>来源：' + (t.source || '编辑部整理') + '</p>';
        var article = (d.articles || []).find(function (a) { return a.id === t.article; });
        if (article) detail += '<p>延伸阅读：<a href="article.html?id=' + encodeURIComponent(article.id) + '">' + article.title + '</a></p>';
        html += '<article class="timeline-entry" data-timeline-id="' + t.id + '">' +
          '<div class="timeline-node" tabindex="0" role="button" aria-expanded="false">' +
          '<div class="timeline-node-top"><span class="badge ' + statusClass(t.status) + '">' + statusLabel(t.status) + '</span>' +
          '<span class="tag">' + (categoryLabels[t.category] || t.category) + '</span></div>' +
          '<h3>' + t.title + '</h3><p>' + t.description + '</p>' +
          '<div class="timeline-detail">' + detail + '</div></div></article>';
      });
      html += '</section>';
    });
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.timeline-node').forEach(function (node) {
      function toggle() {
        var open = node.classList.toggle('is-expanded');
        node.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      node.addEventListener('click', toggle);
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });

    return items.map(function (t) { return t.id; });
  }

  function focus(id) {
    var el = document.querySelector('[data-timeline-id="' + id + '"]');
    if (!el) return;
    var node = el.querySelector('.timeline-node');
    node.classList.add('is-expanded');
    node.setAttribute('aria-expanded', 'true');
    setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
  }

  window.AtlasTimeline = { render: render, focus: focus, categoryLabels: categoryLabels };
})();
