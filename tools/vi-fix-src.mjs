// Sửa dòng Nguồn bị hỏng: lấy lại nguyên văn từ bản gốc Trung.
//
//   node tools/vi-fix-src.mjs
//
// Đã xảy ra: một subagent dịch luôn cả dòng Nguồn, làm chữ Hán trong đó đổi thành tiếng
// Việt (喂养 → nuôi dưỡng) và dịch cả câu trích dẫn. Nhưng dòng Nguồn theo quy ước phải
// GIỮ NGUYÊN BYTE — có thể tái tạo hoàn toàn từ bản gốc, nên sửa được chắc chắn.
//
// Tool này chỉ chạm dòng `- Nguồn:`. Mọi thứ khác giữ nguyên.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAP = JSON.parse(readFileSync(resolve(ROOT, 'tools/vi-slug-map.json'), 'utf8'));
const args = process.argv.slice(2);
const CHECK = args.includes('--check');

// Trong block của một mục, lấy dòng nhãn cho trước
function grab(lines, item, label) {
  let c = 0;
  for (let i = 0; i < lines.length; i++) {
    const h = /^### (\d+)\. /.exec(lines[i]);
    if (h) { c = Number(h[1]); continue; }
    if (c === item && lines[i].startsWith(label)) return { idx: i, line: lines[i] };
  }
  return null;
}

let fixedTotal = 0, checked = 0;
for (const n of Object.keys(MAP).sort()) {
  const viPath = resolve(ROOT, 'book/vi', `${n}-${MAP[n]}`);
  let raw;
  try { raw = readFileSync(viPath, 'utf8'); } catch { continue; }
  const zhFile = readdirSync(resolve(ROOT, 'book'))
    .find(f => f.startsWith(n + '-') && f.endsWith('.md'));
  const zhLines = readFileSync(resolve(ROOT, 'book', zhFile), 'utf8').replace(/\r\n/g, '\n').split('\n');
  const viLines = raw.replace(/\r\n/g, '\n').split('\n');

  const zhItems = new Set();
  zhLines.forEach(l => { const h = /^### (\d+)\. /.exec(l); if (h) zhItems.add(Number(h[1])); });

  let changed = false;
  for (const item of zhItems) {
    const v = grab(viLines, item, '- Nguồn:');
    if (!v) continue;
    const z = grab(zhLines, item, '- 来源：');
    if (!z) continue;
    const vs = v.line.replace(/^- Nguồn:\s*/, '');
    const zs = z.line.replace(/^- 来源：\s*/, '');
    checked++;
    if (vs === zs) continue;
    viLines[v.idx] = '- Nguồn: ' + zs;
    changed = true;
    fixedTotal++;
    console.log(`${n} mục ${item}: sửa dòng Nguồn về nguyên văn bản gốc`);
  }
  if (changed && !CHECK) writeFileSync(viPath, viLines.join('\n'));
}
console.log(`\nkiểm ${checked} dòng Nguồn, ${CHECK ? 'phát hiện' : 'sửa'} ${fixedTotal} dòng lệch khỏi bản gốc`);