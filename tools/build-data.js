const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'data', name + '.json'), 'utf8'));

const categories = [
  { id: 'ai', name: '人工智能与机器人', icon: 'assets/icons/ai-brain.svg', image: 'assets/images/ai-data.webp', desc: '从大模型到具身智能，探索机器如何重新定义智能的边界。', color: '#4d8dff' },
  { id: 'tech', name: '未来科技与科学', icon: 'assets/icons/digital-earth.svg', image: 'assets/images/circuit.webp', desc: '量子计算、核聚变、脑机接口，追踪基础科学的突破与工程化。', color: '#35d0d8' },
  { id: 'city', name: '未来城市与建筑', icon: 'assets/icons/future-city.svg', image: 'assets/images/city-sky.webp', desc: '15 分钟城市、生态建筑与海绵城市，重新想象人类的聚居方式。', color: '#8b6ff5' },
  { id: 'society', name: '未来社会与人类', icon: 'assets/icons/humanoid-robot.svg', image: 'assets/images/books.webp', desc: '长寿时代、数字身份与教育重构，思考社会结构与个体位置。', color: '#5ab8ff' },
  { id: 'economy', name: '未来经济与工作', icon: 'assets/icons/data-network.svg', image: 'assets/images/network.webp', desc: '自动化、代币化与后工作时代，理解财富与劳动的新逻辑。', color: '#7de3c0' },
  { id: 'space', name: '太空探索与宇宙文明', icon: 'assets/icons/galaxy.svg', image: 'assets/images/galaxy.webp', desc: '可复用火箭、月球基地与地外生命，望向地球之外的文明前景。', color: '#a990ff' }
];

const predictionCategories = [
  { id: 'tech', name: '科技' },
  { id: 'society', name: '社会' },
  { id: 'economy', name: '经济' },
  { id: 'environment', name: '环境' },
  { id: 'health', name: '医疗' },
  { id: 'space', name: '太空' }
];

const topics = [
  { id: 'world-2050', title: '2050 年的世界', subtitle: '世界将走向何方', image: 'assets/images/earth-network.webp', icon: 'assets/icons/digital-earth.svg', url: 'predictions.html?category=environment', desc: '汇集气候、能源、人口与地缘趋势，描绘本世纪中叶世界的多种可能面貌。', tags: ['2050', '全球趋势', '情景规划'] },
  { id: 'ai-human', title: '人工智能之后的人类', subtitle: '智能时代的自我定位', image: 'assets/images/ai-data.webp', icon: 'assets/icons/ai-brain.svg', url: 'trends.html?category=ai', desc: '当机器开始思考，人类的独特价值、社会角色与伦理边界将如何改变。', tags: ['人工智能', '伦理', '文明'] },
  { id: 'energy', title: '未来能源革命', subtitle: '驱动文明的底层力量', image: 'assets/images/solar.webp', icon: 'assets/icons/future-energy.svg', url: 'trends.html?tag=能源', desc: '从光伏、储能到聚变，追踪能源系统如何走向清洁、稳定与充裕。', tags: ['能源', '核聚变', '可持续'] },
  { id: 'mars', title: '火星移民与太空文明', subtitle: '走出地球的第二步', image: 'assets/images/mars.webp', icon: 'assets/icons/mars-base.svg', url: 'trends.html?category=space', desc: '从可复用火箭到自给定居点，梳理人类成为多行星物种的技术与社会前提。', tags: ['火星', '航天', '太空文明'] },
  { id: 'future-city', title: '未来城市与智能交通', subtitle: '重新设计人类的聚居地', image: 'assets/images/city-night.webp', icon: 'assets/icons/future-city.svg', url: 'trends.html?category=city', desc: '紧凑城市、自动驾驶与生态基础设施，构建更宜居、更低碳的城市生活。', tags: ['城市', '交通', '建筑'] },
  { id: 'longevity', title: '人类寿命与生命科学', subtitle: '重新理解生命的长度', image: 'assets/images/medicine.webp', icon: 'assets/icons/biotech.svg', url: 'trends.html?category=society', desc: '衰老生物学、基因编辑与脑机接口，正在改写人类对身体与寿命的理解。', tags: ['长寿', '生物科技', '医疗'] },
  { id: 'post-work', title: '后工作时代', subtitle: '当劳动被重新定义', image: 'assets/images/network.webp', icon: 'assets/icons/data-network.svg', url: 'trends.html?category=economy', desc: '自动化、技能极化与新的社会保障，探索工作之外的生活可能性。', tags: ['工作', '经济', '自动化'] },
  { id: 'climate', title: '气候变化与地球未来', subtitle: '一颗星球的未来答卷', image: 'assets/images/nature.webp', icon: 'assets/icons/digital-earth.svg', url: 'predictions.html?category=environment', desc: '从气候模型到适应型城市，理解地球系统面临的压力与人类的应对路径。', tags: ['气候', '生态', '可持续'] }
];

const statusLabels = {
  fact: '已发生事实',
  plan: '官方规划',
  prediction: '专家预测',
  scenario: '假设情景'
};

const scenarioLabels = {
  optimistic: '乐观情景',
  baseline: '基准情景',
  pessimistic: '悲观情景'
};

const confidenceLabels = {
  high: '较高可信度',
  medium: '中等可信度',
  low: '低可信度 / 高度不确定'
};

const timelineCategoryLabels = {
  tech: '科技', society: '社会', economy: '经济', environment: '环境',
  energy: '能源', transport: '交通', health: '医疗', space: '太空'
};

const data = {
  articles: read('articles'),
  predictions: read('predictions'),
  books: read('books'),
  resources: read('resources').map(function (r) {
    r.tags = r.focus || [];
    return r;
  }),
  timeline: read('timeline').map(function (t) {
    t.tags = [statusLabels[t.status] || t.status, timelineCategoryLabels[t.category] || t.category];
    return t;
  }),
  categories,
  predictionCategories,
  topics,
  statusLabels,
  scenarioLabels,
  confidenceLabels
};

const out = `/* 由 tools/build-data.js 生成，请勿直接修改本文件。修改 data/*.json 后重新运行生成脚本。 */
window.AtlasData = ${JSON.stringify(data, null, 2)};
`;
fs.writeFileSync(path.join(root, 'assets', 'js', 'data.js'), out, 'utf8');
console.log('wrote assets/js/data.js', out.length, 'bytes');
