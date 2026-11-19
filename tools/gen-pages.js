const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const ico = (n, cls = '') => `<img src="assets/icons/ui-${n}.svg" alt="" ${cls ? `class="${cls}"` : ''}>`;
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const V = '?v=20261119b';

const navLinks = [
  ['index.html', '首页', 'home'],
  ['trends.html', '未来趋势', 'trends'],
  ['trends.html?category=tech', '未来科技', 'tech'],
  ['index.html#topics', '未来世界', 'world'],
  ['predictions.html', '未来预测', 'predictions'],
  ['books.html', '书籍与报告', 'books'],
  ['resources.html', '研究机构', 'resources'],
  ['timeline.html', '时间轴', 'timeline']
];

function header(active) {
  const nav = navLinks.map(([url, name, id]) =>
    `<a href="${url}"${active === id ? ' class="is-active" aria-current="page"' : ''}>${name}</a>`).join('');
  const mobile = [...navLinks, ['about.html', '关于本站', 'about']].map(([url, name]) => `<a href="${url}">${name}</a>`).join('');
  return `<div class="reading-progress" aria-hidden="true"></div>
<header class="site-header${active === 'home' ? '' : ' is-solid'}">
  <div class="header-inner">
    <a class="brand" href="index.html" aria-label="Future Atlas 首页">
      <img class="brand-mark" src="assets/icons/logo.svg" alt="Future Atlas 标志">
      <span class="brand-text"><span class="brand-name">FUTURE ATLAS</span><span class="brand-sub">未来图谱</span></span>
    </a>
    <nav class="main-nav" aria-label="主导航">${nav}</nav>
    <div class="header-actions">
      <button class="icon-btn" data-search-open aria-label="全站搜索" title="全站搜索 (Ctrl+K)">${ico('search')}</button>
      <button class="icon-btn theme-toggle" data-theme-toggle aria-label="切换主题" aria-pressed="false">${ico('sun')}</button>
      <button class="icon-btn menu-toggle" aria-label="打开菜单" aria-expanded="false">${ico('menu')}</button>
    </div>
  </div>
</header>
<nav class="mobile-menu" aria-label="移动端导航">${mobile}<a href="about.html" class="btn btn-ghost mobile-cta">了解 Future Atlas</a></nav>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="index.html"><img class="brand-mark" src="assets/icons/logo.svg" alt=""><span class="brand-text"><span class="brand-name">FUTURE ATLAS</span><span class="brand-sub">未来图谱</span></span></a>
        <p>一个面向中文读者的未来知识图书馆。收集、整理并解读未来趋势、科技突破、社会演进与文明设想，让复杂的未来议题变得可理解、可讨论。</p>
      </div>
      <div class="footer-col"><h4>内容分类</h4>
        <a href="trends.html">未来趋势</a><a href="predictions.html">未来预测</a><a href="trends.html?category=ai">人工智能</a><a href="trends.html?category=space">太空探索</a><a href="timeline.html">未来时间轴</a>
      </div>
      <div class="footer-col"><h4>资源导航</h4>
        <a href="books.html">未来学书籍</a><a href="resources.html">研究机构</a><a href="resources.html?category=media">科技媒体</a><a href="index.html#topics">深度专题</a><a href="about.html">关于本站</a>
      </div>
      <div class="footer-col"><h4>联系与说明</h4>
        <a href="about.html#method">内容方法</a><a href="about.html#sources">素材来源</a><a href="about.html#disclaimer">免责声明</a><a href="mailto:hello@futureatlas.example">联系编辑部</a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-disclaimer">免责声明：本站内容仅供学习与研究参考。预测类内容均标注来源与不确定性，其中「假设情景」为编辑部首创推演，不代表任何机构立场，不应作为投资或决策依据。</div>
      <div>© <span data-year>2026</span> Future Atlas 未来图谱 · 保留所有权利</div>
    </div>
  </div>
</footer>
<button class="back-to-top" aria-label="返回顶部">${ico('arrowUp')}</button>`;
}

function head(opt) {
  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${opt.title}</title>
<meta name="description" content="${opt.desc}">
<meta name="keywords" content="${opt.keywords || '未来,未来学,未来科技,未来趋势,人工智能,太空探索,未来城市'}">
<meta name="theme-color" content="#060b18">
<meta property="og:type" content="website">
<meta property="og:title" content="${opt.title}">
<meta property="og:description" content="${opt.desc}">
<meta property="og:image" content="assets/images/hero-earth.webp">
<meta property="og:locale" content="zh_CN">
<link rel="icon" type="image/svg+xml" href="assets/icons/logo.svg">
<link rel="stylesheet" href="assets/css/style.css${V}">
<link rel="stylesheet" href="assets/css/components.css${V}">
<link rel="stylesheet" href="assets/css/responsive.css${V}">
<script>try{var t=localStorage.getItem('future-atlas-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
<script src="assets/js/data.js${V}" defer></script>
<script src="assets/js/theme.js${V}" defer></script>
<script src="assets/js/search.js${V}" defer></script>
<script src="assets/js/filters.js${V}" defer></script>
<script src="assets/js/timeline.js${V}" defer></script>
<script src="assets/js/main.js${V}" defer></script>
</head>
<body data-page="${opt.page}">`;
}

function pageHero(opt) {
  return `<section class="page-hero"><div class="container page-hero-inner">
  <nav class="breadcrumb" aria-label="面包屑"><a href="index.html">首页</a><span>/</span><span>${opt.crumb}</span></nav>
  <span class="eyebrow">${opt.eyebrow}</span>
  <h1>${opt.title}</h1><p>${opt.desc}</p>
</div></section>`;
}

function end() { return `</body>\n</html>\n`; }

/* ---------------- 首页 ---------------- */
const home = head({ page: 'home', title: 'Future Atlas 未来图谱 — 探索未来，理解正在发生的变化', desc: '从科技突破到文明演进，收集思想、预测与研究，描绘未来世界的无限可能。中文未来知识门户：未来趋势、未来预测、未来科技、未来城市与研究机构。', keywords: '未来图谱,未来世界,未来趋势,未来预测,未来科技,未来城市,人工智能,太空文明' }) + `
${header('home')}
<main>
  <section class="hero">
    <div class="hero-bg"><img src="assets/images/hero-earth.webp" alt="从太空俯瞰的地球，象征人类文明的未来" fetchpriority="high"></div>
    <div class="hero-glow a"></div><div class="hero-glow b"></div>
    <div class="hero-deco"><div class="hero-grid"></div><div class="hero-orbit"></div><span class="hero-dot d1"></span><span class="hero-dot d2"></span></div>
    <div class="container hero-inner">
      <span class="hero-eyebrow"><i></i> 一份持续更新的中文未来知识档案</span>
      <h1 class="hero-title">探索未来，<br><span class="grad">理解正在发生的变化。</span></h1>
      <p class="hero-sub">从科技突破到文明演进，收集思想、预测与研究，描绘未来世界的无限可能。在这里，未来不是一句口号，而是可以被阅读、被比较、被讨论的知识体系。</p>
      <form class="search-bar hero-search" data-hero-search role="search">
        ${ico('search')}
        <label class="sr-only" for="hero-q">搜索未来科技、趋势、预测、书籍</label>
        <input id="hero-q" type="search" placeholder="搜索未来科技、趋势、预测、书籍……" autocomplete="off">
        <button type="submit" class="btn btn-primary btn-sm">搜索</button>
      </form>
      <div class="hero-actions">
        <a href="#topics" class="btn btn-primary btn-lg">探索未来 ${arrow}</a>
        <a href="predictions.html" class="btn btn-ghost btn-lg">浏览未来预测</a>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><strong data-count="20" data-suffix="+">20</strong><span>深度趋势文章</span></div>
        <div class="hero-stat"><strong data-count="20" data-suffix="+">20</strong><span>结构化未来预测</span></div>
        <div class="hero-stat"><strong data-count="32" data-suffix="+">32</strong><span>时间轴关键节点</span></div>
        <div class="hero-stat"><strong data-count="26" data-suffix="+">26</strong><span>研究机构与资源</span></div>
      </div>
    </div>
    <div class="scroll-hint"><span>向下滚动</span><i></i></div>
  </section>

  <section class="section" id="observation">
    <div class="container">
      <div class="section-head reveal"><div class="section-head-text"><span class="eyebrow">今日未来观察</span><h2 class="section-title">正在改变世界的议题</h2><p class="section-desc">编辑部精选：那些值得今天就开始关注的趋势、突破与争论。</p></div><a href="trends.html" class="section-link">查看全部趋势 ${arrow}</a></div>
      <div class="masonry-feature reveal" id="featured-story"></div>
      <div class="grid grid-3 reveal" id="observation-grid" style="margin-top:24px"></div>
    </div>
  </section>

  <section class="section section-alt" id="categories">
    <div class="container">
      <div class="orb-deco one"></div>
      <div class="section-head reveal"><div class="section-head-text"><span class="eyebrow">未来世界六大主题</span><h2 class="section-title">从智能到文明，构建理解的坐标</h2><p class="section-desc">六个相互关联的主题，覆盖技术、城市、社会、经济与太空的系统性变化。</p></div></div>
      <div class="grid grid-3 reveal" id="category-grid"></div>
    </div>
  </section>

  <section class="section" id="predictions">
    <div class="container">
      <div class="section-head reveal"><div class="section-head-text"><span class="eyebrow">未来预测精选</span><h2 class="section-title">5 年、10 年、20 年、50 年、100 年之后</h2><p class="section-desc">每条预测均标注来源、发布时间、可信度与不确定性。推测情景不会被写成既成事实。</p></div><a href="predictions.html" class="section-link">查看全部预测 ${arrow}</a></div>
      <div class="grid grid-3 reveal" id="prediction-grid"></div>
    </div>
  </section>

  <section class="section section-alt" id="timeline">
    <div class="container">
      <div class="section-head reveal"><div class="section-head-text"><span class="eyebrow">未来时间轴</span><h2 class="section-title">从 2026 到 2100，一条可阅读的时间线</h2><p class="section-desc">明确区分已发生事实、官方规划、专家预测与假设情景，让每一种信息都有清晰的身份。</p></div><a href="timeline.html" class="section-link">打开交互时间轴 ${arrow}</a></div>
      <div class="grid grid-2 reveal" id="home-timeline"></div>
    </div>
  </section>

  <section class="section" id="books">
    <div class="container">
      <div class="section-head reveal"><div class="section-head-text"><span class="eyebrow">未来学书籍推荐</span><h2 class="section-title">理解未来，先读懂这些书</h2><p class="section-desc">中外经典与重要著作，涵盖文明史、技术趋势、人工智能与社会发展。</p></div><a href="books.html" class="section-link">浏览全部书籍 ${arrow}</a></div>
      <div class="grid grid-4 reveal" id="books-grid"></div>
    </div>
  </section>

  <section class="section section-light" id="resources">
    <div class="container">
      <div class="section-head reveal"><div class="section-head-text"><span class="eyebrow">未来研究机构与网站</span><h2 class="section-title">值得长期关注的思想来源</h2><p class="section-desc">来自全球的研究机构、智库、科学组织与科技媒体，提供一手的研究与数据。</p></div><a href="resources.html" class="section-link">查看全部资源 ${arrow}</a></div>
      <div class="grid grid-2 reveal" id="resources-grid"></div>
    </div>
  </section>

  <section class="section" id="topics">
    <div class="container">
      <div class="section-head reveal"><div class="section-head-text"><span class="eyebrow">深度专题</span><h2 class="section-title">八个值得深入的未来命题</h2><p class="section-desc">把分散的文章、预测与书籍组织成可持续阅读的知识路径。</p></div></div>
      <div class="grid grid-4 reveal" id="topics-grid"></div>
    </div>
  </section>

  <section class="section-tight"><div class="container"><div class="split-cta reveal"><div><h2>把未来变成可以讨论的问题</h2><p>从一条预测、一篇文章或一本书开始，建立属于你自己的未来认知框架。</p></div><a href="trends.html" class="btn btn-primary btn-lg">开始探索 ${arrow}</a></div></div></section>
</main>
${footer()}
<script>
document.querySelector('[data-hero-search]').addEventListener('submit', function (e) {
  e.preventDefault();
  var v = document.getElementById('hero-q').value.trim();
  if (v && window.AtlasSearch) window.AtlasSearch.open(v);
  else if (window.AtlasSearch) window.AtlasSearch.open();
});
</script>
${end()}`;

/* ---------------- 趋势列表 ---------------- */
const trends = head({ page: 'trends', title: '未来趋势 — Future Atlas 未来图谱', desc: '按分类、标签与热度浏览 20 篇未来趋势文章，覆盖人工智能、未来科技、城市、社会、经济与太空探索。', keywords: '未来趋势,人工智能趋势,未来科技,未来城市,未来社会' }) + `
${header('trends')}
<main>
${pageHero({ crumb: '未来趋势', eyebrow: 'Future Trends', title: '未来趋势', desc: '以编辑视角解读正在发生的技术与社会变化。分类、标签、排序与搜索，帮你快速找到真正关心的内容。' })}
<section class="section">
  <div class="container">
    <div class="filter-bar">
      <div class="filter-group"><span class="filter-label">分类</span><span id="category-chips" style="display:contents"></span></div>
      <div class="filter-group"><span class="filter-label">标签</span><span id="tag-chips" style="display:contents"></span></div>
      <div class="filter-group" style="width:100%"><label class="filter-label" for="list-search">搜索</label><div class="search-bar search-compact">${ico('search')}<input id="list-search" type="search" placeholder="在趋势中搜索…"></div>
        <div class="select-wrap"><label class="sr-only" for="sort-select">排序方式</label><select id="sort-select"><option value="latest">最新发布</option><option value="popular">热门阅读</option><option value="featured">编辑精选</option></select>${ico('chevronDown')}</div>
      </div>
    </div>
    <div class="toolbar"><div class="toolbar-left"><span class="result-count" id="result-count"></span></div></div>
    <div class="active-filters" id="active-filters"></div>
    <div class="grid grid-3" id="article-list"></div>
    <div class="load-more-wrap" id="load-more-wrap"></div>
  </div>
</section>
</main>
${footer()}${end()}`;

/* ---------------- 预测 ---------------- */
const predictions = head({ page: 'predictions', title: '未来预测 — Future Atlas 未来图谱', desc: '按年份、领域与情景筛选未来预测。每条预测提供来源、发布时间、证据与不确定性说明，区分乐观、基准与悲观情景。', keywords: '未来预测,预测情景,技术预测,2050,2100' }) + `
${header('predictions')}
<main>
${pageHero({ crumb: '未来预测', eyebrow: 'Future Predictions', title: '未来预测', desc: '预测不是预言。这里把每条判断放在可检验的框架里：谁说的、何时说的、依据是什么、有多不确定。' })}
<section class="section">
  <div class="container">
    <div class="filter-bar">
      <div class="filter-group"><span class="filter-label">年份</span><span id="year-chips" style="display:contents"></span></div>
      <div class="filter-group"><span class="filter-label">领域</span><span id="pred-category-chips" style="display:contents"></span></div>
      <div class="filter-group"><span class="filter-label">情景</span><span id="scenario-chips" style="display:contents"></span></div>
      <div class="filter-group"><label class="filter-label" for="prediction-search">搜索</label><div class="search-bar search-compact">${ico('search')}<input id="prediction-search" type="search" placeholder="搜索预测主题或来源…"></div></div>
    </div>
    <div class="toolbar"><div class="toolbar-left"><span class="result-count" id="result-count"></span><span class="tag">预测按时间先后排列</span></div></div>
    <div class="grid grid-3" id="prediction-list"></div>
    <p style="text-align:center;color:var(--text-dim);font-size:12.5px;margin-top:44px;max-width:760px;margin-inline:auto">阅读提示：标注为「情景推演」或「假设情景」的内容为编辑部基于现有趋势的推演，不代表任何机构的正式预测，请勿作为投资或政策依据。</p>
  </div>
</section>
</main>
${footer()}${end()}`;

/* ---------------- 书籍 ---------------- */
const books = head({ page: 'books', title: '未来学书籍 — Future Atlas 未来图谱', desc: '15 本未来学、人工智能、科技趋势与文明研究领域的中外经典著作，提供作者、出版年份、简介与推荐理由。', keywords: '未来学书籍,未来简史,奇点临近,人工智能书籍,科技趋势书单' }) + `
${header('books')}
<main>
${pageHero({ crumb: '书籍与报告', eyebrow: 'Future Library', title: '未来学书籍', desc: '从《人类简史》到《生命 3.0》，一份经过筛选的未来阅读书单。所有书籍信息均为真实出版物，封面为本站原创设计插画。' })}
<section class="section">
  <div class="container">
    <div class="filter-bar">
      <div class="filter-group"><span class="filter-label">主题</span><span id="book-category-chips" style="display:contents"></span></div>
      <div class="filter-group"><label class="filter-label" for="book-search">搜索</label><div class="search-bar search-compact">${ico('search')}<input id="book-search" type="search" placeholder="书名、作者或关键词…"></div>
        <div class="select-wrap"><label class="sr-only" for="book-sort">排序</label><select id="book-sort"><option value="rating">推荐指数</option><option value="latest">出版年份</option><option value="title">书名</option></select>${ico('chevronDown')}</div>
      </div>
    </div>
    <div class="toolbar"><span class="result-count" id="result-count"></span></div>
    <div class="grid grid-4" id="book-list"></div>
  </div>
</section>
</main>
${footer()}${end()}`;

/* ---------------- 资源 ---------------- */
const resources = head({ page: 'resources', title: '未来研究机构与网站 — Future Atlas 未来图谱', desc: '整理全球未来学研究机构、智库、科学组织、科技媒体与开放数据库，区分官方网站与第三方资料。', keywords: '未来研究机构,智库,未来学网站,科技媒体,开放数据' }) + `
${header('resources')}
<main>
${pageHero({ crumb: '研究机构与网站', eyebrow: 'Research Directory', title: '未来研究机构与网站', desc: '26 个值得长期关注的思想来源。每条资源标注类型、研究方向、地区与链接性质，官方网站与第三方资料分开标识。' })}
<section class="section">
  <div class="container">
    <div class="filter-bar">
      <div class="filter-group"><span class="filter-label">类型</span><span id="resource-category-chips" style="display:contents"></span></div>
      <div class="filter-group"><span class="filter-label">链接</span><span id="linktype-chips" style="display:contents"></span></div>
      <div class="filter-group"><label class="filter-label" for="resource-search">搜索</label><div class="search-bar search-compact">${ico('search')}<input id="resource-search" type="search" placeholder="机构名称、方向或地区…"></div></div>
    </div>
    <div class="toolbar"><span class="result-count" id="result-count"></span></div>
    <div class="grid grid-2" id="resource-list"></div>
  </div>
</section>
</main>
${footer()}${end()}`;

/* ---------------- 时间轴 ---------------- */
const timeline = head({ page: 'timeline', title: '未来时间轴 2026—2100 — Future Atlas 未来图谱', desc: '以年份为核心的交互式未来时间轴，覆盖科技、社会、能源、交通、医疗与太空，明确标注事实、规划、预测与假设情景。', keywords: '未来时间轴,2026,2030,2040,2050,2070,2100,未来事件' }) + `
${header('timeline')}
<main>
${pageHero({ crumb: '未来时间轴', eyebrow: 'Interactive Timeline', title: '未来时间轴 · 2026—2100', desc: '点击任意节点查看详情。每个事件都带有身份标签：已发生事实、官方规划、专家预测或假设情景，避免把推测误读为结论。' })}
<section class="section">
  <div class="container">
    <div class="filter-bar">
      <div class="filter-group"><span class="filter-label">领域</span><span id="timeline-category-chips" style="display:contents"></span></div>
      <div class="filter-group"><span class="filter-label">性质</span><span id="timeline-status-chips" style="display:contents"></span></div>
      <div class="filter-group"><label class="filter-label" for="timeline-search">搜索</label><div class="search-bar search-compact">${ico('search')}<input id="timeline-search" type="search" placeholder="搜索时间节点…"></div></div>
    </div>
    <div class="toolbar"><span class="result-count" id="result-count"></span><span class="tag">点击节点展开来源</span></div>
    <div id="timeline-container"></div>
  </div>
</section>
</main>
${footer()}${end()}`;

/* ---------------- 文章详情 ---------------- */
const article = head({ page: 'article', title: '文章详情 — Future Atlas 未来图谱', desc: 'Future Atlas 未来趋势深度解读文章，包含目录导航、核心要点、相关预测与书籍推荐。', keywords: '未来趋势文章,未来解读,未来图谱' }) + `
${header('trends')}
<main>
${pageHero({ crumb: '未来趋势 / 文章', eyebrow: 'Future Reading', title: '趋势解读', desc: '一篇文章，一个理解未来的角度。正文含目录跳转、核心要点、相关预测与延伸阅读。' })}
<section class="section"><div class="container" id="article-root"></div></section>
</main>
${footer()}${end()}`;

/* ---------------- 关于 ---------------- */
const about = head({ page: 'about', title: '关于本站 — Future Atlas 未来图谱', desc: '了解 Future Atlas 的定位、内容方法、素材来源与免责声明：一个面向中文读者的未来知识图书馆。', keywords: '关于未来图谱,内容方法,素材来源,免责声明' }) + `
${header('about')}
<main>
${pageHero({ crumb: '关于本站', eyebrow: 'About Future Atlas', title: '关于 Future Atlas', desc: '一个面向中文读者的未来知识图书馆：把分散的思想、预测、研究和数据，组织成可以阅读、比较与讨论的知识体系。' })}
<section class="section"><div class="container-narrow">
  <div class="reveal"><span class="eyebrow">我们的定位</span><h2 class="section-title">不是博客，而是一座未来知识图书馆</h2>
  <p style="color:var(--text-muted);font-size:16px;line-height:1.95">Future Atlas 专注于收集、整理与展示未来世界、未来预测、未来科技趋势、未来学研究、未来生活方式、未来城市、未来经济与社会发展相关内容。我们希望把零散的信息变成有结构、有来源、有语境的知识，让中文读者能够更准确地理解正在发生的变化。</p>
  <p style="color:var(--text-muted);font-size:16px;line-height:1.95">网站以科技杂志的编辑标准组织内容：每篇趋势文章有清晰的论证结构，每条预测标注来源与不确定性，每份研究资源注明性质与方向。所有推测性内容均明确标注，不会被包装成事实。</p></div>
  <div class="divider"></div>
  <div class="reveal" id="method"><span class="eyebrow">内容方法</span><h2 class="section-title">如何标注一条预测</h2>
  <div class="grid grid-2" style="margin-top:24px">
    <div class="side-card"><h4>四种身份标签</h4><p style="font-size:13.5px;color:var(--text-muted);line-height:1.8;margin:0">已发生事实：有公开数据支撑的既成事实。<br>官方规划：机构公开声明的目标与路线图。<br>专家预测：由可识别来源提出的判断。<br>假设情景：编辑部基于趋势的推演，不具备预测效力。</p></div>
    <div class="side-card"><h4>三种情景与可信度</h4><p style="font-size:13.5px;color:var(--text-muted);line-height:1.8;margin:0">预测按乐观、基准、悲观三种情景组织，并配有三档可信度指示。每条预测都附有依据与不确定性说明，便于读者判断其适用范围。</p></div>
  </div></div>
  <div class="divider"></div>
  <div class="reveal" id="sources"><span class="eyebrow">素材与许可</span><h2 class="section-title">图片与内容来源</h2>
  <p style="color:var(--text-muted);font-size:15.5px;line-height:1.95">站内摄影图片下载自 Unsplash，依据 Unsplash License 使用，详细说明见项目根目录 <code>IMAGE-SOURCES.md</code>。全部 SVG 插画与书籍封面由本站原创绘制，位于 <code>assets/icons/</code>。书籍、机构与网站信息均取自公开资料，内容解读为编辑部原创。</p>
  <p style="color:var(--text-muted);font-size:15.5px;line-height:1.95">主要参考来源包括：国际能源署（IEA）、政府间气候变化专门委员会（IPCC）、联合国人口司、NASA 与 ESA 等机构的公开报告，以及 Nature、Science、MIT Technology Review 等科学媒体。</p></div>
  <div class="divider"></div>
  <div class="reveal" id="disclaimer"><span class="eyebrow">免责声明</span><h2 class="section-title">请审慎使用本站内容</h2>
  <p style="color:var(--text-muted);font-size:15.5px;line-height:1.95">本站内容仅供学习与研究参考，不构成投资、医疗、法律或其他专业建议。未来本质上是开放的，任何预测都可能被现实推翻。对于标注为「情景推演」或「假设情景」的内容，读者应理解其为思想实验而非事实陈述。引用数据请以原始来源为准。</p></div>
  <div class="divider"></div>
  <div class="reveal"><span class="eyebrow">联系</span><h2 class="section-title">与我们交流</h2>
  <p style="color:var(--text-muted);font-size:15.5px">如果你发现事实错误、失效链接或有内容建议，欢迎联系编辑部：<a href="mailto:hello@futureatlas.example" style="color:var(--primary)">hello@futureatlas.example</a></p>
  <a href="index.html" class="btn btn-primary" style="margin-top:12px">返回首页 ${arrow}</a></div>
</div></section>
</main>
${footer()}${end()}`;

const pages = { 'index.html': home, 'trends.html': trends, 'predictions.html': predictions, 'books.html': books, 'resources.html': resources, 'timeline.html': timeline, 'article.html': article, 'about.html': about };
for (const [name, html] of Object.entries(pages)) {
  fs.writeFileSync(path.join(root, name), html, 'utf8');
  console.log('wrote', name, html.length, 'bytes');
}
