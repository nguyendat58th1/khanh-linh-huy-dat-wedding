# Wedding Gallery 💍

Trang web tĩnh trưng bày ảnh cưới, có nhạc nền, hiệu ứng cuộn, lightbox xem ảnh và countdown ngày cưới.

## Cấu trúc

```
wedding-gallery/
├── index.html          # Trang chính
├── css/style.css       # Style tuỳ chỉnh
├── js/
│   ├── config.js       # ⭐ CẤU HÌNH ẢNH, NHẠC, NGÀY CƯỚI
│   └── main.js         # Logic: lightbox, music, countdown
└── assets/
    ├── images/         # ➜ Bỏ ảnh cưới của bạn vào đây
    └── music/
        └── wedding.mp3 # ➜ Bỏ file nhạc nền vào đây
```

## Thư viện sử dụng (qua CDN, không cần build)

- **TailwindCSS** – utility CSS framework
- **AOS** – Animate On Scroll
- **GLightbox** – Lightbox xem ảnh
- **Font Awesome 6** – Icon
- **Google Fonts**: Great Vibes, Playfair Display, Cormorant Garamond

## Cách chạy

Mở trực tiếp `index.html` bằng trình duyệt, hoặc dùng VS Code Live Server / lệnh sau:

```powershell
# Tại thư mục wedding-gallery
python -m http.server 5500
# rồi mở http://localhost:5500
```

## ⭐ Tuỳ chỉnh qua file config.js

Mọi thông tin đều cấu hình trong **[js/config.js](js/config.js)**:

### Thêm ảnh cưới
1. Bỏ file ảnh vào thư mục `assets/images/`
2. Mở `js/config.js`, thêm tên file vào mảng `galleryImages`:

```javascript
galleryImages: [
  'pre-wedding-01.jpg',
  'ceremony-01.jpg',
  'reception-01.jpg',
  // ... thêm bao nhiêu tuỳ thích
],
```

### Đổi nhạc nền
1. Bỏ file nhạc vào `assets/music/`
2. Sửa `backgroundMusic` trong config:

```javascript
backgroundMusic: 'ten-file-nhac.mp3',
```

### Đổi ngày cưới
```javascript
weddingDate: '2026-10-18T10:00:00',  // YYYY-MM-DDTHH:mm:ss
```

### Đổi tên cô dâu / chú rể
```javascript
brideName: 'Khánh Linh',
groomName: 'Huy Đạt',
```

## Lưu ý

- Ảnh đang dùng là **placeholder từ Unsplash**. Hãy thay bằng ảnh thật theo hướng dẫn trên.
- Trình duyệt sẽ chặn autoplay nhạc cho tới khi người dùng click chuột lần đầu — đây là hành vi chuẩn của Chrome/Safari.
- Để deploy: đẩy folder này lên **GitHub Pages**, **Netlify**, hoặc **Vercel** là chạy ngay.
