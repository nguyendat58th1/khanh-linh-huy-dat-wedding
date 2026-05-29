/* ============================================
   Wedding Gallery — Premium main script
   GSAP + ScrollTrigger + Swiper + tsParticles + Lenis + Splitting + LightGallery
   ============================================ */

// ---- Auto-detect images from assets/images/ ----
// Strategy:
//  1. Ưu tiên: đọc assets/images/manifest.json (nếu có) → list filename
//  2. Fallback: thử tải theo pattern 1.jpg, 2.jpg, ... 01.jpg, wedding-01.jpg ...
//  3. Nếu không có ảnh nào → dùng CONFIG.galleryImages (placeholder Unsplash)
async function autoDetectImages() {
  // 1) Try manifest.json
  try {
    const res = await fetch('assets/images/manifest.json', { cache: 'no-store' });
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length) return list;
    }
  } catch (_) { /* ignore */ }

  // 2) Probe common patterns
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG'];
  const patterns = [
    i => `${i}`,
    i => `${String(i).padStart(2, '0')}`,
    i => `wedding-${String(i).padStart(2, '0')}`,
    i => `anh-cuoi-${String(i).padStart(2, '0')}`,
    i => `img-${i}`,
    i => `IMG_${String(i).padStart(4, '0')}`,
  ];
  const tryLoad = (path) => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
  const found = [];
  for (const makeName of patterns) {
    let missStreak = 0;
    for (let i = 1; i <= 100; i++) {
      let hit = null;
      for (const ext of exts) {
        const name = `${makeName(i)}.${ext}`;
        if (await tryLoad(`assets/images/${name}`)) { hit = name; break; }
      }
      if (hit) { found.push(hit); missStreak = 0; }
      else { missStreak++; if (missStreak >= 3) break; }
    }
    if (found.length) return found;
  }
  return null;
}

// ---- Render Gallery (auto > CONFIG) ----
async function renderGallery() {
  const container = document.getElementById('masonry');
  if (!container) return;

  // Lấy danh sách: auto-detect trước, CONFIG sau
  let images = await autoDetectImages();
  if (!images || !images.length) images = CONFIG?.galleryImages || [];

  container.innerHTML = '';
  images.forEach((img, idx) => {
    const isObject = typeof img === 'object';
    const thumbSrc = isObject ? img.src  : `assets/images/${img}`;
    const fullSrc  = isObject ? img.full : `assets/images/${img}`;
    const a = document.createElement('a');
    a.href = fullSrc;
    a.className = 'masonry-item';
    a.dataset.src = fullSrc;
    a.dataset.subHtml = `<h4>Huy Đạt &amp; Khánh Linh</h4><p>Wedding moment ${idx + 1}</p>`;
    const im = document.createElement('img');
    im.src = thumbSrc; im.alt = `Wedding ${idx + 1}`; im.loading = 'lazy';
    a.appendChild(im);
    container.appendChild(a);
  });
}

// ---- LightGallery ----
function initLightGallery() {
  const el = document.getElementById('masonry');
  if (!el || !window.lightGallery) return;
  lightGallery(el, {
    selector: '.masonry-item',
    plugins: [window.lgZoom, window.lgThumbnail, window.lgFullscreen, window.lgAutoplay].filter(Boolean),
    download: false,
    counter: true,
    speed: 500,
    thumbnail: true,
  });
}

// ---- Lenis smooth scroll ----
let lenis;
function initLenis() {
  if (!window.Lenis) return;
  lenis = new Lenis({ duration: 1.2, smoothWheel: true, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: -20 }); }
    });
  });
  if (window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

// ---- Splitting ----
function initSplitting() { if (window.Splitting) Splitting(); }

// ---- Hero Swiper ----
function initHeroSwiper() {
  if (!window.Swiper) return;
  new Swiper('.hero-swiper', {
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 1500,
    autoplay: { delay: 5000, disableOnInteraction: false },
    allowTouchMove: false,
  });
}

// ---- Wishes Swiper ----
function initWishesSwiper() {
  if (!window.Swiper) return;
  new Swiper('.wishes-swiper', {
    loop: true,
    autoplay: { delay: 4500, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    spaceBetween: 30,
    slidesPerView: 1,
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
  });
}

// ---- tsParticles (floating petals + hearts) ----
async function initParticles() {
  if (!window.tsParticles) return;
  await tsParticles.load({
    id: 'tsparticles',
    options: {
      fullScreen: { enable: false },
      background: { color: 'transparent' },
      fpsLimit: 60,
      particles: {
        number: { value: 35, density: { enable: true, area: 900 } },
        shape: {
          type: 'char',
          options: { char: [{ value: ['❤', '✿', '❀'], font: 'Arial', style: '', weight: '400' }] },
        },
        color: { value: ['#e11d48', '#fb7185', '#fda4af', '#fecdd3'] },
        opacity: { value: { min: 0.3, max: 0.8 } },
        size: { value: { min: 8, max: 18 } },
        move: {
          enable: true, direction: 'bottom', speed: { min: 0.6, max: 1.6 },
          straight: false, outModes: { default: 'out' },
        },
        rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 5 } },
        wobble: { enable: true, distance: 20, speed: { min: -3, max: 3 } },
      },
      detectRetina: true,
    },
  });
}

// ---- GSAP scroll animations ----
function initGSAP() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-pre .char', { opacity: 0, y: 30, stagger: 0.03, duration: 0.6, delay: 0.6, ease: 'power3.out' });
  gsap.from('.name-groom .char', { opacity: 0, y: 80, rotateX: -90, stagger: 0.04, duration: 1, delay: 1, ease: 'back.out(1.5)' });
  gsap.from('.hero-amp', { opacity: 0, scale: 0, duration: 0.8, delay: 1.6, ease: 'elastic.out(1, .5)' });
  gsap.from('.name-bride .char', { opacity: 0, y: 80, rotateX: -90, stagger: 0.04, duration: 1, delay: 1.8, ease: 'back.out(1.5)' });
  gsap.from('.hero-quote, .hero-date, .btn-glass', { opacity: 0, y: 30, stagger: 0.2, duration: 1, delay: 2.6, ease: 'power3.out' });

  // Section titles
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 0, y: 50, duration: 1, ease: 'power3.out',
    });
  });
  gsap.utils.toArray('.section-eyebrow, .divider-fancy').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, y: 20, duration: 0.8,
    });
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 0, x: el.classList.contains('left') ? -60 : 60, duration: 1, ease: 'power3.out',
    });
  });

  // Reveal cards
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
    });
  });

  // Masonry gallery items
  setTimeout(() => {
    gsap.utils.toArray('.masonry-item').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 92%' },
        opacity: 0, y: 60, scale: 0.9, duration: 0.9, delay: (i % 4) * 0.08, ease: 'power3.out',
      });
    });
    ScrollTrigger.refresh();
  }, 150);

  // Parallax for quote background
  gsap.to('.quote-section .quote-bg', {
    yPercent: 25, ease: 'none',
    scrollTrigger: { trigger: '.quote-section', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  // Countdown
  gsap.from('.count-box', {
    scrollTrigger: { trigger: '#countdown', start: 'top 85%' },
    opacity: 0, y: 40, scale: 0.8, stagger: 0.12, duration: 0.8, ease: 'back.out(1.6)',
  });
}

// ---- Music setup ----
function setupMusic() {
  const audio = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  if (!audio || !toggle) return;
  if (CONFIG?.backgroundMusic) {
    const src = audio.querySelector('source');
    if (src) { src.src = `assets/music/${CONFIG.backgroundMusic}`; audio.load(); }
  }
  let playing = false;
  toggle.addEventListener('click', () => {
    if (playing) { audio.pause(); toggle.classList.remove('playing'); }
    else { audio.play().catch(() => {}); toggle.classList.add('playing'); }
    playing = !playing;
  });
}

// ---- Countdown ----
function startCountdown() {
  if (!CONFIG?.weddingDate) return;
  const target = new Date(CONFIG.weddingDate).getTime();
  const $d = document.getElementById('cd-days');
  const $h = document.getElementById('cd-hours');
  const $m = document.getElementById('cd-mins');
  const $s = document.getElementById('cd-secs');
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) { $d.textContent = $h.textContent = $m.textContent = $s.textContent = 0; return; }
    $d.textContent = Math.floor(diff / 86400000);
    $h.textContent = Math.floor((diff % 86400000) / 3600000);
    $m.textContent = Math.floor((diff % 3600000) / 60000);
    $s.textContent = Math.floor((diff % 60000) / 1000);
  };
  tick(); setInterval(tick, 1000);
}

// ---- Loader hide ----
function hideLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 600);
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', async () => {
  hideLoader();
  initSplitting();
  initLenis();
  initHeroSwiper();
  initWishesSwiper();
  initParticles();
  initGSAP();
  setupMusic();
  startCountdown();

  // Render gallery (async: auto-detect images) r\u1ed3i kh\u1edfi t\u1ea1o LightGallery
  await renderGallery();
  initLightGallery();
  if (window.ScrollTrigger) ScrollTrigger.refresh();

  if (CONFIG?.brideName && CONFIG?.groomName) {
    document.title = `${CONFIG.groomName} & ${CONFIG.brideName} — Wedding`;
  }
});
