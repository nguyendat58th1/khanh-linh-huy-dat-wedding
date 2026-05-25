/* ============================================
   Wedding Gallery - Configuration
   ============================================
   
   📸 Hướng dẫn thêm ảnh:
   1. Bỏ file ảnh vào thư mục: assets/images/
   2. Thêm tên file vào mảng GALLERY_IMAGES bên dưới
   
   🎵 Hướng dẫn đổi nhạc:
   1. Bỏ file nhạc vào thư mục: assets/music/
   2. Đổi tên file trong biến BACKGROUND_MUSIC
   
============================================ */

const CONFIG = {
  // ===== THÔNG TIN CÔ DÂU CHÚ RỂ =====
  brideName: 'Khánh Linh',
  groomName: 'Huy Đạt',
  
  // ===== NGÀY CƯỚI (format: YYYY-MM-DDTHH:mm:ss) =====
  weddingDate: '2026-10-18T10:00:00',
  
  // ===== FILE NHẠC NỀN =====
  // Đặt file nhạc trong: assets/music/
  backgroundMusic: 'wedding.mp3',
  
  // ===== DANH SÁCH ẢNH GALLERY =====
  // Đặt ảnh trong: assets/images/
  // Thêm tên file vào mảng này (có thể dùng jpg, png, webp)
  galleryImages: [
    // Ví dụ:
    // 'pre-wedding-01.jpg',
    // 'ceremony-01.jpg',
    // 'reception-01.jpg',
    
    // === PLACEHOLDER (dùng ảnh Unsplash demo) ===
    // Xoá các URL bên dưới và thay bằng tên file ảnh thật của bạn
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', full: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', full: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', full: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', full: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600' },
    { src: 'https://images.unsplash.com/photo-1525772764200-be829a350797?w=800', full: 'https://images.unsplash.com/photo-1525772764200-be829a350797?w=1600' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', full: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600' },
    { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800', full: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1600' },
    { src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800', full: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1600' },
    { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800', full: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600' },
    { src: 'https://images.unsplash.com/photo-1546035768-987a3e15ee7d?w=800', full: 'https://images.unsplash.com/photo-1546035768-987a3e15ee7d?w=1600' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', full: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600' },
    { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800', full: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600' },
  ],
};

// ====== HƯỚNG DẪN NHANH ======
// 
// Khi có ảnh thật, thay mảng galleryImages thành dạng đơn giản:
//
// galleryImages: [
//   'anh-cuoi-01.jpg',
//   'anh-cuoi-02.jpg',
//   'le-vu-quy.jpg',
//   'tiec-cuoi-01.png',
// ],
//
// Code sẽ tự động đọc từ assets/images/ và hiển thị trong gallery.
