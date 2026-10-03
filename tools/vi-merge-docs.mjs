#!/usr/bin/env node
// Chuyển mảnh bài dài trong .vi-chunks/ sang docs/vi/.
//
//   node tools/vi-merge-docs.mjs
//
// Mảnh bài dài khác file chương ở chỗ: nó không có thẻ 成本标签, không đánh số mục, có các
// tiêu đề `##`. vi-merge.mjs giả định có `### N.` nên không dùng được. Script này chỉ
// chuyển tệp sang chỗ đúng khi tên file khớp bản gốc trong docs/ và nội dung có dòng
// trạng thái bản dịch.
import { readFileSync, writeFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHUNK_DIR = resolve(ROOT, '.vi-chunks');
const DOCS = resolve(ROOT, 'docs');
const VI_DIR = resolve(ROOT, 'docs/vi');
const CHECK = process.argv.includes('--check');

const chunks = readdirSync(CHUNK_DIR).filter(f => f.startsWith('doc-') && f.endsWith('.md'));
if (!chunks.length) { console.log('Không có mảnh bài dài nào.'); process.exit(0); }

let moved = 0;
for (const c of chunks) {
  const slug = c.replace(/^doc-/, '').replace(/\.md$/, '');
  const body = readFileSync(resolve(CHUNK_DIR, c), 'utf8').replace(/\r\n/g, '\n').trimEnd() + '\n';

  // Chỉ nhận khi có dòng trạng thái bản dịch — đó là dấu hiệu đã dịch xong
  if (!/^> Bản dịch không chính thức/m.test(body)) {
    console.log(`${c}: bỏ qua, thiếu dòng trạng thái bản dịch`);
    continue;
  }
  // Đường dẫn trong dòng trạng thái phải trỏ tới một file thật trong docs/
  const ref = (/\]\((.+?\.md)\)/.exec(body.split('\n')[0]) || [])[1];
  if (!ref || !existsSync(resolve(DOCS, ref.replace(/^\.\.\//, '')))) {
    console.log(`${c}: bỏ qua, đường dẫn nguồn không hợp lệ (${ref})`);
    continue;
  }
  if (CHECK) { console.log(`${c}: sẽ chuyển thành docs/vi/${slug}.md`); continue; }
  writeFileSync(resolve(VI_DIR, `${slug}.md`), body);
  rmSync(resolve(CHUNK_DIR, c));
  moved++;
  console.log(`${c} → docs/vi/${slug}.md`);
}
console.log(CHECK ? '(chỉ kiểm tra, chưa chuyển)' : `Đã chuyển ${moved} bài dài.`);