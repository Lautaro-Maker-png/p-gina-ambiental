// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
});

links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  })
);

// Fondo del menú al hacer scroll
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll);
onScroll();

// Contadores animados
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = (el.dataset.target.split('.')[1] || '').length;
  const duration = 1500;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals).replace('.', ',');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Aparición de elementos al hacer scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      const counter = entry.target.querySelector('.stat-num');
      if (counter) animateCounter(counter);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Checklist de acciones
const checks = document.querySelectorAll('.action input');
const bar = document.getElementById('progressBar');
const text = document.getElementById('progressText');

const levels = [
  { min: 0, msg: 'Marcá al menos una acción para empezar 🌱' },
  { min: 1, msg: '¡Buen comienzo! Cada acción cuenta 🌿' },
  { min: 3, msg: 'Vas por muy buen camino 🌳' },
  { min: 6, msg: '¡Sos un guardián del planeta! 🌎' },
  { min: 8, msg: '¡Increíble! Compromiso ambiental total 🏆' },
];

function updateProgress() {
  const done = [...checks].filter((c) => c.checked).length;
  bar.style.width = `${(done / checks.length) * 100}%`;
  const level = [...levels].reverse().find((l) => done >= l.min);
  text.textContent = done ? `${done}/${checks.length} — ${level.msg}` : level.msg;
}

checks.forEach((c) => c.addEventListener('change', updateProgress));
