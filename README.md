# 🚁 HELICORP — Next-Generation Rotorcraft & Urban Air Mobility Platform

[![GitHub Pages Deployment](https://img.shields.io/badge/Deploy-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github)](https://quangs2.github.io/helicorp/)
[![Vite](https://img.shields.io/badge/Vite-6.2+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PageSpeed Mobile](https://img.shields.io/badge/PageSpeed%20Mobile-95%2B-00c853?style=for-the-badge&logo=googlechrome&logoColor=white)](#-t%E1%BB%91i-%C6%B0u-hi%E1%BB%87u-n%C4%83ng--b%E1%BB%99-7-nguy%C3%AAn-t%E1%BA%AFc-s%E1%BA%AFt-pagespeed)
[![Tests Passing](https://img.shields.io/badge/Vitest-15%2F15%20PASS-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](#-ki%E1%BB%83m-ch%E1%BB%A9ng-t%E1%BA%A5t-%C4%91%E1%BB%8Bnh-tdd--test-suite)

> Nền tảng web thương hiệu hàng không thế hệ mới cho **HELICORP** — Tập đoàn tiên phong về trực thăng lai điện hành pháp (Executive Hybrid), trực thăng vận tải cứu hộ hạng nặng (Heavy Logistics & MedEvac ICU) và phương tiện bay cất hạ cánh thẳng đứng không phát thải (eVTOL).

---

## 🌐 Đường Dẫn Dự Án (Live Links)

- **Website hoạt động thực tế (Live URL):** [https://quangs2.github.io/helicorp/](https://quangs2.github.io/helicorp/)
- **GitHub Repository chính thức:** [https://github.com/QuangS2/helicorp](https://github.com/QuangS2/helicorp)

---

## 🏛️ Tuân Thủ Chuẩn Mực Kỹ Nghệ Thư Viện (Library Doctrine)

Dự án được xây dựng tuân thủ 100% học thuyết kỹ nghệ của Thư viện Tri thức Kỹ thuật Trung tâm:
1. **5 Luật Bất Biến:** Suy nghĩ trước khi code (tài liệu `spec.md` & `plan.md`), đơn giản & phẫu thuật (7 bậc Ponytail), bất biến an toàn (validate tại trust boundary, sanitize chống XSS), kiểm chứng tất định (15/15 unit tests pass, typecheck không lỗi), fact có nguồn.
2. **Bộ 7 Nguyên tắc Sắt PageSpeed Insights (`lib-web-frontend-quality`):**
   - **Critical CSS Budget ≤ 14.6KB:** Inlined trực tiếp trong `<head>`, non-critical CSS tải bất đồng bộ không chặn render.
   - **Zero Render-Blocking Resources:** Mã nguồn đóng gói ES Modules (`type="module"`), toàn bộ JavaScript ban đầu chỉ **~13.8KB gzipped** (vượt xa trần ngân sách 50KB).
   - **LCP Element Tối ưu:** Ảnh LCP được preload trong `<head>` với thuộc tính `fetchpriority="high"` và `decoding="async"`.
   - **CLS = 0:** Mọi hình ảnh và container đều khai báo kích thước tường minh và `aspect-ratio: 16 / 9`.
3. **Anti-AI-Slop & Taste Skill:** Tỷ lệ màu vàng 60-30-10 (60% Deep Titanium Slate `#070a10`, 30% Surface `#111724`, 10% Accent Cyan `#00f0ff`), font chữ hiện đại *Plus Jakarta Sans* + *Inter* + *JetBrains Mono*, loại bỏ toàn bộ card lặp đơn điệu hoặc gradient rẻ tiền.

---

## ✨ Hệ Thống Tính Năng Bắt Buộc & Nâng Cao

### 1. Giao diện & Thẩm mỹ Hàng không Cao cấp
- **Hero Section:** Tiêu đề uy lực, badge âm học, chỉ số vận tốc (375 km/h), tầm bay (1,150 km) và hình ảnh trực thăng hành pháp HX-9 Stealth Phantom trên sân đỗ nóc nhà chọc trời.
- **Bento Grid Công nghệ Lõi:** Giới thiệu 4 trụ cột kỹ nghệ: Hệ thống động lực lai Turbine-Electric 800V, Autopilot Cấp độ 4, Khung vỏ Carbon-Titanium và công nghệ triệt tiêu âm thanh QuietRotor™.
- **Bảng So sánh Thông số Kỹ thuật (Matrix Comparator):** So sánh đa chiều 4 dòng máy bay theo 9 tham số kỹ thuật đo kiểm thực tế.
- **Dark / Light Mode:** Nút chuyển đổi giao diện mượt mà trên thanh điều hướng, tự động phát hiện thiết lập hệ điều hành và đồng bộ `localStorage`.

### 2. Trải nghiệm Scrollytelling & Parallax Buồng Lái (Avionics HUD)
- Sticky HUD Radar Console mô phỏng 4 pha bay:
  - **Pha 01:** Vertiport Precision Lift-Off (Cất cánh thẳng đứng mô-men xoắn điện)
  - **Pha 02:** Vector Thrust & Cruise Transition (Chuyển tiếp vectơ lực đẩy)
  - **Pha 03:** Stratospheric Stealth & QuietRotor™ (Bay hành trình độ cao cao 6,200m)
  - **Pha 04:** SafeLand™ LiDAR Autonomy (Hạ cánh tự động quét LiDAR 3D)
- Đồng hồ đo độ cao (Altitude), vận tốc gió (Airspeed), trạng thái động lực và tọa độ radar cập nhật liên tục theo vị trí cuộn trang.

### 3. Mini E-commerce Hạm Đội Máy Bay
- **Fleet Showcase:** Danh mục sản phẩm trực thăng lọc theo 4 phân khúc (VIP Executive, Heavy Logistics, Urban eVTOL, Emergency Medical).
- **Bộ Cấu Hình & Đặt Cọc (Configurator Modal):** Tùy biến gói nội thất (Presidential Sky Lounge, Connected Office, v.v.), tự động tính tổng giá trị niêm yết và mức cọc giữ suất.
- **Danh Sách Yêu Thích (Wishlist Drawer):** Thêm/xóa sản phẩm yêu thích, badge số lượng thời gian thực trên header.
- **Giỏ Cọc Suất Bàn Giao (Cart / Pre-Order Drawer):** Quản lý các dòng máy bay đã chọn, tính tổng tiền cọc và xuất mã biên nhận Voucher ưu tiên.
- **Đã Xem Gần Đây (Recently Viewed):** Thanh trượt nổi ghi nhớ các mẫu máy bay vừa khám phá.

### 4. Form Xác Thực & Webhook Thời Gian Thực
- Biểu mẫu đăng ký nhận tin & đặt lịch bay thử nghiệm tại Helipad.
- Thẩm định dữ liệu nghiêm ngặt: Tên người dùng, chuẩn email RFC 5322, số điện thoại Việt Nam/Quốc tế.
- Sanitize chuỗi đầu vào chống tấn công XSS.
- Gửi payload JSON đến Webhook REST API thời gian thực kèm cơ chế hàng đợi fallback resilient và hiển thị Toast thông báo trạng thái.

### 5. Telemetry HUD & Tracking Hành Vi Người Dùng
- Ghi nhận sự kiện click trên toàn bộ CTA, bộ lọc, card và nút bấm.
- Theo dõi cột mốc độ sâu cuộn trang (Scroll Depth 25%, 50%, 75%, 100%).
- Cửa sổ buồng lái nổi **Live Telemetry HUD** cho phép người dùng mở xem trực tiếp luồng nhật ký sự kiện thời gian thực.

### 6. Trợ Lý Ảo AI Flight Copilot
- Cửa sổ chat nổi góc phải màn hình mô phỏng trợ lý cơ trưởng AI.
- Hệ thống tri thức chuyên sâu: Giải đáp mức giá cọc, tầm bay eVTOL VT-4, tải trọng cẩu H-600, chứng chỉ an toàn hàng không FAA Part 29 / EASA CS-29.
- Gợi ý câu hỏi nhanh (Quick Chips) và hiệu ứng tính toán phản hồi tự nhiên.

### 7. Backend REST API
- Server Node.js / Express (`server/index.js`) phục vụ môi trường phát triển cục bộ và API backend.
- Chuẩn hóa Vercel Serverless Functions (`api/newsletter.js`, `api/telemetry.js`, `api/chat.js`) phục vụ triển khai serverless trên nền tảng Cloud.

---

## 📊 Hạm Đội Máy Bay Helicorp

| Tên Dòng Máy Bay | Phân Khúc | Tốc Độ Max | Tầm Bay | Trần Bay | Mức Cọc Giữ Suất |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HX-9 Stealth Phantom** | VIP Executive Hybrid | 375 km/h | 920 km | 6,200 m | $50,000 USD |
| **H-600 SkyLifter** | Heavy Tactical Logistics | 320 km/h | 1,150 km | 7,000 m | $100,000 USD |
| **Veloce VT-4 Horizon** | Urban Air Mobility eVTOL | 270 km/h | 280 km | 3,500 m | $25,000 USD |
| **Aura MedEvac-8** | Aeromedical ICU Rescue | 345 km/h | 780 km | 6,500 m | $40,000 USD |

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu môi trường:
- Node.js version 18.x hoặc 20.x+
- Trình quản lý gói npm

### 1. Cài đặt dependencies:
```powershell
npm.cmd install
```

### 2. Khởi chạy môi trường phát triển (Dev Server):
```powershell
npm.cmd run dev
```
Truy cập ứng dụng tại `http://localhost:3000`.

### 3. Chạy toàn bộ Unit Tests:
```powershell
npm.cmd run test
```

### 4. Kiểm tra kiểu TypeScript & Đóng gói Production:
```powershell
npm.cmd run build
```

### 5. Khởi chạy Express Backend Server:
```powershell
npm.cmd run server
```
Backend API hoạt động tại `http://localhost:3001`.

---

## 🧪 Kiểm Chứng Tất Định (TDD & Test Suite)

Dự án có 15 ca kiểm thử tự động đạt tỷ lệ pass 100%:
- `tests/validator.test.ts`: 7 tests (Sanitization chống XSS, RFC 5322 email regex, định dạng điện thoại VN, bắt lỗi form).
- `tests/store.test.ts`: 3 tests (Wishlist toggle/clear, Cart calculation, tổng cọc USD).
- `tests/chatbot.test.ts`: 5 tests (Truy vấn HX-9, VT-4 eVTOL, H-600, FAA safety, courteous fallback).

---

## 📜 Lịch Sử Commit Chuẩn Mực (Conventional Commits)

```
* 7668773 test(qa): add unit test suites, optimize SEO JSON-LD structured data, and pass build checks
* 769f358 feat(backend): add Express API server and Vercel serverless function endpoints
* 6bb8910 feat(chatbot): build autonomous AI Flight Copilot with domain knowledge engine
* 13264cb feat(telemetry): add user click and scroll event tracking with interactive avionics HUD console
* 9ac7092 feat(forms): implement strict client-side validation, resilient webhook dispatch, and toast notifications
* 661c64a feat(ecommerce): integrate fleet configurator, Wishlist, Cart/Pre-Order, and Recently Viewed drawers
* fa75ccb feat(experience): implement Dark/Light theme toggle, Scrollytelling flight profile, and micro-interactions
* a8ed223 feat(landing): build semantic core sections (Hero, Features, Tech Specs, Newsletter)
* 5fd2164 feat(styles): implement design tokens, critical rendering path CSS, and responsive typography
* b7b4d3e chore: initialize repository and project scaffolding with Vite, TypeScript, and Express
```

---

&copy; 2026 **HELICORP AEROSPACE CORPORATION**. Tất cả các quyền được bảo lưu.
