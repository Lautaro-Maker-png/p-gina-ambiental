// =====================================================
//  Ranking de la comunidad (datos compartidos entre visitantes)
//  Funciona cuando la página se abre en Claude; si no, se muestra un aviso.
// =====================================================
(function () {
  const box = document.getElementById('rankBox');
  const listEl = document.getElementById('rankList');
  const statusEl = document.getElementById('rankStatus');
  const form = document.getElementById('rankForm');
  const aliasInput = document.getElementById('rankAlias');
  const joinBtn = document.getElementById('rankJoin');

  const lget = (k, f) => { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } };
  const lset = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  let db = null, uid = null, rows = [], writing = false, pending = false, canWrite = true;
  let alias = lget('pv-rank-alias', '');
  aliasInput.value = alias;

  const setStatus = (t) => { statusEl.textContent = t; };

  function renderRows() {
    listEl.textContent = '';
    if (!rows.length) {
      const li = document.createElement('li');
      li.className = 'rank-empty';
      li.textContent = 'Todavía no hay nadie en el ranking. ¡Sé la primera persona! 🌱';
      listEl.appendChild(li);
      return;
    }
    rows.forEach((d, i) => {
      const r = d.data();
      const li = document.createElement('li');
      li.className = 'rank-row' + (d.id === uid ? ' me' : '');
      const pos = document.createElement('span'); pos.className = 'rank-pos'; pos.textContent = ['🥇', '🥈', '🥉'][i] || String(i + 1);
      const lvl = document.createElement('span'); lvl.className = 'rank-lvl'; lvl.textContent = typeof r.levelIcon === 'string' ? r.levelIcon.slice(0, 4) : '🌱';
      const name = document.createElement('span'); name.className = 'rank-name';
      name.textContent = (typeof r.alias === 'string' && r.alias.trim() ? r.alias.slice(0, 20) : 'Anónimo') + (d.id === uid ? ' (vos)' : '');
      const badges = document.createElement('span'); badges.className = 'rank-badges'; badges.textContent = `${Number(r.badges) || 0} 🏅`;
      const pts = document.createElement('span'); pts.className = 'rank-pts'; pts.textContent = `${Number(r.points) || 0} pts`;
      li.append(pos, lvl, name, badges, pts);
      listEl.appendChild(li);
    });
  }

  async function writeMine() {
    if (!db || !uid || !alias) return;
    if (writing) { pending = true; return; }
    writing = true;
    try {
      const lv = window.PV ? PV.level() : { icon: '🌱', name: 'Semilla' };
      await db.collection('ranking').doc(uid).set({
        alias: alias.slice(0, 20),
        points: window.PV ? PV.points() : 0,
        badges: window.PV ? PV.badgeCount() : 0,
        levelIcon: lv.icon,
        level: lv.name,
        updatedAt: Date.now(),
      });
      setStatus('✅ Tus puntos están en el ranking. Se actualizan solos cuando ganás insignias.');
      if (window.PV) PV.unlock('ranking');
    } catch (err) {
      if (err && err.code === 'invalid_argument') {
        canWrite = false;
        form.hidden = true;
        setStatus('Podés ver el ranking, pero para aparecer necesitás que la persona dueña de la página te dé permiso de colaborador.');
      } else if (err && err.code === 'quota_exceeded') {
        setStatus('El ranking está lleno por ahora. ¡Probá más tarde!');
      } else {
        setStatus('No se pudo guardar tu puntaje. Probá de nuevo en un rato.');
      }
    } finally {
      writing = false;
      if (pending && canWrite) { pending = false; writeMine(); }
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = aliasInput.value.trim().slice(0, 20);
    if (!v) { setStatus('Escribí un apodo para aparecer en el ranking.'); return; }
    alias = v;
    lset('pv-rank-alias', alias);
    joinBtn.textContent = 'Actualizar apodo';
    writeMine();
  });

  let debounce;
  document.addEventListener('pv-points', () => {
    if (!alias || !canWrite) return;
    clearTimeout(debounce);
    debounce = setTimeout(writeMine, 1500);
  });

  async function init() {
    const c = window.claude;
    if (!c || typeof c.use !== 'function') return offline();
    const [d, user] = await Promise.all([c.use('db'), c.use('user')]);
    if (!d) return offline();
    db = d;
    uid = user ? await user.id() : null;
    if (!uid) {
      form.hidden = true;
      setStatus('Iniciá sesión para sumarte al ranking. Igual podés ver la tabla.');
    } else {
      const can = user ? await user.can('data.write') : null;
      if (can === false) {
        canWrite = false;
        form.hidden = true;
        setStatus('Podés ver el ranking, pero para aparecer necesitás que la persona dueña de la página te dé permiso de colaborador.');
      } else if (alias) {
        joinBtn.textContent = 'Actualizar apodo';
      }
    }
    box.classList.add('live');
    const timer = setTimeout(() => { if (!rows.length) setStatus('No pudimos cargar el ranking todavía. Puede tardar un poco.'); }, 10000);
    db.collection('ranking').orderBy('points', 'desc').limit(20).onSnapshot(
      (snap) => {
        if (!snap.metadata.fromCache) clearTimeout(timer);
        rows = snap.docs;
        renderRows();
      },
      () => { clearTimeout(timer); setStatus('El ranking no está disponible en este momento.'); }
    );
  }

  function offline() {
    form.hidden = true;
    listEl.textContent = '';
    const li = document.createElement('li');
    li.className = 'rank-empty';
    li.textContent = '🌐 El ranking compartido funciona cuando la página se abre desde su enlace de Claude con una cuenta iniciada.';
    listEl.appendChild(li);
  }

  renderRows();
  init().catch(offline);
})();
