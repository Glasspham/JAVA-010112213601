# Hướng dẫn Test API với Postman

## 1. Test Login để lấy JWT Token

**URL:** `POST http://localhost:8080/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "username": "your_username",
    "password": "your_password"
}
```

**Response mẫu:**
```json
{
    "code": 200,
    "message": "Success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "username": "your_username",
        "roles": ["USER"]
    }
}
```

**⚠️ Lưu ý:** Copy `token` từ response để sử dụng cho các API khác.

---

## 2. Test Update Profile

**URL:** `PUT http://localhost:8080/auth/update?username=your_username`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Body (JSON):**
```json
{
    "username": "user1",
    "fullname": "Nguyen Van A Updated", 
    "email": "nguyenvana.updated@gmail.com",
    "avatar": "avatar_url_here",
    "position": "Developer",
    "phone": "0123456789",
    "majors": ["Tư vấn ma túy", "Tâm lý học"],
    "role": "USER"
}
```

**Query Parameters:**
```
username: your_username
```

**Response mẫu:**
```json
{
    "code": 200,
    "message": "Success",
    "data": {
        "id": 1,
        "username": "your_username",
        "fullName": "Nguyen Van A",
        "email": "nguyenvana@gmail.com",
        "phone": "0123456789",
        "address": "123 Nguyen Hue, TP.HCM",
        "dateOfBirth": "1990-01-01",
        "roles": ["USER"]
    }
}
```

---

## 3. Test Update Password

**URL:** `PUT http://localhost:8080/auth/update-password?username=your_username`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Body (JSON):**
```json
{
    "oldpassword": "current_password",
    "newpassword": "new_password"
}
```

---

## 📝 Chi tiết các bước trong Postman:

### Bước 1: Tạo Collection
1. Mở Postman
2. Tạo New Collection: "Drug Prevention API"
3. Thêm các request vào collection

### Bước 2: Setup Environment
1. Tạo Environment: "Local Development"
2. Thêm variables:
   - `base_url`: `http://localhost:8080`
   - `jwt_token`: (để trống, sẽ update sau)
   - `username`: `your_test_username`

### Bước 3: Configure Login Request
1. **Method:** POST
2. **URL:** `{{base_url}}/auth/login`
3. **Headers:** `Content-Type: application/json`
4. **Body:** Raw JSON với username/password
5. **Tests Tab:** Thêm script để auto-save token:
```javascript
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.code).to.eql(200);
    
    // Save token to environment
    pm.environment.set("jwt_token", jsonData.data.token);
});
```

### Bước 4: Configure Update Profile Request
1. **Method:** PUT
2. **URL:** `{{base_url}}/auth/update?username={{username}}`
3. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer {{jwt_token}}`
4. **Body:** Raw JSON với thông tin cần update

### Bước 5: Test Scenarios

#### Scenario 1: User update own profile ✅
- Login với user thường
- Update profile của chính user đó
- **Expected:** Success (200)

#### Scenario 2: Admin update any profile ✅
- Login với admin account
- Update profile của user khác
- **Expected:** Success (200)

#### Scenario 3: User update other's profile ❌
- Login với user thường
- Update profile của user khác
- **Expected:** Access Denied (403)

#### Scenario 4: No authentication ❌
- Không gửi JWT token
- **Expected:** Unauthorized (401)

---

## 🔧 Troubleshooting

### Lỗi 401 Unauthorized:
- Kiểm tra JWT token có đúng format không
- Token có hết hạn không
- Header Authorization có đúng format: `Bearer token`

## 🚨 Troubleshooting: 401 "Chưa đăng nhập"

### Nguyên nhân phổ biến:

#### 1. **Missing Authorization Header**
```bash
❌ Sai: Không có header Authorization
Headers:
  Content-Type: application/json

✅ Đúng: Có đầy đủ headers
Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2. **Wrong Bearer Format**
```bash
❌ Sai formats:
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...           (thiếu "Bearer ")
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...      (viết thường)
Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."    (có dấu ngoặc)

✅ Đúng format:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. **Token Expired**
JWT tokens có thời gian sống (thường 15-60 phút). Nếu token hết hạn → 401

#### 4. **Copy Token Incorrectly**
- Copy thiếu/thừa ký tự
- Copy cả dấu ngoặc kép từ JSON response
- Có space hoặc newline characters

### 🔧 Quick Debug Steps:

#### Step 1: Verify Headers trong Postman
1. Mở request "Update Profile"
2. Click tab **Headers**
3. Kiểm tra có dòng này không:
```
Key: Authorization
Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Step 2: Re-login và test ngay
```bash
# 1. Login lại
POST /auth/login
{
    "username": "user",
    "password": "your_password"
}

# 2. Copy token từ response:
{
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  ← Copy cái này
    }
}

# 3. Paste vào Authorization header ngay lập tức
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 4. Test Update Profile
```

#### Step 3: Validate Token
Paste token vào https://jwt.io để kiểm tra:
```json
{
  "sub": "user",           ← Username
  "roles": ["USER"],       ← Roles  
  "iat": 1641234567,      ← Issued at
  "exp": 1641238167       ← Expiry (phải > current time)
}
```

### 🎯 Postman Environment Setup

Để tránh lỗi này, setup auto-save token:

**Login Request - Tests Tab:**
```javascript
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.code).to.eql(200);
    
    // Auto-save token (không cần copy manual)
    pm.environment.set("jwt_token", jsonData.data.token);
    console.log("Token saved successfully!");
});
```

**Update Profile Request - Headers:**
```
Authorization: Bearer {{jwt_token}}
```

**Pre-request Script:**
```javascript
// Check token exists
if (!pm.environment.get("jwt_token")) {
    throw new Error("No JWT token found! Please login first.");
}
```

### 🔄 Test Flow:
1. **Run Login request** → Token auto-saved to environment
2. **Run Update Profile** → Uses {{jwt_token}} variable
3. **No manual copy/paste needed!**

---

## 📋 HƯỚNG DẪN CHI TIẾT: Cách thêm JWT Token vào Postman

### 🎯 Bước 1: Lấy Token từ Login Request

#### 1.1 Tạo Login Request
1. **Mở Postman**
2. **Tạo New Request:**
   - Name: "Login"
   - Method: **POST**
   - URL: `http://localhost:8080/auth/login`

3. **Headers Tab:**
   ```
   Key: Content-Type
   Value: application/json
   ```

4. **Body Tab:**
   - Chọn **raw**
   - Chọn **JSON** (dropdown bên phải)
   - Nhập:
   ```json
   {
       "username": "user",
       "password": "your_password"
   }
   ```

5. **Click Send** → Nhận response có token

#### 1.2 Copy Token từ Response
```json
{
    "code": 200,
    "message": "Success", 
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI6InVzZXIi..."  ← COPY CÁI NÀY
    }
}
```

**⚠️ LƯU Ý:** Copy chỉ phần token (không bao gồm dấu ngoặc kép "")

---

### 🎯 Bước 2: Thêm Token vào Update Profile Request

#### 2.1 Tạo Update Profile Request
1. **Tạo New Request:**
   - Name: "Update Profile"
   - Method: **PUT**
   - URL: `http://localhost:8080/auth/update?username=user`

#### 2.2 Thêm Token vào Headers
1. **Click tab "Headers"** (bên cạnh Params, Authorization, Body...)

2. **Thêm 2 headers:**
   **Header 1:**
   ```
   Key: Content-Type
   Value: application/json
   ```

   **Header 2:**
   ```
   Key: Authorization
   Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI6InVzZXIi...
   ```

   **⚠️ QUAN TRỌNG:** 
   - Phải có từ `Bearer ` (có dấu space) trước token
   - Không có dấu ngoặc kép
   - Paste đúng token đầy đủ

#### 2.3 Setup Body
1. **Click tab "Body"**
2. **Chọn "raw"**
3. **Chọn "JSON"** (dropdown)
4. **Nhập:**
```json
{
    "username": "user",
    "fullname": "Updated Name",
    "email": "updated@email.com",
    "avatar": "",
    "position": "Developer", 
    "phone": "0123456789",
    "majors": ["Tư vấn"],
    "role": "USER"
}
```

#### 2.4 Send Request
1. **Click "Send"**
2. **Kết quả mong đợi:** 200 OK với data updated

---

### 🚨 Các lỗi thường gặp và cách sửa:

#### ❌ Lỗi: "Key 'Authorization' already exists"
**Nguyên nhân:** Đã có header Authorization rồi
**Cách sửa:** 
- Tìm dòng Authorization cũ và xóa
- Hoặc edit giá trị Value thành `Bearer new_token`

#### ❌ Lỗi: Token không được nhận diện
**Kiểm tra:**
1. **Format đúng:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
2. **Có space sau "Bearer"**
3. **Không có dấu ngoặc kép**
4. **Token đầy đủ (không bị cắt)**

#### ❌ Lỗi: 401 "Chưa đăng nhập"
**Nguyên nhân phổ biến:**
- Thiếu header Authorization
- Token hết hạn (cần login lại)
- Format sai

---

### 🎯 CÁCH NHANH: Sử dụng Authorization Tab

#### Alternative Method:
1. **Click tab "Authorization"** (thay vì Headers)
2. **Type:** Chọn **"Bearer Token"**
3. **Token:** Paste token (không cần "Bearer " prefix)
4. Postman sẽ tự động thêm vào Headers

---

### 🔄 AUTO-SAVE TOKEN (Khuyên dùng)

#### Setup để không phải copy/paste manual:

**Login Request - Tests Tab:**
```javascript
// Auto-save token khi login thành công
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.code).to.eql(200);
    
    // Lưu token vào environment variable
    pm.environment.set("jwt_token", jsonData.data.token);
    console.log("✅ Token saved to environment!");
});
```

**Update Profile Request - Authorization Tab:**
```
Type: Bearer Token
Token: {{jwt_token}}
```

**Hoặc Headers Tab:**
```
Key: Authorization  
Value: Bearer {{jwt_token}}
```

#### Workflow:
1. **Run Login** → Token tự động lưu
2. **Run Update Profile** → Tự động dùng token đã lưu
3. **Không cần copy/paste!** 🎉

---

### 🔍 Debug: Kiểm tra Headers có đúng không

#### Cách 1: Trong Postman
1. **Gửi request Update Profile**
2. **Scroll xuống response**
3. **Click "Console"** (bottom panel)
4. **Xem request details** → Headers section

#### Cách 2: Check trước khi Send
1. **Click "Code"** (link bên phải nút Send)
2. **Chọn "cURL"**
3. **Kiểm tra có dòng:** `-H "Authorization: Bearer eyJ..."`

#### Expected Headers:
```bash
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI6InVzZXIi...
```
