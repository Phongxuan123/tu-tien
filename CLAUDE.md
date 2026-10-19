# Quy ước làm việc với repo

## Quy trình push code

Mỗi lần push code lên GitHub, thực hiện theo thứ tự:

1. `git fetch origin main`, rồi merge `origin/main` vào nhánh đang làm (dùng merge, không rebase) và xử lý xung đột nếu có.
2. Push nhánh lên GitHub (`git push -u origin <tên-nhánh>`).
3. Đồng bộ với local: fetch lại nhánh vừa push và đảm bảo bản local trùng bản trên GitHub (`git status` không báo ahead/behind).

## Quy ước phiên làm việc (tiết kiệm token, tránh xung đột)

1. **Mỗi phiên một đợt hoặc một chặng** (xem `ke-hoach/Z-lo-trinh-trien-khai.md`). Làm trọn rồi dừng; cuối phiên ghi mục "Đã làm" vào file kế hoạch tương ứng để phiên sau chỉ cần đọc phần đó.
2. **Chạy lần lượt, không chạy hai phiên song song trên cùng một nhánh.** Trước khi push, ngoài `origin/main` còn phải `git fetch origin <nhánh đang làm>` và merge nếu nhánh đã có commit mới (phiên khác có thể đã đẩy). Xung đột ở `tools/baseline/seeds.json`: giải quyết rồi chạy lại `node tools/baseline.js --save`.
3. **Đọc có chọn lọc.** Không đọc nguyên file kế hoạch lớn (`Q-cot-truyen.md` hơn 1.600 dòng, `S-quoc-gia-tong-mon-ton-giao.md`, `E-kinh-te.md`): dùng `grep -n "^#"` lấy mục lục rồi đọc đúng mục cần, hoặc đọc theo `offset`/`limit`.
4. **Kiểm thử và đo:** `node tools/run-tests.js [từ khóa]` (đầy đủ khoảng 2 phút), `node tools/baseline.js [--seeds=101,...,140] [--check|--save]`. Chặng không đổi cân bằng phải trùng khít `tools/baseline/seeds.json`; chặng có chủ ý đổi thì đo 40 hạt giống trước và sau, ghi số vào mục "Đã làm". Chỉ tiêu: khoảng 52 chiến tranh và 10 diệt vong mỗi 300 năm (±25%).
5. **Hàm đọc không gọi `rng` và không khởi tạo dữ liệu** (xem S mục 15.2); trường mới khởi tạo muộn, không đổi `TT.VERSION`. Hệ nào có công tắc tắt (như `D.NATION.on`) thì phải chứng minh bằng `--check` rằng tắt thì trùng khít đường cơ sở cũ.
6. **Chọn model theo việc:** cơ chế mô phỏng, cân bằng, giao diện phức tạp dùng Sonnet; viết dữ liệu, chữ truyện, bài kiểm thử theo mẫu, tài liệu dùng Haiku.
7. **Chữ trong game:** tiếng Việt, tên nước thật không xuất hiện (chỉ tên tôn giáo thật được dùng, viết tôn trọng, xem S mục 3); tên tông, hội, gia tộc, cơ quan dùng tên cổ trang.
8. **Báo cáo cuối phiên ngắn gọn:** đã làm gì, số kiểm thử, số đo cân bằng, việc cần người chơi thử, điều gì chưa làm.
