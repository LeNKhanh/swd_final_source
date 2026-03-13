# SWD – Furniture E-Commerce REST API

> **Môn học:** Software Development  
> **Nền tảng:** Node.js + Express.js + MongoDB (Mongoose)  
> **Kiến trúc:** REST API with Role-Based Access Control (RBAC)

---

## Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Yêu cầu hệ thống](#2-yêu-cầu-hệ-thống)
3. [Cài đặt & Khởi động](#3-cài-đặt--khởi-động)
4. [Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
5. [Cơ sở dữ liệu](#5-cơ-sở-dữ-liệu)
6. [Phân quyền theo Actor](#6-phân-quyền-theo-actor)
7. [API Endpoints](#7-api-endpoints)
8. [Use Case – API Mapping](#8-use-case--api-mapping)
9. [Biến môi trường](#9-biến-môi-trường)
10. [Dữ liệu mẫu (Seed)](#10-dữ-liệu-mẫu-seed)

---

## 1. Tổng quan dự án

**SWD Furniture E-Commerce** là REST API backend cho website thương mại điện tử bán đồ nội thất. Hệ thống hỗ trợ 3 nhóm người dùng chính:

| Actor | Mô tả |
|---|---|
| **Guest** | Khách vãng lai, chưa đăng nhập |
| **Customer** | Khách hàng đã đăng ký tài khoản |
| **Manager** | Quản lý cửa hàng |
| **Admin** | Quản trị viên toàn quyền |

### Tính năng chính

- Xác thực JWT + Google OAuth
- CRUD đầy đủ sản phẩm, danh mục, thương hiệu
- Giỏ hàng, đặt hàng, thanh toán (COD + VNPay)
- Đánh giá sản phẩm và phản hồi
- Thống kê doanh thu theo tháng/năm
- Phân quyền rõ ràng theo Role-Based Access Control

---

## 2. Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---|---|
| Node.js | >= 18.x |
| npm | >= 9.x |
| MongoDB | >= 6.x (Community) |

---

## 3. Cài đặt & Khởi động

### Bước 1: Clone & cài dependencies

```bash
cd SWD
npm install
```

### Bước 2: Cấu hình biến môi trường

Sao chép file `.env` và điền thông tin:

```bash
cp .env .env.local
```

Chỉnh sửa `.env` (xem [Biến môi trường](#9-biến-môi-trường))

### Bước 3: Nạp dữ liệu mẫu

```bash
npm run seed
```

### Bước 4: Khởi động server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server chạy tại: `http://localhost:5000`

---

## 4. Cấu trúc thư mục

```
SWD/
├── index.js                    ← Entry point, khai báo toàn bộ routes
├── .env                        ← Biến môi trường
├── .gitignore
├── package.json
│
├── migrations/
│   └── seed.js                 ← Script nạp dữ liệu mẫu vào MongoDB
│
└── src/
    ├── config/
    │   └── db.js               ← Kết nối MongoDB qua Mongoose
    │
    ├── models/                 ← Mongoose Schemas / Collections
    │   ├── User.js             → collection: users
    │   ├── Brand.js            → collection: brands
    │   ├── Category.js         → collection: categories
    │   ├── Product.js          → collection: products
    │   ├── Cart.js             → collection: carts
    │   ├── Order.js            → collection: orders
    │   ├── Review.js           → collection: reviews
    │   └── Payment.js          → collection: payments
    │
    ├── middleware/
    │   ├── auth.middleware.js  ← Xác thực JWT Bearer Token
    │   └── role.middleware.js  ← Phân quyền theo role (RBAC)
    │
    ├── controllers/            ← Business logic xử lý request/response
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── product.controller.js
    │   ├── category.controller.js
    │   ├── brand.controller.js
    │   ├── cart.controller.js
    │   ├── order.controller.js
    │   ├── review.controller.js
    │   ├── payment.controller.js
    │   └── stats.controller.js
    │
    ├── routes/                 ← Định nghĩa API routes + gắn middleware
    │   ├── auth.route.js
    │   ├── user.route.js
    │   ├── product.route.js
    │   ├── category.route.js
    │   ├── brand.route.js
    │   ├── cart.route.js
    │   ├── order.route.js
    │   ├── review.route.js
    │   ├── payment.route.js
    │   └── stats.route.js
    │
    └── utils/
        └── helpers.js          ← generateToken, paginate
```

---

## 5. Cơ sở dữ liệu

**Database name:** `swd_furniture_db`  
**Host:** `localhost:27017`

### Collections & Schema

#### `users`
| Field | Type | Mô tả |
|---|---|---|
| name | String | Họ tên |
| email | String (unique) | Email |
| password | String (hashed) | Mật khẩu bcrypt |
| phone | String | Số điện thoại |
| address | String | Địa chỉ |
| avatar | String | URL ảnh đại diện |
| role | Enum | `customer` / `manager` / `admin` |
| isGoogleAuth | Boolean | Đăng nhập bằng Google |
| googleId | String | Google UID |
| isActive | Boolean | Trạng thái tài khoản |
| resetPasswordToken | String | Token đặt lại mật khẩu |
| resetPasswordExpire | Date | Hạn token đặt lại MK |

#### `brands`
| Field | Type | Mô tả |
|---|---|---|
| name | String (unique) | Tên thương hiệu |
| description | String | Mô tả |
| logo | String | URL logo |
| website | String | Website |
| isActive | Boolean | Hiển thị |

#### `categories`
| Field | Type | Mô tả |
|---|---|---|
| name | String (unique) | Tên danh mục |
| description | String | Mô tả |
| image | String | URL ảnh |
| isActive | Boolean | Hiển thị |

#### `products`
| Field | Type | Mô tả |
|---|---|---|
| name | String | Tên sản phẩm |
| description | String | Mô tả chi tiết |
| price | Number | Giá gốc |
| discountPrice | Number | Giá khuyến mãi |
| images | [String] | Danh sách URL ảnh |
| stock | Number | Tồn kho |
| category | ObjectId → Category | Danh mục |
| brand | ObjectId → Brand | Thương hiệu |
| dimensions | Object | `{width, height, depth}` (cm) |
| material | String | Chất liệu |
| color | [String] | Màu sắc có sẵn |
| rating | Number | Điểm trung bình (0–5) |
| reviewCount | Number | Số lượt đánh giá |
| isActive | Boolean | Hiển thị |

#### `carts`
| Field | Type | Mô tả |
|---|---|---|
| user | ObjectId → User (unique) | Chủ giỏ hàng |
| items | Array | `[{product, quantity, price}]` |
| totalPrice | Number | Tổng tiền (tự tính) |

#### `orders`
| Field | Type | Mô tả |
|---|---|---|
| user | ObjectId → User | Người đặt |
| items | Array | `[{product, quantity, price}]` |
| totalPrice | Number | Tổng tiền |
| shippingAddress | Object | `{fullName, phone, address, city}` |
| status | Enum | `pending / confirmed / shipping / delivered / cancelled` |
| paymentMethod | Enum | `cod / vnpay` |
| paymentStatus | Enum | `unpaid / paid` |
| note | String | Ghi chú đơn hàng |

#### `reviews`
| Field | Type | Mô tả |
|---|---|---|
| user | ObjectId → User | Người đánh giá |
| product | ObjectId → Product | Sản phẩm (unique pair với user) |
| rating | Number (1–5) | Số sao |
| comment | String | Nội dung đánh giá |
| reply | Object | `{content, repliedBy, repliedAt}` |
| isActive | Boolean | Hiển thị |

#### `payments`
| Field | Type | Mô tả |
|---|---|---|
| order | ObjectId → Order | Đơn hàng liên kết |
| user | ObjectId → User | Người thanh toán |
| amount | Number | Số tiền |
| method | Enum | `vnpay / cod` |
| status | Enum | `pending / success / failed` |
| transactionId | String | Mã giao dịch VNPay |
| vnpayData | Mixed | Raw response từ VNPay |

---

## 6. Phân quyền theo Actor

```
Guest       → Không cần token
Customer    → Bearer Token (role: customer)
Manager     → Bearer Token (role: manager)
Admin       → Bearer Token (role: admin)
```

### Ma trận phân quyền

| Tài nguyên | Guest | Customer | Manager | Admin |
|---|:---:|:---:|:---:|:---:|
| Xem sản phẩm / tìm kiếm / lọc | ✅ | ✅ | ✅ | ✅ |
| Xem danh mục / brand | ✅ | ✅ | ✅ | ✅ |
| Xem đánh giá | ✅ | ✅ | ✅ | ✅ |
| Đăng ký / Đăng nhập | ✅ | ✅ | ✅ | ✅ |
| Quên mật khẩu | ✅ | ✅ | ✅ | ✅ |
| Quản lý profile | ❌ | ✅ | ✅ | ✅ |
| Đổi mật khẩu | ❌ | ✅ | ✅ | ✅ |
| Giỏ hàng | ❌ | ✅ | ❌ | ❌ |
| Đặt hàng / xem đơn | ❌ | ✅ | ❌ | ❌ |
| Thanh toán VNPay | ❌ | ✅ | ❌ | ❌ |
| Viết đánh giá | ❌ | ✅ | ❌ | ❌ |
| CRUD sản phẩm | ❌ | ❌ | ✅ | ✅ |
| CRUD danh mục / brand | ❌ | ❌ | ✅ | ✅ |
| Xem tất cả đơn hàng | ❌ | ❌ | ✅ | ✅ |
| Cập nhật trạng thái đơn | ❌ | ❌ | ✅ | ✅ |
| Phản hồi đánh giá | ❌ | ❌ | ✅ | ✅ |
| Xóa đánh giá | ❌ | ❌ | ✅ | ✅ |
| Xem thống kê | ❌ | ❌ | ✅ | ✅ |
| Xem danh sách users | ❌ | ❌ | ✅ | ✅ |
| CRUD Users | ❌ | ❌ | ❌ | ✅ |

---

## 7. API Endpoints

**Base URL:** `http://localhost:5000/api`

### 🔐 Auth – `/api/auth`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/auth/register` | None | UC-08: Đăng ký tài khoản |
| POST | `/auth/register/google` | None | UC-09: Đăng ký bằng Google |
| POST | `/auth/login` | None | UC-16: Đăng nhập |
| POST | `/auth/login/google` | None | UC-14: Đăng nhập Google |
| POST | `/auth/logout` | Bearer | UC-22: Đăng xuất |
| PUT | `/auth/change-password` | Bearer | UC-23: Đổi mật khẩu |
| POST | `/auth/forgot-password` | None | UC-30: Quên mật khẩu |

### 👥 Users – `/api/users`

| Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|
| GET | `/users/profile` | Bearer | Any | UC-19: Xem profile |
| PUT | `/users/profile` | Bearer | Any | UC-20: Cập nhật profile |
| DELETE | `/users/profile` | Bearer | Any | UC-21: Xóa/deactivate tài khoản |
| GET | `/users` | Bearer | manager, admin | UC-31: Xem danh sách users |
| GET | `/users/:id` | Bearer | manager, admin | Xem chi tiết user |
| POST | `/users` | Bearer | admin | Tạo user mới |
| PUT | `/users/:id` | Bearer | admin | Cập nhật user |
| DELETE | `/users/:id` | Bearer | admin | Xóa user |

### 🛋 Products – `/api/products`

| Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|
| GET | `/products` | None | All | UC-01/10: Danh sách sản phẩm |
| GET | `/products/search?q=` | None | All | UC-03/12: Tìm kiếm sản phẩm |
| GET | `/products/filter` | None | All | UC-04/13: Lọc sản phẩm |
| GET | `/products/:id` | None | All | UC-02/11: Chi tiết sản phẩm |
| POST | `/products` | Bearer | manager, admin | Thêm sản phẩm |
| PUT | `/products/:id` | Bearer | manager, admin | Cập nhật sản phẩm |
| DELETE | `/products/:id` | Bearer | manager, admin | Xóa sản phẩm |

**Query params cho GET /products:**
- `page`, `limit` – phân trang
- `category` – filter theo category ID
- `brand` – filter theo brand ID
- `minPrice`, `maxPrice` – lọc theo giá
- `sort` – sắp xếp (vd: `-price`, `rating`)

### 📦 Categories – `/api/categories`

| Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|
| GET | `/categories` | None | All | UC-05/15/17: Danh sách danh mục |
| GET | `/categories/:id` | None | All | Chi tiết danh mục |
| POST | `/categories` | Bearer | manager, admin | UC-34: Thêm danh mục |
| PUT | `/categories/:id` | Bearer | manager, admin | UC-34: Sửa danh mục |
| DELETE | `/categories/:id` | Bearer | manager, admin | UC-34: Xóa danh mục |

### 🏷 Brands – `/api/brands`

| Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|
| GET | `/brands` | None | All | UC-06/18/35: Danh sách thương hiệu |
| GET | `/brands/:id` | None | All | Chi tiết thương hiệu |
| POST | `/brands` | Bearer | manager, admin | UC-35: Thêm brand |
| PUT | `/brands/:id` | Bearer | manager, admin | UC-35: Sửa brand |
| DELETE | `/brands/:id` | Bearer | manager, admin | UC-35: Xóa brand |

### 🛒 Cart – `/api/cart`

| Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|
| GET | `/cart` | Bearer | customer | UC-24: Xem giỏ hàng |
| POST | `/cart/items` | Bearer | customer | UC-25: Thêm vào giỏ |
| PUT | `/cart/items/:itemId` | Bearer | customer | UC-24: Sửa số lượng |
| DELETE | `/cart/items/:itemId` | Bearer | customer | UC-24: Xóa item |
| DELETE | `/cart` | Bearer | customer | Xóa toàn bộ giỏ |

### 📋 Orders – `/api/orders`

| Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|
| GET | `/orders/my` | Bearer | customer | UC-26: Xem đơn hàng của tôi |
| GET | `/orders/my/:id` | Bearer | customer | UC-26: Chi tiết đơn hàng |
| POST | `/orders` | Bearer | customer | UC-27: Tạo đơn hàng |
| PUT | `/orders/my/:id/cancel` | Bearer | customer | UC-26: Hủy đơn hàng |
| GET | `/orders` | Bearer | manager, admin | Xem tất cả đơn hàng |
| PUT | `/orders/:id/status` | Bearer | manager, admin | Cập nhật trạng thái đơn |

### ⭐ Reviews – `/api/reviews`

| Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|
| GET | `/reviews/product/:productId` | None | All | UC-07: Xem đánh giá sản phẩm |
| GET | `/reviews` | Bearer | manager, admin | UC-37: Xem tất cả đánh giá |
| POST | `/reviews` | Bearer | customer | Viết đánh giá |
| POST | `/reviews/:id/reply` | Bearer | manager, admin | UC-38: Phản hồi đánh giá |
| DELETE | `/reviews/:id` | Bearer | manager, admin | UC-37: Xóa đánh giá |

### 💳 Payments – `/api/payments`

| Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|
| POST | `/payments` | Bearer | customer | UC-28: Tạo thanh toán |
| POST | `/payments/vnpay-checkout` | Bearer | customer | UC-29: VNPay checkout URL |
| GET | `/payments/vnpay-return` | None | — | VNPay callback |

### 📊 Statistics – `/api/stats`

| Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|
| GET | `/stats?year=2026` | Bearer | manager, admin | UC-36: Thống kê doanh thu |

**Response `/api/stats`:**
```json
{
  "totalUsers": 4,
  "totalProducts": 10,
  "totalOrders": 5,
  "totalRevenue": 67190000,
  "monthlySales": [{ "_id": 1, "revenue": 12280000, "count": 1 }, ...],
  "topProducts": [...],
  "ordersByStatus": [...]
}
```

---

## 8. Use Case – API Mapping

| Use Case ID | Tên | Actor | API |
|---|---|---|---|
| UC-01 | View Product List | Guest | GET /api/products |
| UC-02 | View Product Detail | Guest | GET /api/products/:id |
| UC-03 | Search Product | Guest | GET /api/products/search |
| UC-04 | Filter Product | Guest | GET /api/products/filter |
| UC-05 | View Categories List | Guest | GET /api/categories |
| UC-06 | View Brand List | Guest | GET /api/brands |
| UC-07 | View Feedback | Guest | GET /api/reviews/product/:id |
| UC-08 | Register | Guest | POST /api/auth/register |
| UC-09 | Register with Google | Guest | POST /api/auth/register/google |
| UC-10 | View Product List | Customer | GET /api/products |
| UC-11 | View Product Detail | Customer | GET /api/products/:id |
| UC-12 | Search Product | Customer | GET /api/products/search |
| UC-13 | Filter Product | Customer | GET /api/products/filter |
| UC-14 | Google Login | Customer | POST /api/auth/login/google |
| UC-15 | View Categories Group List | Customer | GET /api/categories |
| UC-16 | Login | Customer/Manager/Admin | POST /api/auth/login |
| UC-17 | View Categories List | Customer | GET /api/categories |
| UC-18 | View Brand List | Customer | GET /api/brands |
| UC-19 | View Profile | Customer | GET /api/users/profile |
| UC-20 | Update Profile | Customer | PUT /api/users/profile |
| UC-21 | Delete Profile | Customer | DELETE /api/users/profile |
| UC-22 | Logout | All | POST /api/auth/logout |
| UC-23 | Change Password | Customer | PUT /api/auth/change-password |
| UC-24 | View Cart (RUD) | Customer | GET/PUT/DELETE /api/cart |
| UC-25 | Add to Cart | Customer | POST /api/cart/items |
| UC-26 | View Orders (RD) | Customer | GET /api/orders/my |
| UC-27 | Create Orders | Customer | POST /api/orders |
| UC-28 | Create Payment | Customer | POST /api/payments |
| UC-29 | VNPay Checkout | Customer | POST /api/payments/vnpay-checkout |
| UC-30 | Forgot Password | Guest | POST /api/auth/forgot-password |
| UC-31 | View Users (CRUD) | Manager/Admin | GET /api/users |
| UC-32 | View List of Furniture (CRUD) | Manager/Admin | GET/POST /api/products |
| UC-33 | View Furniture Details (RUD) | Manager/Admin | GET/PUT/DELETE /api/products/:id |
| UC-34 | View Categories (CRUD) | Manager/Admin | /api/categories |
| UC-35 | View Brand List (CRUD) | Manager/Admin | /api/brands |
| UC-36 | View Statistical Diagram | Manager/Admin | GET /api/stats |
| UC-37 | View Reviews (RD) | Manager/Admin | GET/DELETE /api/reviews |
| UC-38 | Reply Reviews | Manager/Admin | POST /api/reviews/:id/reply |

---

## 9. Biến môi trường

File `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swd_furniture_db
JWT_SECRET=swd_furniture_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

| Biến | Mô tả |
|---|---|
| `PORT` | Cổng server (mặc định 5000) |
| `MONGODB_URI` | URI kết nối MongoDB |
| `JWT_SECRET` | Khóa bí mật ký JWT token |
| `JWT_EXPIRES_IN` | Thời hạn token (vd: `7d`, `24h`) |
| `VNPAY_URL` | URL cổng thanh toán VNPay |

---

## 10. Dữ liệu mẫu (Seed)

### Chạy seed

```bash
npm run seed
```

> ⚠️ Lệnh seed **xóa toàn bộ dữ liệu cũ** trước khi nạp dữ liệu mới.

### Dữ liệu được tạo

| Collection | Số lượng | Chi tiết |
|---|---|---|
| users | 6 | 1 admin, 1 manager, 4 customers |
| brands | 5 | IKEA, Hòa Phát, Herman Miller, Vifon, Kinnarps |
| categories | 6 | Sofa, Beds, Tables, Chairs, Wardrobes, Outdoor |
| products | 10 | Đa dạng danh mục, có giá khuyến mãi |
| reviews | 6 | Có đánh giá và phản hồi từ manager |
| carts | 2 | Giỏ hàng đang hoạt động |
| orders | 5 | Các trạng thái: pending, confirmed, shipping, delivered |
| payments | 3 | VNPay success |

### Tài khoản test

| Role | Email | Password |
|---|---|---|
| Admin | `admin@furniture.com` | `Admin@123` |
| Manager | `manager@furniture.com` | `Manager@123` |
| Customer | `an.nguyen@gmail.com` | `Customer@123` |
| Customer | `bich.tran@gmail.com` | `Customer@123` |
| Customer | `cuong.le@gmail.com` | `Customer@123` |

### Ví dụ test với curl

```bash
# Đăng nhập
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"an.nguyen@gmail.com","password":"Customer@123"}'

# Xem sản phẩm (public)
curl http://localhost:5000/api/products?page=1&limit=5

# Thêm vào giỏ hàng (cần token)
curl -X POST http://localhost:5000/api/cart/items \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"productId":"<PRODUCT_ID>","quantity":1}'

# Xem thống kê (manager/admin)
curl http://localhost:5000/api/stats?year=2026 \
  -H "Authorization: Bearer <MANAGER_TOKEN>"
```

---

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Database | MongoDB 8.x (Community) |
| ODM | Mongoose 8.x |
| Authentication | JWT (jsonwebtoken) |
| Password hashing | bcryptjs |
| Env management | dotenv |
| Dev server | nodemon |
