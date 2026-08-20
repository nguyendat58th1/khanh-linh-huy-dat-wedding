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
    'TTD_6724.jpg',
    'TTD_6790.jpg',
    'TTD_6871.jpg',
    'TTD_6985.jpg',
    'TTD_7026.jpg',
    'TTD_7045.jpg',
    'TTD_7067.jpg',
    'TTD_7124.jpg',
    'TTD_7166.jpg',
    'TTD_7200.jpg',
    'TTD_7209.jpg',
    'TTD_7246.jpg',
    'TTD_7273.jpg',
    'TTD_7298.jpg',
    'TTD_7310.jpg',
    'TTD_7324.jpg',
    'TTD_7339.jpg',
    'TTD_7346.jpg',
    'TTD_7374.jpg',
    'TTD_7382.jpg',
    'TTD_7458.jpg',
    'TTD_7466.jpg',
    'TTD_7468.jpg',
    'TTD_7477.jpg',
    'TTD_7480.jpg',
    'TTD_7508.jpg',
    'TTD_7523.jpg',
    'TTD_7580.jpg',
    'TTD_7604.jpg',
    'TTD_7620.jpg',
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
