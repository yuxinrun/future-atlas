const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
let errors = [];
let checked = 0;

function exists(rel, from) {
  checked++;
  const p = path.resolve(root, rel);
  if (!fs.existsSync(p)) errors.push('缺失: ' + rel + '  (引用自 ' + from + ')');
}

const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const allText = [];
for (const f of htmlFiles) allText.push({ name: f, text: fs.readFileSync(path.join(root, f), 'utf8') });
for (const f of fs.readdirSync(path.join(root, 'data'))) if (f.endsWith('.json')) allText.push({ name: 'data/' + f, text: fs.readFileSync(path.join(root, 'data', f), 'utf8') });
allText.push({ name: 'assets/js/data.js', text: fs.readFileSync(path.join(root, 'assets/js/data.js'), 'utf8') });
allText.push({ name: 'assets/js/main.js', text: fs.readFileSync(path.join(root, 'assets/js/main.js'), 'utf8') });
allText.push({ name: 'tools/build-data.js', text: fs.readFileSync(path.join(root, 'tools/build-data.js'), 'utf8') });

for (const file of allText) {
  const re = /assets\/(?:images|icons|css|js|fonts)\/[A-Za-z0-9._\-\/]+\.(?:webp|svg|css|js)/g;
  let m;
  while ((m = re.exec(file.text)) !== null) exists(m[0], file.name);
}

for (const f of htmlFiles) {
  const text = fs.readFileSync(path.join(root, f), 'utf8');
  ['<title>', 'name="description"', 'property="og:title"', 'property="og:description"', 'property="og:image"', 'data-page=', 'assets/css/style.css', 'assets/js/data.js', 'assets/js/main.js'].forEach(token => {
    if (text.indexOf(token) === -1) errors.push(f + ' 缺少 ' + token);
  });
}

const rawData = fs.readFileSync(path.join(root, 'assets/js/data.js'), 'utf8').replace(/^\/\*[\s\S]*?\*\/\s*/, '').replace(/^window\.AtlasData\s*=\s*/, '').replace(/;\s*$/, '');
const data = JSON.parse(rawData);
const articleIds = new Set(data.articles.map(a => a.id));
for (const p of data.predictions) {
  if (p.relatedArticle && !articleIds.has(p.relatedArticle)) errors.push('预测 ' + p.id + ' 关联文章不存在: ' + p.relatedArticle);
}
for (const b of data.books) {
  if (b.relatedArticle && !articleIds.has(b.relatedArticle)) errors.push('书籍 ' + b.id + ' 关联文章不存在: ' + b.relatedArticle);
}
for (const t of data.timeline) {
  if (t.article && !articleIds.has(t.article)) errors.push('时间轴 ' + t.id + ' 关联文章不存在: ' + t.article);
}
for (const r of data.resources) {
  if (!/^https?:\/\//.test(r.url)) errors.push('资源 ' + r.id + ' URL 无效');
}

const required = ['index.html','trends.html','predictions.html','books.html','resources.html','timeline.html','article.html','about.html','README.md','IMAGE-SOURCES.md'];
for (const f of required) if (!fs.existsSync(path.join(root, f))) errors.push('缺少文件: ' + f);

console.log('检查引用 ' + checked + ' 次');
console.log('文章 ' + data.articles.length + ' / 预测 ' + data.predictions.length + ' / 书籍 ' + data.books.length + ' / 资源 ' + data.resources.length + ' / 时间轴 ' + data.timeline.length + ' / 专题 ' + data.topics.length);
if (errors.length) { console.log('\n发现问题 ' + errors.length + ' 条:'); errors.forEach(e => console.log(' - ' + e)); process.exit(1); }
console.log('\n全部检查通过');
