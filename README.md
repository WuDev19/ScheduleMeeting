# Link github Backend
https://github.com/WuDev19/ScheduleMeetingBE
# Link github Frontend
https://github.com/WuDev19/ScheduleMeetingFE

# ScheduleMeeting - Hệ Thống Quản Lý Phòng Họp & Đăng Ký Lịch Sử Dụng

ScheduleMeeting là một ứng dụng web hiện đại giúp quản lý, tối ưu hóa việc đăng ký sử dụng phòng họp và điều phối các thiết bị đi kèm trong tổ chức/doanh nghiệp. Hệ thống được xây dựng trên kiến trúc Client-Server mạnh mẽ, bảo mật cao và dễ dàng triển khai với Docker.

---

## 🚀 Các Tính Năng Nổi Bật

* **Đặt phòng họp linh hoạt**: Hỗ trợ đăng ký đặt phòng họp một lần (Single) hoặc đặt lặp lại theo chu kỳ (Daily, Weekly, Monthly...).
* **Quy trình phê duyệt (Approval Flow)**: Cho phép người phê duyệt (Approver) quản lý, chấp nhận hoặc từ chối các yêu cầu đặt phòng họp kèm lý do chi tiết.
* **Quản lý thiết bị & phòng họp**: Quản lý thông tin chi tiết của tòa nhà (Building), phòng họp (Room), danh sách trang thiết bị tiện ích (Equipment) và trạng thái sẵn dùng của chúng.
* **Hệ thống thông báo (Notification System)**: Tự động gửi email thông báo xác nhận tham gia cuộc họp, nhắc lịch họp hoặc thông báo hủy phòng thông qua cơ chế Outbox Pattern tin cậy.
* **Phân quyền người dùng chi tiết (Role-Based Access Control)**:
  * **ADMIN**: Quản trị viên hệ thống có toàn quyền cấu hình, khởi tạo dữ liệu ban đầu.
  * **APPROVER**: Người phê duyệt lịch họp và điều phối tài nguyên phòng họp.
  * **REGISTER**: Nhân viên/người dùng có quyền đăng ký phòng họp cá nhân hoặc cho nhóm.
* **Hỗ trợ đa nền tảng**: Giao diện Responsive hoạt động mượt mà trên cả PC, máy tính bảng và điện thoại di động.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Backend
* **Ngôn ngữ**: Java 17
* **Framework**: Spring Boot 3.x
* **Security**: Spring Security, OAuth2 Resource Server (JWT) với bộ giải mã JWT tùy biến (Custom Decoder)
* **Database**: PostgreSQL 16
* **Database Migration**: Flyway
* **Caching & Message Broker**: Redis 7.2
* **API Documentation**: OpenAPI / Swagger UI

### Frontend
* **Framework**: React 19, TypeScript
* **Build tool**: Vite 8
* **Styling**: Vanilla CSS (tối ưu hóa hiệu năng, giao diện Glassmorphic hiện đại)
* **State Management & Fetching**: Axios, React Router v7, React Hook Form, React Query, Lucide Icons

### Triển Khai & Vận Hành (DevOps)
* **Containerization**: Docker & Docker Compose
* **Web Server**: Nginx (phục vụ static files cho Frontend)

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
ScheduleMeeting/
├── backend/                  # Mã nguồn Spring Boot (Backend API)
│   ├── src/                  # Mã nguồn Java và file cấu hình
│   ├── Dockerfile            # Dockerfile build backend
│   └── pom.xml               # Quản lý dependency Maven
├── frontend/                 # Mã nguồn React + TypeScript (Frontend Client)
│   ├── src/                  # Các component, page, context, api client
│   ├── Dockerfile            # Dockerfile build frontend và serve qua Nginx
│   └── package.json          # Quản lý dependency npm
├── redis/                    # Cấu hình cache Redis cho dự án
└── docker-compose.yml        # File orchestrate chạy toàn bộ hệ thống
```

---

## ⚙️ Cấu Hình Môi Trường (Environment Variables)

Các biến môi trường cấu hình cho hệ thống nằm trong file [docker-compose.yml](file:///d:/ScheduleMeeting/docker-compose.yml) dưới service `backend`. Bạn có thể thay đổi các giá trị này để phù hợp với môi trường triển khai thực tế:

| Tên biến môi trường | Mô tả | Giá trị mặc định |
| :--- | :--- | :--- |
| `DB_NAME_POSTGRES` | Tên cơ sở dữ liệu PostgreSQL | `schedule_meeting` |
| `DB_USER` | Tên tài khoản kết nối Database | `postgres` |
| `DB_PASSWORD` | Mật khẩu kết nối Database | `Anhvu197@` |
| `DB_HOST_POSTGRES` | Địa chỉ/tên dịch vụ Database | `postgres-db` |
| `REDIS_HOST` | Tên dịch vụ Redis cache | `redis-cache` |
| `REDIS_PASS` | Mật khẩu kết nối Redis | `Anhvu197@` |
| `JWT_SECRET_KEY` | Khóa bí mật dùng để ký và giải mã JWT | `87c63f5d838e678b...` |
| `APP_EMAIL` | Email dùng để gửi thông báo tự động | *(Gmail của bạn)* |
| `APP_EMAIL_PASSWORD` | App Password của Gmail để gửi thư | *(App password 16 ký tự)* |
| `ADMIN_USERNAME` | Tên tài khoản Admin mặc định | `admin` |
| `ADMIN_PASSWORD` | Mật khẩu tài khoản Admin mặc định | `Aa123456@` |
| `ADMIN_EMAIL` | Email tài khoản Admin mặc định | `nguyenvu19a19@gmail.com` |
| `CLOUDINARY_NAME` | Cloud Name trên Cloudinary để upload ảnh | *(Cấu hình Cloudinary)* |
| `CLOUDINARY_API_KEY` | API Key của Cloudinary | *(Cấu hình Cloudinary)* |
| `CLOUDINARY_SECRET_KEY`| API Secret của Cloudinary | *(Cấu hình Cloudinary)* |

---

## 🚀 Hướng Dẫn Khởi Chạy Dự Án

### Cách 1: Khởi Chạy Nhanh Bằng Docker Compose (Khuyên Dùng)

Yêu cầu máy tính đã cài đặt **Docker** và **Docker Compose**.

1. Mở terminal tại thư mục gốc của dự án (`ScheduleMeeting`).
2. Khởi chạy toàn bộ hệ thống bằng lệnh:
   ```bash
   docker compose up -d --build
   ```
   *Lệnh này sẽ tự động khởi dựng Database, Redis, build mã nguồn Backend/Frontend và khởi chạy chúng.*

3. Truy cập hệ thống:
   * **Giao diện người dùng (Frontend)**: [http://localhost](http://localhost) (Cổng 80)
   * **Swagger API Documentation (Backend)**: [http://localhost:8080/api/v1/swagger-ui.html](http://localhost:8080/api/v1/swagger-ui.html) (Cổng 8080)

4. Đăng nhập bằng tài khoản Quản trị viên (Admin) mặc định:
   * **Username**: `admin`
   * **Password**: `Aa123456@`

5. Dừng hệ thống:
   ```bash
   docker compose down
   ```

---

### Cách 2: Khởi Chạy Cho Quá Trình Phát Triển (Local Development)

#### Khởi chạy Backend:
1. Yêu cầu cài đặt **Java 17** và **Maven**.
2. Đảm bảo bạn đã khởi chạy PostgreSQL và Redis độc lập (hoặc có thể dùng Docker để chạy riêng DB và Redis thông qua lệnh `docker compose up -d postgres-db redis-cache`).
3. Truy cập vào thư mục `backend/` và chạy lệnh sau để build và khởi hành backend:
   ```bash
   mvn spring-boot:run
   ```

#### Khởi chạy Frontend:
1. Yêu cầu cài đặt **Node.js (phiên bản 18 hoặc 20 trở lên)**.
2. Truy cập vào thư mục `frontend/` và cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy frontend ở chế độ dev với Hot Reloading:
   ```bash
   npm run dev
   ```
4. Giao diện phát triển sẽ hiển thị tại địa chỉ: `http://localhost:5173`.

---

## 🛡️ Cấu Hình CORS & Security Lưu Ý

Hệ thống sử dụng bảo mật Spring Security với JWT. Cấu hình phân quyền chi tiết cho phép CORS được khai báo ở lớp [SecurityConfig.java](file:///d:/ScheduleMeeting/backend/src/main/java/com/example/schedulemeetingbe/config/SecurityConfig.java). 

Nếu bạn muốn chạy ứng dụng thông qua địa chỉ IP mạng nội bộ hoặc các tunnel như `ngrok` để test trên các thiết bị khác, hãy chắc chắn đã bổ sung domain/IP đó vào danh sách Allowed Origins của phương thức `corsConfigurationSource()` trong cấu hình bảo mật.
