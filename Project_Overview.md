# Drug Use Prevention Support System

## 📋 Tổng quan dự án

**Tên dự án**: Hệ thống hỗ trợ phòng ngừa sử dụng ma túy  
**Loại dự án**: Ứng dụng web fullstack  
**Kiến trúc**: Client-Server (Frontend React + Backend Spring Boot)  
**Database**: MySQL  
**Containerization**: Docker  

## 🎯 Mục tiêu và chức năng hệ thống

### Đối tượng người dùng:
- **Guest**: Khách vãng lai
- **Member**: Thành viên đã đăng ký
- **Staff**: Nhân viên
- **Consultant**: Chuyên viên tư vấn
- **Manager**: Quản lý
- **Admin**: Quản trị viên

### Chức năng chính:
1. **Trang chủ thông tin**: Giới thiệu tổ chức, blog chia sẻ kinh nghiệm
2. **Quản lý khóa học**: Tìm kiếm và đăng ký khóa đào tạo online về ma túy
3. **Hệ thống khảo sát**: Thực hiện bài khảo sát ASSIST, CRAFFT để đánh giá nguy cơ
4. **Đặt lịch tư vấn**: Đặt lịch hẹn trực tuyến với chuyên viên
5. **Quản lý chương trình**: Quản lý các chương trình truyền thông và giáo dục
6. **Quản lý chuyên viên**: Thông tin, bằng cấp, chuyên môn, lịch làm việc
7. **Quản lý hồ sơ**: Lịch sử đặt lịch, tham gia chương trình
8. **Dashboard & Report**: Báo cáo và thống kê

## 🏗️ Kiến trúc hệ thống

### Frontend (React + TypeScript)
**Vị trí**: `FrontEnd/`

#### 🔧 Công nghệ & Thư viện chính:
- **React 19.1.0**: Framework UI chính
- **TypeScript 4.9.5**: Ngôn ngữ lập trình
- **Material-UI (MUI) 7.1.0**: Thư viện UI components
- **React Router DOM 7.6.0**: Routing và navigation
- **Axios 1.9.0**: HTTP client để gọi API
- **React Toastify 11.0.5**: Hiển thị thông báo
- **SweetAlert2 11.22.0**: Modal và alert đẹp
- **Recharts 2.15.3**: Thư viện biểu đồ
- **JWT Decode 4.0.0**: Giải mã JWT token
- **CKEditor 5**: Rich text editor
- **Date-fns 4.1.0**: Thao tác với ngày tháng

#### 📁 Cấu trúc thư mục:
```
FrontEnd/
├── src/
│   ├── components/
│   │   └── layout/           # Layout components
│   │       ├── AdminLayout.tsx
│   │       ├── ClientLayout.tsx
│   │       └── MainLayout.tsx
│   ├── contexts/             # React Context
│   │   └── AuthContext.tsx
│   ├── dto/                  # Data Transfer Objects
│   │   ├── ProgramDTO.ts
│   │   ├── UserDTO.ts
│   │   └── ...
│   ├── pages/                # Trang chính
│   │   ├── admin/            # Trang quản trị
│   │   ├── auth/             # Xác thực
│   │   ├── courses/          # Khóa học
│   │   ├── programs/         # Chương trình
│   │   ├── surveys/          # Khảo sát
│   │   └── ...
│   ├── services/             # API services
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   └── ...
│   ├── types/                # TypeScript types
│   │   ├── user.ts
│   │   ├── program.ts
│   │   └── ...
│   ├── utils/                # Utilities
│   │   ├── theme.ts
│   │   ├── imageUtils.ts
│   │   └── ...
│   └── styles/               # CSS files
```

### Backend (Spring Boot + Java)
**Vị trí**: `BackEnd/`

#### 🔧 Công nghệ & Thư viện chính:
- **Spring Boot 3.4.5**: Framework chính
- **Java 17**: Ngôn ngữ lập trình
- **Spring Data JPA**: ORM và database access
- **Spring Security**: Bảo mật và xác thực
- **MySQL Connector**: Kết nối database
- **JWT (JSON Web Token) 0.9.1**: Xác thực token
- **Lombok**: Giảm boilerplate code
- **SpringDoc OpenAPI 2.8.5**: Tạo API documentation (Swagger)
- **Spring Boot Validation**: Validation dữ liệu
- **Maven**: Build tool

#### 📁 Cấu trúc thư mục:
```
BackEnd/src/main/java/com/project/codebasespringjpa/
├── configuration/        # Cấu hình Spring
├── controller/          # REST Controllers
│   ├── AuthController.java
│   ├── UserController.java
│   ├── ProgramController.java
│   └── ...
├── dto/                 # Data Transfer Objects
├── entity/              # JPA Entities
│   ├── UserEntity.java
│   ├── ProgramEntity.java
│   ├── SurveyEntity.java
│   └── ...
├── enums/               # Enums
├── exception/           # Exception handling
├── mapper/              # Object mapping
├── repository/          # JPA Repositories
├── service/             # Business logic
└── util/                # Utilities
```

#### 🗃️ Database Entities:
- **UserEntity**: Thông tin người dùng
- **ProgramEntity**: Chương trình truyền thông
- **CourseEntity**: Khóa học
- **SurveyEntity**: Khảo sát
- **AppointmentEntity**: Lịch hẹn tư vấn
- **AnswerEntity**: Câu trả lời khảo sát
- **QuestionEntity**: Câu hỏi khảo sát
- **RoleEntity**: Vai trò người dùng
- **BaseEntity**: Entity cơ sở

### Database (MySQL)
- **Version**: 8.0.40
- **Database name**: `doanyte`
- **Encoding**: UTF-8 (utf8mb4)
- **Connection**: `jdbc:mysql://localhost:3306/doanyte`

## 🐳 Containerization (Docker)

### Docker Services:
1. **MySQL Container**:
   - Image: mysql:8.0.40-debian
   - Port: 3306
   - Database: doanyte
   - Volume: mysql_data

2. **Backend Container**:
   - Build từ `BackEnd/Dockerfile`
   - Port: 8080
   - Depends on: MySQL
   - Volume: backend_static

3. **Frontend Container**:
   - Build từ `FrontEnd/Dockerfile`
   - Port: 3000 (mapped to 80)
   - Nginx server
   - Depends on: Backend

## 🔧 Các tính năng kỹ thuật

### Bảo mật:
- **Spring Security**: Xác thực và phân quyền
- **JWT Token**: Stateless authentication
- **Password encryption**: BCrypt
- **Role-based access control**: Phân quyền theo vai trò

### API Documentation:
- **Swagger/OpenAPI**: Tự động generate API docs
- **Interactive API testing**: Test API trực tiếp từ browser

### File Upload:
- **Static file serving**: Serve files từ classpath
- **Large file support**: Max 1000MB
- **Avatar management**: Quản lý ảnh đại diện

### Responsive Design:
- **Material-UI**: Component library hiện đại
- **Mobile-first**: Tối ưu cho mobile
- **Cross-browser**: Hỗ trợ đa trình duyệt
