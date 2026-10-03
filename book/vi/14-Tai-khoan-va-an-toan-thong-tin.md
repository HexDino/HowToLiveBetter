> Bản dịch không chính thức của [book/14-账号与信息安全.md](../14-账号与信息安全.md). Khi có khác biệt, bản gốc tiếng Trung là chuẩn.

[← Về mục lục](../../README.vi.md)

# 14. Tài khoản và an toàn thông tin

Thước đo của chương này là tiền và thông tin cá nhân. Khi người khác đăng nhập được vào tài khoản của bạn, thứ mất trước là tiền. Người đó còn dùng tài khoản của bạn để lừa những người trong danh bạ. Thân phận của bạn cũng coi như đã bị người ta lấy.

### 1. Mở xác thực hai lớp (二次验证) cho tài khoản email, thanh toán và mạng xã hội: ưu tiên bấm xác nhận trên điện thoại, mã tin nhắn chỉ để sau
<!-- 成本标签: 钱=0 时间=少 毅力=否 收益=大 口径=金钱 -->
- Chi phí: Không tốn tiền. Mỗi tài khoản chỉ cần bật một lần, hai ba phút là xong
- Nói thật: Xác thực hai lớp: khi đăng nhập còn phải xác nhận là chính bạn. Bấm xác nhận trên điện thoại chặn hơn 9 phần trăm vụ cướp tài khoản, hỏi kiểu cũ chỉ chặn 1 phần trăm
- Lợi ích: Google thống kê 35 vạn lần tấn công cướp tài khoản thật (còn gọi là chiếm đoạt tài khoản). Một loại là xác minh bằng thiết bị, ví dụ hiện cửa sổ trên điện thoại để bạn bấm xác nhận, hoặc cắm một khóa bảo mật. Loại này chặn được 「hơn 94% vụ chiếm đoạt do lừa đảo và 100% vụ chiếm đoạt tự động」. Lừa đảo là dụ dỗ bạn nhập mật khẩu vào trang web giả. Tự động là máy lấy mật khẩu đã bị lộ để thử hàng loạt. Loại còn lại là xác minh bằng câu hỏi, ví dụ hỏi lần trước bạn đăng nhập ở đâu, email dự phòng là gì. Loại này 「chỉ chặn được ở mức thấp nhất là 10% vụ lừa đảo và 73% vụ tự động」
- Mức bằng chứng: A
- Nguồn: Doerfler P, Thomas K, Marincenko M, et al. (2019). Evaluating Login Challenges as a Defense Against Account Takeover. The World Wide Web Conference (WWW '19). <https://doi.org/10.1145/3308558.3313481>
- Ghi chú: Cùng nghiên cứu đó cũng thấy loại xác minh này đôi khi chặn luôn cả chủ tài khoản. 52% người dùng thật lần đầu không đăng nhập được, nhưng cuối cùng 97% vẫn vào được. Nên bật trước cho email, vì phần lớn tài khoản khác đều tìm lại được mật khẩu qua email

### 2. Mật khẩu email phải là một mật khẩu riêng, không dùng lại ở bất kỳ trang nào
<!-- 成本标签: 钱=0 时间=少 毅力=些 收益=大 口径=金钱 -->
- Chi phí: Không tốn tiền. Lưu vào trình quản lý mật khẩu thì không phải tự nhớ. Chỗ khó là bỏ thói quen dùng chung một mật khẩu khắp nơi
- Nói thật: Mật khẩu bị lộ ở trang khác sẽ được dùng luôn để đăng nhập vào email của bạn. Email mất rồi thì mọi tài khoản tìm lại mật khẩu qua email cũng mất theo
- Lợi ích: Lấy cặp tài khoản và mật khẩu bị lộ ở nơi khác rồi thử đăng nhập từng cái một, cách này gọi là tấn công dồn dập (撞库), là cách tấn công tiện tay nhất, và email của bạn cũng bị thử kiểu đó. Đăng nhập được vào email thì mọi tài khoản dùng nó tìm lại mật khẩu đều mất theo. Cơ quan An ninh mạng và An ninh hạ tầng của Mỹ (CISA) khuyến nghị: mỗi tài khoản một mật khẩu mạnh khác nhau, ít nhất 16 ký tự, giao cho trình quản lý mật khẩu lưu
- Mức bằng chứng: C
- Nguồn: US CISA. Use Strong Passwords. <https://www.cisa.gov/secure-our-world/use-strong-passwords>
- Ghi chú: Không nhớ được thì dùng trình quản lý mật khẩu có sẵn trong trình duyệt. Nó giữ mật khẩu từng trang giúp bạn, tốt hơn nhiều so với dùng chung một mật khẩu khắp nơi. Đừng lưu mật khẩu trong mục yêu thích của WeChat hay trong ứng dụng ghi chú

### 3. Đặt mật khẩu màn hình khóa cho điện thoại, đặt mã PIN cho thẻ SIM
<!-- 成本标签: 钱=0 时间=少 毅力=否 收益=大 口径=金钱 -->
- Chi phí: Không tốn tiền. Mật khẩu màn hình khóa và mã PIN, mỗi thứ chỉ cần đặt một lần
- Nói thật: SIM là thẻ nhỏ trong điện thoại, mã xác minh nhận được là nhờ nó. Điện thoại mất, người nhặt sẽ rút thẻ cắm sang máy khác để lấy mã xác minh rồi đặt lại tài khoản của bạn. Đặt mã PIN thì sang máy khác phải nhập mã đó mới bật nguồn
- Lợi ích: Điện thoại thất lạc, đường nhanh nhất của người nhặt được là cắm SIM sang máy khác để nhận mã xác minh qua tin nhắn. Có mã xác minh rồi thì họ đặt lại được từng tài khoản của bạn. SIM đã đặt mã PIN thì sang máy khác phải nhập mật khẩu mới bật nguồn được, người nhặt không lấy được mã xác minh từ đó
- Mức bằng chứng: C
- Nguồn: 作者经验，无直接文献
- Ghi chú: Đặt mã PIN ở mục 「khóa thẻ SIM」 (「SIM 卡锁」) trong phần cài đặt của điện thoại. Mã ban đầu khi xuất xưởng thường là 1234 hoặc 0000. Gõ sai ba lần liên tiếp thì phải có mã PUK do nhà mạng cấp mới mở được. Nên đặt xong thì ghi mã đó ra giấy trước đã

### 4. Điện thoại thất lạc thì làm theo thứ tự này: báo mất thẻ SIM, khóa từ xa, đổi mật khẩu, báo cảnh sát, khóa thẻ ngân hàng
<!-- 成本标签: 钱=0 时间=少 毅力=否 收益=大 口径=金钱 -->
- Chi phí: Không tốn tiền. Làm trọn bộ mất mười mấy phút
- Nói thật: Thứ tự quan trọng hơn tốc độ tay. Báo mất SIM trước, đường dẫn mã xác minh đứt ngang đó. Rồi khóa điện thoại từ xa, đổi mật khẩu email và thanh toán trên máy tính, báo cảnh sát lấy biên bản, cuối cùng khóa thẻ ngân hàng
- Lợi ích: Thứ tự quan trọng hơn tốc độ. Bước một: báo mất SIM, người khác không nhận được mã xác minh của bạn. Bước hai: khóa điện thoại từ xa và xóa sạch nội dung trong máy. Bước ba: đổi mật khẩu email và mật khẩu thanh toán từ máy tính. Bước bốn: báo cảnh sát và lấy biên bản. Cuối cùng khóa thẻ ngân hàng khi cần. Ủy ban Truyền thông Liên bang Mỹ (FCC) cũng nhắc: dù chỉ nghĩ là làm rơi thì vẫn nên khóa từ xa. Bị cướp thì báo cảnh sát ngay, nêu rõ model và số IMEI (mã định danh của điện thoại), và báo nhà mạng ngay
- Mức bằng chứng: C
- Nguồn: US FCC. Protect Your Smart Device. <https://www.fcc.gov/consumers/guides/protect-your-mobile-device>；步骤顺序是作者经验；补办身份证见第 7 节，冒名贷款见第 8 节关于征信的一条
- Ghi chú: Trước khi cần, ghi sẵn số tổng đài của ba nhà mạng ở Trung Quốc: 10086 của China Mobile, 10010 của China Unicom, 10000 của China Telecom. Ghi luôn số điện thoại của bạn đăng ký ở thành phố nào, tổng đài sẽ hỏi. Điện thoại không có trong túi thì gọi tổng đài bằng máy của người khác vẫn báo mất được

### 5. Thẻ bị quẹt tiền trái phép: báo khóa trước rồi báo cảnh sát, sau đó yêu cầu ngân hàng bồi thường. Chứng minh 「chính bạn đã quẹt」 là việc của ngân hàng
<!-- 成本标签: 钱=0 时间=少 毅力=些 收益=大 口径=金钱 -->
- Chi phí: Không tốn tiền. Thấy trên thẻ có động tĩnh bất thường thì báo mất hoặc khóa ngay. Giữ lại biên bản báo cảnh sát, biên bản báo khóa thẻ, và thông báo giao dịch ngân hàng gửi. Nếu thẻ vẫn còn trong tay thì ra gần đó kiểm tra số dư hoặc rút gửi một số tiền nhỏ, để có bản ghi chứng minh lúc xảy ra việc thật sự thẻ nằm trong tay bạn. Chỗ khó là nhịn được không tranh luận với nhân viên tổng đài trước, mà báo khóa trước đã
- Nói thật: Thẻ bị quẹt tiền trái phép, bạn không phải chứng minh 「đây không phải tôi quẹt」. Ngược lại, ngân hàng phải chứng minh là chính bạn quẹt, không chứng minh được thì phải bồi thường. Điều kiện là báo khóa ngay, kéo dài thì thiệt hại phát sinh thêm bạn tự chịu
- Lợi ích: Quy định của Tòa án Tối cao nhân dân Trung Quốc tách rõ 「ai phải đưa ra chứng cứ」. Bạn nói đây là quẹt tiền bằng thẻ giả hoặc quẹt tiền qua mạng thì phải tự đưa ra chứng cứ trước. Quẹt bằng thẻ giả nghĩa là người ta sao chép thẻ của bạn rồi đi quẹt. Những thứ có thể dùng để chứng minh gồm: văn bản tư pháp đã có hiệu lực, lúc giao dịch thẻ thật nằm ở đâu, giao dịch xảy ra ở đâu. Còn sao kê giao dịch tài khoản, thông báo giao dịch, biên bản báo cảnh sát, biên bản báo khóa thẻ... **Ngược lại, ngân hàng phát hành hoặc tổ chức thanh toán phi ngân hàng (thanh toán bên thứ ba) nói khoản đó do chủ thẻ tự quẹt hoặc được chủ thẻ ủy quyền quẹt thì phải do chính họ đưa ra chứng cứ**. Sau khi bạn báo cho ngân hàng, nếu ngân hàng không kiểm tra kịp, hoặc không cấp và lưu kịp chứng từ giao dịch cùng video giám sát, nên không thu được chứng cứ thì hậu quả do ngân hàng chịu. Khi được xác nhận: chủ thẻ tín dụng (thẻ tiết kiệm) có quyền yêu cầu ngân hàng phát hành trả lại khoản tiền gửi bị quẹt trái phép cộng lãi, đồng thời đền bù thiệt hại. Chủ thẻ tín dụng (thẻ tín dụng) có quyền yêu cầu hoàn trả khoản tiêu đã bị trừ cộng lãi và phí phạt, đồng thời đền bù thiệt hại; nếu ngân hàng đòi bạn trả lại khoản tiêu đó thì tòa không ủng hộ. Bạn còn có quyền yêu cầu ngân hàng phát hành xóa kịp thời bản ghi lịch sử tín dụng xấu tương ứng (toàn quốc, có hiệu lực từ ngày 25 tháng 5 năm 2021)
- Mức bằng chứng: A
- Nguồn: 最高人民法院 (2021). 关于审理银行卡民事纠纷案件若干问题的规定（第四、五、七、十四、十五条）. <https://www.court.gov.cn/fabu/xiangqing/304771.html>
- Ghi chú: Có hai trường hợp bạn phải tự chịu. Một là thẻ ngân hàng, mật khẩu, mã xác minh bạn không giữ gìn, tức là bản thân bạn đã sai (nguyên văn là 「chưa thực hiện đầy đủ nghĩa vụ giữ gìn nên có lỗi」), sai đến đâu chịu đến đó. Nên không nói mật khẩu cho người khác, không chuyển tiếp mã xác minh cho người khác (xem mục 1, xác thực hai lớp nên ưu tiên bấm xác nhận trên điện thoại). Hai là không báo khóa kịp, để thiệt hại tiếp tục nới ra, phần phát sinh thêm thì tự chịu. Nên bước đầu luôn là báo khóa, đừng gọi tổng đài tranh luận trước. Quy tắc này cũng áp dụng cho tổ chức thanh toán bên thứ ba. Trong tài liệu quảng bá của họ có ghi 「hoàn trả trước」, cam kết đó mà cụ thể rõ ràng thì bạn có thể yêu cầu họ hoàn trả trước. Còn nếu tiền do chính bạn bị lừa rồi tự chuyển đi thì phải làm theo cách khác, xem chương 8, mục 2 (phát hiện bị lừa thì gọi ngay 110, cảnh sát, hoặc 96110, đường dây nóng chống lừa đảo, để yêu cầu dừng thanh toán)

### 6. Cứ khoảng thời gian lại xem thiết bị đã đăng nhập và ứng dụng đã cấp quyền của tài khoản, cái nào không dùng thì xóa luôn
<!-- 成本标签: 钱=0 时间=少 毅力=些 收益=中 口径=金钱 -->
- Chi phí: Không tốn tiền. Mỗi lần xem mất vài phút. Chỗ khó là không có ai nhắc, phải tự nhớ mà xem
- Nói thật: 「Thiết bị đã đăng nhập」 là những điện thoại, máy tính hiện còn dùng được tài khoản của bạn. Kẻ cướp tài khoản thường nằm im một thời gian rồi mới ra tay. Thấy thiết bị lạ thì đăng xuất toàn bộ rồi đổi mật khẩu
- Lợi ích: Kẻ cướp tài khoản thường không ra tay ngay từ đầu, họ nằm im một thời gian đã. Danh sách thiết bị đã đăng nhập trong tài khoản ghi lại những chiếc điện thoại và máy tính hiện còn dùng được tài khoản đó. Danh sách ứng dụng đã cấp quyền ghi lại những phần mềm khác mà bạn đã cho phép dùng tài khoản này để đăng nhập. Thiết bị lạ trong danh sách, và phần mềm bên thứ ba đã lâu không dùng, là những dấu vết dễ phát hiện nhất
- Mức bằng chứng: C
- Nguồn: 作者经验，无直接文献
- Ghi chú: WeChat, Alipay, email, tài khoản Apple và tài khoản Android đều có mục này. Thấy thiết bị không nhận ra thì bấm đăng xuất toàn bộ rồi đổi mật khẩu

### 7. Đừng bấm 「đồng ý tất cả」 chỉ vì muốn dùng App: với thông tin không phải thứ bắt buộc, bên kia không được vì bạn không đồng ý mà từ chối dịch vụ
<!-- 成本标签: 钱=0 时间=少 毅力=些 收益=中 口径=自由 -->
- Chi phí: Không tốn tiền. Chỗ khó là nhịn không bấm 「đồng ý tất cả」
- Nói thật: App xin thông tin của bạn. Nếu không phải thứ bắt buộc cho dịch vụ mà bạn không đồng ý, nó không được không cho bạn dùng. Nó chỉ được lấy ở mức cần thiết. Bản đồ cần vị trí, đèn pin không cần danh bạ
- Lợi ích: Luật của Trung Quốc viết thẳng hai điều. Một là không được vì người dùng không đồng ý, hoặc đã rút lại sự đồng ý, mà từ chối cung cấp sản phẩm hoặc dịch vụ; trừ khi xử lý những thông tin đó là điều kiện bắt buộc để cung cấp dịch vụ. Hai là việc thu thập phải giới hạn ở phạm vi tối thiểu cần thiết để đạt mục đích xử lý, chỉ được lấy những thứ dùng đến
- Mức bằng chứng: A
- Nguồn: 全国人大常委会 (2021). 个人信息保护法. 中国人大网. <http://www.npc.gov.cn/npc/c2/c30834/202108/t20210820_313088.html>：第六条「收集个人信息，应当限于实现处理目的的最小范围，不得过度收集个人信息」；第十六条「个人信息处理者不得以个人不同意处理其个人信息或者撤回同意为由，拒绝提供产品或者服务；处理个人信息属于提供产品或者服务所必需的除外」；第十五条「基于个人同意处理个人信息的，个人有权撤回其同意。个人信息处理者应当提供便捷的撤回同意的方式」
- Ghi chú: Tiêu chuẩn để xem là thông tin đó có phải thứ bắt buộc để cung cấp dịch vụ này không. Bản đồ cần vị trí là bắt buộc, đèn pin không cần danh bạ. Xong cài App, vào trước trang cấp quyền ứng dụng trong phần cài đặt điện thoại và tắt những quyền không cần. Khi nào thật sự dùng đến thì chọn chỉ cho phép một lần đó

### 8. Bạn có quyền xem, sao chép, sửa và xóa thông tin cá nhân của mình, bị từ chối thì có thể kiện
<!-- 成本标签: 钱=0 时间=少 毅力=些 收益=中 口径=自由 -->
- Chi phí: Không tốn tiền. Chỉ khi bên kia cố tình kéo dài mới phải khiếu nại hoặc kiện. Nếu thật sự ra tòa thì tính từ vài tháng trở lên, còn phí luật sư phải tự bỏ ra, nên khiếu nại trước sẽ lợi hơn. Chỗ khó là phải nhắc nhiều lần khi bên kia cứ trì hoãn
- Nói thật: Bạn có quyền yêu cầu doanh nghiệp cho xem, sao chép, sửa và xóa thông tin của mình. Dịch vụ dừng, thời hạn lưu hết, hay bạn rút lại đồng ý, doanh nghiệp vốn phải tự xóa. Nó từ chối thì phải nói lý do, không làm thì ra tòa kiện được
- Lợi ích: Có vài trường hợp doanh nghiệp phải tự xóa: dịch vụ đã dừng, thời hạn lưu đã thỏa thuận hết hạn, bạn rút lại sự đồng ý, mục đích thu thập lúc đầu đã đạt... Nó không xóa thì bạn có thể yêu cầu xóa. Nếu nó từ chối để bạn thực hiện những quyền này thì phải nói rõ lý do. Bạn có thể trực tiếp kiện ra tòa
- Mức bằng chứng: A
- Nguồn: 全国人大常委会 (2021). 个人信息保护法. 中国人大网. <http://www.npc.gov.cn/npc/c2/c30834/202108/t20210820_313088.html>：第四十五条「个人有权向个人信息处理者查阅、复制其个人信息……个人请求查阅、复制其个人信息的，个人信息处理者应当及时提供」；第四十六条更正、补充权；第四十七条列了五种应当主动删除的情形，含「（一）处理目的已实现、无法实现或者为实现处理目的不再必要」「（二）个人信息处理者停止提供产品或者服务，或者保存期限已届满」「（三）个人撤回同意」，「个人信息处理者未删除的，个人有权请求删除」；第五十条「个人信息处理者应当建立便捷的个人行使权利的申请受理和处理机制。拒绝个人行使权利的请求的，应当说明理由」「个人可以依法向人民法院提起诉讼」
- Ghi chú: Hủy tài khoản và xóa thông tin cá nhân là hai việc khác nhau, hủy tài khoản xong vẫn phải yêu cầu xóa riêng. Trước khi đổi điện thoại hoặc bán máy cũ, hãy đăng xuất mọi tài khoản trên máy cũ và hủy liên kết, rồi mới khôi phục cài đặt gốc. Luật cho bạn quyền xóa sau sự việc, nó không lấy lại được thứ đã lộ ra ngoài

### 9. Quét mặt không phải chuyện bắt buộc phải đồng ý: đã có cách khác thì không được chỉ bắt bạn quét mặt, bạn không đồng ý thì phải đưa cách khác cho bạn
<!-- 成本标签: 钱=0 时间=少 毅力=些 收益=中 口径=金钱 -->
- Chi phí: Không tốn tiền. Khi bị yêu cầu quét mặt, hãy hỏi một câu 「còn cách xác minh nào khác không」. Nếu bên kia bảo không có, hãy yêu cầu bên kia đưa ra một cách. Chỗ khó là phải hỏi thẳng trước mặt
- Nói thật: Còn cách khác làm được cùng việc đó thì không được chỉ bắt bạn quét mặt. Bạn không đồng ý thì phải đưa cho bạn cách khác như quẹt thẻ, mật khẩu hay căn cước công dân. Ở nhà tắm, phòng thay đồ, nhà vệ sinh, không ai được lắp thiết bị nhận dạng khuôn mặt
- Lợi ích: Quy chế An toàn ứng dụng công nghệ nhận dạng khuôn mặt của Trung Quốc ghi: 「Khi đã có cách kỹ thuật khác không phải nhận dạng khuôn mặt để đạt cùng mục đích hoặc đáp ứng yêu cầu nghiệp vụ tương đương thì không được dùng nhận dạng khuôn mặt làm cách xác minh duy nhất. Người cá nhân không đồng ý xác minh danh tính bằng thông tin khuôn mặt thì phải cung cấp cách khác hợp lý, tiện lợi」. Quy chế còn ghi: 「Không tổ chức hay cá nhân nào được lấy lý do thủ tục nghiệp vụ hay nâng cao chất lượng dịch vụ để mê hoặc, lừa dối, ép buộc người ta chấp nhận xác minh danh tính bằng công nghệ nhận dạng khuôn mặt」. Nếu xử lý thông tin khuôn mặt dựa trên sự đồng ý thì phải có 「sự đồng ý riêng, tự nguyện, rõ ràng mà người đó đưa ra khi đã hiểu đầy đủ」: hỏi riêng về đúng việc này và bạn gật đầu riêng thì mới tính. Bạn có quyền rút lại sự đồng ý, bên xử lý phải có cách rút lại tiện lợi. Xử lý thông tin khuôn mặt của người chưa đủ 14 tuổi phải có sự đồng ý của cha mẹ hoặc người giám hộ. Lắp thiết bị nhận dạng khuôn mặt ở nơi công cộng thì 「phải là việc cần thiết để bảo đảm an toàn công cộng」, đồng thời phải đặt biển báo hiển thị rõ. Trong khu vực riêng tư của những nơi công cộng như phòng khách sạn, nhà tắm công cộng, phòng thay đồ công cộng, nhà vệ sinh công cộng, không tổ chức hay cá nhân nào được lắp. Thông tin khuôn mặt phải được lưu trong thiết bị nhận dạng khuôn mặt, không được truyền ra ngoài qua internet. Có hai ngoại lệ: pháp luật và quy chế hành chính có quy định khác, hoặc đã có sự đồng ý riêng (toàn quốc Trung Quốc, có hiệu lực từ ngày 1 tháng 6 năm 2025)
- Mức bằng chứng: A
- Nguồn: 国家互联网信息办公室、公安部 (2025). 人脸识别技术应用安全管理办法（第 19 号令，第十条、十二条、十三条，2025 年 6 月 1 日起施行）. <https://www.cac.gov.cn/2025-03/21/c_1744174262156096.htm>
- Ghi chú: Hay gặp nhất là cổng vào khu chung cư, nền tảng cho thuê nhà, phòng tập thể hình, khách sạn đòi bạn đăng ký khuôn mặt. Khi bên kia bảo 「hệ thống chỉ hỗ trợ quét mặt」, hãy đọc nguyên văn điều khoản cho họ nghe. Nguyên văn là: 「Khi đã có cách kỹ thuật khác không phải nhận dạng khuôn mặt để đạt cùng mục đích hoặc đáp ứng yêu cầu nghiệp vụ tương đương thì không được dùng nhận dạng khuôn mặt làm cách xác minh duy nhất」. Sau đó yêu cầu bên kia đưa cách khác như quẹt thẻ, mật khẩu hay căn cước công dân. Vẫn không đưa thì báo với cơ quan quản lý mạng thông tin địa phương. Với những trường hợp nhà nước có quy định riêng về xác minh danh tính bằng quét mặt, ví dụ một số nghiệp vụ tài chính và hành chính công, thì làm theo các quy định đó. Khác biệt lớn nhất giữa khuôn mặt và mật khẩu là khuôn mặt bị lộ rồi không đổi lại được, nên nó đáng cẩn thận hơn mật khẩu. Đơn vị nào lưu hơn 10 vạn khuôn mặt thì phải đăng ký với cơ quan quản lý mạng thông tin từ cấp tỉnh trở lên trong 30 ngày làm việc, đây cũng là một cách hỏi xem bên kia có đàng hoàng không. Quyền xem, sửa và xóa thông tin cá nhân của mình xem mục 8