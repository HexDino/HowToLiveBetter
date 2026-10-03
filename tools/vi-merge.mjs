// Ghép các mảnh dịch nhỏ thành file chương.
//
//   node tools/vi-merge.mjs 05        # ghép lại từ .vi-chunks/
//   node tools/vi-merge.mjs --check    # chỉ báo cáo, không ghi
//
// Vì sao có tool này: subagent viết lại TOÀN BỘ file chương thì dễ vượt giới hạn đầu ra
// và bị cắt cụt giữa chừng — đã xảy ra với chương 05, file đứt ở giữa câu của mục 6, mất
// 16 mục đã dịch. Nhiều subagent cùng ghi một file cũng khiến bản sau đè bản trước.
//
// Nên: subagent dịch ra .vi-chunks/NN-<từ>-<đến>.md (file nhỏ, ghi một lần là xong),
// rồi tool này ghép vào book/vi/. Subagent KHÔNG BAO GIỜ chạm file chương.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAP = JSON.parse(readFileSync(resolve(ROOT, 'tools/vi-slug-map.json'), 'utf8'));
const CHUNK_DIR = resolve(ROOT, '.vi-chunks');
const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const only = args.filter(a => /^\d\d$/.test(a));

if (!existsSync(CHUNK_DIR)) { console.log('Chưa có .vi-chunks/'); process.exit(0); }
if (!existsSync(CHUNK_DIR)) mkdirSync(CHUNK_DIR, { recursive: true });

const cntItems = s => (s.match(/^### (\d+)\. /gm) || []).length;
const zhTotal = n => cntItems(readFileSync(resolve(ROOT, 'book',
  readdirSync(resolve(ROOT, 'book')).find(f => f.startsWith(n + '-') && f.endsWith('.md'))), 'utf8'));

// Tách file thành các khối theo số mục
function blocks(txt) {
  const lines = txt.replace(/\r\n/g, '\n').split('\n');
  let first = -1;
  for (let i = 0; i < lines.length; i++) if (/^### \d+\. /.test(lines[i])) { first = i; break; }
  if (first < 0) return { header: '', map: new Map() };
  const header = lines.slice(0, first).join('\n').replace(/\s+$/, '');
  const map = new Map();
  let cur = null, buf = [];
  const flush = () => { if (cur !== null && !map.has(cur)) map.set(cur, buf.join('\n').replace(/\s+$/, '')); };
  for (const l of lines.slice(first)) {
    const m = /^### (\d+)\. /.exec(l);
    if (m) { flush(); cur = Number(m[1]); buf = [l]; continue; }
    buf.push(l);
  }
  flush();
  return { header, map };
}

const report = [];
for (const n of Object.keys(MAP).sort()) {
  if (only.length && !only.includes(n)) continue;
  const prefix = `${n}-`;
  const chunkFiles = readdirSync(CHUNK_DIR).filter(f => f.startsWith(prefix)).sort();
  if (!chunkFiles.length) continue;
  const total = zhTotal(n);

  // Header lấy từ file chương nếu có, không thì ghép từ mảnh đầu tiên có phần đầu
  const chapterPath = resolve(ROOT, 'book/vi', `${n}-${MAP[n]}`);
  let header = '';
  let map = new Map();
  if (existsSync(chapterPath)) {
    const p = blocks(readFileSync(chapterPath, 'utf8'));
    header = p.header; map = p.map;
  }
  // Mảnh nào có phần đầu (dòng trạng thái, tiêu đề chương, dẫn nhập) thì lấy từ đó
  let headerFromChunk = '';
  let added = 0, dup = 0;
  for (const cf of chunkFiles) {
    const t = readFileSync(resolve(CHUNK_DIR, cf), 'utf8').replace(/\r\n/g, '\n');
    const b = blocks(t);
    if (!headerFromChunk && /Bản dịch không chính thức/.test(b.header)) headerFromChunk = b.header;
    for (const [num, body] of b.map) { if (map.has(num)) dup++; else { map.set(num, body); added++; } }
  }
  if (!header && headerFromChunk) header = headerFromChunk;

  const nums = [...map.keys()].sort((a, b) => a - b);
  const missing = [];
  for (let i = 1; i <= total; i++) if (!map.has(i)) missing.push(i);
  report.push({ n, have: map.size, total, added, dup, missing, header: !!header });

  if (CHECK) continue;
  const out = [header];
  for (const num of nums) out.push(map.get(num));
  writeFileSync(chapterPath, out.join('\n\n') + '\n');
}

for (const r of report) {
  console.log(`${r.n}: ${r.have}/${r.total} mục (+${r.added} từ mảnh, ${r.dup} trùng bị bỏ)` +
    (r.missing.length ? ` · thiếu ${r.missing.join(' ')}` : ' · đủ') +
    (r.header ? '' : ' · THIẾU PHẦN ĐẦU FILE'));
}
if (CHECK) console.log('\n(chỉ kiểm tra, chưa ghi. Bỏ --check để ghép.)');