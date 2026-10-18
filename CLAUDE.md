# Quy ước làm việc với repo

## Quy trình push code

Mỗi lần push code lên GitHub, thực hiện theo thứ tự:

1. `git fetch origin main`, rồi merge `origin/main` vào nhánh đang làm (dùng merge, không rebase) và xử lý xung đột nếu có.
2. Push nhánh lên GitHub (`git push -u origin <tên-nhánh>`).
3. Đồng bộ với local: fetch lại nhánh vừa push và đảm bảo bản local trùng bản trên GitHub (`git status` không báo ahead/behind).
