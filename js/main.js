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

  // 2) Probe common patterns (gi\u1edbi h\u1ea1n nh\u1eb9 \u0111\u1ec3 kh\u00f4ng ch\u1eadm)
  const exts = ['jpg', 'jpeg', 'png', 'webp'];
  const patterns = [
    i => `${i}`,
    i => `${String(i).padStart(2, '0')}`,
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
    for (let i = 1; i <= 50; i++) {
      let hit = null;
      for (const ext of exts) {
        const name = `${makeName(i)}.${ext}`;
        if (await tryLoad(`assets/images/${name}`)) { hit = name; break; }
      }
      if (hit) { found.push(hit); missStreak = 0; }
      else { missStreak++; if (missStreak >= 2) break; }
    }
    if (found.length) return found;
  }
  return null;
}

// ---- Render Gallery (auto > CONFIG) ----
async function renderGallery() {
  const container = document.getElementById('masonry');
  if (!container) return;

  // Config is the source of truth so the gallery preserves the filename order.
  const images = CONFIG?.galleryImages || [];

  container.innerHTML = '';
  images.forEach((img, idx) => {
    const isObject = typeof img === 'object';
    const thumbSrc = isObject ? img.src  : `assets/images/thumbs/${img}`;
    const previewSrc = isObject ? img.src : `assets/images/display/${img}`;
    const fullSrc  = previewSrc;
    const a = document.createElement('a');
    a.href = previewSrc;
    a.className = 'masonry-item';
    a.dataset.src = previewSrc;
    a.dataset.fullSrc = fullSrc;
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
  const warmedImages = new Map();
  const galleryItems = () => [...el.querySelectorAll('.masonry-item')];
  const warmFullImage = item => {
    if (!item?.dataset.fullSrc) return Promise.resolve();
    if (warmedImages.has(item.dataset.fullSrc)) return warmedImages.get(item.dataset.fullSrc);
    const image = new Image();
    image.fetchPriority = 'high';
    image.decoding = 'async';
    const promise = new Promise(resolve => {
      image.onload = resolve;
      image.onerror = resolve;
    });
    image.src = item.dataset.fullSrc;
    warmedImages.set(item.dataset.fullSrc, promise);
    return promise;
  };
  const upgradeSlide = index => {
    const item = galleryItems()[index];
    if (!item) return;
    warmFullImage(item).then(() => {
      const slide = document.querySelectorAll('.lg-item')[index];
      const image = slide?.querySelector('.lg-image');
      if (image) image.src = item.dataset.fullSrc;
    });
  };
  el.addEventListener('pointerover', event => warmFullImage(event.target.closest('.masonry-item')));
  el.addEventListener('pointerdown', event => warmFullImage(event.target.closest('.masonry-item')));
  el.addEventListener('lgAfterOpen', event => upgradeSlide(event.detail.index));
  el.addEventListener('lgAfterSlide', event => {
    upgradeSlide(event.detail.index);
    const nextIndex = (event.detail.index + 1) % galleryItems().length;
    warmFullImage(galleryItems()[nextIndex]);
  });
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
let playBackgroundMusic = () => {};
function initLenis() {
  if (!window.Lenis) return;
  lenis = new Lenis({ duration: 0.8, smoothWheel: true, syncTouch: false, easing: t => 1 - Math.pow(1 - t, 3) });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: -20 }); }
    });
  });
  if (window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(500, 33);
  } else {
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
}

// ---- Splitting ----
function initSplitting() { if (window.Splitting) Splitting(); }

// Read the guest name from ?guest=... on the invitation URL.
function initGuestInvitation() {
  const guestLabel = document.getElementById('guestName');
  if (!guestLabel) return;
  const encodedGuestName = new URLSearchParams(window.location.search).get('guest');
  if (!encodedGuestName?.trim()) return;

  let guestName = encodedGuestName;
  for (let attempt = 0; attempt < 3; attempt++) {
    const sanitizedName = guestName.replace(/%(?![0-9a-f]{2})/gi, ' ');
    try {
      const decodedName = decodeURIComponent(sanitizedName);
      if (decodedName === guestName) break;
      guestName = decodedName;
    } catch (_) {
      guestName = sanitizedName;
      break;
    }
  }
  guestName = guestName.replace(/\s+/g, ' ').trim();
  if (guestName) guestLabel.textContent = guestName;
}

// ---- Hero Swiper ----
function initHeroSwiper() {
  if (!window.Swiper) return;
  new Swiper('.hero-swiper', {
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 700,
    autoplay: { delay: 1500, disableOnInteraction: false },
    allowTouchMove: false,
  });
}

// ---- Wishes Swiper ----
function initWishesSwiper() {
  if (!window.Swiper || !document.querySelector('.wishes-swiper')) return;
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
      fpsLimit: 24,
      particles: {
        number: { value: 12, density: { enable: true, area: 1200 } },
        shape: {
          type: 'char',
          options: { char: [{ value: ['❤', '✿', '❀'], font: 'Arial', style: '', weight: '400' }] },
        },
        color: { value: ['#e11d48', '#fb7185', '#fda4af', '#fecdd3'] },
        opacity: { value: { min: 0.3, max: 0.8 } },
        size: { value: { min: 6, max: 12 } },
        move: {
          enable: true, direction: 'bottom', speed: { min: 0.2, max: 0.6 },
          straight: false, outModes: { default: 'out' },
        },
        rotate: { value: { min: 0, max: 360 }, animation: { enable: false } },
        wobble: { enable: false },
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

  // Keep the long gallery and quote section free of per-frame scroll effects.
  ScrollTrigger.refresh();

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
  let fadeFrame;
  let fadeTimer;
  const fadeInMusic = () => {
    cancelAnimationFrame(fadeFrame);
    const start = performance.now();
    const startVolume = 0.08;
    const targetVolume = 1;
    const duration = 5000;
    audio.volume = startVolume;
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      audio.volume = startVolume + (targetVolume - startVolume) * progress;
      if (progress < 1 && playing) fadeFrame = requestAnimationFrame(step);
    };
    fadeFrame = requestAnimationFrame(step);
  };
  playBackgroundMusic = (fadeDelay = 0) => {
    clearTimeout(fadeTimer);
    audio.volume = 0;
    audio.play().then(() => {
      playing = true;
      toggle.classList.add('playing');
      fadeTimer = setTimeout(fadeInMusic, fadeDelay);
    }).catch(() => {});
  };
  toggle.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      clearTimeout(fadeTimer);
      cancelAnimationFrame(fadeFrame);
      toggle.classList.remove('playing');
      playing = false;
    } else {
      playBackgroundMusic();
    }
  });
}

// ---- Invitation gate ----
function setupInvitationGate() {
  const gate = document.getElementById('invitationGate');
  const openButton = document.getElementById('openInvitation');
  if (!gate || !openButton) return;
  document.body.classList.add('invitation-locked');
  document.documentElement.classList.add('invitation-locked');
  const preventScroll = event => event.preventDefault();
  const preventKeyScroll = event => {
    if ([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
    }
  };
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('keydown', preventKeyScroll);
  openButton.addEventListener('click', () => {
    playBackgroundMusic(1000);
    gate.classList.add('is-opening');
    openButton.disabled = true;
    gate.classList.add('is-open');
    document.body.classList.remove('invitation-locked');
    document.documentElement.classList.remove('invitation-locked');
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('keydown', preventKeyScroll);
    setTimeout(() => gate.remove(), 850);
  }, { once: true });
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

// ---- Loader hide (nhanh + an toàn) ----
// Ẩn loader theo điều kiện nào đến trước:
//   - Ảnh hero đầu tiên tải xong
//   - Window 'load' event
//   - Timeout an toàn 2.5s (không bao giờ kẹt ở loader)
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  let hidden = false;
  const hide = () => {
    if (hidden) return;
    hidden = true;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 800);
  };

  // 1) Khi ảnh hero đầu tiên load xong
  const firstHero = document.querySelector('.hero-bg');
  if (firstHero) {
    const bg = getComputedStyle(firstHero).backgroundImage.match(/url\("?(.+?)"?\)/);
    if (bg && bg[1]) {
      const img = new Image();
      img.onload = () => setTimeout(hide, 200);
      img.onerror = hide;
      img.src = bg[1];
    }
  }

  // 2) Window load (mọi tài nguyên xong)
  window.addEventListener('load', () => setTimeout(hide, 100));

  // 3) Safety timeout — không bao giờ đợi quá 2.5s
  setTimeout(hide, 2500);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', async () => {
  setupInvitationGate();
  initGuestInvitation();
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
