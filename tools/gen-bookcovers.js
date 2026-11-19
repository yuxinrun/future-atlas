const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'assets', 'icons');

const books = [
  ['01','人类简史','SAPIENS','#1b3a6b','#4d8dff','circle'],
  ['02','未来简史','HOMO DEUS','#3a2359','#8b6ff5','orbit'],
  ['03','今日简史','21 LESSONS','#0e3b45','#35d0d8','grid'],
  ['04','奇点临近','SINGULARITY','#401f2e','#ff7b8a','spiral'],
  ['05','失控','OUT OF CONTROL','#12332b','#4fd6a8','network'],
  ['06','必然','THE INEVITABLE','#1e2a56','#6f9bff','wave'],
  ['07','科技想要什么','WHAT TECH WANTS','#2d2a1c','#e0b95c','circuit'],
  ['08','第二次机器革命','SECOND MACHINE','#142f3d','#5ec8e8','bars'],
  ['09','生命3.0','LIFE 3.0','#2b1f4d','#a98cff','dna'],
  ['10','规模','SCALE','#123047','#56b7e8','hex'],
  ['11','AI 3.0','AI 3.0','#1f2b35','#8fd4ff','nodes'],
  ['12','富足','ABUNDANCE','#2f3418','#c6d95e','sun'],
  ['13','智能时代','INTELLIGENT ERA','#202a4a','#7ea6ff','dots'],
  ['14','全球科技通史','TECH HISTORY','#33251c','#e6a76b','line'],
  ['15','创新者的窘境','INNOVATOR','#2a1f38','#b28cff','layers']
];

const motifs = {
  circle: c => `<circle cx="90" cy="86" r="52" fill="none" stroke="${c}" stroke-opacity=".55" stroke-width="1.5"/><circle cx="90" cy="86" r="34" fill="none" stroke="${c}" stroke-opacity=".35"/><circle cx="90" cy="86" r="14" fill="${c}" opacity=".7"/>`,
  orbit: c => `<ellipse cx="90" cy="86" rx="58" ry="22" transform="rotate(-24 90 86)" fill="none" stroke="${c}" stroke-width="1.5" opacity=".65"/><circle cx="90" cy="86" r="20" fill="${c}" opacity=".8"/><circle cx="142" cy="62" r="4" fill="#fff"/>`,
  grid: c => `<g stroke="${c}" stroke-opacity=".35">${Array.from({length:7},(_,i)=>`<path d="M${40+i*17} 36V138"/>`).join('')}${Array.from({length:7},(_,i)=>`<path d="M36 ${44+i*16}H144"/>`).join('')}</g><circle cx="90" cy="86" r="16" fill="${c}" opacity=".8"/>`,
  spiral: c => `<path d="M90 86m0-6a6 6 0 1 1-6 6 14 14 0 1 1 14-14 24 24 0 1 1-24 24 38 38 0 1 1 38-38" fill="none" stroke="${c}" stroke-width="2" opacity=".8"/>`,
  network: c => `<g stroke="${c}" stroke-opacity=".6"><path d="M46 60L90 86L134 58M46 60L58 120L90 86L124 124L134 58"/></g>${[[46,60],[90,86],[134,58],[58,120],[124,124]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="${c}"/>`).join('')}`,
  wave: c => `<path d="M30 96q20-36 40 0t40 0 40 0" fill="none" stroke="${c}" stroke-width="2" opacity=".8"/><path d="M30 112q20-36 40 0t40 0 40 0" fill="none" stroke="${c}" stroke-width="1.5" opacity=".45"/>`,
  circuit: c => `<g stroke="${c}" stroke-opacity=".65" fill="none"><path d="M40 60h30v20h40M40 100h24v24h60M120 52v34"/></g>${[[70,60],[110,80],[64,100],[124,124],[120,52]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`).join('')}`,
  bars: c => `<g fill="${c}" opacity=".75">${[26,42,58,74,90,106].map((x,i)=>`<rect x="${x}" y="${118-i*14}" width="10" height="${i*14+22}" rx="2"/>`).join('')}</g>`,
  dna: c => `<g stroke="${c}" stroke-width="2" fill="none"><path d="M68 40c46 30 46 72 0 100"/><path d="M112 40c-46 30-46 72 0 100"/>${Array.from({length:6},(_,i)=>`<path d="M${70+i*2} ${48+i*16}h40" opacity=".5"/>`).join('')}</g>`,
  hex: c => `<g stroke="${c}" stroke-opacity=".65" fill="none"><path d="M90 42l34 20v44L90 126 56 106V62z"/><path d="M90 60l18 11v24L90 106 72 95V71z"/></g>`,
  nodes: c => `<g fill="${c}">${[[60,62],[118,62],[90,86],[60,112],[118,112]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i===2?12:7}" opacity="${i===2?.9:.6}"/>`).join('')}</g><g stroke="${c}" stroke-opacity=".5"><path d="M60 62L90 86L118 62M60 112L90 86L118 112M60 62v50M118 62v50"/></g>`,
  sun: c => `<circle cx="90" cy="86" r="26" fill="${c}" opacity=".8"/>${Array.from({length:10},(_,i)=>`<path d="M90 48v-10" stroke="${c}" stroke-width="2" transform="rotate(${i*36} 90 86)" opacity=".7"/>`).join('')}`,
  dots: c => `<g fill="${c}">${Array.from({length:6},(_,r)=>Array.from({length:8},(_,col)=>`<circle cx="${44+col*13}" cy="${54+r*13}" r="${((r+col)%3===0)?3:1.5}" opacity=".75"/>`).join('')).join('')}</g>`,
  line: c => `<path d="M32 118L56 92L76 104L100 62L122 76L148 40" fill="none" stroke="${c}" stroke-width="2.5" opacity=".85"/><circle cx="100" cy="62" r="5" fill="${c}"/>`,
  layers: c => `<g fill="none" stroke="${c}" stroke-width="1.8" opacity=".85"><path d="M90 46l46 22-46 22-46-22z"/><path d="M44 92l46 22 46-22"/><path d="M44 108l46 22 46-22"/></g>`
};

for (const [num, zh, en, bg, accent, motif] of books) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 260" role="img" aria-label="${zh} 书籍封面插画">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#0a1226"/></linearGradient></defs>
  <rect width="180" height="260" rx="6" fill="url(#bg)"/>
  <rect x="5" y="5" width="170" height="250" rx="3" fill="none" stroke="${accent}" stroke-opacity=".35"/>
  <rect x="13" y="12" width="2" height="236" fill="${accent}" opacity=".55"/>
  ${motifs[motif](accent)}
  <text x="90" y="190" text-anchor="middle" fill="#ffffff" font-size="17" font-weight="700" font-family="PingFang SC, Microsoft YaHei, sans-serif">${zh}</text>
  <text x="90" y="212" text-anchor="middle" fill="${accent}" font-size="8.5" letter-spacing="1.4" font-family="Arial, sans-serif">${en}</text>
  <path d="M60 228h60" stroke="${accent}" stroke-opacity=".5"/>
  <text x="90" y="244" text-anchor="middle" fill="#9fb0d0" font-size="7.5" letter-spacing="2" font-family="Arial, sans-serif">FUTURE ATLAS</text>
</svg>`;
  fs.writeFileSync(path.join(dir, 'book-' + num + '.svg'), svg, 'utf8');
}
console.log('generated', books.length, 'book covers');
