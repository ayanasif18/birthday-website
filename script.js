// --- Floating hearts ---
function createHeart(x, y, size, delay, speed, color){
  const el = document.createElement('div');
  el.className = 'heart';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.background = color;
  el.style.borderRadius = '50% 50% 50% 50%';
  el.style.transform = 'translateY(0) rotate(0deg) scale(1)';
  el.style.opacity = '0.95';
  el.style.transition = `transform ${speed}s linear ${delay}s, opacity ${speed}s linear ${delay}s`;
  document.getElementById('hearts').appendChild(el);
  // animate upward then remove
  requestAnimationFrame(()=>{
    el.style.transform = `translateY(-${100 + Math.random()*200}px) rotate(${Math.random()*40-20}deg) scale(${0.8 + Math.random()*0.6})`;
    el.style.opacity = '0';
  });
  setTimeout(()=>el.remove(), (delay + speed) * 1000 + 500);
}

function spawnHearts(){
  const container = document.getElementById('hearts');
  const w = window.innerWidth;
  const colors = ['#9b59b6','#b892d6','#d6a2e8','#8e44ad','#c39bd3'];
  for(let i=0;i<8;i++){
    const x = Math.random()*w;
    const y = window.innerHeight + 40;
    const size = 14 + Math.random()*34;
    const delay = Math.random()*1.2;
    const speed = 3 + Math.random()*3;
    const color = colors[Math.floor(Math.random()*colors.length)];
    createHeart(x, y, size, delay, speed, color);
  }
}
// spawn every 1.6s
setInterval(spawnHearts, 1600);
spawnHearts();

// --- Typewriter effect for heading ---
(function typewriter(){
  const el = document.querySelector('.typewriter');
  const text = el.textContent.trim();
  el.textContent = '';
  let i = 0;
  function next(){ if(i<=text.length){ el.textContent = text.slice(0,i); i++; setTimeout(next, 55); } }
  next();
})();

// --- Music controls ---
// const bgMusic = document.getElementById('bgMusic');
// const musicToggle = document.getElementById('musicToggle');
// const muteBtn = document.getElementById('muteBtn');
// let musicPlaying = false;
// musicToggle.addEventListener('click', ()=>{
//   if(!musicPlaying){ bgMusic.play().catch(()=>{}); musicToggle.textContent='Pause Music ⏸️'; musicPlaying = true; }
//   else{ bgMusic.pause(); musicToggle.textContent='Play Music ▶️'; musicPlaying = false; }
// });
// muteBtn.addEventListener('click', ()=>{
//   bgMusic.muted = !bgMusic.muted;
//   muteBtn.textContent = bgMusic.muted ? 'Unmute 🔈' : 'Mute 🔈';
// });

// // Try autoplay (may be blocked by browser)
// bgMusic.volume = 0.18;
// setTimeout(()=>{ bgMusic.play().then(()=>{ musicPlaying=true; musicToggle.textContent='Pause Music ⏸️'; }).catch(()=>{}); }, 900);

// --- Lightbox / Slideshow ---
const galleryImgs = Array.from(document.querySelectorAll('.gallery-grid img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightbox = document.getElementById('closeLightbox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

// Ribbon click-to-reveal
const imageWrappers = document.querySelectorAll('.image-wrapper');
imageWrappers.forEach(wrapper => {
  const ribbon = wrapper.querySelector('.ribbon');
  ribbon.addEventListener('click', () => {
    wrapper.classList.add('revealed');
  });
});


function openLightbox(idx){
  currentIndex = idx;
  lightboxImg.src = galleryImgs[currentIndex].src;
  lightbox.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeLB(){ lightbox.classList.remove('visible'); document.body.style.overflow=''; }

galleryImgs.forEach((img, idx)=> img.addEventListener('click', ()=> openLightbox(idx)));
closeLightbox.addEventListener('click', closeLB);
prevBtn.addEventListener('click', ()=>{ currentIndex = (currentIndex-1+galleryImgs.length)%galleryImgs.length; lightboxImg.src = galleryImgs[currentIndex].src; });
nextBtn.addEventListener('click', ()=>{ currentIndex = (currentIndex+1)%galleryImgs.length; lightboxImg.src = galleryImgs[currentIndex].src; });

// keyboard support
document.addEventListener('keydown', (e)=>{
  if(!lightbox.classList.contains('visible')) return;
  if(e.key === 'ArrowLeft') prevBtn.click();
  if(e.key === 'ArrowRight') nextBtn.click();
  if(e.key === 'Escape') closeLB();
});

// swipe support for mobile
let startX = 0, endX = 0;
lightboxImg.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; });
lightboxImg.addEventListener('touchend', (e)=>{ endX = e.changedTouches[0].clientX; if(startX - endX > 40) nextBtn.click(); if(endX - startX > 40) prevBtn.click(); });

// clicking outside image closes
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLB(); });

// --- Reveal on scroll ---
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// small tweak: ensure images lazy loading for performance
galleryImgs.forEach(img=> img.loading = 'lazy');
