// Kiểm tra bản dịch tiếng Việt: parity với bản gốc + các quy ước trong VI-TRANSLATION.md.
// Bản dịch phải kiểm chứng được bằng máy, không bằng cảm tính.
//
//   node tools/check-vi.mjs                 # kiểm tất cả chương đã có trong book/vi/
//   node tools/check-vi.mjs book/vi/15-x.md # kiểm một file
//   node tools/check-vi.mjs --stat          # chỉ đếm
//
// Bốn thứ được đo, theo thứ tự nghiêm ngặt dần:
// ① parity cấu trúc: số mục, thẻ chi phí, dòng Nguồn, số `### N.` phải khớp bản gốc.
// ② dòng Nguồn phải giống hệt bản gốc tính từ sau nhãn (tác giả, tạp chí, DOI, số điều luật).
// ③ nhãn Trung còn sót trong chỗ phải dịch: dòng Nguồn, và chữ Hán ngoài vùng được phép.
// ④ dòng Nói thật không được dài quá 120 chữ và không được chứa từ Hán.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STAT = process.argv.includes('--stat');
const ONLY = process.argv.filter(a => a.endsWith('.md') && a.includes('vi'));
// Độ dài dòng Nói thật. Bản gốc giới hạn 120 chữ Hán (đo được: median 102, max 120).
// Tiếng Việt dài hơn: đo trên bản dịch, median 289 chữ ứng với 102 chữ Hán, tức 2,83 lần.
// Nên trần của bản Việt là 120 × 2,9 ≈ 350, ứng với đúng trần của bản gốc chứ không phải
// một con số bịa ra.
// Lưu ý: trần cũ từng là 120 và còn là 300. Cả hai đều sai, và sai theo hướng làm mất
// nội dung: dịch giả cắt bỏ chi tiết chỉ để vừa chỗ. Rút gọn phải theo nghĩa (bỏ câu trùng
// lặp, bỏ chi tiết đã nằm ở dòng Ghi chú), không theo đếm ký tự.
const MAX = 350;

// Nhãn tiếng Việt. Bản dịch phải dùng đúng những nhãn này, index.html dò theo chúng.
const LABELS = { cost: 'Chi phí', human: 'Nói thật', gain: 'Lợi ích', grade: 'Mức bằng chứng', src: 'Nguồn', note: 'Ghi chú' };
// Nhãn Trung, để bắt trường hợp quên dịch nhãn.
const ZH = { cost: '成本', human: '说人话', gain: '收益', grade: '证据等级', src: '来源', note: '备注' };

// Vùng được phép chứa chữ Hán. Đây là những dòng mà VI-TRANSLATION.md bắt buộc giữ
// nguyên byte, nên xét theo cả dòng chứ không phải theo đoạn khớp: tên file trong dòng
// trạng thái và tên luật trong dòng Nguồn đều là chữ Hán mà bản dịch không được dịch.
// Ngoài ra còn cho phép thuật ngữ Trung trong ngoặc, dùng để giải thích lần đầu.
const HAN_LINE_OK = [
  /^<!--\s*成本标签:/,                              // thẻ chi phí: index.html đọc khoá tiếng Trung
  /^>\s*Bản dịch không chính thức/,                // dòng trạng thái: có tên file Trung trong link
  /^- Nguồn:/,                                     // tên luật Trung và số điều giữ nguyên
  /^-#/,
];
// Dòng khác: bỏ hết phần trong ngoặc 「」 và （） rồi mới xét chữ Hán còn lại. Ngoặc 「」
// là nơi tên chương trình, luật, tài khoản Trung Quốc được phép đứng để người đọc Việt tra
// cứu — 「中国戒烟平台」 là ví dụ đúng, đó là tên riêng chứ không phải chỗ dịch bỏ sót.
const HAN_IN_PAREN = /「[^」]*」|[（(][^）)]*[）)]/g;

// ① và ②
function compare(vi, zh) {
  const V = vi.split('\n'), Z = zh.split('\n');
  const problems = [];
  // ① parity cấu trúc. Mỗi nhãn có regex riêng cho bản Việt và bản Trung: nhãn Trung dùng
  // dấu hai chấm full-width nên dùng chung regex thì số bên Trung luôn bằng 0.
  const count = (lines, re) => lines.filter(l => re.test(l)).length;
  const pairs = [
    ['mục',        /^### \d+\. /,        /^### \d+\. /],
    ['thẻ chi phí',/^<!--\s*成本标签:/, /^<!--\s*成本标签:/],
    ['dòng Chi phí',      /^- Chi phí:/,           /^- 成本：/],
    ['dòng Nói thật',     /^- Nói thật:/,          /^- 说人话：/],
    ['dòng Lợi ích',      /^- Lợi ích:/,           /^- 收益：/],
    ['dòng Mức bằng chứng',/^- Mức bằng chứng:/,  /^- 证据等级：/],
    ['dòng Nguồn',        /^- Nguồn:/,            /^- 来源：/],
    ['dòng Ghi chú',      /^- Ghi chú:/,          /^- 备注：/],
  ];
  for (const [name, reV, reZ] of pairs){
    const na = count(V, reV), nb = count(Z, reZ);
    if (na !== nb) problems.push(`số ${name}: ${na} trong bản Việt, ${nb} trong bản Trung`);
  }

  // ② dòng Nguồn: phần sau nhãn phải khớp từng dòng
  const vs = V.filter(l => /^- Nguồn:/.test(l)).map(l => l.slice(l.indexOf(':') + 1).trim());
  const zs = Z.filter(l => /^- 来源：/.test(l)).map(l => l.slice(l.indexOf('：') + 1).trim());
  if (vs.length === zs.length) {
    const diff = [];
    vs.forEach((v, i) => { if (v !== zs[i]) diff.push(i + 1); });
    if (diff.length) problems.push(`dòng Nguồn khác bản gốt ở mục ${diff.slice(0, 12).join(', ')}${diff.length > 12 ? '…' : ''}`);
  }

  // số mục phải đánh số liên tục và khớp bản gốc
  const vn = V.filter(l => /^### \d+\. /.test(l)).map(l => Number(l.match(/^### (\d+)\./)[1]));
  const zn = Z.filter(l => /^### \d+\. /.test(l)).map(l => Number(l.match(/^### (\d+)\./)[1]));
  if (vn.join(',') !== zn.join(',')) problems.push(`đánh số mục lệch với bản gốc (Việt ${vn.slice(0, 8).join(',')}… / Trung ${zn.slice(0, 8).join(',')}…)`);

  // ③ nhãn Trung còn sót ở nơi phải dịch
  for (const [key, zhLabel] of Object.entries(ZH)) {
    const re = new RegExp('^- ' + zhLabel + '：');
    if (count(V, re)) problems.push(`còn ${count(V, re)} dòng dùng nhãn Trung「${zhLabel}」thay vì「${LABELS[key]}」`);
  }

  // ③ chữ Hán ngoài vùng được phép
  const stray = [];
  V.forEach((l, i) => {
    if (!/[\u4e00-\u9fff]/.test(l)) return;
    if (HAN_LINE_OK.some(re => re.test(l))) return;         // dòng phải giữ nguyên byte
    const rest = l.replace(HAN_IN_PAREN, '').match(/[\u4e00-\u9fff]+/g);
    if (rest) stray.push(`${i + 1}: ${rest.join(' ')}`);
  });
  if (stray.length) problems.push(`chữ Hán ngoài vùng cho phép — dòng ${stray.slice(0, 6).join(' | ')}${stray.length > 6 ? ` (${stray.length} dòng)` : ''}`);

  // ④ dòng Nói thật: độ dài và chữ Hán. Chữ Hán trong ngoặc 「」 là cách giải thích thuật
  // ngữ Hán Việt, hợp lệ theo VI-TRANSLATION.md; ngoài ngoặc thì không được còn.
  V.filter(l => /^- Nói thật:/.test(l)).forEach((l, i) => {
    const body = l.slice(l.indexOf(':') + 1);
    const len = [...body.replace(/\s/g, '')].length;
    if (len > MAX) problems.push(`dòng Nói thật thứ ${i + 1} dài ${len} chữ, quá ${MAX}`);
    const han = body.replace(HAN_IN_PAREN, '').match(/[\u4e00-\u9fff]+/g);
    if (han) problems.push(`dòng Nói thật thứ ${i + 1} còn chữ Hán: ${han.join(' ')}`);
  });

  // dòng trạng thái bản dịch phải có, và phải trỏ về đúng bản gốc
  if (!/^> Bản dịch không chính thức/.test(V[0] || '')) problems.push('thiếu dòng trạng thái bản dịch ở dòng đầu');
  const back = V.find(l => /Về mục lục/.test(l));
  if (!back) problems.push('thiếu dòng quay lại mục lục');
  else if (!/\.\.\/\.\.\/README\.vi\.md/.test(back)) problems.push(`dòng quay lại mục lục phải trỏ ../../README.vi.md, đang là: ${back.trim()}`);

  return problems;
}

const VI_DIR = resolve(ROOT, 'book/vi');
const files = ONLY.length ? ONLY : (exists(VI_DIR)
  ? readdirSync(VI_DIR).filter(f => f.endsWith('.md')).sort().map(f => 'book/vi/' + f)
  : []);

if (!files.length) { console.log('Chưa có chương nào trong book/vi/.'); process.exit(0); }

// statSync chứ không readFileSync: tham số là thư mục, đọc file sẽ ném EISDIR
function exists(p) { try { return statSync(p).isDirectory(); } catch { return false; } }

const bad = [];
let items = 0;
for (const f of files){
  const name = basename(f);
  const zhName = readdirSync(resolve(ROOT, 'book')).find(x => x.startsWith(name.slice(0, 2)) && x.endsWith('.md'));
  if (!zhName) { bad.push(`${f}: không tìm thấy chương Trung tương ứng`); continue; }
  const vi = readFileSync(resolve(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
  const zh = readFileSync(resolve(ROOT, 'book', zhName), 'utf8').replace(/\r\n/g, '\n');
  items += (vi.match(/^### \d+\. /gm) || []).length;
  const problems = compare(vi, zh);
  if (problems.length) bad.push(`${f} (gốc ${zhName})\n    - ` + problems.join('\n    - '));
}

if (STAT) { console.log(`${files.length} chương, ${items} mục`); process.exit(bad.length ? 1 : 0); }

if (bad.length) {
  console.log(`${bad.length}/${files.length} chương có vấn đề:\n`);
  for (const b of bad) console.log(b + '\n');
  process.exit(1);
}
console.log(`Kiểm tra bản dịch đạt: ${files.length} chương, ${items} mục, đủ số thẻ chi phí và dòng Nguồn khớp bản gốc.`);
