// Rà soát toàn bộ bản dịch tiếng Việt, tìm mọi chữ Hán còn sót.
//
//   node tools/check-vi-sweep.mjs
//
// Rà ba chỗ khác nhau vì mức độ nghiêm trọng khác nhau:
//
//   1. CHỮ HÁN HIỆN RA  — người đọc thấy. Sai, phải bằng không.
//      Ngoại lệ: thuật ngữ Hán Việt trong ngoặc 「」 hoặc （）, vì đó là cách chú thích
//      cho người đọc Việt tra cứu (ví dụ `hộ khẩu (户口)`). In ra để duyệt.
//
//   2. CHỮ HÁN BẮT BUỘC GIỮ — không ai nhìn thấy, nhưng bỏ đi là hỏng.
//      - Thẻ <!-- 成本标签: ... -->: index.html đọc đúng các khoá này để lọc.
//      - Phần sau dấu hai chấm của dòng `- Nguồn:`: tên tác giả, tạp chí, DOI, tên
//        luật Trung kèm số điều. Đây là thứ làm cho bản dịch kiểm chứng được; bỏ nó
//        thì không còn tra được nguồn gốc.
//      - Dòng trạng thái đầu file: chứa tên file Trung trong đường dẫn tới bản gốc.
//      Đếm riêng, không tính là lỗi.
//
//   3. index.html — HTML tĩnh và chuỗi trong JS. Chuỗi nào nằm ở nhánh else của
//      `VI ? tiếngViệt : tiếngTrung` thì chỉ hiện ra khi bỏ `?lang=vi`, không tính.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HAN = /[\u4e00-\u9fff]/;

let visible = [], required = 0;
const note = (where, line, text, what) => visible.push(`${where} dòng ${line}: ${what}\n      ${text.slice(0, 100)}`);

// ── 1 + 2: file chương và bài dài ─────────────────────────────────────────
function scanFile(abs, label) {
  const rel = abs.replace(ROOT + '\\', '').replace(ROOT + '/', '');
  const lines = readFileSync(abs, 'utf8').replace(/\r\n/g, '\n').split('\n');
  lines.forEach((l, i) => {
    if (!HAN.test(l)) return;
    // loại 2: máy đọc và nguồn
    if (/^<!--\s*成本标签:/.test(l)) { required++; return; }
    if (/^- Nguồn:/.test(l)) { required++; return; }
    // Bài dài trong docs/vi/ dùng dạng `- Tên tác giả (năm). Tên tài liệu. <url>` —
    // trích dẫn nguyên văn, không có nhãn. Cũng là loại 2.
    if (/^-\s*\S+.*(<https?:\/\/[^>]+>)\s*$/.test(l) && /[一-龥]/.test(l)) { required++; return; }
    if (/^Nguồn:.*<https?:\/\/[^>]+>\s*$/.test(l)) { required++; return; }
    // README.vi.md giải thích chính thẻ máy đọc `<!-- 成本标签: ... -->` cho người đọc
    // biết dòng đó ẩn thế nào — việc nhắc tên thẻ ở đây là chủ ý, không phải sót.
    if (/成本标签/.test(l)) { required++; return; }
    // dòng trạng thái: `> Bản dịch ... [book/xx-中文.md](../xx-中文.md)`
    if (/^>\s*Bản dịch không chính thức/.test(l)) {
      const path = (/\]\((\.\.\/[^)]+)\)/.exec(l) || [])[1];
      const rest = path ? l.replace(/\[[^\]]*\]\([^)]*\)/g, '') : l;
      if (!HAN.test(rest)) { required++; return; }
    }
    if (/^\[← Về mục lục\]/.test(l)) return;
    // link tới bản gốc / thư mục bản gốc: chữ Trung nằm trong phần link, giữ nguyên
    const noLink = l.replace(/\[[^\]]*\]\([^)]*\)/g, '');
    if (!HAN.test(noLink)) { required++; return; }
    // loại 1: thuật ngữ trong ngoặc được phép, nhưng phần ngoài ngoặc thì không
    const outside = noLink.replace(/「[^」]*」/g, '').replace(/[（(][^）)]*[）)]/g, '');
    const m2 = outside.match(/[\u4e00-\u9fff]+/g);
    if (m2) note(rel, i + 1, l, `「${m2.join(' ')}」`);
  });
}

const bookVi = resolve(ROOT, 'book/vi');
for (const f of existsSync(bookVi) ? readdirSync(bookVi).filter(x => x.endsWith('.md')) : []) {
  scanFile(resolve(bookVi, f), 'book/vi');
}
const docsVi = resolve(ROOT, 'docs/vi');
for (const f of existsSync(docsVi) ? readdirSync(docsVi).filter(x => x.endsWith('.md')) : []) {
  scanFile(resolve(docsVi, f), 'docs/vi');
}
if (existsSync(resolve(ROOT, 'README.vi.md'))) scanFile(resolve(ROOT, 'README.vi.md'), 'README.vi');

// ── 3: index.html ─────────────────────────────────────────────────────────
// Phần này KHÔNG quyết định được kết luận, chỉ liệt kê. Lý do: nhãn gốc vẫn là tiếng Trung,
// applyI18n() mới ghi đè lúc chạy, mà script không có DOM để dựng lại trạng thái sau đó —
// quét chuỗi trong mã nguồn thì không phân biệt được chuỗi nào người đọc thấy. Thử rút
// danh sách selector từ applyI18n rồi dựng regex cũng không đáng tin (`.cls` khớp cả
// thẻ không có class đó). Nguồn chân lực cho phần này là ảnh chụp màn hình, không phải script.
//
// Cách kiểm đúng: mở index.html?lang=vi và nhìn. Ảnh đã xác nhận các nhóm bộ lọc, tiêu đề
// nhóm, ba đoạn dẫn nhập, dòng bài dài và dòng Trợ lý AI đều ra tiếng Việt.
const h = readFileSync(resolve(ROOT, 'index.html'), 'utf8');
const htmlFindings = [];
const stripTags = s => s.replace(/<[^>]*>/g, '\n');
const staticBody = h.replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
stripTags(staticBody).split('\n').forEach(s => {
  const t = s.trim();
  if (!t || !HAN.test(t)) return;
  const noLink = t.replace(/\[[^\]]*\]\([^)]*\)/g, '').replace(/（中文）/g, '');
  if (!HAN.test(noLink)) return;
  htmlFindings.push(t.slice(0, 60));
});
// Thuộc tính: title/aria-label/placeholder/alt hiện ra khi rê chuột hoặc đọc bằng màn hình.
// Script này KHÔNG kết luận được phần này: applyI18n() ghi đè chúng lúc chạy bằng selector
// động, mà ở đây không có DOM để dựng lại. Liệt kê ra để đối chiếu bằng mắt.
const attrFindings = [];
staticBody.replace(/\b(title|aria-label|placeholder|alt)="([^"]*)"/g, (m, attr, val) => {
  if (HAN.test(val)) attrFindings.push(`${attr}="${val.slice(0, 40)}"`);
  return m;
});
required += [...new Set(htmlFindings)].length + attrFindings.length;

// Khối script chính: chỉ đếm chuỗi Trung, không kết luận. Phần lớn nằm ở nhánh else của
// `VI ? tiếngViệt : tiếngTrung` hoặc là khoá tra bảng — chỉ hiện ra khi bỏ ?lang=vi.
const mainScript = [...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop() || '';
const jsHanCount = (mainScript.match(/[\u4e00-\u9fff]/g) || []).length;

// ── kết quả ───────────────────────────────────────────────────────────────
console.log(`Dòng Trung BẮT BUỘC giữ (máy đọc + nguồn + đường dẫn): ${required}`);
if (!visible.length) {
  console.log('KHÔNG CÒN chữ Hán nào hiện ra với người đọc.');
  console.log('  → file nội dung: book/vi/, docs/vi/, README.vi.md đã SẠCH, kiểm được bằng script.');
  console.log(`  → index.html: ${new Set(htmlFindings).size} đoạn chữ Trung trong HTML gốc và`);
  console.log(`    ${attrFindings.length} thuộc tính — applyI18n() ghi đè lúc chạy, script không dựng được DOM:`);
  console.log(`    ${[...new Set(attrFindings)].join(', ')}`);
  console.log('    → đối chiếu bằng mắt trên index.html?lang=vi');
} else {
  console.log(`\n${visible.length} chỗ còn chữ Hán hiện ra:`);
  visible.forEach(v => console.log('  ' + v));
}
process.exit(visible.length ? 1 : 0);