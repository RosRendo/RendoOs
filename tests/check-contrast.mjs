import fs from 'node:fs';
import path from 'node:path';

function parseHex(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function luminance([r, g, b]) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(hex1, hex2) {
  const lum1 = luminance(parseHex(hex1));
  const lum2 = luminance(parseHex(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function checkContrast() {
  const tokensPath = path.resolve('replica/design/tokens.json');
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

  console.log('🎨 Checking WCAG Contrast Ratios for RendoOS Design Tokens\n');
  let failures = 0;

  function getColor(pathStr) {
    const parts = pathStr.split('.');
    let cur = tokens.color;
    for (const p of parts) {
      cur = cur[p];
      if (!cur) throw new Error(`Missing token: ${pathStr}`);
    }
    return cur;
  }

  const results = [];

  for (const pair of tokens.pairs) {
    const [fgPath, bgPath, level = 'normal'] = pair;
    const fg = getColor(fgPath);
    const bg = getColor(bgPath);
    const ratio = contrastRatio(fg, bg);
    const threshold = level === 'large' || level === 'ui' ? 3.0 : 4.5;
    const pass = ratio >= threshold;

    results.push({
      pair: `${fgPath} on ${bgPath}`,
      colors: `${fg} on ${bg}`,
      ratio: ratio.toFixed(2),
      threshold: `${threshold}:1`,
      pass
    });

    if (!pass) failures++;
  }

  console.table(results);

  if (failures > 0) {
    console.error(`❌ ${failures} pair(s) failed WCAG AA compliance.`);
    process.exit(1);
  } else {
    console.log('✅ ALL PAIRS PASS WCAG 2.2 AA (Minimum 4.5:1 for body text, 3:1 for UI)');
  }
}

checkContrast();
