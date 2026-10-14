# HELICORP — Specification & Architecture Document (spec.md)

> **Mã dự án:** HELICORP-UAM-2026  
> **Phiên bản:** 1.0.0  
> **Tuân thủ chuẩn:** `lib-engineering-discipline` & `lib-web-frontend-quality`

---

## 1. Bối cảnh & Mục tiêu (Context & Objectives)
Xây dựng nền tảng web thương hiệu cao cấp cho **HELICORP** — Tập đoàn tiên phong về trực thăng thế hệ mới, vận tải y tế khẩn cấp (MedEvac) và máy bay cất hạ cánh thẳng đứng chạy điện (eVTOL - Urban Air Mobility).

### Mục tiêu cốt lõi:
1. **Thẩm mỹ đỉnh cao (Aero-Luxury / Tech-Avant-Garde):** Giao diện đậm chất hàng không tương lai, tối giản, sang trọng, loại bỏ hoàn toàn "AI-slop".
2. **Hiệu năng cực đại (PageSpeed Mobile ≥ 90):** Áp dụng trọn vẹn Bộ 7 Nguyên tắc Sắt PageSpeed (Critical CSS inline, Zero Render-Blocking, LCP preload, CLS = 0).
3. **Đầy đủ tính năng bắt buộc & nâng cao:**
   - **Core Landing:** Hero, Highlight Features, Technical Specifications & Interactive Comparison, Newsletter Form.
   - **Dark / Light Mode:** Chuyển đổi mượt mà, lưu trạng thái `localStorage`.
   - **Scrollytelling & Parallax:** Trải nghiệm cuộn trang mô phỏng hành trình bay ("Flight Profile & Aerodynamics").
   - **Form & Webhook:** Validate nghiêm ngặt (Email RFC, số điện thoại, tên), gửi webhook thời gian thực (Webhook.site / Endpoint API), hiển thị toast thông báo trạng thái.
   - **Telemetry & Event Tracking:** Theo dõi hành vi click, scroll depth, session duration kèm HUD Console trực quan.
   - **Mini E-commerce:** Hạm đội máy bay (Fleet Catalog), Danh sách yêu thích (Wishlist), Cấu hình & Giỏ cọc chuyến bay (Cart / Pre-Order), Đã xem gần đây (Recently Viewed).
   - **AI Copilot Chatbot:** Cửa sổ trò chuyện trực tuyến góc màn hình với tri thức chuyên sâu về hạm đội trực thăng, thông số bay và hỗ trợ khách hàng.
   - **Backend API:** Node.js Express server cục bộ + Serverless function chuẩn hóa sẵn sàng cho Vercel.
   - **Triển khai & CI/CD:** Git repository, Conventional Commits theo từng bước, tự động hóa build/deploy lên Vercel / GitHub Pages.

### Non-Goals (Ngoài phạm vi):
- Không xử lý thanh toán thẻ tín dụng thực tế (dùng mock payment / booking confirmation voucher).
- Không xây dựng CMS quản trị nội dung đa người dùng (dùng structured data JSON type-safe).

---

## 2. Kiến trúc & Công nghệ (Architecture Decision)

### Quyết định kỹ thuật:
- **Ngôn ngữ & Bundler:** TypeScript + Vite. Đảm bảo type safety 100%, bundle size tối thiểu (< 35KB gzipped), Zero Hydration lag.
- **Styling:** Vanilla CSS kết hợp CSS Custom Properties (Design Tokens), container queries, CSS grid/flexbox, không dùng TailwindCSS (đúng quy định của dự án).
- **Backend & Webhook:** 
  - Express.js API server (`server/index.js`) phục vụ môi trường local và phát triển backend.
  - Vercel Serverless Functions (`api/newsletter.ts`, `api/telemetry.ts`, `api/chat.ts`, `api/webhook.ts`) cho môi trường cloud.
- **Lưu trữ dữ liệu phía client:** Web Storage API (`localStorage`) cho Wishlist, Cart, Recently Viewed, Theme preferences.

---

## 3. Hệ thống Thiết kế (Design System & Color Tokens)

Tuân thủ quy tắc vàng 60-30-10 và chuẩn WCAG 2.2 AA (Tương phản ≥ 4.5:1):
- **60% Chủ đạo (Dominant):**
  - Dark Mode: `#0a0e17` (Deep Titanium Slate) / `#111827`
  - Light Mode: `#f8fafc` (Aero White) / `#ffffff`
- **30% Cấu trúc (Structure):**
  - Dark Mode: Surface `#161f30`, viền `rgba(255, 255, 255, 0.08)`, text `#94a3b8`
  - Light Mode: Surface `#ffffff`, viền `rgba(0, 0, 0, 0.08)`, text `#475569`
- **10% Điểm nhấn (Accent):**
  - Primary Accent: `#00f0ff` (Cyan Ion Thruster) / `#0284c7` (Light Mode)
  - Secondary Accent: `#f59e0b` (Avionics Amber)
- **Typography:**
  - Headings: `Plus Jakarta Sans`, sans-serif (700/800)
  - Body: `Inter`, sans-serif (400/500/600)
  - Avionics / Telemetry Data: `JetBrains Mono`, monospace

---

## 4. Đặc tả tính năng chi tiết (Acceptance Criteria)

### AC 1: Hero & Scrollytelling
- Hero hiển thị tiêu đề thương hiệu, slogan, CTA "Khám phá Hạm đội", thông số nhanh (Tốc độ tối đa, Tầm bay, Không phát thải).
- Mô phỏng chuyến bay Parallax Scrollytelling theo từng chặng (Takeoff, Cruise, Vector Thrust, Landing).

### AC 2: Technical Specifications & Fleet Comparator
- Tối thiểu 4 mẫu máy bay: **Helicorp HX-9 Stealth**, **SkyLifter H-600**, **Veloce VT-4 eVTOL**, **Aura MedEvac-8**.
- Bảng so sánh thông số tương tác: Tốc độ hành trình, Tầm bay tối đa, Tải trọng hữu ích, Trần bay, Độ ồn âm học.

### AC 3: Mini E-commerce Suite
- **Fleet Showcase:** Lọc theo phân khúc (VIP / Tactical Cargo / Urban eVTOL / Medical).
- **Wishlist:** Thêm/xóa sản phẩm, badge số lượng, hiển thị modal/drawer.
- **Cart / Booking Configurator:** Cấu hình nội thất (VIP Lounge, Medical Suite, Cargo Bay) và cọc giữ chỗ.
- **Recently Viewed:** Tự động ghi nhớ khi xem chi tiết máy bay.

### AC 4: Form & Real Webhook Integration
- Form nhận bản tin & đặt lịch bay thử: Validate họ tên (≥ 2 ký tự), email (chuẩn RFC 5322), số điện thoại (định dạng 10 số).
- Gửi payload JSON đến webhook endpoint thực tế.
- UI phản hồi: State loading, Toast thành công / thất bại, reset form.

### AC 5: Live Telemetry & User Event Tracking
- Theo dõi sự kiện: Click CTA, Scroll Depth (25%, 50%, 75%, 100%), Time on Site.
- Floating HUD Console cho phép người dùng mở xem log sự kiện thời gian thực.

### AC 6: AI Flight Copilot (Chatbot)
- Floating button góc phải màn hình.
- Trả lời tức thì câu hỏi về giá cọc, thông số HX-9, chứng chỉ an toàn FAA/EASA, trạm cất hạ cánh vertiport.
- Fallback thông minh và đề xuất câu hỏi gợi ý.

### AC 7: Hiệu năng PageSpeed Mobile ≥ 90
- Inline Critical CSS.
- Defer non-critical CSS và JS.
- Mọi hình ảnh có `width`, `height`, `aspect-ratio`, ảnh LCP có `fetchpriority="high"` và `preload`.
- Không có layout shift (`CLS = 0`).

---

## 5. Kế hoạch Kiểm chứng (Verification Plan)
- **Kiểm tra kiểu dữ liệu & Lint:** `npm.cmd run build` không lỗi TypeScript, 0 `any`.
- **Unit & Logic Tests:** Kiểm tra form validation, cart/wishlist calculation, state transitions.
- **Kiểm thử giao diện:** Kiểm tra Responsive trên Desktop (1440px), Tablet (768px), Mobile (375px).
- **Lighthouse / Core Web Vitals Audit:** Đạt điểm Mobile Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices = 100.
