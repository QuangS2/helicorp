# HELICORP — Implementation Roadmap & Execution Plan (plan.md)

> **Tuân thủ:** `lib-engineering-discipline` (Surgical Changes, Ponytail 7-Rungs, Zero-Slop, TDD, Commits chi tiết)

---

## Danh sách Task chi tiết

### Giai đoạn 1: Khởi tạo Nền tảng & Git Repository
- [ ] **Task 1.1:** Khởi tạo Git repo (`git init`), cấu hình `.gitignore`, kiểm tra môi trường.
- [ ] **Task 1.2:** Thiết lập dự án `package.json`, Vite, TypeScript, Express, Vitest (cho unit testing), scripts build/dev/test.
- [ ] **Task 1.3:** Commit 1: `chore: initialize repository and project scaffolding with Vite, TypeScript, and Express`.

### Giai đoạn 2: Design Tokens & PageSpeed Critical Architecture
- [ ] **Task 2.1:** Xây dựng Design System (`src/styles/tokens.css`, `src/styles/main.css`) tuân thủ 60-30-10, WCAG 2.2, zero AI-slop.
- [ ] **Task 2.2:** Xây dựng Critical CSS nhúng thẳng vào `<head>` (`index.html`) ≤ 14.6KB theo Nguyên tắc Sắt PageSpeed.
- [ ] **Task 2.3:** Tạo tài nguyên hình ảnh chất lượng cao, định dạng tối ưu WebP/SVG với kích thước `width`, `height`, `aspect-ratio` tường minh.
- [ ] **Task 2.4:** Commit 2: `feat(styles): implement design tokens, critical rendering path CSS, and responsive typography`.

### Giai đoạn 3: Core Landing Sections & Semantic HTML
- [ ] **Task 3.1:** Hero Section với LCP tối ưu (`fetchpriority="high"`, zero CLS), CTA, badge âm học & vận tốc.
- [ ] **Task 3.2:** Highlight Features: Hệ thống Động lực Lai Turbine-Electric, Autopilot Cấp độ 4, Thân vỏ Carbon-Titanium, Cánh quạt triệt tiêu âm học QuietRotor™.
- [ ] **Task 3.3:** Bảng Thông số Kỹ thuật tương tác (Interactive Tech Specs Comparator) cho 4 dòng máy bay (HX-9, H-600, VT-4, MedEvac-8).
- [ ] **Task 3.4:** Form Đăng ký nhận tin & Đặt lịch thẩm định chuyên sâu.
- [ ] **Task 3.5:** Commit 3: `feat(landing): build semantic core sections (Hero, Features, Tech Specs, Newsletter)`.

### Giai đoạn 4: Scrollytelling, Parallax & Dark/Light Mode
- [ ] **Task 4.1:** Module quản lý Theme (`src/modules/theme.ts`): Tự động phát hiện OS theme, switch Light/Dark, đồng bộ `localStorage`, chuyển đổi không giật layout.
- [ ] **Task 4.2:** Scrollytelling & Parallax Engine (`src/modules/scrollytelling.ts`): Hiệu ứng cuộn mô phỏng 4 pha bay (Vertiport Lift-off -> Vector Cruise -> High-Altitude Stealth -> Precision Landing).
- [ ] **Task 4.3:** Skeleton loading & micro-interactions tinh tế cho button, badge, card hover.
- [ ] **Task 4.4:** Commit 4: `feat(experience): implement Dark/Light theme toggle, Scrollytelling flight profile, and micro-interactions`.

### Giai đoạn 5: Mini E-commerce Suite (Fleet, Wishlist, Cart, Recently Viewed)
- [ ] **Task 5.1:** Fleet Data Model & Storage Manager (`src/modules/fleet.ts`, `src/modules/store.ts`).
- [ ] **Task 5.2:** Trình xem & cấu hình máy bay (VIP Executive, AeroMed Suite, Cargo Logistics).
- [ ] **Task 5.3:** Wishlist Drawer: Thêm, xóa, lưu `localStorage`, badge đếm thời gian thực.
- [ ] **Task 5.4:** Cart / Pre-Order Drawer: Tính tổng cọc giữ chỗ, cấu hình nội thất, voucher ưu tiên bàn giao.
- [ ] **Task 5.5:** Recently Viewed Bar: Tự động ghi nhớ máy bay vừa khám phá.
- [ ] **Task 5.6:** Commit 5: `feat(ecommerce): integrate fleet configurator, Wishlist, Cart/Pre-Order, and Recently Viewed drawers`.

### Giai đoạn 6: Form Validation & Real Webhook Integration
- [ ] **Task 6.1:** Validator Module (`src/modules/validator.ts`): RFC 5322 email regex, phone formatting, XSS sanitization.
- [ ] **Task 6.2:** Webhook Client (`src/modules/webhook.ts`): Dispatch dữ liệu đến webhook endpoint thực tế kèm fallback resilient queue.
- [ ] **Task 6.3:** Toast Notification System (`src/modules/toast.ts`): Thông báo kết quả gửi form mượt mà.
- [ ] **Task 6.4:** Commit 6: `feat(forms): implement strict client-side validation, resilient webhook dispatch, and toast notifications`.

### Giai đoạn 7: Live Telemetry & User Event Tracking
- [ ] **Task 7.1:** Telemetry Tracker (`src/modules/telemetry.ts`): Đo lường sự kiện click, scroll depth (25, 50, 75, 100%), time on page.
- [ ] **Task 7.2:** Flight Telemetry HUD Console: Cửa sổ nổi hiển thị trực tiếp dòng sự kiện người dùng theo phong cách buồng lái phi công (Avionics HUD).
- [ ] **Task 7.3:** Commit 7: `feat(telemetry): add user click and scroll event tracking with interactive avionics HUD console`.

### Giai đoạn 8: AI Copilot Chatbot (Helicorp Flight Assistant)
- [ ] **Task 8.1:** Chatbot Knowledge Engine (`src/modules/chatbot.ts`): Kiến thức chuyên sâu về 4 mẫu trực thăng, quy chuẩn cất hạ cánh, hỗ trợ khách hàng.
- [ ] **Task 8.2:** Chatbot UI: Cửa sổ chat nổi góc phải, typing indicator, quick suggested questions, âm thanh/haptic micro-effects.
- [ ] **Task 8.3:** Commit 8: `feat(chatbot): build autonomous AI Flight Copilot with domain knowledge engine`.

### Giai đoạn 9: Backend API (Node.js/Express & Serverless Endpoints)
- [ ] **Task 9.1:** Xây dựng Express server (`server/index.js`): Endpoints `/api/newsletter`, `/api/bookings`, `/api/telemetry`, `/api/chat`, `/api/health`.
- [ ] **Task 9.2:** Chuẩn hóa Vercel Serverless Functions (`api/newsletter.js`, `api/telemetry.js`, `api/chat.js`).
- [ ] **Task 9.3:** Commit 9: `feat(backend): add Express API server and Vercel serverless function endpoints`.

### Giai đoạn 10: Kiểm thử, Tối ưu hóa SEO & PageSpeed
- [ ] **Task 10.1:** Viết và chạy Unit Tests (Vitest) cho validator, store, và fleet logic.
- [ ] **Task 10.2:** Kiểm tra TypeScript compile (`tsc --noEmit`) và Vite production build (`npm run build`).
- [ ] **Task 10.3:** Bổ sung SEO Meta, Open Graph (OG Title/Desc/Image), Twitter Card, JSON-LD Schema.org AerospaceBusiness.
- [ ] **Task 10.4:** Commit 10: `test(qa): add unit test suites, optimize SEO JSON-LD structured data, and pass build checks`.

### Giai đoạn 11: Đẩy GitHub & Triển khai Deployment Thực tế
- [ ] **Task 11.1:** Tạo GitHub repository `QuangS2/helicorp` bằng GitHub CLI (`gh repo create`).
- [ ] **Task 11.2:** Push toàn bộ commits và nhánh lên GitHub.
- [ ] **Task 11.3:** Thiết lập deploy lên Vercel / GitHub Pages, cung cấp đường link website live thực tế.
- [ ] **Task 11.4:** Commit 11: `chore(deploy): finalize deployment configuration and update documentation`.
