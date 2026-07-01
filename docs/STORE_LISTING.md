# Google Workspace Marketplace — Store Listing content

Copy/paste when filling the Marketplace SDK **Store Listing**. Includes English
and Vietnamese versions.

---

## App name
Image Uploader for Google Sheets

## Category
Productivity

## Pricing
Free

---

## English

### Short description (≤ 120 chars)
Upload local images to Google Drive, make them public, and drop their links + metadata into your sheet.

### Detailed description
Image Uploader turns a folder of images on your computer into public image links
inside Google Sheets — in one step.

Pick a folder (or individual images) in the sidebar and the add-on will:
• Upload every image to a new folder in your Google Drive
• Set them to "anyone with the link can view"
• Write a row of metadata for each image into your current sheet

Each row includes: file name, format, size, dimensions (W×H), Drive link,
direct image link (lh3.googleusercontent.com/d/…), a live =IMAGE() preview, and
the upload time. Paste the direct link straight into an <img> tag on your
website.

Why you'll like it:
• One step — no manual uploading, sharing, or copying links
• Folder or individual file selection
• Bilingual UI (English / Tiếng Việt), auto-detected
• Minimal permissions — it can only touch the current sheet and the files it
  creates; it cannot see the rest of your Drive
• Progress and per-file log while uploading

Note: Google Drive is not a CDN. It's great for quickly generating links and for
low-traffic pages; for high-traffic sites consider a dedicated image host.

### Permissions justification (if asked)
• See/edit only the current spreadsheet (spreadsheets.currentonly) — to write
  image metadata.
• See/create only files the add-on makes (drive.file) — to upload images and set
  them public.
• Display and run in the UI (script.container.ui) — to show the sidebar.

---

## Tiếng Việt

### Mô tả ngắn (≤ 120 ký tự)
Upload ảnh từ máy lên Google Drive, đặt public, và chèn link + metadata vào Google Sheet.

### Mô tả chi tiết
Image Uploader biến một thư mục ảnh trên máy tính thành các link ảnh public ngay
trong Google Sheets — chỉ với một bước.

Chọn một thư mục (hoặc từng ảnh) trong sidebar, add-on sẽ:
• Upload toàn bộ ảnh vào một folder mới trên Google Drive của bạn
• Đặt chế độ "ai có link đều xem được"
• Ghi một dòng metadata cho mỗi ảnh vào Sheet đang mở

Mỗi dòng gồm: tên ảnh, định dạng, dung lượng, kích thước (RxC), link Drive, link
ảnh direct (lh3.googleusercontent.com/d/…), ô xem trước =IMAGE(), và thời gian
upload. Dán link direct thẳng vào thẻ <img> trên website của bạn.

Điểm nổi bật:
• Một bước — khỏi upload/chia sẻ/copy link thủ công
• Chọn cả thư mục hoặc từng file
• Giao diện song ngữ Anh/Việt, tự nhận theo tài khoản
• Quyền tối thiểu — chỉ tác động Sheet đang mở và các file do add-on tạo; không
  đọc phần còn lại của Drive
• Thanh tiến trình + log từng file khi upload

Lưu ý: Google Drive không phải CDN. Rất tiện để lấy link nhanh và cho trang ít
truy cập; nếu website tải cao thật sự nên dùng dịch vụ host ảnh chuyên dụng.

### Giải thích quyền (nếu được hỏi)
• Chỉ xem/sửa Sheet đang mở (spreadsheets.currentonly) — để ghi metadata ảnh.
• Chỉ tạo/quản lý file do add-on tạo (drive.file) — để upload ảnh và set public.
• Hiển thị giao diện (script.container.ui) — để hiện sidebar.

---

## Graphic assets checklist
- [ ] App icon 32×32 (PNG)
- [ ] App icon 128×128 (PNG)
- [ ] At least 1 screenshot (1280×800 recommended) of the sidebar in action
- [ ] Optional: banner 220×140

## Required URLs
- Homepage: https://github.com/foyo-ai/image-uploader-googlesheet
- Privacy Policy: (host `docs/PRIVACY.md` on a domain you own, e.g. foyo.ai)
- Terms of Service: (host `docs/TERMS.md` on a domain you own, e.g. foyo.ai)
