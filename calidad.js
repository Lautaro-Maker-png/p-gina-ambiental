// =====================================================
//  Calidad del aire y del agua: semáforo interactivo
// =====================================================
(function () {
  const airBox = document.getElementById('airBox');
  const waterBox = document.getElementById('wqBox');
  if (!airBox || !waterBox) return;

  const fmt = (n, d = 0) => Number(n).toLocaleString('es-AR', { maximumFractionDigits: d, minimumFractionDigits: d });
  let touchedAir = false, touchedWater = false;
  const check = () => { if (touchedAir && touchedWater && window.PV) PV.unlock('chem'); };

  // ---------------------------------------------------
  //  Aire: PM2,5 (promedio de 24 horas, en µg/m³)
  //  Categorías basadas en el índice de calidad del aire de la EPA (2024)
  // ---------------------------------------------------
  const AIR = [
    [9, 'Buena', '#2d9d5f', '😀', 'El aire es saludable. Ideal para actividades al aire libre.'],
    [35.4, 'Moderada', '#e9c46a', '🙂', 'Aceptable. Las personas muy sensibles podrían notar molestias.'],
    [55.4, 'Dañina para grupos sensibles', '#f4a261', '😐', 'Niños, personas mayores y con asma o problemas cardíacos deberían reducir el esfuerzo al aire libre.'],
    [125.4, 'Dañina para la salud', '#e76f51', '😷', 'Toda la población puede tener efectos. Conviene evitar el ejercicio intenso al aire libre.'],
    [225.4, 'Muy dañina', '#9b4dca', '🚨', 'Alerta sanitaria: mejor permanecer en interiores con ventanas cerradas.'],
    [Infinity, 'Peligrosa', '#7a1f3d', '☠️', 'Emergencia: toda la población está en riesgo.'],
  ];

  airBox.innerHTML = `
    <div class="tl-head">
      <span class="tl-icon">🌫️</span>
      <div><h3>Material particulado fino (PM2,5)</h3>
      <p>Son partículas 30 veces más finas que un pelo, que llegan hasta los pulmones y la sangre. Vienen del tránsito, la industria, las quemas y los incendios.</p></div>
    </div>
    <label class="tl-control">
      <span>Concentración (promedio de 24 h): <strong id="airVal">12</strong> µg/m³</span>
      <input type="range" min="0" max="300" step="1" value="12" id="airRange">
    </label>
    <div class="tl-presets">
      <button data-v="5">🏔️ Montaña</button><button data-v="14">🏙️ Ciudad tranquila</button>
      <button data-v="45">🚗 Avenida con tránsito</button><button data-v="160">🔥 Humo de incendios</button>
    </div>
    <div class="tl-result" id="airOut" aria-live="polite"></div>
    <p class="note">La Organización Mundial de la Salud recomienda no superar 15 µg/m³ en 24 horas ni 5 µg/m³ como promedio anual.</p>`;

  const airRange = document.getElementById('airRange');
  function paintAir() {
    const v = +airRange.value;
    const c = AIR.find((x) => v <= x[0]);
    document.getElementById('airVal').textContent = v;
    document.getElementById('airOut').innerHTML = `
      <div class="tl-light" style="--tl:${c[2]}"><span>${c[3]}</span></div>
      <div><strong style="color:${c[2]}">${c[1]}</strong><p>${c[4]}</p>
      <small>${v > 15 ? `⚠️ Supera ${fmt(v / 15, 1)} veces la guía de la OMS para 24 h.` : '✅ Dentro de la guía de la OMS para 24 h.'}</small></div>`;
  }
  airRange.addEventListener('input', () => { touchedAir = true; paintAir(); check(); });
  airBox.querySelector('.tl-presets').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    airRange.value = b.dataset.v;
    touchedAir = true; paintAir(); check();
  });
  paintAir();

  // ---------------------------------------------------
  //  Agua: parámetros básicos
  //  Límites de agua potable del Código Alimentario Argentino (art. 982) y la OMS
  // ---------------------------------------------------
  // id, icono, nombre, unidad, min, max, paso, valor inicial, qué es, función de estado -> [nivel 0/1/2, texto]
  const WQ = [
    ['ph', '⚗️', 'pH', '', 0, 14, 0.1, 7.2,
      'Indica si el agua es ácida (menos de 7), neutra (7) o alcalina (más de 7).',
      (v) => v >= 6.5 && v <= 8.5 ? [0, 'Dentro del rango para agua potable (6,5 a 8,5).']
        : (v >= 6 && v <= 9) ? [1, 'Levemente fuera del rango recomendado para agua potable.']
        : [2, v < 6 ? 'Muy ácida: puede corroer cañerías y liberar metales.' : 'Muy alcalina: no apta para consumo.']],
    ['od', '🐟', 'Oxígeno disuelto', 'mg/L', 0, 14, 0.5, 8,
      'Es el oxígeno que respiran peces y otros organismos. Se usa para evaluar ríos y lagos.',
      (v) => v >= 6 ? [0, 'Bueno para la vida acuática.']
        : v >= 4 ? [1, 'Regular: algunas especies sensibles pueden desaparecer.']
        : [2, v < 2 ? 'Crítico (hipoxia): mortandad de peces.' : 'Malo: la mayoría de los peces sufre estrés.']],
    ['nitratos', '🌾', 'Nitratos', 'mg/L', 0, 120, 1, 15,
      'Llegan al agua por fertilizantes, efluentes cloacales y de feedlots.',
      (v) => v <= 25 ? [0, 'Nivel bajo.'] : v <= 45 ? [1, 'Elevado, pero dentro del límite para agua potable (45 mg/L).'] : [2, 'Supera el límite para agua potable (45 mg/L). Es riesgoso para bebés.']],
    ['turbidez', '🌊', 'Turbidez', 'NTU', 0, 20, 0.5, 1,
      'Mide qué tan turbia está el agua por partículas en suspensión.',
      (v) => v <= 1 ? [0, 'Agua clara.'] : v <= 3 ? [1, 'Aceptable: dentro del límite para agua potable (3 NTU).'] : [2, 'Supera el límite para agua potable (3 NTU).']],
    ['arsenico', '⚠️', 'Arsénico', 'µg/L', 0, 200, 1, 5,
      'Está presente de forma natural en el agua subterránea de amplias zonas de la llanura chaco-pampeana. Su consumo prolongado causa HACRE.',
      (v) => v <= 10 ? [0, 'Dentro de la guía de la OMS (10 µg/L).'] : v <= 50 ? [1, 'Supera la guía de la OMS (10 µg/L). Conviene usar otra fuente o tratarla.'] : [2, 'Muy alto: no apta para beber ni cocinar.']],
  ];
  const COLORS = ['#2d9d5f', '#e9c46a', '#e76f51'];
  const LABEL = ['Bien', 'Atención', 'Mal'];

  waterBox.innerHTML = `
    <div class="tl-head">
      <span class="tl-icon">💧</span>
      <div><h3>Análisis de una muestra de agua</h3>
      <p>Mové los valores como si fueras el laboratorio y mirá qué indica cada parámetro.</p></div>
    </div>
    <div class="tl-presets" id="wqPresets">
      <button data-p="potable">🚰 Agua de red</button>
      <button data-p="rio">🏞️ Río limpio</button>
      <button data-p="contaminado">🏭 Río contaminado</button>
      <button data-p="pozo">🕳️ Pozo con arsénico</button>
    </div>
    <div class="wq-list">
      ${WQ.map(([id, icon, name, unit, min, max, step, val, what]) => `
        <div class="wq-row" id="wq-${id}">
          <div class="wq-light"></div>
          <div class="wq-main">
            <div class="wq-top"><strong>${icon} ${name}</strong><span><b class="wq-val">${fmt(val, step < 1 ? 1 : 0)}</b> ${unit}</span></div>
            <input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-id="${id}" aria-label="${name}">
            <small class="wq-what">${what}</small>
            <p class="wq-msg"></p>
          </div>
        </div>`).join('')}
    </div>
    <div class="wq-summary" id="wqSummary" aria-live="polite"></div>
    <p class="note">Valores orientativos. Para saber si un agua es potable hace falta un análisis de laboratorio completo.</p>`;

  const PRESETS = {
    potable: { ph: 7.2, od: 8, nitratos: 10, turbidez: 0.5, arsenico: 3 },
    rio: { ph: 7.4, od: 9, nitratos: 5, turbidez: 4, arsenico: 2 },
    contaminado: { ph: 6.2, od: 2.5, nitratos: 70, turbidez: 15, arsenico: 8 },
    pozo: { ph: 7.8, od: 6, nitratos: 30, turbidez: 1, arsenico: 90 },
  };

  function paintWater() {
    let worst = 0;
    WQ.forEach(([id, , , , , , step, , , rule]) => {
      const row = document.getElementById('wq-' + id);
      const v = +row.querySelector('input').value;
      const [lvl, msg] = rule(v);
      worst = Math.max(worst, lvl);
      row.style.setProperty('--tl', COLORS[lvl]);
      row.querySelector('.wq-val').textContent = fmt(v, step < 1 ? 1 : 0);
      row.querySelector('.wq-msg').textContent = `${LABEL[lvl]}: ${msg}`;
    });
    document.getElementById('wqSummary').innerHTML = `
      <div class="tl-light small" style="--tl:${COLORS[worst]}"></div>
      <p><strong>Resultado general:</strong> ${worst === 0 ? 'todos los parámetros analizados están en buen nivel. ✅' : worst === 1 ? 'hay parámetros para vigilar. ⚠️' : 'al menos un parámetro está fuera de los valores aceptables. ❌'}</p>`;
  }

  waterBox.addEventListener('input', (e) => { if (e.target.matches('input[type=range]')) { touchedWater = true; paintWater(); check(); } });
  document.getElementById('wqPresets').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const p = PRESETS[b.dataset.p];
    Object.entries(p).forEach(([id, v]) => { document.querySelector(`#wq-${id} input`).value = v; });
    touchedWater = true; paintWater(); check();
  });
  paintWater();
})();
