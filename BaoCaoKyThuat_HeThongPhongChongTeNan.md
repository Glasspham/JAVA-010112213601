# BÁO CÁO ĐẶC TẢ KỸ THUẬT HỆ THỐNG
## HỆ THỐNG HỖ TRỢ PHÒNG CHỐNG TỆ NẠN XÃ HỘI (PREVENTION SYSTEM)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1 Giới thiệu
Hệ thống hỗ trợ phòng chống tệ nạn xã hội là một ứng dụng web được phát triển để hỗ trợ việc tuyên truyền, giáo dục và tư vấn về phòng chống các tệ nạn xã hội như ma túy, nghiện game, bạo lực học đường, v.v. Hệ thống cung cấp các công cụ đánh giá nguy cơ, khóa học giáo dục, tư vấn trực tuyến và quản lý chương trình cộng đồng.

### 1.2 Mục tiêu
- Cung cấp nền tảng tuyên truyền, giáo dục về phòng chống tệ nạn xã hội
- Hỗ trợ đánh giá mức độ nguy cơ của cá nhân
- Kết nối người dùng với các chuyên gia tư vấn
- Quản lý và tổ chức các chương trình cộng đồng
- Cung cấp công cụ thống kê và báo cáo cho cơ quan quản lý

### 1.3 Phạm vi ứng dụng
- Đối tượng: Học sinh, sinh viên, phụ huynh, giáo viên, cộng đồng
- Phạm vi: Toàn quốc
- Môi trường: Web-based application

---

## 2. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 2.1 Các vai trò người dùng

#### 2.1.1 Người dùng khách (Guest)
- **Chức năng:**
  - Xem thông tin khóa học công khai
  - Xem thông tin chương trình cộng đồng
  - Đăng ký tài khoản mới
  - Truy cập trang chủ và thông tin giới thiệu

#### 2.1.2 Người dùng thành viên (USER)
- **Chức năng:**
  - Tất cả chức năng của Guest
  - Tham gia các khóa học
  - Thực hiện đánh giá nguy cơ (ASSIST, CRAFFT, Custom)
  - Đặt lịch tư vấn với chuyên gia
  - Tham gia chương trình cộng đồng
  - Quản lý thông tin cá nhân

#### 2.1.3 Chuyên viên tư vấn (SPECIALIST)
- **Chức năng:**
  - Tất cả chức năng của USER
  - Quản lý lịch tư vấn cá nhân
  - Tư vấn trực tuyến cho người dùng
  - Xem thống kê khách hàng của mình
  - Cập nhật thông tin chuyên môn

#### 2.1.4 Quản trị viên (ADMIN)
- **Chức năng:**
  - Quản lý tất cả người dùng trong hệ thống
  - Quản lý khóa học và nội dung giáo dục
  - Quản lý khảo sát và đánh giá nguy cơ
  - Quản lý lịch hẹn tư vấn
  - Quản lý chương trình cộng đồng
  - Quản lý danh sách chuyên viên
  - Xem báo cáo và thống kê tổng thể
  - Cài đặt hệ thống

### 2.2 Các module chính

#### 2.2.1 Module Quản lý người dùng
- **Chức năng:**
  - Đăng ký, đăng nhập, đăng xuất
  - Phân quyền theo vai trò (USER, SPECIALIST, ADMIN)
  - Quản lý thông tin hồ sơ cá nhân
  - Xác thực JWT Token
  - Upload avatar người dùng

#### 2.2.2 Module Khóa học giáo dục
- **Đối tượng khóa học:**
  - `student`: Học sinh
  - `parent`: Phụ huynh  
  - `teacher`: Giáo viên
  - `general`: Cộng đồng chung
- **Chức năng:**
  - Tạo, chỉnh sửa, xóa khóa học
  - Phân loại theo đối tượng
  - Quản lý nội dung bài học
  - Theo dõi tiến độ học tập

#### 2.2.3 Module Đánh giá nguy cơ
- **Loại khảo sát:**
  - `ASSIST`: Đánh giá nguy cơ sử dụng chất kích thích
  - `CRAFFT`: Đánh giá nguy cơ cho thanh thiếu niên
  - `CUSTOM`: Khảo sát tùy chỉnh
- **Mức độ nguy cơ:**
  - `low`: Thấp
  - `moderate`: Trung bình
  - `high`: Cao
- **Chức năng:**
  - Tạo và quản lý các bộ câu hỏi
  - Thực hiện khảo sát trực tuyến
  - Tính toán và phân tích kết quả
  - Đưa ra khuyến nghị phù hợp

#### 2.2.4 Module Tư vấn trực tuyến
- **Trạng thái lịch hẹn:**
  - `pending`: Chờ xác nhận
  - `confirmed`: Đã xác nhận
  - `completed`: Đã hoàn thành
  - `cancelled`: Đã hủy
  - `scheduled`: Đã lên lịch
  - `rescheduled`: Đã dời lịch
- **Chức năng:**
  - Đặt lịch tư vấn với chuyên gia
  - Quản lý lịch làm việc của chuyên viên
  - Theo dõi trạng thái cuộc hẹn
  - Đánh giá chất lượng tư vấn

#### 2.2.5 Module Chuyên viên tư vấn
- **Chuyên ngành:**
  - `addiction`: Tư vấn nghiện
  - `youth`: Tư vấn thanh thiếu niên
  - `family`: Tư vấn gia đình
  - `education`: Tư vấn giáo dục
  - `mental_health`: Tư vấn sức khỏe tâm thần
- **Chức năng:**
  - Quản lý hồ sơ chuyên viên
  - Phân loại theo chuyên ngành
  - Đánh giá năng lực và kinh nghiệm
  - Theo dõi số lượng khách hàng

#### 2.2.6 Module Chương trình cộng đồng
- **Trạng thái chương trình:**
  - `upcoming`: Sắp diễn ra
  - `ongoing`: Đang diễn ra
  - `completed`: Đã hoàn thành
  - `cancelled`: Đã hủy
- **Chức năng:**
  - Tạo và quản lý sự kiện cộng đồng
  - Đăng ký tham gia chương trình
  - Theo dõi số lượng người tham gia
  - Đánh giá hiệu quả chương trình

#### 2.2.7 Module Dashboard và báo cáo
- **Chức năng:**
  - Thống kê tổng quan hệ thống
  - Báo cáo theo thời gian
  - Phân tích xu hướng và dữ liệu
  - Xuất báo cáo định kỳ
  - Biểu đồ trực quan với Recharts

---

## 3. THIẾT KẾ GIAO DIỆN

### 3.1 Layout chính
- **ClientLayout**: Giao diện cho người dùng thường
- **AdminLayout**: Giao diện quản trị
- **MainLayout**: Layout tổng quát

### 3.2 Màn hình chính
- Trang chủ (Homepage)
- Danh sách khóa học
- Trang đánh giá nguy cơ
- Đặt lịch tư vấn
- Chương trình cộng đồng
- Dashboard quản trị

### 3.3 Thiết kế responsive
- Hỗ trợ thiết bị di động và máy tính bảng
- Menu navigation adaptive
- Grid system linh hoạt

---

## 4. CÔNG NGHỆ SỬ DỤNG

### 4.1 Frontend Technologies
- **React 19.1.0**: Framework JavaScript chính
- **TypeScript**: Ngôn ngữ lập trình type-safe
- **Material-UI (MUI)**: UI component library
- **React Router DOM**: Điều hướng ứng dụng
- **Recharts**: Thư viện biểu đồ và visualization
- **React Toastify**: Thông báo người dùng
- **Axios**: HTTP client cho API requests
- **JWT Decode**: Xử lý JSON Web Token
- **Date-fns**: Thư viện xử lý ngày tháng
- **SweetAlert2**: Modal dialog đẹp

### 4.2 Development Tools
- **Vite**: Build tool và development server
- **ESLint**: Code linting
- **TypeScript Compiler**: Kiểm tra type

### 4.3 State Management
- **React Context API**: Quản lý state toàn cục (AuthContext)
- **Local State**: useState và useEffect hooks

---

## 5. KIẾN TRÚC HỆ THỐNG

### 5.1 Kiến trúc tổng thể
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React App)   │◄──►│   (REST API)    │◄──►│   (PostgreSQL   │
│                 │    │                 │    │   /MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 5.2 Cấu trúc thư mục dự án
```
src/
├── components/          # UI Components
│   └── layout/         # Layout components
├── pages/              # Trang ứng dụng
│   ├── admin/         # Trang quản trị
│   ├── auth/          # Xác thực
│   ├── courses/       # Khóa học
│   ├── consultants/   # Chuyên viên
│   ├── programs/      # Chương trình
│   ├── surveys/       # Khảo sát
│   └── dashboard/     # Dashboard
├── types/              # TypeScript type definitions
├── services/           # API services
├── contexts/           # React contexts
├── utils/             # Utility functions
├── dto/               # Data Transfer Objects
└── App.tsx            # Main application
```

### 5.3 Luồng dữ liệu
1. **Authentication Flow**: Login → JWT Token → Local Storage → Auth Context
2. **API Communication**: Service Layer → Axios → REST API → Database
3. **State Management**: Local State ↔ Context API ↔ Components

---

## 6. CƠ SỞ DỮ LIỆU

### 6.1 Các entity chính

#### Users Table
- id: Primary Key
- email: Email đăng nhập
- username: Tên đăng nhập  
- fullname: Họ tên đầy đủ
- role: Vai trò (USER, SPECIALIST, ADMIN)
- avatar: Ảnh đại diện
- phone: Số điện thoại
- position: Chức vụ
- createDate: Ngày tạo

#### Courses Table
- id: Primary Key
- title: Tiêu đề khóa học
- description: Mô tả
- audienceType: Đối tượng (student, parent, teacher, general)
- duration: Thời lượng
- difficulty: Độ khó
- imageUrl: Hình ảnh

#### Surveys Table
- id: Primary Key
- title: Tiêu đề khảo sát
- type: Loại (ASSIST, CRAFFT, CUSTOM)
- description: Mô tả
- questions: Danh sách câu hỏi
- riskLevel: Mức độ nguy cơ kết quả

#### Appointments Table
- id: Primary Key
- userId: Người đặt lịch
- consultantId: Chuyên viên tư vấn
- scheduledDate: Ngày hẹn
- status: Trạng thái
- notes: Ghi chú

#### Programs Table
- id: Primary Key
- title: Tên chương trình
- description: Mô tả
- startDate: Ngày bắt đầu
- endDate: Ngày kết thúc
- status: Trạng thái
- maxParticipants: Số người tối đa

#### Consultants Table
- id: Primary Key
- name: Họ tên
- specialty: Chuyên ngành
- experience: Kinh nghiệm
- rating: Đánh giá
- bio: Tiểu sử

---

## 7. TÍNH NĂNG BẢO MẬT

### 7.1 Xác thực và phân quyền
- **JWT Authentication**: Token-based authentication
- **Role-based Access Control**: Phân quyền theo vai trò
- **Protected Routes**: Bảo vệ các route admin
- **Session Management**: Quản lý phiên đăng nhập

### 7.2 Bảo mật dữ liệu
- **Input Validation**: Kiểm tra dữ liệu đầu vào
- **HTTPS**: Mã hóa truyền tải
- **Local Storage Security**: Lưu trữ token an toàn
- **API Security**: Bảo vệ các endpoint API

---

## 8. HIỆU NĂNG VÀ TỐI ƯU HÓA

### 8.1 Frontend Optimization
- **Code Splitting**: Chia nhỏ bundle JavaScript
- **Lazy Loading**: Tải component theo yêu cầu
- **Memoization**: Tối ưu re-rendering
- **Image Optimization**: Tối ưu hình ảnh

### 8.2 User Experience
- **Responsive Design**: Thích ứng mọi thiết bị
- **Loading States**: Hiển thị trạng thái loading
- **Error Handling**: Xử lý lỗi graceful
- **Notification System**: Thông báo người dùng

---

## 9. TESTING VÀ QUALITY ASSURANCE

### 9.1 Testing Strategy
- **Unit Testing**: Test từng component
- **Integration Testing**: Test tích hợp
- **E2E Testing**: Test end-to-end
- **Manual Testing**: Test thủ công

### 9.2 Code Quality
- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Code Review**: Review code process
- **Documentation**: Tài liệu đầy đủ

---

## 10. DEPLOYMENT VÀ DEVOPS

### 10.1 Build Process
- **Vite Build**: Build production optimized
- **Environment Variables**: Quản lý môi trường
- **Asset Optimization**: Tối ưu tài nguyên

### 10.2 Deployment Options
- **Static Hosting**: Netlify, Vercel
- **CDN**: Content Delivery Network
- **Docker**: Container deployment
- **CI/CD**: Continuous Integration/Deployment

---

## 11. MAINTAINABILITY VÀ SCALABILITY

### 11.1 Code Organization
- **Modular Architecture**: Kiến trúc module
- **Component Reusability**: Tái sử dụng component
- **Service Layer**: Tách biệt logic business
- **Type Definitions**: Định nghĩa type rõ ràng

### 11.2 Future Enhancements
- **Mobile App**: Ứng dụng di động
- **Real-time Features**: Tính năng thời gian thực
- **AI Integration**: Tích hợp AI/ML
- **Multi-language**: Đa ngôn ngữ

---

## 12. KẾT LUẬN

Hệ thống hỗ trợ phòng chống tệ nạn xã hội được xây dựng với kiến trúc hiện đại, sử dụng các công nghệ tiên tiến như React 19, TypeScript và Material-UI. Hệ thống cung cấp đầy đủ các tính năng cần thiết để hỗ trợ công tác tuyên truyền, giáo dục và tư vấn phòng chống tệ nạn xã hội.

### 12.1 Điểm mạnh
- Giao diện thân thiện, responsive
- Kiến trúc modular, dễ bảo trì
- Bảo mật tốt với JWT authentication
- Có đầy đủ các vai trò và phân quyền
- Hỗ trợ đa dạng loại đánh giá nguy cơ
- Dashboard thống kê trực quan

### 12.2 Khuyến nghị phát triển
- Tích hợp thêm các phương thức xác thực (2FA)
- Phát triển ứng dụng mobile companion
- Thêm tính năng chat realtime
- Tích hợp AI để phân tích và khuyến nghị thông minh
- Mở rộng hỗ trợ đa ngôn ngữ

---


