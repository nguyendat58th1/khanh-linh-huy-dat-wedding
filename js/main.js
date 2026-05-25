/* ============================================
   Wedding Gallery - main script
   ============================================ */

// ---- Render Gallery từ CONFIG ----
function renderGallery() {
  const container = document.getElementById('masonry');
  if (!container || !CONFIG?.galleryImages) return;

  container.innerHTML = ''; // Clear existing

  CONFIG.galleryImages.forEach((img, index) => {
    const isObject = typeof img === 'object';
    const thumbSrc = isObject ? img.src : `assets/images/${img}`;
    const fullSrc = isObject ? img.full : `assets/images/${img}`;

    const link = document.createElement('a');
    link.href = fullSrc;
    link.className = 'glightbox masonry-item';
    link.setAttribute('data-gallery', 'wedding');
    link.setAttribute('data-aos', 'zoom-in');

    const imgEl = document.createElement('img');
    imgEl.src = thumbSrc;
    imgEl.alt = `Wedding ${index + 1}`;
    imgEl.loading = 'lazy';

    link.appendChild(imgEl);
    container.appendChild(link);
  });
}

// ---- Setup Background Music từ CONFIG ----
function setupMusic() {
  const audio = document.getElementById('bgMusic');
  if (!audio || !CONFIG?.backgroundMusic) return;

  // Set source từ config
  const source = audio.querySelector('source');
  if (source) {
    source.src = `assets/music/${CONFIG.backgroundMusic}`;
    audio.load();
  }
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // Render gallery từ config
  renderGallery();

  // Setup music source
  setupMusic();

  // AOS init
  AOS.init({
    duration: 1000,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });

  // Lightbox - hien thi anh vua man hinh, giu ty le
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    zoomable: true,
    draggable: false,
    openEffect: 'fade',
    closeEffect: 'fade',
  });
});

// ---- Background music toggle ----
const audio = document.getElementById('bgMusic');
const toggle = document.getElementById('musicToggle');
let isPlaying = false;

function playMusic() {
  audio.play().then(() => {
    isPlaying = true;
    toggle.classList.add('playing');
  }).catch(() => {
    // Trình duyệt chặn autoplay - chờ người dùng click
  });
}

toggle.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    toggle.classList.remove('playing');
  } else {
    playMusic();
  }
});

// Thử autoplay (đa số trình duyệt sẽ chặn cho tới khi user tương tác)
document.addEventListener('click', function once() {
  if (!isPlaying) playMusic();
  document.removeEventListener('click', once);
}, { once: true });

// ---- Countdown ----
// Đọc từ CONFIG nếu có, fallback về giá trị mặc định
const WEDDING_DATE = new Date(CONFIG?.weddingDate || '2026-10-18T10:00:00').getTime();

const elDays  = document.getElementById('cd-days');
const elHours = document.getElementById('cd-hours');
const elMins  = document.getElementById('cd-mins');
const elSecs  = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const diff = WEDDING_DATE - Date.now();
  if (diff <= 0) {
    elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  elDays.textContent  = pad(d);
  elHours.textContent = pad(h);
  elMins.textContent  = pad(m);
  elSecs.textContent  = pad(s);
}
tick();
setInterval(tick, 1000);
