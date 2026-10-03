# Quy ước dịch tiếng Việt (VI)

Bản tiếng Việt nằm ở `book/vi/` và `docs/vi/`, bản gốc Trung vẫn ở `book/*.md`. Bản Việt là
bản dịch không chính thức, phục vụ đọc dễ hơn; khi có khác biệt thì bản gốc tiếng Trung là
chuẩn.

Tài liệu này viết trước, dịch sau. Mọi người dịch đọc file này, không đọc "dịch giống
chương 17 thế nào".

## Không dịch (giữ nguyên byte)

Đây là phần làm cho bản dịch **kiểm chứng được bằng máy** thay vì bằng cảm tính:

- Cả dòng `- 来源：` → chỉ đổi **nhãn** thành `- Nguồn:`, phần sau giữ nguyên: tên tác giả,
  tên tạp chí, DOI, URL, tên luật Trung Quốc kèm số văn bản.
- Thẻ chi phí HTML `<!-- 成本标签: 钱=0 时间=少 毅力=否 收益=大 口径=金钱 -->` — giữ
  nguyên tiếng Trung, byte for byte. index.html đọc chính xác các khoá này. Nó ẩn trong
  HTML nên người đọc không nhìn thấy.
- Mọi con số: HR, RR, OR, CI, tỉ lệ, tiền, số điều, số điện thoại, mức phạt.
- Cấu trúc Markdown: cấp tiêu đề, đánh số `### N.`, thứ tự mục, liên kết.
- Chữ A / B / C trong mức bằng chứng.

### Chỉ hai dòng được giữ nguyên đó

Còn **mọi dòng khác phải dịch hết**, kể cả tiêu đề mục. Đã có worker chép nguyên dòng
`- Lợi ích:` bằng tiếng Trung vì tưởng "giữ nguyên" áp dụng cho cả dòng đó — người đọc
gặp đoạn không đọc được. Cũng đã có worker dịch nửa vời: tiêu đề còn tiếng Trung, trong
dòng Nói thật lẫn nguyên câu tiếng Trung. Trước khi báo xong phải tự kiểm bằng
`node tools/check-vi-all.mjs` và sửa hết dòng báo `chữ Hán sót` thuộc chương của bạn.

## Cần dịch

| Nhãn tiếng Trung | Tiếng Việt |
| --- | --- |
| 成本 | Chi phí |
| 说人话 | Nói thật |
| 收益 | Lợi ích |
| 证据等级 | Mức bằng chứng |
| 来源 | Nguồn |
| 备注 | Ghi chú |

Dòng `说人话` là dòng quan trọng nhất: nó là câu đúng nhất trong thẻ, và phải viết lại bằng
tiếng Việt tự nhiên, **không được thêm con số nào không có trong dòng 收益**. Người đọc
chỉ đọc dòng này là đủ quyết định.

## Giữ giọng văn

Đây là phần dễ mất nhất. Đọc `CLAUDE.md` mục "写作规则" và "句子层面的硬标准" — bản gốc
đã bị sửa nhiều vòng để bỏ hơi AI và để người đọc chậm hiểu được.

- **Khiêm tốn, không giáo huấn, không dấu chấm than.** Tiêu đề mục bắt đầu bằng động từ.
  Bản gốc không mỉa mai người đọc, cũng không đùa cợt. Giữ đúng mức đó.
- **Một câu một ý, khoảng 30 chữ, dài nhất 50 chữ.** Câu dài là lỗi, không phải đam mê.
- **Chủ ngữ rõ ràng** (bạn, bác sĩ, công ty, tòa). Tránh câu bị động và từ Hán Việt
  cứng nhắc kiểu văn bản pháp luật.
- **Giữ màu mèo nhẹ của tác giả.** Có mấy chỗ tác giả tự nói nhẹ với người đọc, như "tác
  giả cũng chưa làm được phần lớn trong số này". Chuyển sang tiếng Việt thì vẫn phải nhẹ
  như vậy, không biến thành lời tuyên bố.
- **Không dịch lỗi văn phong thành văn phong khác.** "Không phải X, mà là Y" là dùng để
  loại một cách hiểu sai — đó là nội dung, giữ nguyên.
- **Câu bắt đầu bằng "争议" trong 备注 phải bắt đầu bằng "Tranh luận"** — index.html dò
  chuỗi này để gắn nhãn.

### Dòng Nói thật: trần 350 chữ, đừng cắt nội dung cho vừa

Bản gốc giới hạn dòng 说人话 ở 120 chữ Hán (đo được: median 102, max 120). **Cùng nội dung
đó ra tiếng Việt dài khoảng 2,8 lần** (đo trên bản dịch: median 289 chữ), nên trần của
bản Việt là 350 chữ.

Lúc đầu quy ước để nhầm là 120, và bản dịch đầu tiên đã cắt mất chi tiết chỉ để vừa
chỗ — mất thông tin mà bản gốc có. Đừng làm vậy nữa.

Muốn rút gọn thì rút theo nghĩa, không rút theo đếm ký tự: bỏ câu trùng lặp, bỏ chi tiết
đã nằm ở dòng *Ghi chú*. Còn câu nào chỉ có ở dòng *Nói thật* thì phải giữ, dài cũng giữ.

Dòng này là câu đúng nhất trong thẻ: người đọc thường chỉ đọc đúng nó rồi quyết định. Cắt
còn đúng một nửa thì hỏng mất chỗ đáng đọc nhất.

### Bốn lỗi đã thấy thật trong lúc dịch, đừng phạm lại

- **Phân biệt chương với mục.** Bản gốc dùng chữ 条 cho cả hai: 「见第 8 节第 16 条」 là
  *chương 8, mục 16*; 「见第 6 条」 là *mục 6 của chương này*. Tiếng Việt phải tách:
  - Chương khác → `xem chương 8`, `xem chương 27`
  - Mục trong chương hiện tại → `xem mục 6`
  - Dòng dẫn nhập đầu chương thì thường trỏ sang chương khác → `xem chương N`.
  Suy nhầm hai loại này làm người đọc tìm nhầm chương.
- **Đừng để lại chữ Hán trong ngoặc ở phần dẫn nhập.** `口径` phải dịch thành "thước đo",
  không viết `thước đo (口径)`. Chỉ giữ chữ Hán trong ngoặc khi đó là tên riêng của
  cơ quan, luật, hoặc thuật ngữ Hán Việt người đọc Việt có thể tra cứu (ví dụ
  `hộ khẩu (户口)`, `quỹ tích lũy nhà ở (公积金)`).
- **Đừng lặp chữ.** "xin một văn bản ủy quyền bằng văn bản" (văn bản … bằng văn bản),
  "môi giới không thu hộ hộ" (thu hộ … hộ). Bản gốc dùng hai từ Hán khác nhau, dịch từng
  chữ một sẽ thành lặp. Đọc thành tiếng phải trôi.
- **Đừng cắt câu thành cụt.** "Luật Trung Quốc cấm." đọc lướt không ai biết cấm cái gì.
  Bản gốc viết「法规明令禁止」rồi mới nói cấm việc gì — giữ đủ hai vế.
- **Trạng thái bị động tiếng Trung hay thành câu bị động tiếng Việt.** Tiếng Việt dùng
  thụ động rất nhiều ("được yêu cầu", "bị phạt"), bản gốc cố tình tránh để người đọc thấy
  rõ ai làm gì. Khi nào có thể, viết chủ ngữ ra: "chủ nhà không được…" thay vì "không
  được phép… bởi chủ nhà".
- **Giữ nhịp cân bằng của câu.** Bản gốc hay đặt hai vế song song ("… và …", "không X mà
  Y"). Cân bằng đó là thứ khiến câu dễ nhớ. Dịch thành một vế dài lê thê là mất.

## Thực thể Trung Quốc — giữ là của Trung Quốc

Đây là sách về hệ thống pháp luật và phúc lợi của **Trung Quốc đại lục**. Không được dịch
sang chế độ phúc lợi Việt Nam, không được đổi tên cơ quan, không được bỏ điều luật nào.

Cách làm: giữ thuật ngữ Hán Việt và tên Trung, giải thích ngắn bằng tiếng Việt **ở lần
đầu xuất hiện trong chương**.

| Tiếng Trung | Cách viết |
| --- | --- |
| 医保 | bảo hiểm y tế (医保) |
| 户口 | hộ khẩu (户口) |
| 低保 | trợ cấp sinh hoạt tối thiểu (低保) |
| 劳动仲裁 | hòa giải lao động (劳动仲裁) |
| ICP 备案 | đăng ký ICP (ICP 备案) |
| 公积金 | quỹ tích lũy nhà ở (公积金) |
| 12356 | giữ nguyên, thêm chú thích nếu cần |

- Luật Trung Quốc: dịch nghĩa, **giữ tên luật tiếng Trung và số điều ở dòng 来源**. Trong
  phần chữ đề, nói thẳng đây là quy định của Trung Quốc để người đọc Việt không tưởng nó
  áp dụng cho mình.
- Số tiền: `元` → `CNY` hoặc `tệ`. **Không quy đổi** sang VND.
- Số điện thoại Trung Quốc (120 cứu thương, 110 cảnh sát, 12356 tâm lý, 12345) giữ nguyên
  và thêm chú thích chức năng bằng tiếng Việt.

## Thêm vào mà bản gốc không có

Bản dịch không được bịa thêm sự thật. Được phép thêm:

- Giải thích thuật ngữ Trung Quốc ở lần đầu (như bảng trên).
- Đơn vị tương đương kèm ngoặc.
- Vài câu dẫn nhắc bối cảnh Trung Quốc.

Cấm thêm: số liệu, triệu chứng, cơ chế giải thích, khuyến nghị mới.

## Cách làm đúng: viết ra MẢNH NHỎ, không sửa file chương

Đã mất dữ liệu ba lần vì cùng một cách sai:

1. **Ghi lại toàn bộ file chương → vượt giới hạn đầu ra → file bị cắt cụt.** Chương 05 bị
   đứt giữa câu ở mục 6, mất 16 mục đã dịch.
2. **Hai người cùng ghi một file → bản sau đè bản trước.**
3. **Dùng `edit` chèn từng đoạn → lỗi tham số, hỏng lượt.**

Nên quy tắc bắt buộc:

- **Dịch ra `.vi-chunks/NN-<từ>-<đến>.md`.** Ví dụ `.vi-chunks/05-7-14.md`. File nhỏ nên
  ghi một lần là xong, không bao giờ bị cắt.
- **Tuyệt đối không mở, không sửa, không ghi file trong `book/vi/`.** Việc ghép do
  `node tools/vi-merge.mjs NN` đảm nhiệm.
- Một lượt nhận **một khoảng liên tục. Bốn mục thì chắc xong, tám mục thì hay hết giờ.**
  Nếu phải dịch nhiều hơn bốn mục thì chia thành nhiều file, **ghi từng file một, xong
  file nào thì dừng rồi viết file tiếp theo** — hết giờ thì phần đã ghi vẫn còn dùng được.
- **Hai lượt không được cùng một chương.** Xem `.vi-active-chapters.json` trước khi giao.
- **Trước khi ghi, kiểm mảnh đó đã có chưa và nội dung có đủ không.** Đã có lần một mảnh bị
  cắt cụt giữa câu, xoá đi rồi giao lại thì tốn công vô ích — mà chương thật ra đã đủ số mục
  rồi, chỉ là bản ghép đã có từ trước. Nếu một mảnh đã tồn tại thì báo và dừng, đừng ghi đè.
- **Nếu mục cuối cùng trong mảnh không đủ tám dòng** thì mảnh đó bị cắt, đừng dùng.
- Mảnh ghi bắt đầu bằng số mục, không cần phần đầu file:
```
### 10. <tiêu đề dịch>
<!-- 成本标签: ... -->
- Chi phí: ...
- Nói thật: ...
- Lợi ích: ...
- Mức bằng chứng: A
- Nguồn: ...
- Ghi chú: ...
```

Mỗi mục đủ **tám dòng**: tiêu đề, thẻ chi phí, và sáu dòng nhãn. Mục cuối trong mảnh mà
thiếu dòng nghĩa là mảnh bị cắt, đừng dùng.
  ```
  > Bản dịch không chính thức của [book/NN-....md](../NN-....md). Khi có khác biệt, bản gốc tiếng Trung là chuẩn.

  [← Về mục lục](../../README.vi.md)

  # NN. <tiêu đề chương dịch>

  <đoạn dẫn nhập dịch>
  ```

Tự kiểm trước khi báo cáo: `node tools/vi-merge.mjs --check NN`, rồi đọc dòng báo cáo.
Đừng chỉ nói 「xong」 — đã có subagent báo 13/13 trong khi file thực tế chỉ có 12.

## Một lượt dịch chỉ nhận MỘT khoảng mục, và mỗi file chỉ một người viết

Đã xảy ra nhiều lần: hai subagent cùng ghi một file, bản sau đè bản trước, kết quả là
mất mục đã dịch hoặc thứ tự mục lộn (mục 21–24 nằm ngay sau mục 8 ở chương 3).

Nên:

1. **Chia theo khoảng mục, không chia theo chương cho nhiều người.** Một lượt nhận đúng
   một khoảng liên tục, ví dụ 「mục 13 đến 20」, tối đa 8 mục. Trên 8 mục thì hay bị
   hết giờ.
2. **Một file tại một thời điểm chỉ có một người ghi.** Không giao hai lượt cho cùng một
   chương. Lượt sau chỉ giao sau khi lượt trước báo xong.
3. **Dùng công cụ `write` để ghi lại toàn bộ file**, không dùng `edit` chèn từng đoạn
   (lỗi tham số làm hỏng lượt, đã xảy ra).
4. **Trước khi giao lượt sau, đếm số mục thật trong file**:
   ```bash
   node tools/check-vi-site.mjs
   ```
   Rồi `node tools/vi-reorder.mjs book/vi/NN-...md` nếu thứ tự bị lộn. Script chỉ sắp
   lại, không dịch.
5. **Đừng tin lời báo 「xong」 của subagent.** Phải tự đếm lại số mục. Đã có subagent báo
   xong 13/13 trong khi file thực tế chỉ có 12.

## Chia đợt

Theo `CLAUDE.md` mục "工作方式": chia theo file, mỗi người một chương, **thêm mới luôn
nối cuối chương**. Không chèn giữa để không dịch lệch số thứ tự.

Chương nào trên 20 mục thì chia làm hai phần: người một dịch `### 1.` đến hết một mốc
tròn (ví dụ `### 20.`), người sau dịch phần còn lại rồi **nối vào cuối file đã có**. Người
sau phải đọc phần đầu file đã dịch để khớp cách dùng từ và giữ đúng phần đệm dòng trống.
Cấm chèn xen giữa, cấm đánh số lại.

Cấm trong mọi lượt dịch:

- Không chạy lệnh làm thay đổi trạng thái git.
- Không sửa `README.md`, `index.html`, `CLAUDE.md`, `tools/`, hay chương Trung.
- Không chạy `sync-stats.mjs` và `check-refs.mjs` (cả `--suspect`) — chúng ghi đè
  `docs/引用对照.md` của bản Trung.
- Không dùng Python hay sed sửa hàng loạt nội dung.

Tự kiểm: `node tools/check-vi.mjs <file>`. Chỉ chạy lệnh này.

## Quy ước tên file

`book/vi/NN-<slug-tiếng-Việt>.md`, slug không dấu, gạch nối, chữ thường. Danh sách đích
đã cố định, mỗi chương một dòng — đổi tên thì `README.vi.md` và `index.html` hỏng theo:

| Bản Trung | Bản Việt |
| --- | --- |
| 01-不要早死 | 01-Dung-chet-som.md |
| 02-不要慢慢死 | 02-Dung-chet-tam-lam.md |
| 03-不要浪费精力 | 03-Dung-luoi-luc.md |
| 04-不要浪费时间 | 04-Dung-luoi-thoi-gian.md |
| 05-不要浪费钱 | 05-Dung-luoi-tien.md |
| 06-反面清单 | 06-Danh-sach-mat-duong.md |
| 07-没钱的时候怎么活 | 07-Khong-co-tien-thi-song-the-nao.md |
| 08-别把自己搭进去 | 08-Dung-tu-lam-roi-ban-than.md |
| 09-普通人容易踩的法律红线 | 09-Red-line-phap-ly-nguoi-dong.md |
| 10-恋爱和结婚划不划算 | 10-Tinh-huyen-va-ket-hon-co-dang-khong.md |
| 11-程序员和技术人容易踩的红线 | 11-Red-line-ky-su-va-nguoi-cong-nghe.md |
| 12-创业与做生意 | 12-Khoi-nghiep-va-kinh-doanh.md |
| 13-紧急情况 | 13-Tinh-huong-khan-cap.md |
| 14-账号与信息安全 | 14-Tai-khoan-va-an-toan-thong-tin.md |
| 15-租房与买房 | 15-Thue-nha-va-mua-nha.md |
| 16-得了慢性病之后怎么活 | 16-Sau-khi-mac-benh-man-tinh.md |
| 17-家里有老人 | 17-Nha-co-nguoi-lon.md |
| 18-养孩子划不划算 | 18-Nuoi-con-co-dang-khong.md |
| 19-在职离职和工伤 | 19-Dang-lam-nghi-viec-va-tai-nan.md |
| 20-刚出生的孩子怎么带 | 20-Cham-con-moi-sinh.md |
| 21-出国旅行与境外安全 | 21-Di-nuoc-ngoai-va-an-toan.md |
| 22-怎么放松 | 22-Lam-thay-nao-de-tha-long.md |
| 23-学什么技能划算 | 23-Hoc-ky-nang-gi-nao-dang-khong.md |
| 24-看病 | 24-Kham-benh.md |
| 25-人走了以后要办什么 | 25-Sau-khi-nguoi-that-di-can-lam-gi.md |
| 26-做一个网站或平台 | 26-Lam-trang-web-hoac-nen-tang.md |
| 27-怀孕和生产 | 27-Mang-thai-va-sinh-con.md |
| 28-别为了外形把身体搞坏 | 28-Dung-hu-hong-co-the-de-lay-ve-dung.md |
| 29-遭遇重大打击之后 | 29-Sau-khi-gap-cuoc-tung.md |
| 30-上学以后的孩子 | 30-Dua-con-ra-truong.md |
| 31-十八岁之后有哪几条路 | 31-Sau-muoi-tuoi-co-nhung-duong-nao.md |
| 32-出国留学 | 32-Du-hoc-o-nuoc-ngoai.md |
| 33-残疾之后怎么活 | 33-Sau-khi-khuyet-tat.md |
| 34-家里的常备药别吃出事 | 34-Thuoc-trong-nha-dung-mua-nham.md |

Dòng đầu file, trước dòng quay lại mục lục:

```
> Bản dịch không chính thức của [book/01-不要早死.md](../01-不要早死.md). Khi có khác biệt, bản gốc tiếng Trung là chuẩn.
```

Dòng quay lại: `[← Về mục lục](../../README.vi.md)`.
