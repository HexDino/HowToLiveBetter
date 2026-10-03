// Quét toàn bộ bản dịch, không chỉ tin báo cáo của subagent.
//
//   node tools/check-vi-all.mjs
//
// check-vi.mjs chỉ kiểm từng file và dừng ngay khi số mục lệch, nên với file đang dịch
// dở thì mọi lỗi nội dung phía sau bị che. Script này kiểm TỪNG MỤC một, nên file dở vẫn
// bắt được lỗi ở phần đã có. Nó cũng là nơi duy nhất sửa được những lỗi máy nắm chắc
// như BOM.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FIX = process.argv.includes('--fix');      // chỉ sửa những thứ máy chắc chắn
const MAP = JSON.parse(readFileSync(resolve(ROOT, 'tools/vi-slug-map.json'), 'utf8'));
const MAX = 350;

const zhOf = n => readdirSync(resolve(ROOT, 'book')).find(f => f.startsWith(n + '-') && f.endsWith('.md'));
// Bản gốc tách thành từng mục: '3' -> khối văn bản của mục 3
function parseZh(n) {
  const txt = readFileSync(resolve(ROOT, 'book', zhOf(n)), 'utf8').replace(/\r\n/g, '\n');
  const map = new Map();
  let cur = null, buf = [];
  const flush = () => { if (cur !== null) map.set(cur, buf.join('\n')); };
  for (const line of txt.split('\n')){
    const h = /^### (\d+)\. /.exec(line);
    if (h) { flush(); cur = Number(h[1]); buf = [line]; continue; }
    if (cur !== null) buf.push(line);
  }
  flush();
  return map;
}
function parseVi(txt) {
  const map = new Map();
  let cur = null, buf = [];
  const flush = () => { if (cur !== null) map.set(cur, buf.join('\n')); };
  for (const line of txt.split('\n')){
    const h = /^### (\d+)\. /.exec(line);
    if (h) { flush(); cur = Number(h[1]); buf = [line]; continue; }
    if (cur !== null) buf.push(line);
  }
  flush();
  return map;
}

const grab = (block, label) => {
  const re = new RegExp(`^- ${label}:\\s*(.*)$`, 'm');
  const m = re.exec(block);
  return m ? m[1].trim() : '';
};
const zhLabel = { cost: '成本', human: '说人话', gain: '收益', grade: '证据等级', src: '来源', note: '备注' };
const viLabel = { cost: 'Chi phí', human: 'Nói thật', gain: 'Lợi ích', grade: 'Mức bằng chứng', src: 'Nguồn', note: 'Ghi chú' };

let issues = [], fixed = 0, chapters = 0, items = 0;

for (const n of Object.keys(MAP).sort()) {
  const path = resolve(ROOT, 'book/vi', `${n}-${MAP[n]}`);
  if (!existsSync(path)) { issues.push(`${n}: chưa có file`); continue; }
  chapters++;
  let buf = readFileSync(path);
  // BOM: máy chắc chắn đây là lỗi — checker đọc dòng đầu sẽ không khớp, và file khác
  // trong book/vi/ đều không có BOM nên đây là sai lệch, không phải quy ước.
  if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    if (FIX) { buf = buf.slice(3); writeFileSync(path, buf); fixed++; }
    else issues.push(`${n}: có BOM ở đầu file`);
  }
  const txt = buf.toString('utf8');
  const zh = parseZh(n), vi = parseVi(txt);
  const nums = [...vi.keys()];
  items += nums.length;

  for (const num of nums) {
    const b = vi.get(num), z = zh.get(num);
    if (z === undefined) { issues.push(`${n} mục ${num}: không có trong bản gốc`); continue; }
    // dòng Nguồn: phần sau nhãn phải giống hệt
    const vs = grab(b, 'Nguồn'), zs = grab(z, zhLabel.src);
    if (zs && vs !== zs) issues.push(`${n} mục ${num}: dòng Nguồn khác bản gốc\n      vi: ${vs.slice(0, 90)}\n      zh: ${zs.slice(0, 90)}`);
    // mức bằng chứng
    const vg = grab(b, 'Mức bằng chứng'), zg = grab(z, zhLabel.grade);
    if (zg && vg !== zg) issues.push(`${n} mục ${num}: mức bằng chứng ${vg} ≠ ${zg}`);
    // sáu trường phải có
    for (const k of Object.keys(viLabel)) if (!grab(b, viLabel[k])) issues.push(`${n} mục ${num}: thiếu dòng ${viLabel[k]}`);
    // thẻ chi phí phải khớp
    const vt = (/<!--\s*成本标签:\s*(.*?)\s*-->/.exec(b) || [])[1];
    const zt = (/<!--\s*成本标签:\s*(.*?)\s*-->/.exec(z) || [])[1];
    if (zt && vt !== zt) issues.push(`${n} mục ${num}: thẻ chi phí khác bản gốc`);
    // dòng Nói thật: độ dài và chữ Hán. Thuật ngữ Trung trong ngoặc 「」 là hợp lệ —
    // đó là cách giải thích thuật ngữ Hán Việt cho người đọc (xem VI-TRANSLATION.md).
    const vh = grab(b, 'Nói thật');
    const len = [...vh.replace(/\s/g, '')].length;
    if (len > MAX) issues.push(`${n} mục ${num}: Nói thật dài ${len} chữ (>${MAX})`);
    const han = vh.replace(/「[^」]*」/g, '').replace(/[（(][^）)]*[）)]/g, '').match(/[\u4e00-\u9fff]+/g);
    if (han) issues.push(`${n} mục ${num}: Nói thật còn chữ Hán ${han.join(' ')}`);
  }
  // Chữ Hán ngoài vùng cho phép. Ba loại dòng bắt buộc giữ nguyên: thẻ chi phí, dòng
  // Nguồn, dòng trạng thái (có tên file Trung trong link). Ngoài ra tên chương trình, luật,
  // tài khoản Trung Quốc có thể xuất hiện trong ngoặc 「」 để người đọc Việt tra cứu —
  // 「中国戒烟平台」 là ví dụ đúng, đó là tên riêng chứ không phải chỗ dịch bỏ sót.
  const allow = l => /^<!--\s*成本标签:/.test(l) || /^- Nguồn:/.test(l) || /^>\s*Bản dịch không chính thức/.test(l);
  txt.split('\n').forEach((l, i) => {
    if (!/[\u4e00-\u9fff]/.test(l) || allow(l)) return;
    // bỏ phần trong ngoặc 「」 và （） — nơi tên riêng Trung Quốc được phép đứng
    const rest = l.replace(/「[^」]*」/g, '').replace(/[（(][^）)]*[）)]/g, '');
    const m = rest.match(/[\u4e00-\u9fff]+/g);
    if (m) issues.push(`${n} dòng ${i + 1}: chữ Hán sót ${m.join(' ')}`);
  });
  // dòng trạng thái và quay lại mục lục
  if (!/^> Bản dịch không chính thức/.test(txt)) issues.push(`${n}: thiếu dòng trạng thái ở đầu file`);
  if (!/\[\← Về mục lục\]\(\.\.\/\.\.\/README\.vi\.md\)/.test(txt)) issues.push(`${n}: thiếu hoặc sai dòng quay lại mục lục`);
}

// Trước đây script chỉ quét book/vi/, nên một worker có thể ghi mảnh .vi-chunks/ bằng tiếng
// Trung rồi báo "check sạch" — đã xảy ra với chương 08 mục 33–36. Giờ quét cả mảnh chưa ghép.
//
// Chỉ kiểm mảnh của chương CHƯA đủ số mục. Mảnh của chương đã xong là bản cũ đã bị thay,
// quét lại chỉ ra hàng chục cảnh báo về nội dung không còn được dùng.
const CHUNK_DIR = resolve(ROOT, '.vi-chunks');
let pending = 0;
if (existsSync(CHUNK_DIR)) {
  const doneCh = new Set();
  for (const n of Object.keys(MAP)) {
    const chap = resolve(ROOT, 'book/vi', `${n}-${MAP[n]}`);
    if (!existsSync(chap)) continue;
    const want = (readFileSync(resolve(ROOT, 'book', zhOf(n)), 'utf8').match(/^### \d+\. /gm) || []).length;
    if ((readFileSync(chap, 'utf8').match(/^### \d+\. /gm) || []).length >= want) doneCh.add(n);
  }
  for (const cf of readdirSync(CHUNK_DIR).filter(f => /^\d\d-\d+-\d+\.md$/.test(f))) {
    const n = cf.slice(0, 2);
    if (doneCh.has(n)) continue;                   // chương đã xong, mảnh này là bản cũ
    const ctxt = readFileSync(resolve(CHUNK_DIR, cf), 'utf8').replace(/\r\n/g, '\n');
    const cItems = [...ctxt.matchAll(/^### (\d+)\. /gm)].map(m => Number(m[1]));
    if (!cItems.length) continue;
    const chap = resolve(ROOT, 'book/vi', `${n}-${MAP[n]}`);
    const haveSet = new Set(existsSync(chap)
      ? (readFileSync(chap, 'utf8').match(/^### \d+\. /gm) || []).map(s => Number(s.match(/\d+/)[0])) : []);
    const wanted = cItems.filter(i => !haveSet.has(i));
    if (!wanted.length) continue;
    pending += wanted.length;
    for (const [i, l] of ctxt.split('\n').entries()) {
      if (!/[\u4e00-\u9fff]/.test(l)) continue;
      if (/^<!--\s*成本标签:/.test(l) || /^- Nguồn:/.test(l)) continue;
      const rest = l.replace(/「[^」]*」/g, '').replace(/[（(][^）)]*[）)]/g, '');
      const m = rest.match(/[\u4e00-\u9fff]+/g);
      if (m) issues.push(`mảnh ${cf} dòng ${i + 1}: chữ Hán sót ${m.slice(0, 6).join(' ')}`);
    }
    // nhãn Trung sót lẫn trong mảnh — lỗi đã gặp: 来源： thay cho Nguồn:
    if (/^-\s*(来源|证据等级|成本|收益|说人话|备注)[：:]/.test(ctxt))
      issues.push(`mảnh ${cf}: còn nhãn tiếng Trung, phải dùng nhãn tiếng Việt`);
  }
}

console.log(`${chapters} chương, ${items} mục đã dịch${pending ? ` · ${pending} mục trong mảnh chưa ghép` : ''}${FIX ? ` · đã sửa ${fixed} BOM` : ''}`);
if (issues.length) {
  console.log(`\n${issues.length} vấn đề:`);
  issues.slice(0, 60).forEach(i => console.log('  ' + i));
  if (issues.length > 60) console.log(`  … và ${issues.length - 60} vấn đề nữa`);
  process.exit(1);
}
console.log('Sạch: mọi mục đã dịch đều khớp bản gốc ở dòng Nguồn, thẻ chi phí và mức bằng chứng.');