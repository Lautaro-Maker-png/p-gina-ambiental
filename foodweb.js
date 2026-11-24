// =====================================================
//  Red alimentaria interactiva: pastizal pampeano (simplificado)
// =====================================================
(function () {
  // id: [icono, nombre, x, y, nivel, come]
  const SP = {
    pastos: ['🌾', 'Pastos', 290, 370, 'Productor', []],
    flores: ['🌼', 'Flores silvestres', 600, 370, 'Productor', []],
    saltamontes: ['🦗', 'Saltamontes', 90, 270, 'Herbívoro', ['pastos']],
    raton: ['🐭', 'Ratón de campo', 225, 270, 'Herbívoro', ['pastos']],
    cuis: ['🐹', 'Cuis', 355, 270, 'Herbívoro', ['pastos']],
    vizcacha: ['🐾', 'Vizcacha', 480, 270, 'Herbívoro', ['pastos']],
    abejas: ['🐝', 'Abejas', 610, 270, 'Polinizador', ['flores']],
    perdiz: ['🐦', 'Perdiz', 110, 165, 'Omnívoro', ['saltamontes', 'pastos']],
    sapo: ['🐸', 'Sapo', 560, 165, 'Insectívoro', ['saltamontes', 'abejas']],
    zorro: ['🦊', 'Zorro gris', 160, 65, 'Carnívoro', ['raton', 'cuis', 'perdiz']],
    lechuza: ['🦉', 'Lechuza', 310, 65, 'Carnívoro', ['raton', 'cuis', 'sapo']],
    yarara: ['🐍', 'Yarará', 450, 65, 'Carnívoro', ['raton', 'sapo']],
    puma: ['🐆', 'Puma', 600, 65, 'Superpredador', ['vizcacha', 'cuis']],
  };

  const svg = document.getElementById('webSvg');
  if (!svg) return;
  const log = document.getElementById('webLog');
  let removed = new Set();   // quitadas por la persona
  let extinct = new Set();   // desaparecidas en cascada

  function gone(id) { return removed.has(id) || extinct.has(id); }

  function simulate() {
    extinct = new Set();
    let changed = true;
    while (changed) {
      changed = false;
      for (const [id, s] of Object.entries(SP)) {
        if (gone(id)) continue;
        const food = s[5];
        // Consumidores sin ninguna presa disponible
        if (food.length && food.every(gone)) { extinct.add(id); changed = true; }
        // Las flores necesitan a las abejas para polinizarse
        if (id === 'flores' && gone('abejas')) { extinct.add(id); changed = true; }
      }
    }
    // Presas que se quedaron sin depredadores: sobrepoblación
    const over = Object.keys(SP).filter((id) => {
      if (gone(id)) return false;
      const preds = Object.keys(SP).filter((p) => SP[p][5].includes(id));
      return preds.length && preds.every(gone);
    });
    return over;
  }

  function render() {
    const over = simulate();
    const edges = [];
    for (const [id, s] of Object.entries(SP)) {
      for (const prey of s[5]) {
        const a = SP[prey], b = s;
        const off = gone(id) || gone(prey);
        edges.push(`<line x1="${a[2]}" y1="${a[3] - 24}" x2="${b[2]}" y2="${b[3] + 26}" class="web-edge ${off ? 'off' : ''}" marker-end="url(#arrow)"/>`);
      }
    }
    svg.innerHTML = `
      <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="web-arrow"/></marker></defs>
      ${['Superpredadores y carnívoros', 'Omnívoros e insectívoros', 'Herbívoros y polinizadores', 'Productores'].map((t, i) => `<text x="8" y="${[30, 132, 236, 410][i]}" class="web-level">${t}</text>`).join('')}
      ${edges.join('')}
      ${Object.entries(SP).map(([id, s]) => {
        const cls = removed.has(id) ? 'removed' : extinct.has(id) ? 'extinct' : over.includes(id) ? 'over' : '';
        return `<g class="web-node ${cls}" data-id="${id}" tabindex="0" role="button" aria-label="${s[1]}" transform="translate(${s[2]},${s[3]})">
          <circle r="25"/><text class="web-emoji" y="8" text-anchor="middle">${s[0]}</text>
          <text class="web-name" y="42" text-anchor="middle">${s[1]}</text>
          ${removed.has(id) ? '<text class="web-x" y="9" text-anchor="middle">✕</text>' : ''}
        </g>`;
      }).join('')}`;

    if (!removed.size) {
      log.innerHTML = '<p>👆 Tocá una especie para quitarla del ecosistema y mirá qué les pasa a las demás. Las flechas muestran hacia dónde va la energía: de quien es comido a quien come.</p>';
      return;
    }
    const names = (set) => [...set].map((id) => `${SP[id][0]} ${SP[id][1]}`).join(', ');
    let html = `<p><strong>Quitaste:</strong> ${names(removed)}</p>`;
    if (extinct.size) {
      html += `<p class="web-bad">💀 <strong>Desaparecen en cadena:</strong> ${names(extinct)}.</p>`;
      if (extinct.has('flores')) html += '<p class="web-note">🌼 Sin abejas, las flores silvestres no se polinizan y dejan de reproducirse.</p>';
      if (window.PV) PV.unlock('web');
    } else {
      html += '<p class="web-ok">Por ahora ninguna otra especie desaparece: tienen otras fuentes de alimento. ¡La diversidad hace al ecosistema más resistente!</p>';
    }
    if (over.length) html += `<p class="web-warn">📈 <strong>Sin depredadores, pueden multiplicarse en exceso:</strong> ${names(new Set(over))}. Eso puede dañar los pastos y desequilibrar todo el sistema.</p>`;
    log.innerHTML = html;
  }

  function toggle(id) {
    if (extinct.has(id)) return;
    removed.has(id) ? removed.delete(id) : removed.add(id);
    render();
  }

  svg.addEventListener('click', (e) => { const n = e.target.closest('.web-node'); if (n) toggle(n.dataset.id); });
  svg.addEventListener('keydown', (e) => { const n = e.target.closest('.web-node'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(n.dataset.id); } });
  document.getElementById('webReset').addEventListener('click', () => { removed = new Set(); render(); });
  document.querySelectorAll('[data-web]').forEach((b) =>
    b.addEventListener('click', () => { removed = new Set(b.dataset.web.split(',')); render(); })
  );
  render();
})();
