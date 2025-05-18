Dưới đây là lịch trình chi tiết để thực hiện dự án "Drug Use Prevention Support System" với 5 thành viên trong nhóm, chia theo giai đoạn, thời lượng, công việc, và phân công người phụ trách. Dự án được ước lượng thực hiện trong 6–8 tuần (có thể rút ngắn nếu dùng template/boilerplate sẵn).
🧭 TỔNG QUAN NHÓM (5 người)
Thành viênVai trò chính
A: Team Lead + Backend (Spring Boot) - Phạm Hà Võ
B: Backend (Spring Boot) + Database - Nguyễn Phạm Minh Nhiên
C: Frontend (ReactJS + TypeScript) - Su Đức Tiến
D: Frontend (ReactJS + TypeScript + UI/UX) - Ngô Công Thảo
E: QA + Tester + Viết tài liệu + hỗ trợ FE/BE + tìm data - Lê Văn Phong
📅 LỊCH TRÌNH DỰ ÁN THEO TUẦN
✅ Tuần 1: Phân tích yêu cầu & Thiết kế hệ thống
Mục tiêu: Hiểu bài toán, phân rã chức năng, thiết kế kiến trúc.
• Công việc:
◦ Họp nhóm, phân tích yêu cầu đề bài.
◦ Vẽ sơ đồ use-case, ERD (C, D, E).
◦ Phân quyền vai trò (A).
◦ Thiết kế kiến trúc tổng thể (RESTful API, role-based access, database).
◦ Chia module + Giao việc.
• Người phụ trách: A (lead), E (tài liệu), C+D (UI Mockup)
✅ Tuần 2: Setup môi trường + Thiết kế giao diện
Mục tiêu: Có bộ khung chạy được (backend + frontend)
• Công việc:
◦ Setup Spring Boot project + cấu trúc package (A, B).
◦ Setup ReactJS + TypeScript + Tailwind UI (C, D).
◦ Thiết kế mockup UI (Figma hoặc Canva) (D).
◦ Kết nối DB + Docker (nếu có).
• Người phụ trách:
◦ A + B: Backend structure
◦ C + D: Frontend setup
◦ E: Viết hướng dẫn môi trường
✅ Tuần 3: Xây API cho Auth, User, Course
Mục tiêu: Backend có thể đăng nhập, đăng ký, xem danh sách khóa học.
• Công việc:
◦ API đăng ký, đăng nhập, phân quyền (A).
◦ API xem/dăng ký khóa học (B).
◦ Giao diện login/register (C).
◦ Kết nối login từ FE -> BE (C + D).
• Người phụ trách:
◦ A: Auth
◦ B: Course
◦ C + D: Giao diện
◦ E: Test đăng nhập / đăng ký
✅ Tuần 4: Khảo sát đánh giá + Dashboard
Mục tiêu: Làm bài khảo sát, xử lý đánh giá nguy cơ
• Công việc:
◦ CRUD survey + submit + tính điểm (A, B).
◦ Dashboard hiển thị kết quả (C).
◦ Gợi ý hành động sau đánh giá (backend logic) (B).
• Người phụ trách:
◦ A + B: Survey API
◦ C: Dashboard FE
◦ E: Test khảo sát
✅ Tuần 5: Đặt lịch tư vấn + Quản lý chuyên viên
Mục tiêu: Người dùng đặt lịch, xem lịch chuyên viên
• Công việc:
◦ API chuyên viên + lịch làm việc (A).
◦ Đặt lịch hẹn, kiểm tra trùng lịch (B).
◦ UI đặt lịch + hiển thị lịch tư vấn (D).
• Người phụ trách:
◦ A + B: Appointment API
◦ D: UI lịch
◦ E: Test & bug report
✅ Tuần 6: Quản lý chương trình cộng đồng + Blog
Mục tiêu: Tạo/chỉnh/sửa chương trình & viết blog chia sẻ
• Công việc:
◦ CRUD chương trình + khảo sát trước/sau (A).
◦ Blog & bài viết (B).
◦ UI chương trình + blog (C + D).
• Người phụ trách:
◦ A + B: API
◦ C + D: Giao diện
◦ E: Test chương trình + viết nội dung mẫu
✅ Tuần 7: Dashboard Admin + Kiểm thử hệ thống
Mục tiêu: Xem thống kê, báo cáo; hoàn tất các chức năng chính
• Công việc:
◦ API thống kê số liệu (người học, khảo sát, lịch hẹn) (A, B).
◦ Giao diện dashboard admin (C, D).
◦ Viết test-case, kiểm thử tích hợp (E).
✅ Tuần 8: Viết tài liệu + Deploy + Demo
Mục tiêu: Deploy hệ thống + báo cáo nhóm
• Công việc:
◦ Viết tài liệu sử dụng (E).
◦ Hướng dẫn cài đặt (E).
◦ Deploy backend + frontend (A, C).
◦ Quay video demo (nhóm).

| Tuần | Task ID | Mô tả nhiệm vụ                                            | Ưu tiên | Người phụ trách | Trạng thái |
| ---- | ------- | --------------------------------------------------------- | ------- | --------------- | ---------- |
| 1    | T1      | Vẽ sơ đồ Use-case toàn hệ thống                           | Cao     | Thành viên 1    | xong       |
| 1    | T2      | Thiết kế kiến trúc tổng thể (API, RBAC, Database ERD)     | Cao     | Thành viên 2    | xong       |
| 1    | T3      | Tạo sơ đồ ERD Database cho hệ thống                       | Trung   | Thành viên 3    | xong       |
| 1    | T4      | Phân tích chức năng từng role (Guest, Member, ...)        | Trung   | Thành viên 4    | xong       |
| 2    | T5      | Thiết lập dự án Spring Boot (cấu trúc, auth, role)        | Cao     | Thành viên 1    | |
| 2    | T6      | Thiết lập dự án ReactJS + TypeScript + Tailwind           | Cao     | Thành viên 2    | |
| 2    | T7      | Thiết kế giao diện trang chủ và blog (Guest UI)           | Trung   | Thành viên 3    | |
| 2    | T8      | Thiết kế giao diện đăng ký khóa học                       | Trung   | Thành viên 4    | |
| 3    | T9      | Tạo API quản lý khóa học (GET, POST, PUT, DELETE)         | Cao     | Thành viên 1    | |
| 3    | T10     | Thiết kế UI khảo sát ASSIST / CRAFFT                      | Trung   | Thành viên 5    | |
| 3    | T11     | Tạo API xử lý khảo sát và đưa ra khuyến nghị              | Cao     | Thành viên 2    | |
| 4    | T12     | Tạo chức năng đặt lịch hẹn và quản lý lịch tư vấn         | Cao     | Thành viên 3    | |
| 4    | T13     | Tạo giao diện chương trình cộng đồng + khảo sát trước/sau | Trung   | Thành viên 4    | |
| 4    | T14     | Tạo Dashboard thống kê và báo cáo cho Manager/Admin       | Trung   | Thành viên 5    | |
| 5    | T15     | Tích hợp bảo mật (JWT, Spring Security)                   | Cao     | Thành viên 1    | |
| 5    | T16     | Kiểm thử chức năng + Viết test case                       | Cao     | Thành viên 2    | |
| 6    | T17     | Viết tài liệu hướng dẫn người dùng + hướng dẫn triển khai | Trung   | Thành viên 5    | |
| 6    | T18     | Tổng kiểm thử toàn hệ thống                               | Cao     | Cả nhóm         | |
| 6    | T19     | Deploy lên server thử nghiệm hoặc Vercel/Render           | Trung   | Thành viên 1    | |
