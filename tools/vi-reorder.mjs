// Sắp lại thứ tự mục trong một file tiếng Việt.
//
//   node tools/vi-reorder.mjs book/vi/03-Dung-luoi-luc.md
//
// Nhiều subagent cùng ghi một file thì các khối bị chèn lẫn vào nhau: mục 21–24 nằm
// ngay sau mục 8, mục 17–20 nằm giữa mục 12 và 25. index.html đánh số theo thứ tự xuất
// hiện, nên thẻ hiện ra sai nhãn. Script này tách file thành từng khối theo số mục rồi
// ghép lại đúng thứ tự 1, 2, 3… Nó KHÔNG dịch, không sửa nội dung khối nào.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = process.argv[2];
if (!file) { console.error('Dùng: node tools/vi-reorder.mjs <file vi>'); process.exit(1); }

const path = resolve(file);
const txt = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const lines = txt.split('\n');

let first = -1;
for (let i = 0; i < lines.length; i++) if (/^### \d+\. /.test(lines[i])) { first = i; break; }
if (first < 0) { console.log(`${file}: không có mục nào`); process.exit(0); }

const header = lines.slice(0, first).join('\n').replace(/\s+$/, '');
const blocks = new Map();
let cur = null, buf = [];
const flush = () => { if (cur !== null && !blocks.has(cur)) blocks.set(cur, buf.join('\n').replace(/\s+$/, '')); };
for (const l of lines.slice(first)) {
  const m = /^### (\d+)\. /.exec(l);
  if (m) { flush(); cur = Number(m[1]); buf = [l]; continue; }
  buf.push(l);
}
flush();

// Thứ tự trong file là thứ tự các khối xuất hiện, không phải thứ tự sau khi sort.
const asWritten = [...blocks.keys()];
const order = [...asWritten].sort((a, b) => a - b);
const wasSorted = asWritten.every((n, i) => i === 0 || asWritten[i - 1] < n);
const max = Math.max(...order);
const missing = [];
for (let i = 1; i <= max; i++) if (!blocks.has(i)) missing.push(i);

console.log(`${file}: ${blocks.size} khối, thiếu ${missing.length ? missing.join(' ') : 'không có'}`);
if (!wasSorted) {
  const out = [header];
  for (const n of order) out.push(blocks.get(n));
  writeFileSync(path, out.join('\n\n') + '\n');
  console.log(`  đã sắp lại:\n    trước: ${asWritten.join(',')}\n    sau:   ${order.join(',')}`);
} else {
  console.log('  thứ tự đã đúng');
}
if (missing.length) console.log(`  còn thiếu mục ${missing.join(' ')} — phải dịch thêm, script không dịch`);