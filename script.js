const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');
const backgroundVideos = document.querySelectorAll('[data-background-video]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const smallScreen = window.matchMedia('(max-width: 650px)');

function setBackgroundVideo(video) {
  if (video.dataset.loaded) return;

  const webm = video.dataset.webm;
  const mp4 = video.dataset.mp4;
  const source = document.createElement('source');
  const canPlayWebm = video.canPlayType('video/webm; codecs="vp9"');
  source.src = canPlayWebm && webm ? webm : mp4;
  source.type = canPlayWebm && webm ? 'video/webm' : 'video/mp4';
  video.append(source);
  video.dataset.loaded = 'true';
  video.load();
  video.play().catch(() => {});
}

function removeBackgroundVideo(video) {
  video.pause();
  video.querySelectorAll('source').forEach(source => source.remove());
  delete video.dataset.loaded;
  video.load();
}

function syncBackgroundVideos() {
  backgroundVideos.forEach(video => {
    if (reducedMotion.matches || smallScreen.matches) removeBackgroundVideo(video);
    else setBackgroundVideo(video);
  });
}

syncBackgroundVideos();
reducedMotion.addEventListener('change', syncBackgroundVideos);
smallScreen.addEventListener('change', syncBackgroundVideos);
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
  nav.classList.toggle('is-open', !open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menú');
}));
const revealItems = document.querySelectorAll('.capability-list article, .catalog-card, .steps article');
revealItems.forEach(item => item.classList.add('reveal'));
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.14 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('is-visible'));
