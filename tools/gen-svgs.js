const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'assets', 'icons');
fs.mkdirSync(dir, { recursive: true });

const defs = `
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4d8dff"/><stop offset="1" stop-color="#8b6ff5"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#35d0d8"/><stop offset="1" stop-color="#4d8dff"/>
    </linearGradient>
    <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8b6ff5"/><stop offset="1" stop-color="#35d0d8"/>
    </linearGradient>
    <radialGradient id="grad" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#4d8dff" stop-opacity=".45"/>
      <stop offset="1" stop-color="#4d8dff" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>`;

const wrap = (inner, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" fill="none" role="img" ${extra}>${defs}${inner}</svg>`;

const starfield = (n = 26, seed = 1) => {
  let s = seed, out = '';
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const x = Math.round((s / 233280) * 400);
    s = (s * 9301 + 49297) % 233280;
    const y = Math.round((s / 233280) * 260);
    const r = (i % 5 === 0) ? 1.6 : 0.9;
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="#bcd4ff" opacity="${0.25 + (i % 4) * 0.16}"/>`;
  }
  return out;
};

const grid = `<g stroke="#4d8dff" stroke-opacity=".10" stroke-width="1">
${Array.from({length:9},(_,i)=>`<path d="M${i*50} 0V260"/>`).join('')}
${Array.from({length:6},(_,i)=>`<path d="M0 ${i*52}H400"/>`).join('')}</g>`;

const illos = {
'digital-earth': wrap(`
  <rect width="400" height="260" fill="#081227"/>${grid}${starfield(20,3)}
  <circle cx="200" cy="130" r="120" fill="url(#grad)"/>
  <circle cx="200" cy="130" r="72" fill="#0d2144" stroke="url(#g1)" stroke-width="2"/>
  <g stroke="#4d8dff" stroke-opacity=".5" stroke-width="1.2" fill="none">
    <ellipse cx="200" cy="130" rx="72" ry="26"/><ellipse cx="200" cy="130" rx="72" ry="50"/>
    <ellipse cx="200" cy="130" rx="30" ry="72"/><ellipse cx="200" cy="130" rx="55" ry="72"/>
    <path d="M128 130h144M200 58v144"/>
  </g>
  <g fill="url(#g2)" opacity=".55">
    <path d="M160 92q18-10 35-2t28 16q-12 16-32 14t-31-10z"/>
    <path d="M205 140q22-6 38 10t8 32q-20 6-36-8t-10-34z"/>
    <path d="M145 145q14-4 22 8t-4 24q-14-2-18-16z"/>
  </g>
  <g fill="#35d0d8">
    ${[[160,100],[222,108],[205,168],[150,158],[248,150],[198,80]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4"/><circle cx="${x}" cy="${y}" r="9" fill="none" stroke="#35d0d8" stroke-opacity=".4"/>`).join('')}
  </g>
  <g stroke="#35d0d8" stroke-opacity=".45" stroke-width="1">
    <path d="M160 100L222 108L248 150L205 168L150 158Z"/><path d="M198 80L222 108L205 168"/>
  </g>
  <ellipse cx="200" cy="130" rx="110" ry="34" transform="rotate(-22 200 130)" stroke="url(#g3)" stroke-width="1.4" fill="none" opacity=".8"/>
  <circle cx="300" cy="92" r="4" fill="#8b6ff5"/>`),

'future-city': wrap(`
  <rect width="400" height="260" fill="#0a1428"/>${starfield(18,9)}
  <circle cx="320" cy="60" r="46" fill="url(#grad)"/>
  <g fill="url(#g1)" opacity=".85">
    <path d="M40 210V96h34v114z"/><path d="M84 210V64h42v146z"/><path d="M136 210V112h30v98z"/>
    <path d="M176 210V48h46v162z"/><path d="M232 210V88h36v122z"/><path d="M278 210V70h40v140z"/>
    <path d="M328 210V118h34v92z"/>
  </g>
  <g fill="#35d0d8" opacity=".75">
    ${Array.from({length:44},(_,i)=>{const x=48+(i%11)*29,y=80+Math.floor(i/11)*32;return `<rect x="${x}" y="${y}" width="6" height="9" rx="1"/>`}).join('')}
  </g>
  <path d="M0 210h400" stroke="#35d0d8" stroke-opacity=".5" stroke-width="1.5"/>
  <g stroke="#8b6ff5" stroke-opacity=".6" stroke-width="1" fill="none">
    <path d="M0 210q100-40 200 0t200 0"/><path d="M0 230q100-30 200 0t200 0"/>
  </g>
  <path d="M60 96L197 48L318 70" stroke="#fff" stroke-opacity=".15" fill="none"/>
  <circle cx="197" cy="48" r="3" fill="#fff" opacity=".8"/>`),

'ai-brain': wrap(`
  <rect width="400" height="260" fill="#081127"/>${grid}${starfield(14,5)}
  <circle cx="200" cy="128" r="105" fill="url(#grad)"/>
  <path d="M200 60c-34 0-56 20-60 46-20 4-32 20-32 40 0 16 10 30 24 36-2 26 18 48 46 48 10 0 18-3 22-8 4 5 12 8 22 8 28 0 48-22 46-48 14-6 24-20 24-36 0-20-12-36-32-40-4-26-26-46-60-46z" fill="#0f2246" stroke="url(#g1)" stroke-width="2.5"/>
  <g stroke="#35d0d8" stroke-width="1.6" fill="none" stroke-linecap="round">
    <path d="M170 84v40l-24 18v34"/><path d="M170 124h30l26-20"/><path d="M200 124v44l-22 16"/>
    <path d="M146 176h48l30-22h30"/><path d="M230 104v34l22 16v26"/><path d="M200 168h52"/>
  </g>
  <g fill="#8b6ff5">${[[170,84],[200,124],[226,104],[146,176],[252,154],[200,168],[252,168],[178,184]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>
  <g fill="#35d0d8">${[[170,124],[230,138],[194,184]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.5"/>`).join('')}</g>
  <path d="M60 60h40M300 200h40" stroke="#4d8dff" stroke-opacity=".35"/>`),

'humanoid-robot': wrap(`
  <rect width="400" height="260" fill="#0a1429"/>${grid}${starfield(16,7)}
  <ellipse cx="200" cy="130" rx="100" ry="100" fill="url(#grad)"/>
  <g stroke="url(#g1)" stroke-width="3" fill="#10254a" stroke-linejoin="round">
    <rect x="172" y="46" width="56" height="50" rx="16"/>
    <path d="M160 106q40-16 80 0l10 74q-50 18-100 0z"/>
    <path d="M170 180l-12 46h22l16-40M230 180l12 46h-22l-16-40"/>
    <path d="M160 118l-30 44 14 10 28-34M240 118l30 44-14 10-28-34"/>
  </g>
  <rect x="182" y="62" width="36" height="18" rx="9" fill="#35d0d8" opacity=".9"/>
  <circle cx="192" cy="71" r="3" fill="#06132b"/><circle cx="208" cy="71" r="3" fill="#06132b"/>
  <g stroke="#35d0d8" stroke-width="1.4" fill="none">
    <path d="M180 140h40M176 154h48"/><circle cx="200" cy="132" r="10"/>
  </g>
  <path d="M60 226h280" stroke="#4d8dff" stroke-opacity=".3"/>
  <g fill="#8b6ff5"><circle cx="130" cy="88" r="3"/><circle cx="278" cy="150" r="3"/><circle cx="96" cy="170" r="2.5"/></g>`),

'space-exploration': wrap(`
  <rect width="400" height="260" fill="#060d1e"/>${starfield(46,11)}
  <circle cx="310" cy="70" r="38" fill="#1b2c58" stroke="url(#g3)" stroke-width="1.5"/>
  <circle cx="298" cy="60" r="7" fill="#0d1834" opacity=".7"/><circle cx="320" cy="82" r="5" fill="#0d1834" opacity=".7"/>
  <ellipse cx="90" cy="210" rx="70" ry="22" fill="url(#grad)"/>
  <g transform="rotate(28 190 130)">
    <path d="M190 52c16 18 22 44 22 70l-22 22-22-22c0-26 6-52 22-70z" fill="#e8eefc"/>
    <path d="M190 52c8 10 13 22 16 34h-32c3-12 8-24 16-34z" fill="url(#g1)"/>
    <circle cx="190" cy="104" r="10" fill="#0b1a36" stroke="#35d0d8" stroke-width="2"/>
    <path d="M168 122l-18 22v-30zM212 122l18 22v-30z" fill="url(#g2)"/>
    <path d="M182 144l8 34 8-34" fill="#ff9b54" opacity=".85"/>
  </g>
  <path d="M40 40l60 20M340 200l30-16" stroke="#4d8dff" stroke-opacity=".25"/>`),

'mars-base': wrap(`
  <rect width="400" height="260" fill="#140d15"/>${starfield(16,13)}
  <circle cx="320" cy="52" r="26" fill="#e8eefc" opacity=".85"/>
  <path d="M0 190q90-34 180-14t220-8v92H0z" fill="#7a3b2e"/>
  <path d="M0 214q120-28 220-6t180-4v56H0z" fill="#9c4a34" opacity=".8"/>
  <g stroke="#35d0d8" stroke-width="2" fill="#12304a" opacity=".9">
    <path d="M130 176a52 34 0 0 1 104 0z"/><rect x="150" y="158" width="64" height="34" rx="4"/>
  </g>
  <path d="M130 176h104" stroke="#35d0d8" stroke-opacity=".6"/>
  <g fill="url(#g1)"><rect x="250" y="160" width="44" height="30" rx="3"/><rect x="70" y="170" width="34" height="22" rx="3"/></g>
  <path d="M182 158v-28h20" stroke="#8b6ff5" stroke-width="2" fill="none"/>
  <circle cx="204" cy="128" r="4" fill="#8b6ff5"/>
  <g stroke="#ffb08a" stroke-width="1.4" opacity=".7"><path d="M40 196l30-8M300 204l40-10"/></g>`),

'smart-transport': wrap(`
  <rect width="400" height="260" fill="#0a1428"/>${grid}${starfield(14,17)}
  <circle cx="70" cy="60" r="40" fill="url(#grad)"/>
  <path d="M0 200h400" stroke="#4d8dff" stroke-opacity=".4" stroke-width="2"/>
  <path d="M0 224h400" stroke="#8b6ff5" stroke-opacity=".3" stroke-width="1.5"/>
  <g transform="translate(70 120)">
    <path d="M0 40q10-44 56-44h138q46 0 56 44l6 24H-6z" fill="#10254a" stroke="url(#g2)" stroke-width="2.5"/>
    <g fill="#35d0d8" opacity=".85">${Array.from({length:6},(_,i)=>`<rect x="${20+i*36}" y="10" width="22" height="13" rx="3"/>`).join('')}</g>
    <circle cx="52" cy="66" r="9" fill="#0a1428" stroke="#4d8dff" stroke-width="2"/>
    <circle cx="198" cy="66" r="9" fill="#0a1428" stroke="#4d8dff" stroke-width="2"/>
  </g>
  <g stroke="#35d0d8" stroke-opacity=".5" stroke-width="1.2" fill="none">
    <path d="M0 172h400"/><path d="M120 172v-40M280 172v-40"/>
  </g>
  <circle cx="120" cy="130" r="4" fill="#8b6ff5"/><circle cx="280" cy="130" r="4" fill="#8b6ff5"/>`),

'future-energy': wrap(`
  <rect width="400" height="260" fill="#081327"/>${grid}${starfield(16,19)}
  <circle cx="200" cy="118" r="88" fill="url(#grad)"/>
  <g transform="translate(200 128)">
    ${Array.from({length:12},(_,i)=>`<path d="M0 0L${Math.round(Math.cos(i*Math.PI/6)*46)} ${Math.round(Math.sin(i*Math.PI/6)*46)}" stroke="#4d8dff" stroke-opacity=".5"/>`).join('')}
    <circle r="22" fill="#0e2247" stroke="url(#g1)" stroke-width="2"/>
    <path d="M-8 4l6-14 4 10 8-14 2 18z" fill="#ffd166"/>
  </g>
  <g stroke="url(#g2)" stroke-width="2" fill="none">
    <path d="M60 200v-42M60 158l-22 12 22 12 22-12z"/>
    <path d="M340 200v-50M340 150l-18 10 18 10 18-10z"/>
  </g>
  <g fill="#35d0d8" opacity=".8"><rect x="92" y="196" width="46" height="6" rx="2"/><rect x="262" y="196" width="46" height="6" rx="2"/></g>
  <path d="M0 226h400" stroke="#4d8dff" stroke-opacity=".3"/>`),

'biotech': wrap(`
  <rect width="400" height="260" fill="#081227"/>${grid}${starfield(14,23)}
  <circle cx="200" cy="130" r="92" fill="url(#grad)"/>
  <g stroke-width="2.4" fill="none" stroke-linecap="round">
    <path d="M164 42c72 40 72 136 0 176" stroke="url(#g1)"/>
    <path d="M236 42c-72 40-72 136 0 176" stroke="url(#g2)"/>
    ${Array.from({length:7},(_,i)=>{const y=54+i*25;return `<path d="M${164+Math.sin(i)*4} ${y}h72" stroke="#8b6ff5" stroke-opacity=".55" stroke-width="1.6"/>`}).join('')}
  </g>
  <g fill="#35d0d8">${[[170,60],[226,84],[168,110],[232,136],[172,162],[228,186]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g>
  <circle cx="86" cy="196" r="16" fill="#0e2247" stroke="url(#g3)" stroke-width="1.5"/>
  <circle cx="314" cy="64" r="12" fill="#0e2247" stroke="url(#g3)" stroke-width="1.5"/>`),

'timeline-graphic': wrap(`
  <rect width="400" height="260" fill="#0a1428"/>${grid}
  <path d="M30 130h340" stroke="url(#g1)" stroke-width="3"/>
  ${[70,150,230,310].map((x,i)=>`<g><circle cx="${x}" cy="130" r="${i%2?7:9}" fill="#0b1a36" stroke="url(#g2)" stroke-width="3"/><path d="M${x} 118V${i%2?76:184}" stroke="#4d8dff" stroke-opacity=".4" stroke-dasharray="3 3"/><rect x="${x-26}" y="${i%2?52:184}" width="52" height="20" rx="10" fill="#142a54" stroke="#4d8dff" stroke-opacity=".4"/><text x="${x}" y="${i%2?66:198}" text-anchor="middle" fill="#bcd4ff" font-size="11" font-family="sans-serif">${[2026,2040,2070,2100][i]}</text></g>`).join('')}
  ${starfield(12,29)}`),

'data-network': wrap(`
  <rect width="400" height="260" fill="#081227"/>${grid}${starfield(18,31)}
  <circle cx="200" cy="130" r="100" fill="url(#grad)"/>
  ${[[200,130],[110,80],[290,86],[96,178],[300,182],[200,52],[200,214],[60,130],[340,130]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i===0?11:6}" fill="${i===0?'url(#g1)':'#0f2246'}" stroke="#35d0d8" stroke-width="2"/>`).join('')}
  <g stroke="#4d8dff" stroke-opacity=".5" stroke-width="1.2">
    <path d="M200 130L110 80L96 178L200 130L290 86L300 182L200 130M110 80L200 52L290 86M96 178L60 130L110 80M300 182L340 130L290 86M200 52L200 130L200 214"/>
  </g>`),

'galaxy': wrap(`
  <rect width="400" height="260" fill="#050b1a"/>${starfield(70,37)}
  <ellipse cx="200" cy="130" rx="130" ry="52" fill="url(#grad)" transform="rotate(-18 200 130)"/>
  <g transform="rotate(-18 200 130)" fill="none" stroke-width="2">
    <ellipse cx="200" cy="130" rx="120" ry="46" stroke="#4d8dff" stroke-opacity=".45"/>
    <ellipse cx="200" cy="130" rx="88" ry="32" stroke="#8b6ff5" stroke-opacity=".5"/>
    <ellipse cx="200" cy="130" rx="56" ry="19" stroke="#35d0d8" stroke-opacity=".6"/>
  </g>
  <circle cx="200" cy="130" r="16" fill="#fff" opacity=".9" filter="url(#blur)"/>
  <circle cx="200" cy="130" r="7" fill="#fff"/>
  <g fill="#35d0d8">${[[112,104],[288,158],[162,92],[244,170]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.5"/>`).join('')}</g>`)
};

for (const [name, svg] of Object.entries(illos)) {
  fs.writeFileSync(path.join(dir, name + '.svg'), svg, 'utf8');
}

// small UI icons (24x24)
const iconPaths = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M12 20V5M6 11l6-6 6 6"/>',
  bookmark: '<path d="M6 4h12v16l-6-4-6 4z"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  book: '<path d="M5 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H5zM19 4h-5v13h5z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3V4z"/>',
  rocket: '<path d="M12 3c4 3 6 8 6 13l-6 5-6-5c0-5 2-10 6-13z"/><circle cx="12" cy="11" r="2"/><path d="M7 16l-3 3M17 16l3 3"/>',
  building: '<path d="M5 21V6l7-3v18M12 21V9l7 3v9M3 21h18"/>',
  leaf: '<path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s2-8 15-10c0 0-7 3-10 9 6 1 10-3 10-15z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 20v-2a6 6 0 0 0-3-5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  check: '<path d="M5 12l5 5L19 7"/>',
  quote: '<path d="M9 7H5a2 2 0 0 0-2 2v3h5v5H4M19 7h-4a2 2 0 0 0-2 2v3h5v5h-4"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><circle cx="12" cy="13" r="2"/><path d="M12 7v4M10.5 14.5L6.5 17M13.5 14.5l4 2.5"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>'
};
for (const [name, d] of Object.entries(iconPaths)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  fs.writeFileSync(path.join(dir, 'ui-' + name + '.svg'), svg, 'utf8');
}
console.log('generated', Object.keys(illos).length, 'illustrations and', Object.keys(iconPaths).length, 'ui icons');
