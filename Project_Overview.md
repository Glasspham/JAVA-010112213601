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
├── configuration/       # Cấu hình Spring
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

### Database (MySQL)
- **Version**: 8.0.40
- **Database name**: `doanyte`
- **Encoding**: UTF-8 (utf8mb4)
- **Connection**: `jdbc:mysql://localhost:3306/doanyte`

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

#### Cấu trúc Database

```sql
CREATE TABLE `tbl_answer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `correct` bit(1) DEFAULT NULL,
  `question_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9g1eq48ckxg43nr81oi3asbm` (`question_id`),
  CONSTRAINT `FK9g1eq48ckxg43nr81oi3asbm` FOREIGN KEY (`question_id`) REFERENCES `tbl_question` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_appoiment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_by` varchar(255) DEFAULT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `duration` double DEFAULT NULL,
  `hours` time(6) DEFAULT NULL,
  `specialist_id` bigint NOT NULL,
  `specialist_name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_course` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_by` varchar(255) DEFAULT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_course_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_by` varchar(255) DEFAULT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `content` text,
  `duration` double DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `objective` text,
  `video` varchar(255) DEFAULT NULL,
  `course_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKi4slm61yx5cd5fiqx3fn8kcy1` (`course_id`),
  CONSTRAINT `FKi4slm61yx5cd5fiqx3fn8kcy1` FOREIGN KEY (`course_id`) REFERENCES `tbl_course` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_course_object` (
  `course_id` bigint NOT NULL,
  `object_id` bigint NOT NULL,
  KEY `FKebxayac65ihcultfn1kcbx1k0` (`object_id`),
  KEY `FKebm46qkbts25xg887mkabed92` (`course_id`),
  CONSTRAINT `FKebm46qkbts25xg887mkabed92` FOREIGN KEY (`course_id`) REFERENCES `tbl_course` (`id`),
  CONSTRAINT `FKebxayac65ihcultfn1kcbx1k0` FOREIGN KEY (`object_id`) REFERENCES `tbl_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_major` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_object` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_program` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_by` varchar(255) DEFAULT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `capacity` bigint DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `time` time(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_question` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_by` varchar(255) DEFAULT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `survey_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbxvljn5jcykjeehpox2f75gtr` (`survey_id`),
  CONSTRAINT `FKbxvljn5jcykjeehpox2f75gtr` FOREIGN KEY (`survey_id`) REFERENCES `tbl_survey` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_role` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_survey` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_by` varchar(255) DEFAULT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_survey_result` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_by` varchar(255) DEFAULT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `mark` double DEFAULT NULL,
  `survey_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK81wnbtji80jf14xnljll3yy41` (`survey_id`),
  KEY `FKjt3t5p8umrw1gddh8x9mr1iq5` (`user_id`),
  CONSTRAINT `FK81wnbtji80jf14xnljll3yy41` FOREIGN KEY (`survey_id`) REFERENCES `tbl_survey` (`id`),
  CONSTRAINT `FKjt3t5p8umrw1gddh8x9mr1iq5` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_by` varchar(255) DEFAULT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `role_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKk0bty7tbcye41jpxam88q5kj2` (`username`),
  KEY `FKqyhp9ytkc0o8uapy1vtqmw350` (`role_id`),
  CONSTRAINT `FKqyhp9ytkc0o8uapy1vtqmw350` FOREIGN KEY (`role_id`) REFERENCES `tbl_role` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_user_major` (
  `user_id` bigint NOT NULL,
  `major_id` bigint NOT NULL,
  KEY `FKsr1js05uwfnqoxmkwiumi92c` (`major_id`),
  KEY `FKk3jkqs669y9is95qa4fysd3c9` (`user_id`),
  CONSTRAINT `FKk3jkqs669y9is95qa4fysd3c9` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `FKsr1js05uwfnqoxmkwiumi92c` FOREIGN KEY (`major_id`) REFERENCES `tbl_major` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_user_program` (
  `user_id` bigint NOT NULL,
  `program_id` bigint NOT NULL,
  KEY `FKiw4r64jegiji5q7pwkrj7smpb` (`program_id`),
  KEY `FK7l70o0n3ws065395p8g6cq1b8` (`user_id`),
  CONSTRAINT `FK7l70o0n3ws065395p8g6cq1b8` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `FKiw4r64jegiji5q7pwkrj7smpb` FOREIGN KEY (`program_id`) REFERENCES `tbl_program` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

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
