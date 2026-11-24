// =====================================================
//  Logros, niveles y tarjetas para compartir
//  Expone window.PV = { unlock, share, isUnlocked }
// =====================================================
(function () {
  const BADGES = [
    { id: 'explorer', icon: '🧭', name: 'Explorador/a', desc: 'Recorré todas las secciones de la página', pts: 20 },
    { id: 'curious', icon: '💡', name: 'Curioso/a', desc: 'Leé 5 datos de “¿Sabías que…?”', pts: 10 },
    { id: 'calc', icon: '🌍', name: 'Primer paso', desc: 'Calculá tu huella de carbono', pts: 20 },
    { id: 'quiz7', icon: '🧠', name: 'Mente verde', desc: 'Sacá 7 o más en el quiz', pts: 30 },
    { id: 'quiz10', icon: '🏆', name: 'Experto/a ambiental', desc: 'Sacá 10 de 10 en el quiz', pts: 50 },
    { id: 'game150', icon: '♻️', name: 'Reciclador/a', desc: 'Hacé 150 puntos en el juego de reciclaje', pts: 30 },
    { id: 'game300', icon: '🚛', name: 'Maestro/a del reciclaje', desc: 'Hacé 300 puntos en el juego de reciclaje', pts: 50 },
    { id: 'eia1', icon: '🔍', name: 'Evaluador/a', desc: 'Completá una Evaluación de Impacto Ambiental', pts: 30 },
    { id: 'eiaPro', icon: '📋', name: 'Ojo experto', desc: 'Sacá 80 o más en una evaluación', pts: 40 },
    { id: 'eiaAll', icon: '⚖️', name: 'Autoridad ambiental', desc: 'Evaluá los 4 proyectos', pts: 60 },
    { id: 'rights', icon: '📜', name: 'Conozco mis derechos', desc: 'Leé las 10 leyes ambientales', pts: 40 },
    { id: 'habits', icon: '✅', name: 'Hábitos verdes', desc: 'Marcá 6 acciones en “¿Qué puedo hacer yo?”', pts: 20 },
    { id: 'week', icon: '📅', name: 'Semana verde', desc: 'Completá 7 días del desafío', pts: 30 },
    { id: 'planet', icon: '🌎', name: 'Guardián/a del planeta', desc: 'Completá los 30 días del desafío', pts: 100 },
    { id: 'share', icon: '📣', name: 'Difusor/a', desc: 'Compartí un resultado', pts: 10 },
  ];

  const LEVELS = [
    { min: 0, icon: '🌰', name: 'Semilla' },
    { min: 50, icon: '🌱', name: 'Brote' },
    { min: 150, icon: '🌿', name: 'Planta' },
    { min: 300, icon: '🌳', name: 'Árbol' },
    { min: 450, icon: '🌲', name: 'Bosque' },
  ];

  const load = (k, f) => {
    try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; }
  };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  let unlocked = load('pv-badges', {});

  const points = () => BADGES.filter((b) => unlocked[b.id]).reduce((s, b) => s + b.pts, 0);

  function levelFor(p) {
    let i = 0;
    LEVELS.forEach((l, idx) => { if (p >= l.min) i = idx; });
    return { cur: LEVELS[i], next: LEVELS[i + 1] || null };
  }

  // ---------- Notificaciones ----------
  const toasts = document.getElementById('toasts');

  function toast(html) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = html;
    toasts.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    }, 3800);
  }

  function unlock(id) {
    if (unlocked[id]) return;
    const b = BADGES.find((x) => x.id === id);
    if (!b) return;
    const before = levelFor(points()).cur;
    unlocked[id] = Date.now();
    save('pv-badges', unlocked);
    toast(`<span class="toast-icon">${b.icon}</span><div><small>¡Logro desbloqueado! +${b.pts} pts</small><strong>${b.name}</strong></div>`);
    const after = levelFor(points()).cur;
    if (after !== before) {
      setTimeout(() => toast(`<span class="toast-icon">${after.icon}</span><div><small>¡Subiste de nivel!</small><strong>Ahora sos ${after.name}</strong></div>`), 700);
    }
    render();
  }

  // ---------- Sección de logros ----------
  function render() {
    const p = points();
    const { cur, next } = levelFor(p);
    const count = BADGES.filter((b) => unlocked[b.id]).length;
    const pct = next ? ((p - cur.min) / (next.min - cur.min)) * 100 : 100;

    document.getElementById('fabPts').textContent = p;

    const levelBox = document.getElementById('levelBox');
    if (levelBox) {
      levelBox.innerHTML = `
        <div class="level-icon">${cur.icon}</div>
        <div class="level-info">
          <small>Tu nivel</small>
          <strong>${cur.name}</strong>
          <div class="progress progress-light"><div class="progress-bar" style="width:${pct}%"></div></div>
          <small>${p} puntos · ${count} de ${BADGES.length} insignias${next ? ` · faltan ${next.min - p} pts para ${next.icon} ${next.name}` : ' · ¡nivel máximo!'}</small>
        </div>`;
    }

    const grid = document.getElementById('badges');
    if (grid) {
      grid.innerHTML = BADGES.map((b) => `
        <div class="badge ${unlocked[b.id] ? 'on' : ''}">
          <span class="badge-icon">${unlocked[b.id] ? b.icon : '🔒'}</span>
          <strong>${b.name}</strong>
          <small>${b.desc}</small>
          <span class="badge-pts">${b.pts} pts</span>
        </div>`).join('');
    }
  }

  // ---------- Explorador: visitar todas las secciones ----------
  const SECTIONS = ['clima', 'reciclaje', 'biodiversidad', 'agua', 'calculadora', 'juego', 'quiz', 'eia', 'derechos', 'desafio', 'calendario', 'puntos'];
  let visited = new Set(load('pv-visited', []));

  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      visited.add(e.target.id);
      save('pv-visited', [...visited]);
      secObserver.unobserve(e.target);
      if (SECTIONS.every((s) => visited.has(s))) unlock('explorer');
    });
  }, { threshold: 0.25 });

  SECTIONS.forEach((id) => {
    const el = document.getElementById(id);
    if (el && !visited.has(id)) secObserver.observe(el);
  });

  // ---------- Tarjeta para compartir ----------
  function wrap(ctx, text, maxW) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach((w) => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  async function drawCard({ emoji, title, value, subtitle }) {
    try { await document.fonts.ready; } catch (e) {}
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1080;
    const ctx = c.getContext('2d');

    const g = ctx.createLinearGradient(0, 0, 1080, 1080);
    g.addColorStop(0, '#1b4332');
    g.addColorStop(1, '#40916c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    [[900, 160, 260], [120, 980, 220], [980, 900, 120]].forEach(([x, y, r]) => {
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#d8f3dc';
    ctx.font = '600 44px Poppins, sans-serif';
    ctx.fillText('🌱 Planeta Verde', 540, 110);

    ctx.font = '190px serif';
    ctx.fillText(emoji, 540, 360);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 58px Poppins, sans-serif';
    let y = 470;
    wrap(ctx, title, 900).forEach((l) => { ctx.fillText(l, 540, y); y += 70; });

    ctx.fillStyle = '#95d5b2';
    ctx.font = '700 140px Poppins, sans-serif';
    ctx.fillText(value, 540, y + 120);
    y += 200;

    ctx.fillStyle = '#ffffff';
    ctx.font = '400 40px Poppins, sans-serif';
    wrap(ctx, subtitle, 880).slice(0, 3).forEach((l) => { ctx.fillText(l, 540, y); y += 54; });

    ctx.fillStyle = '#d8f3dc';
    ctx.font = '600 36px Poppins, sans-serif';
    ctx.fillText('¿Y vos? Medí tu impacto en Planeta Verde 🌍', 540, 1010);

    return c;
  }

  let modal;

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true" aria-label="Compartir resultado">
        <button class="modal-close" aria-label="Cerrar">✕</button>
        <h3>Compartí tu resultado</h3>
        <img class="modal-img" alt="Tarjeta para compartir">
        <p class="modal-hint">Si no se descarga, mantené presionada (o clic derecho) la imagen para guardarla.</p>
        <div class="modal-actions">
          <button class="btn btn-small" data-act="share">📤 Compartir</button>
          <button class="btn btn-small" data-act="download">⬇️ Descargar imagen</button>
          <button class="btn btn-small btn-outline" data-act="copy">📋 Copiar texto</button>
        </div>
        <p class="modal-status" aria-live="polite"></p>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.modal-close')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
    return modal;
  }

  function close() { modal.hidden = true; document.body.style.overflow = ''; }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
    try {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    } catch (e) { return false; }
  }

  async function share(data) {
    const m = ensureModal();
    const status = m.querySelector('.modal-status');
    status.textContent = '';
    const canvas = await drawCard(data);
    const url = canvas.toDataURL('image/png');
    m.querySelector('.modal-img').src = url;
    m.hidden = false;
    document.body.style.overflow = 'hidden';

    const shareBtn = m.querySelector('[data-act="share"]');
    shareBtn.hidden = !navigator.share;

    m.querySelector('.modal-actions').onclick = async (e) => {
      const act = e.target.closest('button')?.dataset.act;
      if (!act) return;
      if (act === 'share') {
        try {
          const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
          const file = new File([blob], 'planeta-verde.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], text: data.text });
          } else {
            await navigator.share({ text: data.text });
          }
          unlock('share');
        } catch (err) {
          if (err && err.name !== 'AbortError') status.textContent = 'No se pudo compartir desde acá. Probá descargar la imagen o copiar el texto.';
        }
      } else if (act === 'download') {
        try {
          const a = document.createElement('a');
          a.href = url; a.download = 'planeta-verde.png';
          document.body.appendChild(a); a.click(); a.remove();
          status.textContent = '¡Listo! Si no se descargó, guardá la imagen manteniéndola presionada.';
          unlock('share');
        } catch (err) {
          status.textContent = 'Guardá la imagen manteniéndola presionada o con clic derecho.';
        }
      } else if (act === 'copy') {
        const ok = await copyText(data.text);
        status.textContent = ok ? '¡Texto copiado! Pegalo en tus redes 😉' : 'No se pudo copiar el texto.';
        if (ok) unlock('share');
      }
    };
  }

  document.getElementById('shareBadges').addEventListener('click', () => {
    const p = points();
    const { cur } = levelFor(p);
    const count = BADGES.filter((b) => unlocked[b.id]).length;
    share({
      emoji: cur.icon,
      title: `Soy nivel ${cur.name} en Planeta Verde`,
      value: `${p} pts`,
      subtitle: `${count} de ${BADGES.length} insignias desbloqueadas cuidando el planeta`,
      text: `${cur.icon} Soy nivel ${cur.name} en Planeta Verde: ${p} puntos y ${count} insignias cuidando el planeta. ¿Y vos? 🌱`,
    });
  });

  render();

  window.PV = { unlock, share, isUnlocked: (id) => !!unlocked[id] };
})();
