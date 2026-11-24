// =====================================================
//  Glosario de la comunidad: sugerencias con moderación
//
//  - Cualquier persona con permiso propone una definición.
//  - Queda "pendiente" hasta que el dueño de la página la aprueba.
//  - Solo el dueño ve el panel de moderación.
//  - Si la página no tiene la base de datos de Claude (por ejemplo,
//    en GitHub Pages), la sugerencia se envía por correo.
//
//  Datos:
//    sugerencias/<id de la persona>  -> { alias, items: [...] }   (cada persona escribe la suya; el dueño lee todas)
//    glosario/<id del término>       -> { term, cat, def, alias } (lo lee cualquiera; solo escribe el dueño)
// =====================================================
(function () {
  const roots = [...document.querySelectorAll('[data-aportes]')];
  if (!roots.length) return;

  const CATS = ['Ecología', 'Clima', 'Agua', 'Residuos', 'Gestión', 'Legal'];
  const MAX_PENDING = 5;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clean = (s, max) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, max);
  const MAIL = ['jlbustamante889', 'gmail.com'].join('@');

  let db = null, uid = null, isOwner = false, mode = 'mail';
  let mine = { alias: '', items: [] };
  let pending = [];   // para el dueño: [{uid, alias, item}]
  let approved = [];  // términos aprobados

  // ---------- Estructura de cada bloque ----------
  roots.forEach((root) => {
    root.innerHTML = `
      <div class="ap-head">
        <span class="ap-icon">✍️</span>
        <div><h3>Sugerí una definición</h3>
        <p>¿Falta un término o conocés una forma más clara de explicarlo? Proponelo: se publica después de que lo revise y apruebe.</p></div>
      </div>
      <form class="ap-form">
        <div class="audit-setup">
          <label>Término
            <input type="text" name="term" maxlength="60" required placeholder="Ej.: Biorremediación">
          </label>
          <label>Categoría
            <select name="cat">${CATS.map((c) => `<option>${c}</option>`).join('')}</select>
          </label>
        </div>
        <label class="contact-msg">Definición <small>(entre 30 y 600 caracteres, con tus palabras)</small>
          <textarea name="def" rows="4" minlength="30" maxlength="600" required></textarea>
        </label>
        <label class="contact-msg">Tu nombre o apodo <small>(opcional, aparece junto a la definición)</small>
          <input type="text" name="alias" maxlength="30" placeholder="Ej.: Estudiante de Caleta Olivia">
        </label>
        <div class="btn-row"><button class="btn" type="submit">📨 Enviar sugerencia</button></div>
        <p class="modal-status ap-status" aria-live="polite"></p>
      </form>
      <div class="ap-mine" hidden></div>
      <div class="ap-mod" hidden></div>`;

    root.querySelector('.ap-form').addEventListener('submit', (e) => { e.preventDefault(); submit(root); });
  });

  const setStatus = (root, t) => { root.querySelector('.ap-status').textContent = t; };

  // ---------- Enviar ----------
  async function submit(root) {
    const f = root.querySelector('.ap-form');
    const term = clean(f.term.value, 60);
    const cat = CATS.includes(f.cat.value) ? f.cat.value : CATS[0];
    const def = clean(f.def.value, 600);
    const alias = clean(f.alias.value, 30);
    if (term.length < 2) return setStatus(root, 'Escribí el término.');
    if (def.length < 30) return setStatus(root, 'La definición es muy corta: escribí al menos 30 caracteres.');

    if (mode === 'mail') {
      const body = `Término: ${term}\nCategoría: ${cat}\nDefinición: ${def}\nAutor/a: ${alias || 'Anónimo'}`;
      window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Sugerencia para el glosario: ' + term)}&body=${encodeURIComponent(body)}`;
      setStatus(root, `Se abrió tu correo con la sugerencia lista. Si no se abrió, escribí a ${MAIL}.`);
      return;
    }

    const open = mine.items.filter((x) => x.status === 'pendiente').length;
    if (open >= MAX_PENDING) return setStatus(root, `Ya tenés ${MAX_PENDING} sugerencias esperando revisión. ¡Gracias! Esperá a que se revisen para enviar más.`);

    const btn = f.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      const ref = db.collection('sugerencias').doc(uid);
      const snap = await ref.get();
      const current = snap.exists ? snap.data() : { items: [] };
      const items = Array.isArray(current.items) ? current.items.slice(-30) : [];
      items.push({ id: 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), term, cat, def, status: 'pendiente', createdAt: Date.now() });
      await ref.set({ alias, items, updatedAt: Date.now() });
      f.reset();
      setStatus(root, '✅ ¡Gracias! Tu sugerencia quedó pendiente de revisión.');
    } catch (err) {
      if (err && err.code === 'invalid_argument') {
        mode = 'mail';
        setStatus(root, 'No tenés permiso para enviar desde acá. Tocá “Enviar sugerencia” de nuevo para mandarla por correo.');
      } else {
        setStatus(root, 'No se pudo enviar. Probá de nuevo en un rato.');
      }
    } finally {
      btn.disabled = false;
    }
  }

  // ---------- Mis sugerencias ----------
  function renderMine() {
    roots.forEach((root) => {
      const box = root.querySelector('.ap-mine');
      if (!mine.items.length) { box.hidden = true; return; }
      box.hidden = false;
      const label = { pendiente: '⏳ Pendiente', aprobada: '✅ Aprobada', rechazada: '❌ No aprobada' };
      box.innerHTML = `<h4>Tus sugerencias</h4><ul>${mine.items.slice().reverse().map((x) =>
        `<li><strong>${esc(x.term)}</strong> <span class="ap-badge ${esc(x.status)}">${label[x.status] || ''}</span></li>`).join('')}</ul>`;
    });
  }

  // ---------- Panel de moderación (solo dueño) ----------
  function renderMod() {
    roots.forEach((root) => {
      const box = root.querySelector('.ap-mod');
      if (!isOwner) { box.hidden = true; return; }
      box.hidden = false;
      box.innerHTML = `
        <h4>🛡️ Panel de moderación <small>(solo lo ves vos)</small></h4>
        <p class="ap-sub">${pending.length ? `${pending.length} sugerencia${pending.length === 1 ? '' : 's'} para revisar. Podés corregir el texto antes de aprobar.` : 'No hay sugerencias pendientes. 🎉'}</p>
        ${pending.map((p) => `
          <div class="ap-card" data-uid="${esc(p.uid)}" data-id="${esc(p.item.id)}">
            <div class="audit-setup">
              <label>Término<input type="text" class="ap-e-term" maxlength="60" value="${esc(p.item.term)}"></label>
              <label>Categoría<select class="ap-e-cat">${CATS.map((c) => `<option ${c === p.item.cat ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
            </div>
            <label class="contact-msg">Definición<textarea class="ap-e-def" rows="3" maxlength="600">${esc(p.item.def)}</textarea></label>
            <small>Enviada por: ${esc(p.alias || 'Anónimo')} · ${new Date(p.item.createdAt || 0).toLocaleDateString('es-AR')}</small>
            <div class="btn-row"><button class="btn btn-small" data-act="ok">✅ Aprobar</button><button class="btn btn-small btn-outline" data-act="no">❌ Rechazar</button></div>
          </div>`).join('')}
        <h4>Términos de la comunidad publicados (${approved.length})</h4>
        ${approved.length ? `<ul class="ap-approved">${approved.map((t) => `<li><span><strong>${esc(t.term)}</strong> · ${esc(t.cat)}</span><button class="btn btn-small btn-outline" data-del="${esc(t.id)}">Quitar</button></li>`).join('')}</ul>` : '<p class="ap-sub">Todavía no hay términos aprobados.</p>'}`;
    });
  }

  async function moderate(card, act) {
    const target = pending.find((p) => p.uid === card.dataset.uid && p.item.id === card.dataset.id);
    if (!target) return;
    card.querySelectorAll('button').forEach((b) => (b.disabled = true));
    try {
      const ref = db.collection('sugerencias').doc(target.uid);
      const snap = await ref.get();
      if (!snap.exists) return;
      const data = snap.data();
      const items = (data.items || []).map((x) => ({ ...x }));
      const it = items.find((x) => x.id === target.item.id);
      if (!it) return;
      if (act === 'ok') {
        const term = clean(card.querySelector('.ap-e-term').value, 60);
        const cat = CATS.includes(card.querySelector('.ap-e-cat').value) ? card.querySelector('.ap-e-cat').value : it.cat;
        const def = clean(card.querySelector('.ap-e-def').value, 600);
        if (!term || def.length < 10) { card.querySelectorAll('button').forEach((b) => (b.disabled = false)); return; }
        await db.collection('glosario').doc(it.id).set({ term, cat, def, alias: clean(data.alias, 30), approvedAt: Date.now() });
        it.status = 'aprobada';
      } else {
        it.status = 'rechazada';
      }
      await ref.update({ items });
    } catch (err) {
      card.querySelectorAll('button').forEach((b) => (b.disabled = false));
      alertIn(card, 'No se pudo guardar. Probá de nuevo.');
    }
  }

  function alertIn(el, t) {
    let p = el.querySelector('.ap-err');
    if (!p) { p = document.createElement('p'); p.className = 'ap-err'; el.appendChild(p); }
    p.textContent = t;
  }

  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-aportes] .ap-card [data-act]');
    if (b) return moderate(b.closest('.ap-card'), b.dataset.act);
    const d = e.target.closest('[data-aportes] [data-del]');
    if (d && db && isOwner) {
      d.disabled = true;
      try { await db.collection('glosario').doc(d.dataset.del).delete(); } catch (err) { d.disabled = false; }
    }
  });

  // ---------- Conexión con la base de datos ----------
  function publishApproved() {
    if (window.PVGlossary) window.PVGlossary.setCommunity(approved);
  }

  async function init() {
    const c = window.claude;
    if (!c || typeof c.use !== 'function') return;
    const [d, user] = await Promise.all([c.use('db'), c.use('user')]);
    if (!d) return;
    db = d;

    // Términos aprobados: los ve cualquiera
    db.collection('glosario').limit(500).onSnapshot((snap) => {
      approved = snap.docs.map((x) => ({ id: x.id, ...x.data() }))
        .filter((t) => typeof t.term === 'string' && typeof t.def === 'string')
        .map((t) => ({ id: t.id, term: clean(t.term, 60), cat: CATS.includes(t.cat) ? t.cat : 'Gestión', def: clean(t.def, 600), alias: clean(t.alias, 30) }));
      publishApproved();
      renderMod();
    }, () => {});

    uid = user ? await user.id() : null;
    if (!uid) return;
    const canWrite = user ? await user.can('data.write') : null;
    isOwner = user ? await user.isOwner() : false;
    if (canWrite !== false || isOwner) mode = 'db';

    db.collection('sugerencias').doc(uid).onSnapshot((snap) => {
      mine = snap.exists ? { alias: snap.data().alias || '', items: Array.isArray(snap.data().items) ? snap.data().items : [] } : { alias: '', items: [] };
      renderMine();
    }, () => {});

    if (isOwner) {
      db.collection('sugerencias').limit(500).onSnapshot((snap) => {
        pending = [];
        snap.docs.forEach((x) => {
          const data = x.data();
          (Array.isArray(data.items) ? data.items : []).forEach((item) => {
            if (item && item.status === 'pendiente') pending.push({ uid: x.id, alias: data.alias, item });
          });
        });
        pending.sort((a, b) => (a.item.createdAt || 0) - (b.item.createdAt || 0));
        renderMod();
      }, () => {});
      renderMod();
    }
  }

  init().catch(() => {});
})();
