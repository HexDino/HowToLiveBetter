// Thử xem trang tìm kiếm có đọc và dựng được bản tiếng Việt không, không cần mở trình duyệt.
// Chạy: node tools/check-vi-site.mjs
//
// Bản tiếng Việt đi qua đúng đường với bản tiếng Trung: đọc README.vi.md, lấy danh sách
// file trong thư mục book/vi/, dựng lại từng thẻ. Nhưng index.html chạy trong trình duyệt,
// nên ở đây mình chạy lại đúng phần parse đó trên Node — bắt được lỗi nhãn, lỗi số thứ tự
// và lỗi thẻ trước khi bạn mở trang.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readme = readFileSync(resolve(ROOT, 'README.vi.md'), 'utf8').replace(/\r\n/g, '\n');

// ① danh sách file: đúng regex mà init() dùng
const files = [...new Set(Array.from(readme.matchAll(/\]\((book\/[^)]+\.md)\)/g), m => m[1]))].sort();
const problems = [];
if (!files.length) problems.push('README.vi.md không có liên kết file nào dạng (book/....md)');

// ② mọi file trong danh sách phải tồn tại. Trong lúc dịch dở thì thiếu là chuyện bình
// thường, nên chỉ ghi nhận chứ không dừng — phần dựng DOM bên dưới bỏ qua file chưa có.
const missing = files.filter(f => !existsSync(resolve(ROOT, f)));
if (missing.length) console.log(`Đang dịch dở: còn thiếu ${missing.length} chương (${missing.map(f => f.split('/').pop()).join(', ')})`);

// ③ mọi file trong book/vi/ phải được README.vi.md nhắc tới, không thừa không thiếu
const onDisk = existsSync(resolve(ROOT, 'book/vi'))
  ? readdirSync(resolve(ROOT, 'book/vi')).filter(f => f.endsWith('.md')).map(f => 'book/vi/' + f) : [];
for (const f of onDisk) if (!files.includes(f)) problems.push(`có trên đĩa nhưng README.vi.md không nhắc: ${f}`);

// ④ parse từng chương y hệt parseReadme() của index.html
const L = {
  cost: /^- Chi phí:(.*)$/, human: /^- Nói thật:(.*)$/, gain: /^- Lợi ích:(.*)$/,
  grade: /^- Mức bằng chứng:\s*([ABC])/, src: /^- Nguồn:(.*)$/, note: /^- Ghi chú:(.*)$/,
};
const COST_W = { money: { '0': 0, '少': 1, '多': 2 }, time: { '少': 0, '中': 1, '多': 2 }, will: { '否': 0, '些': 1, '是': 2 } };
let sections = 0, entries = 0, noHuman = 0;
const corpus = [];
for (const f of files){
  if (!existsSync(resolve(ROOT, f))) continue;   // chưa dịch xong, bỏ qua
  const md = readFileSync(resolve(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
  corpus.push(md);
  let sec = null, e = null;
  const flush = () => { if (e && sec) sec.entries.push(e); e = null; };
  for (const raw of md.split('\n')){
    const line = raw.trimEnd();
    let m;
    if ((m = /^#{1,2} (\d+)\. (.+)$/.exec(line))) { flush(); sec = { n: m[1], title: m[2].trim(), intro: [], entries: [] }; sections++; continue; }
    if (/^#{1,2} /.test(line)) { flush(); sec = null; continue; }
    if (!sec) continue;
    if ((m = /^### (\d+)\. (.+)$/.exec(line))) { flush(); e = { sec: sec.n, n: m[1], title: m[2].trim(), cost: '', human: '', gain: '', grade: '', src: '', note: '', money: '', time: '', will: '', level: '', lens: '' }; continue; }
    if ((m = /^<!--\s*成本标签:\s*(.*?)\s*-->/.exec(line)) && e){
      for (const kv of m[1].split(/\s+/)) { const [k, v] = kv.split('='); if (k === '钱') e.money = v; if (k === '时间') e.time = v; if (k === '毅力') e.will = v; if (k === '收益') e.level = v; if (k === '口径') e.lens = v; }
      continue;
    }
    if (e){
      if ((m = L.cost.exec(line))) e.cost = m[1];
      else if ((m = L.human.exec(line))) e.human = m[1];
      else if ((m = L.gain.exec(line))) e.gain = m[1];
      else if ((m = L.grade.exec(line))) e.grade = m[1];
      else if ((m = L.src.exec(line))) e.src = m[1];
      else if ((m = L.note.exec(line))) e.note = m[1];
      continue;
    }
    if (line) sec.intro.push(line);
  }
  flush();
}

for (const s of []) void s;
{
  // ⑤ mỗi mục phải đủ sáu trường, nếu không thẻ sẽ hiện thiếu dòng
  const all = [];
  for (const md of corpus){
    let cur = null;
    for (const line of md.split('\n')){
      const h = /^### (\d+)\. /.exec(line);
      if (h) { cur = { no: h[1] }; all.push(cur); continue; }
      if (/^<!--\s*成本标签:/.test(line) && cur) cur.tag = true;
      else if (L.cost.test(line) && cur) cur.cost = true;
      else if (L.human.test(line) && cur) cur.human = true;
      else if (L.gain.test(line) && cur) cur.gain = true;
      else if (L.grade.test(line) && cur) cur.grade = true;
      else if (L.src.test(line) && cur) cur.src = true;
      else if (L.note.test(line) && cur) cur.note = true;
    }
  }
  entries = all.length;
  for (const it of all){
    const miss = ['tag', 'cost', 'human', 'gain', 'grade', 'src'].filter(k => !it[k]);
    if (miss.length) problems.push(`mục ${it.no} thiếu trường: ${miss.join(', ')}`);
    if (!it.human) noHuman++;
  }
}

// ⑥ thống kê đối chiếu với README.vi.md
const zh = readFileSync(resolve(ROOT, 'README.md'), 'utf8');
const zhItems = Number((zh.match(/(\d+) 条建议/) || [])[1] || 0);
const viClaim = Number((readme.match(/34 chương (\d+) mục/) || [])[1] || 0);
if (zhItems && viClaim && zhItems !== viClaim) problems.push(`README.vi.md nói ${viClaim} mục, bản gốc nói ${zhItems}`);

console.log(`Chương trong README.vi.md: ${files.length} · mục dựng được: ${entries}`);
console.log(`Mục thiếu dòng Nói thật: ${noHuman}`);
console.log(files.length === 34 && entries === zhItems
  ? 'Khớp với bản gốc.'
  : `Đang dở: bản gốc có 34 chương ${zhItems} mục, hiện có ${files.length} chương ${entries} mục.`);
if (problems.length) {
  console.log(`\n${problems.length} vấn đề:`);
  problems.slice(0, 30).forEach(p => console.log('  - ' + p));
  process.exit(1);
}
console.log('Trang tìm kiếm sẽ dựng được bản tiếng Việt.');
