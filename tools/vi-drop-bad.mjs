// Gỡ khỏi book/vi/ những mục mà nội dung tiếng Việt còn lẫn tiếng Trung.
//
//   node tools/vi-drop-bad.mjs          # chỉ báo cáo
//   node tools/vi-drop-bad.mjs --apply  # ghi thật
//
// Vì sao cần: worker có lúc chép nguyên cả dòng `- Lợi ích:` bằng tiếng Trung, hoặc dịch
// nửa (tiêu đề còn tiếng Trung, trong dòng Nói thật lẫn nguyên câu). Mảnh dịch lại sau đó
// không thay được mục cũ, vì vi-merge.mjs bỏ qua mục đã có — nên mục hỏng nằm lại mãi.
// Cách sạch là gỡ mục hỏng ra, rồi merge lại từ mảnh.
//
// Chỉ xét các dòng người đọc nhìn thấy. Dòng thẻ chi phí và dòng Nguồn giữ tiếng Trung là
// đúng quy ước, không tính là lỗi.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAP = JSON.parse(readFileSync(resolve(ROOT, 'tools/vi-slug-map.json'), 'utf8'));
const APPLY = process.argv.includes('--apply');

const keep = [0];
const stripInvisible = s => s.replace(/[（(][^）)]*[）)]/g, '').replace(/「[^」]*」/g, '');
const hasHan = s => /[\u4e00-\u9fff]/.test(stripInvisible(s));

let dropped = 0, checked = 0;
for (const n of Object.keys(MAP).sort()) {
  const path = resolve(ROOT, 'book/vi', `${n}-${MAP[n]}`);
  let raw;
  try { raw = readFileSync(path, 'utf8'); } catch { continue; }
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  let first = -1;
  for (let i = 0; i < lines.length; i++) if (/^### \d+\. /.test(lines[i])) { first = i; break; }
  if (first < 0) continue;
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

  const bad = [];
  for (const [num, body] of map) {
    checked++;
    const bodyLines = body.split('\n');
    // dòng 1 là tiêu đề mục — cũng phải là tiếng Việt
    for (const l of bodyLines) {
      if (/^<!--\s*成本标签:/.test(l)) continue;         // thẻ chi phí: đúng là tiếng Trung
      if (/^- Nguồn:/.test(l)) continue;                // nguồn: đúng là tiếng Trung
      if (/^>\s*\[/.test(l)) continue;                  // dòng dẫn nhập trạm thái
      if (hasHan(l)) { bad.push(num); break; }
    }
  }
  if (!bad.length) continue;
  console.log(`${n}: gỡ mục ${bad.join(', ')}`);
  dropped += bad.length;
  if (!APPLY) continue;
  for (const num of bad) map.delete(num);
  const order = [...map.keys()].sort((a, b) => a - b);
  const out = [header];
  for (const num of order) out.push(map.get(num));
  writeFileSync(path, out.join('\n\n') + '\n');
}
console.log(`\nkiểm ${checked} mục, gỡ ${dropped} mục còn lẫn tiếng Trung${APPLY ? ' (đã ghi)' : ' — chạy lại với --apply để ghi'}`);
void readdirSync; void keep;