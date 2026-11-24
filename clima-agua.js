// =====================================================
//  Simulador "¿Qué pasa si sube la temperatura?" y huella hídrica
// =====================================================
(function () {
  const load = (k, f) => { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const fmt = (n, d = 0) => n.toLocaleString('es-AR', { maximumFractionDigits: d, minimumFractionDigits: d });

  // ---------------------------------------------------
  //  Simulador de temperatura (datos del IPCC: AR6 y SR1.5)
  // ---------------------------------------------------
  const SCEN = [
    {
      t: '+1,2 °C', label: 'Hoy',
      intro: 'El planeta ya está alrededor de 1,2 °C más caliente que antes de la Revolución Industrial. Los efectos ya se sienten.',
      heat: '2,8 veces', drought: '1,7 veces', rain: '1,3 veces',
      sea: 'Ya subió unos 20 cm desde 1900',
      coral: 'Blanqueamientos masivos cada vez más frecuentes',
      arctic: 'El hielo de verano se redujo mucho, pero todavía no desaparece',
      species: 'Muchas especies ya se están desplazando hacia los polos o hacia zonas más altas',
    },
    {
      t: '+1,5 °C', label: 'Meta del Acuerdo de París',
      intro: 'Es el límite que el Acuerdo de París busca no superar. Todavía implica cambios importantes, pero mucho menores que con más calentamiento.',
      heat: '4,1 veces', drought: '2 veces', rain: '1,5 veces',
      sea: 'Entre 28 y 55 cm hacia 2100',
      coral: 'Se perdería entre el 70% y el 90% de los arrecifes de coral',
      arctic: 'Un verano sin hielo aproximadamente cada 100 años',
      species: 'Un 6% de los insectos, 8% de las plantas y 4% de los vertebrados perderían más de la mitad de su área',
    },
    {
      t: '+2 °C', label: 'Límite máximo de París',
      intro: 'Medio grado más que +1,5 °C parece poco, pero los impactos aumentan mucho.',
      heat: '5,6 veces', drought: '2,4 veces', rain: '1,7 veces',
      sea: 'Entre 32 y 62 cm hacia 2100',
      coral: 'Se perdería más del 99% de los arrecifes de coral',
      arctic: 'Un verano sin hielo aproximadamente cada 10 años',
      species: 'Un 18% de los insectos, 16% de las plantas y 8% de los vertebrados perderían más de la mitad de su área',
    },
    {
      t: '+4 °C', label: 'Si las emisiones siguen muy altas',
      intro: 'Es un escenario de emisiones muy altas. Muchos de sus cambios serían irreversibles durante siglos.',
      heat: '9,4 veces', drought: '4,1 veces', rain: '2,7 veces',
      sea: 'Entre 63 cm y 1 metro hacia 2100, y seguiría subiendo',
      coral: 'Los arrecifes de coral prácticamente desaparecerían',
      arctic: 'El Ártico sin hielo en la mayoría de los veranos',
      species: 'Con +3 °C ya cerca de la mitad de los insectos y de las plantas perderían más de la mitad de su área',
    },
  ];

  const range = document.getElementById('simRange');
  if (range) initSim();
  if (document.getElementById('waterForm')) initWater();

  function initSim() {
  const out = document.getElementById('simOut');
  const scene = document.getElementById('simScene');
  let simSeen = new Set(load('pv-sim', []));

  function sky(i) {
    return [['#9fd8f5', '#e3f5ff'], ['#b9d9ea', '#fbe9cf'], ['#e7c59b', '#fbdcb0'], ['#e8875c', '#f6c38b']][i];
  }

  function drawScene(i) {
    const [s1, s2] = sky(i);
    const glacier = [1, 0.72, 0.5, 0.18][i];
    const sea = [0, 8, 14, 30][i];
    const sun = [34, 38, 42, 52][i];
    const tree = ['#2d9d5f', '#4f9d4a', '#8a9a3a', '#a07a3a'][i];
    scene.innerHTML = `
      <defs><linearGradient id="simSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient></defs>
      <rect width="600" height="300" fill="url(#simSky)"/>
      <circle cx="520" cy="70" r="${sun}" fill="#ffb347" opacity=".9"/>
      <polygon points="40,230 190,60 340,230" fill="#7d8b99"/>
      <polygon points="190,60 ${190 - 70 * glacier},${60 + 85 * glacier} ${190 + 70 * glacier},${60 + 85 * glacier}" fill="#fff"/>
      <rect x="0" y="230" width="600" height="70" fill="${['#8bc48a', '#9cc27a', '#b8b56c', '#c9a76b'][i]}"/>
      <rect x="380" y="${250 - sea}" width="220" height="${50 + sea}" fill="#3a86ff" opacity=".85"/>
      <rect x="380" y="${250 - sea}" width="220" height="6" fill="#9cc8ff" opacity=".8"/>
      ${[90, 130, 300].map((x) => `<rect x="${x - 3}" y="205" width="6" height="25" fill="#6b4f2a"/><circle cx="${x}" cy="198" r="16" fill="${tree}"/>`).join('')}
      <g transform="translate(560,140)"><rect x="-8" y="-60" width="16" height="90" rx="8" fill="#fff" stroke="#555" stroke-width="2"/><circle cy="38" r="14" fill="#e63946" stroke="#555" stroke-width="2"/><rect x="-4" y="${28 - [18, 30, 45, 70][i]}" width="8" height="${[18, 30, 45, 70][i] + 10}" fill="#e63946"/></g>
      <text x="16" y="34" class="sim-label">${SCEN[i].t}</text>`;
  }

  function showSim(i, counts = true) {
    const d = SCEN[i];
    drawScene(i);
    out.innerHTML = `
      <div class="sim-title"><strong>${d.t}</strong> · ${d.label}</div>
      <p class="sim-intro">${d.intro}</p>
      <div class="sim-grid">
        <div class="sim-card"><span>🔥</span><small>Olas de calor extremas</small><strong>${d.heat}</strong><em>más frecuentes que antes de 1850</em></div>
        <div class="sim-card"><span>🏜️</span><small>Sequías agrícolas</small><strong>${d.drought}</strong><em>más frecuentes</em></div>
        <div class="sim-card"><span>🌧️</span><small>Lluvias extremas</small><strong>${d.rain}</strong><em>más frecuentes</em></div>
        <div class="sim-card wide"><span>🌊</span><small>Nivel del mar</small><strong>${d.sea}</strong></div>
        <div class="sim-card wide"><span>🪸</span><small>Corales</small><strong>${d.coral}</strong></div>
        <div class="sim-card wide"><span>🧊</span><small>Hielo del Ártico</small><strong>${d.arctic}</strong></div>
        <div class="sim-card wide"><span>🦋</span><small>Especies</small><strong>${d.species}</strong></div>
      </div>`;
    document.querySelectorAll('.sim-step').forEach((b) => b.classList.toggle('active', +b.dataset.i === i));
    if (!counts) return;
    simSeen.add(i);
    save('pv-sim', [...simSeen]);
    if (simSeen.size === SCEN.length && window.PV) PV.unlock('climate');
  }

  document.getElementById('simSteps').innerHTML = SCEN.map((s, i) => `<button class="sim-step" data-i="${i}">${s.t}<small>${s.label}</small></button>`).join('');
  document.getElementById('simSteps').addEventListener('click', (e) => {
    const b = e.target.closest('.sim-step');
    if (b) { range.value = b.dataset.i; showSim(+b.dataset.i); }
  });
  range.addEventListener('input', () => showSim(+range.value));
  showSim(0, false); // el escenario inicial no cuenta hasta que la persona lo elija
  }

  // ---------------------------------------------------
  //  Huella hídrica (valores promedio de Water Footprint Network)
  // ---------------------------------------------------
  function initWater() {
  // [id, icono, pregunta, unidad, litros por unidad, frecuencia: 'sem' | 'mes' | 'dia', máximo, valor inicial]
  const WATER = [
    ['vaca', '🥩', 'Carne vacuna', 'kg por semana', 15400, 'sem', 3, 1, 0.25],
    ['pollo', '🍗', 'Pollo', 'kg por semana', 4300, 'sem', 3, 0.5, 0.25],
    ['cerdo', '🥓', 'Cerdo', 'kg por semana', 6000, 'sem', 3, 0.25, 0.25],
    ['leche', '🥛', 'Leche', 'litros por semana', 1000, 'sem', 10, 2, 0.5],
    ['queso', '🧀', 'Queso', 'kg por semana', 3200, 'sem', 2, 0.25, 0.25],
    ['huevo', '🥚', 'Huevos', 'unidades por semana', 196, 'sem', 21, 4, 1],
    ['pan', '🍞', 'Pan y harinas', 'kg por semana', 1600, 'sem', 5, 1.5, 0.25],
    ['verdura', '🥕', 'Frutas y verduras', 'kg por semana', 600, 'sem', 10, 3, 0.5],
    ['cafe', '☕', 'Café', 'tazas por semana', 130, 'sem', 35, 7, 1],
    ['ropa', '👕', 'Ropa nueva de algodón', 'prendas por mes', 2700, 'mes', 10, 1, 1],
    ['ducha', '🚿', 'Ducha', 'minutos por día', 10, 'dia', 30, 8, 1],
  ];
  const WORLD = 3800; // litros por persona por día (promedio mundial aproximado)

  const wForm = document.getElementById('waterForm');
  const wOut = document.getElementById('waterOut');

  wForm.innerHTML = WATER.map(([id, icon, name, unit, , , max, val, step]) => `
    <label class="w-row">
      <span class="w-name">${icon} ${name}</span>
      <input type="range" min="0" max="${max}" step="${step}" value="${val}" data-id="${id}">
      <span class="w-val"><strong id="wv-${id}">${fmt(val, step < 1 ? 2 : 0)}</strong> <small>${unit}</small></span>
    </label>`).join('');

  let waterTouched = false;

  function calcWater() {
    const rows = WATER.map(([id, icon, name, , lt, freq, , , step]) => {
      const v = +wForm.querySelector(`[data-id="${id}"]`).value;
      document.getElementById('wv-' + id).textContent = fmt(v, step < 1 ? 2 : 0);
      const perDay = freq === 'sem' ? (v * lt) / 7 : freq === 'mes' ? (v * lt) / 30 : v * lt;
      return { icon, name, perDay };
    });
    const total = rows.reduce((s, r) => s + r.perDay, 0);
    const top = [...rows].sort((a, b) => b.perDay - a.perDay);
    const max = top[0].perDay || 1;
    const bathtubs = total / 150;
    wOut.innerHTML = `
      <div class="w-total">
        <small>Tu huella hídrica estimada</small>
        <div class="big">${fmt(total)} <span>litros por día</span></div>
        <p>Equivale a llenar unas <strong>${fmt(bathtubs)}</strong> bañeras por día 🛁 · Promedio mundial: ~${fmt(WORLD)} L/día</p>
      </div>
      <div class="compare-bars">
        ${top.slice(0, 6).map((r) => `
          <div class="cbar"><span>${r.icon} ${r.name}</span>
            <div class="cbar-track"><div class="cbar-fill" style="width:${(r.perDay / max) * 100}%;background:#48cae4"></div></div>
            <span class="cbar-val">${fmt(r.perDay)} L</span></div>`).join('')}
      </div>
      <p class="w-tip">💡 La mayor parte del agua que usamos es <strong>agua “escondida”</strong> en lo que comemos y compramos, no la que sale de la canilla. Reducir la carne y comprar menos ropa nueva baja mucho tu huella.</p>`;
    if (waterTouched && window.PV) PV.unlock('water');
  }

  wForm.addEventListener('input', () => { waterTouched = true; calcWater(); });
  calcWater();

  // Tarjetas "¿Cuánta agua hay en...?"
  const HIDDEN = [
    ['☕', '1 taza de café', '130 litros'],
    ['🍎', '1 manzana', '125 litros'],
    ['🥚', '1 huevo', '196 litros'],
    ['📄', '1 hoja de papel A4', '10 litros'],
    ['🍫', '1 barra de chocolate (100 g)', '1.700 litros'],
    ['👕', '1 remera de algodón', '2.700 litros'],
    ['👖', '1 jean', '8.000 litros'],
    ['🥩', '1 kg de carne vacuna', '15.400 litros'],
  ];
  const cards = document.getElementById('waterCards');
  cards.innerHTML = HIDDEN.map(([icon, what, lt]) => `
    <button class="flip" aria-label="¿Cuánta agua hay en ${what}?">
      <span class="flip-inner">
        <span class="flip-front"><span class="flip-icon">${icon}</span>${what}<small>Tocá para ver</small></span>
        <span class="flip-back"><strong>${lt}</strong><small>de agua para producirlo</small></span>
      </span>
    </button>`).join('');
  cards.addEventListener('click', (e) => { const f = e.target.closest('.flip'); if (f) f.classList.toggle('on'); });
  }
})();
