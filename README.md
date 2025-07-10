# JAVA-010112213601

# Drug Use Prevention Support System

[Tổng quan dự án](Project_Overview.md)

## Thành Viên Nhóm

| STT | Họ & Tên               |     MSSV     |
| :-: | ---------------------- | :----------: |
|  1  | Phạm Hà Võ             | 079205013990 |
|  2  | Su Đức Tiến            | 079205025447 |
|  3  | Nguyễn Phạm Minh Nhiên | 082205002850 |
|  4  | Lê Văn Phong           | 036205013933 |
|  5  | Ngô Công Thảo          | 060205002242 |

---

## Nội Dung Đề Tài

Phần mềm hỗ trợ phòng ngừa sử dụng ma túy

```
Guest
Member
Staff
Consultant
Manager
Admin
```

Phần mềm hỗ trợ phòng ngừa sử dụng ma túy trong cộng đồng của 01 tổ chức tình nguyện.

- Trang chủ giới thiệu thông tin tổ chức, blog chia sẽ kinh nghiệm, …
- Chức năng cho phép người dùng tìm kiếm và đăng ký các khóa học đào tạo online về ma túy (nhận thức ma túy, kỹ năng phòng tránh, kỹ năng từ chối, …), nội dung được phân theo độ tuổi (học sinh, sinh viên, phụ huynh, giáo viên, ...).
- Chức năng cho phép người dùng làm bài khảo sát trắc nghiệm như ASSIST, CRAFFT, ... để xác định mức độ nguy cơ sử dụng ma túy. Dựa trên kết quả đánh giá này hệ thống đề xuất hành động phù hợp cho người dùng (tham gia khóa đào tạo, gặp chuyên viên tư vấn, ...).
- Chức năng cho phép người dùng đặt lịch hẹn trực tuyến với chuyên viên tư vấn để hỗ trợ.
- Quản lý các chương trình truyền thông và giáo dục cộng đồng về ma túy. Ngoài ra hệ thống còn cho phép người dùng thực hiện các bài khảo sát trước/sau tham gia chương trình nhằm rút kinh nghiệm cải tiến chương trình.
- Quản lý thông tin chuyên viên tư vấn: thông tin chung, bằng cấp, chuyên môn, lịch làm việc, ...
- Quản lý hồ sơ người dùng, lịch sử đặt lịch hẹn trực tuyến, lịch sử tham gia các chương trình truyền thông và giáo dục cộng đồng.
- Dashboard & Report.

---

## 💻Languages and Tools

### Languages

> Front-End

| React | TypeScript | JavaScript |
| :---: | :--------: | :--------: |
| <img src="https://github.com/devicons/devicon/blob/master/icons/react/react-original.svg" width="55" height="55"/> | <img src="https://github.com/devicons/devicon/blob/master/icons/typescript/typescript-original.svg" width="55" height="55"/> | <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" width="55" height="55"/> |

> Back-End

| Java | Spring-boot |
| :--: | :---------: |
| <img src="https://github.com/devicons/devicon/blob/master/icons/java/java-original.svg" width="55" height="55"/> | <img src="https://github.com/devicons/devicon/blob/master/icons/spring/spring-original.svg" width="55" height="55"/> |

> Database

| MySQL |
| :---: |
| <img src="https://github.com/devicons/devicon/blob/master/icons/mysql/mysql-original.svg" width="55" height="55"/> |

> Tools

| Maven | Docker | Git |
| :---: | :----: | :-: |
| <img src="https://github.com/devicons/devicon/blob/master/icons/maven/maven-original.svg" width="55" height="55"/> | <img src="https://github.com/devicons/devicon/blob/master/icons/docker/docker-original.svg" width="55" height="55"/> | <img src="https://github.com/devicons/devicon/blob/master/icons/git/git-original.svg" width="55" height="55"/> |

> IDE/Text Editor

| Vscode | Intellij |
| :----: | :------: |
| <img src="https://github.com/devicons/devicon/blob/master/icons/vscode/vscode-original.svg" width="55" height="55"/> | <img src="https://github.com/devicons/devicon/blob/master/icons/intellij/intellij-original.svg" width="55" height="55"/> |

---

## Hướng dẫn chạy thủ công

### Chạy với môi trường Development

#### Chạy Backend (BE)

1. **Yêu cầu môi trường:**

   - Java 17 trở lên
   - MySQL
   - Maven (hoặc sử dụng file `mvnw`/`mvnw.cmd` đi kèm)

2. **Cấu hình database:**

   - Mở file `BackEnd/src/main/resources/application.properties`
   - Chỉnh sửa các thông tin kết nối MySQL cho phù hợp:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/ten_database
     spring.datasource.username=ten_user
     spring.datasource.password=mat_khau
     ```

3. **Cài đặt thư viện:**

   - Mở terminal tại thư mục `BackEnd` và chạy:
     ```pwsh
     mvn clean install
     ```
     > Có thể chạy thẳng bước thứ 4 luôn!

4. **Chạy ứng dụng:**

   - Chạy lệnh sau trong terminal:
     ```pwsh
     mvn spring-boot:run
     ```
   - Ứng dụng sẽ chạy tại `http://localhost:8080` (mặc định).

5. **Test API**
   - Trong file `./BackEnd/pom.xml` có gọi `SpringDoc OpenAPI Starter WebMVC UI` để có thể test API.
   - Ứng dụng sẽ chạy tại `http://localhost:8080/swagger-ui/index.html`.

---

#### Chạy Frontend (FE)

1. **Yêu cầu môi trường:**

   - Node.js >= 16
   - npm >= 8

2. **Cài đặt thư viện:**

   - Mở terminal tại thư mục `FrontEnd` và chạy:
     ```pwsh
     npm install
     ```

3. **Chạy ứng dụng:**

   - Tại thư mục `FrontEnd`, chạy:
     ```pwsh
     npm start
     ```
   - Ứng dụng sẽ chạy tại `http://localhost:3000`

4. **Lưu ý:**
   - FE sẽ gọi API BE tại địa chỉ cấu hình trong file `.env.development` (mặc định là `http://localhost:8080`).
   - Đảm bảo BE đã chạy trước khi truy cập các chức năng cần backend.

---

### Hướng dẫn chạy bằng Docker Compose (BE + FE)

1. **Yêu cầu môi trường:**

   - Docker Desktop

2. **Chạy Docker Compose:**

   - Ở thư mục gốc project, chạy lệnh:
     ```pwsh
     docker-compose up --build
     ```
   - Docker sẽ tự động build và chạy cả Backend và Frontend.
   - Backend mặc định chạy ở `http://localhost:8080`, Frontend ở `http://localhost:3000`.

3. **Dừng các container:**
   - Nhấn `Ctrl+C` trong terminal hoặc chạy:
     ```pwsh
     docker-compose down
     ```

## Chạy với Script tự động (Khuyến nghị)

### Chạy môi trường Development

1. **Yêu cầu môi trường:**

   - Java 17 trở lên
   - MySQL
   - Maven (hoặc sử dụng file `mvnw`/`mvnw.cmd` đi kèm)

2. **Cấu hình database:**

   - Mở file `BackEnd/src/main/resources/application.properties`
   - Chỉnh sửa các thông tin kết nối MySQL cho phù hợp:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/ten_database
     spring.datasource.username=ten_user
     spring.datasource.password=mat_khau
     ```

3. **Sử dụng start-dev.bat:**

   - Double-click vào file `start-dev.bat` trong thư mục gốc project
   - Hoặc chạy lệnh:
     ```pwsh
     .\start-dev.bat
     ```

4. **Tính năng:**
   - Tự động mở 2 terminal riêng biệt cho Backend và Frontend
   - Backend: Maven development mode với hot reload
   - Frontend: React development server với hot reload
   - Phù hợp cho việc phát triển và debug

---

### Chạy bằng Docker Compose

1. **Yêu cầu môi trường:**

   - Docker Desktop


2. **Sử dụng docker-start.bat:**

   - Double-click vào file `docker-start.bat` trong thư mục gốc project
   - Hoặc chạy lệnh:
     ```pwsh
     .\docker-start.bat
     ```

3. **Các tùy chọn:**

   - **Option 1 - Quick Start (No Build):** Chạy nhanh với images đã build sẵn
   - **Option 2 - Full Build & Start:** Build lại toàn bộ và chạy

4. **Tính năng:**
   - Tự động phát hiện IP hiện tại của máy
   - Cập nhật cấu hình Docker để các thiết bị khác có thể truy cập
   - Chạy Docker trong terminal riêng biệt
   - Hiển thị thông tin truy cập đầy đủ

### Lưu ý quan trọng:

- **IP động:** Script sẽ tự động cập nhật IP cho phép truy cập từ các thiết bị khác trong mạng
- **Port mặc định:**
  - Frontend: `http://[IP]:3000`
  - Backend: `http://[IP]:8080`
- **Database:** MySQL sẽ được chạy trong Docker container
- **Logs:** Docker logs sẽ hiển thị trong terminal riêng biệt

## 🚀 Script Utilities

Project này cung cấp các script tiện ích để dễ dàng quản lý và chạy ứng dụng:

### 📁 Các file script có sẵn:

| Script | Mô tả | Sử dụng |
| ------ | ----- | ------- |
| `docker-start.bat` | Chạy full-stack với Docker | Tự động detect IP, 2 options: Quick Start / Full Build |
| `start-dev.bat` | Chạy development mode | Mở 2 terminal riêng cho BE/FE development |

### 📋 Chi tiết các script:

#### 1. docker-start.bat

```pwsh
# Chạy với giao diện lựa chọn
.\docker-start.bat

# Các tính năng:
# - Tự động phát hiện IP của máy
# - Cập nhật docker-compose.yml với IP hiện tại
# - Lựa chọn Quick Start (không build) hoặc Full Build
# - Chạy Docker trong terminal riêng biệt
# - Hiển thị URL truy cập cho các thiết bị khác
```

#### 2. start-dev.bat

```pwsh
# Chạy development environment
.\start-dev.bat

# Các tính năng:
# - Mở terminal riêng cho Backend (Maven)
# - Mở terminal riêng cho Frontend (React)
# - Hot reload cho cả BE và FE
# - Phù hợp cho development và debugging
```

### 💡 Tips sử dụng:

1. **Lần đầu chạy:** Sử dụng `docker-start.bat` với option "Full Build"
2. **Chạy lại:** Sử dụng option "Quick Start" để tiết kiệm thời gian
3. **Development:** Sử dụng `start-dev.bat` khi cần chỉnh sửa code
4. **Production:** Sử dụng `docker-start.bat` để đảm bảo môi trường ổn định

---
