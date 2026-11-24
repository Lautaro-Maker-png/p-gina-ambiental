// =====================================================
//  Estructura común de todas las páginas:
//  menú, pie de página, botón de logros y avisos.
//  Para agregar una página al menú, sumala a PAGES.
// =====================================================
(function () {
  const PAGES = [
    ['aprender.html', 'Aprender'],
    ['medi.html', 'Medí tu impacto'],
    ['juegos.html', 'Jugá'],
    ['derechos.html', 'Derechos'],
    ['actua.html', 'Actuá'],
    ['blog.html', 'Blog'],
    ['docentes.html', 'Docentes'],
  ];

  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isHome = file === '' || file === 'index.html';

  const nav = document.createElement('nav');
  nav.className = 'nav' + (isHome ? '' : ' scrolled solid');
  nav.setAttribute('aria-label', 'Principal');
  nav.innerHTML = `
    <a href="index.html" class="logo">🌱 Planeta Verde</a>
    <div class="nav-right">
      <ul class="nav-links">
        ${PAGES.map(([href, label]) => `<li><a href="${href}"${href === file ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}
      </ul>
      <button class="theme-toggle" id="themeToggle" aria-label="Cambiar modo claro u oscuro">🌙</button>
      <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>`;

  const header = document.querySelector('.header');
  if (header) header.prepend(nav);
  else document.body.prepend(nav);

  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer-links">
      <a href="index.html">Inicio</a>
      ${PAGES.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}
      <a href="index.html#logros">Logros</a>
    </div>
    <p>🌍 <strong>Planeta Verde</strong> — Cuidar el ambiente es tarea de todos.</p>
    <p class="small">Hecho por <a href="index.html#sobre">Jorge Lautaro Bustamante</a>, estudiante de Gestión Ambiental · Caleta Olivia, Santa Cruz · <a href="index.html#contacto">Contacto</a></p>
    <p class="small">Datos aproximados basados en informes de la ONU, IPCC, IPBES, FAO y Water Footprint Network. Las calculadoras dan estimaciones orientativas. La sección de derechos es de divulgación y no reemplaza el asesoramiento legal.</p>
    <button class="install-btn" id="installBtn" hidden>📲 Instalar Planeta Verde como app</button>`;
  document.body.appendChild(footer);

  const fab = document.createElement('a');
  fab.href = 'index.html#logros';
  fab.className = 'fab';
  fab.id = 'fab';
  fab.setAttribute('aria-label', 'Ver mis logros');
  fab.innerHTML = '🏅 <span id="fabPts">0</span> pts';
  document.body.appendChild(fab);

  const toasts = document.createElement('div');
  toasts.className = 'toasts';
  toasts.id = 'toasts';
  toasts.setAttribute('aria-live', 'polite');
  document.body.appendChild(toasts);

  // ---------- App instalable (solo cuando la página se abre como sitio propio) ----------
  let deferred = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    document.getElementById('installBtn').hidden = false;
  });
  document.getElementById('installBtn').addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    try { await deferred.userChoice; } catch (e) {}
    deferred = null;
    document.getElementById('installBtn').hidden = true;
  });

  const topLevel = (() => { try { return window.top === window.self; } catch (e) { return false; } })();
  if ('serviceWorker' in navigator && location.protocol === 'https:' && topLevel) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
