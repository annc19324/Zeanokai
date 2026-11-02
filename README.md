# Zeanokai - Ứng Dụng Quản Lý Buổi Dạy Gia Sư & Tính Học Phí

**Zeanokai** là hệ thống web hiện đại, tinh gọn và thẩm mỹ giúp các gia sư quản lý, ghi chép và theo dõi lịch dạy, tính tiền học phí theo từng buổi và từng học sinh một cách chuyên nghiệp.

---

## 🌟 Tính Năng Nổi Bật

1. **Đầy đủ thông tin buổi học**:
   - Tên học sinh / môn học / lớp (có gợi ý nhanh từ các buổi trước).
   - **Thứ, ngày tháng năm**: Tự động tính thứ tiếng Việt (Thứ Hai, Thứ Ba... Chủ Nhật) khi chọn ngày.
   - **Khung giờ**: Tuỳ chọn giờ bắt đầu & giờ kết thúc.
   - **Số tiền 1 buổi**: Nhập số định dạng tiền tệ VNĐ linh hoạt, hỗ trợ nút chọn nhanh học phí phổ biến (150k, 200k, 250k, 300k, 400k, 500k).
   - **Ghi chú**: Nội dung bài giảng, bài tập về nhà, tình hình học tập, học bù.
   - **Trạng thái thanh toán**: Đã thanh toán / Chưa thanh toán (chuyển đổi 1 chạm).

2. **Thống kê & Tổng kết (Tổng)**:
   - Tổng số buổi dạy trong kỳ/tháng được chọn.
   - Tổng số tiền học phí kiếm được.
   - Số tiền đã thanh toán (đã thu).
   - Số tiền chưa thanh toán (cần thu từ phụ huynh).
   - Phân tích chi tiết học phí và số buổi theo từng học sinh.

3. **Bộ lọc thông minh & Đa năng**:
   - **Mặc định hiển thị theo tháng trước tháng hiện tại** (tiện lợi cho việc tính và chốt sổ học phí chu kỳ vừa qua).
   - Các nút chuyển nhanh:
     - 🌟 **Tháng trước (Mặc định)**
     - 📅 **Tháng này**
     - 🌐 **Tất cả các tháng**
   - Bộ chọn cụ thể: Tháng 1 - 12, Năm 2024 - 2028.
   - Lọc theo từng học sinh.
   - Lọc theo trạng thái thanh toán (Đã trả / Chưa trả).
   - Ô tìm kiếm từ khóa thời gian thực.

4. **Đa giao diện (Responsive & Đẹp mắt)**:
   - Tương thích hoàn hảo trên Máy tính (Desktop/Laptop), Máy tính bảng (Tablet) và Điện thoại di động (Mobile).
   - Hỗ trợ chế độ xem **Bảng chi tiết (Table View)** và **Thẻ danh thiếp (Card View)**.
   - Hỗ trợ giao diện **Sáng (Light Mode)** và **Tối (Dark Mode)** sang trọng.

5. **Xuất báo cáo & In phiếu học phí**:
   - **Xuất file Excel (CSV UTF-8 BOM)**: Mở trực tiếp trong Excel tiếng Việt không bị lỗi font.
   - **In Phiếu Báo Học Phí (Print / PDF)**: Tạo hoá đơn tổng kết tháng chuyên nghiệp kèm thông tin tài khoản chuyển khoản để gửi phụ huynh qua Zalo/Facebook.

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Cơ sở dữ liệu**: [Neon Serverless PostgreSQL](https://neon.tech/)

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt dependencies:
```bash
npm install
```

### 2. Cấu hình file môi trường:
Tạo file `.env.local` tại thư mục gốc:
```env
DATABASE_URL="postgresql://neondb_owner:npg_QHDLurXb21te@ep-hidden-art-aoaogril-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### 3. Khởi tạo cơ sở dữ liệu:
```bash
# Tạo bảng tutoring_sessions
node scripts/init-db.js

# (Tùy chọn) Nạp dữ liệu mẫu
node scripts/seed-data.js
```

### 4. Chạy chế độ phát triển (Development):
```bash
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 5. Build và chạy Production:
```bash
npm run build
npm start
```
