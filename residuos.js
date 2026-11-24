// =====================================================
//  Calculadora de residuos y guía de compost
// =====================================================
(function () {
  const form = document.getElementById('wasteForm');
  if (!form) return;
  const out = document.getElementById('wasteOut');
  const fmt = (n, d = 0) => Number(n).toLocaleString('es-AR', { maximumFractionDigits: d, minimumFractionDigits: d });

  // Composición típica aproximada de los residuos domiciliarios en Argentina
  const COMP = [
    ['org', '🍌', 'Orgánicos', 0.50, '#8d5524', 'Hago compost con los restos orgánicos'],
    ['papel', '📦', 'Papel y cartón', 0.14, '#3a86ff', 'Separo papel y cartón'],
    ['plast', '🥤', 'Plásticos', 0.15, '#f4c430', 'Separo plásticos'],
    ['vidrio', '🍾', 'Vidrio', 0.05, '#2d9d5f', 'Separo vidrio'],
    ['metal', '🥫', 'Metales', 0.02, '#8a8f98', 'Separo latas y metales'],
    ['otros', '🗑️', 'Otros (textiles, pañales, etc.)', 0.14, '#b0a8a0', null],
  ];
  const PER_DAY = 1.15; // kg por persona por día (promedio aproximado en Argentina)
  const CAPTURE = 0.8;  // proporción que se logra separar bien

  form.innerHTML = `
    <label class="w-row waste-people">
      <span class="w-name">👨‍👩‍👧 Personas en tu casa</span>
      <input type="range" min="1" max="8" step="1" value="3" id="wPeople">
      <span class="w-val"><strong id="wPeopleVal">3</strong> <small>personas</small></span>
    </label>
    <p class="quiz-label">¿Qué separan hoy?</p>
    <div class="waste-checks">
      ${COMP.filter((c) => c[5]).map(([id, icon, , , , label]) => `
        <label class="option"><input type="checkbox" value="${id}"><span>${icon} ${label}</span></label>`).join('')}
    </div>
    <p class="quiz-label">Hábitos para reducir</p>
    <div class="waste-checks">
      <label class="option"><input type="checkbox" value="r-bolsa"><span>🛍️ Uso bolsas reutilizables</span></label>
      <label class="option"><input type="checkbox" value="r-granel"><span>🫙 Compro a granel o con poco envoltorio</span></label>
      <label class="option"><input type="checkbox" value="r-botella"><span>🧴 Uso botella reutilizable</span></label>
      <label class="option"><input type="checkbox" value="r-comida"><span>🍽️ Evito desperdiciar comida</span></label>
    </div>`;

  let touched = false;

  function calc() {
    const people = +document.getElementById('wPeople').value;
    document.getElementById('wPeopleVal').textContent = people;
    const on = new Set([...form.querySelectorAll('input[type=checkbox]:checked')].map((c) => c.value));
    // Cada hábito de reducción baja la generación un 3%
    const reduce = [...on].filter((v) => v.startsWith('r-')).length * 0.03;
    const week = PER_DAY * 7 * people * (1 - reduce);
    let diverted = 0;
    const rows = COMP.map(([id, icon, name, share, color]) => {
      const kg = week * share;
      const saved = on.has(id) ? kg * CAPTURE : 0;
      diverted += saved;
      return { icon, name, kg, saved, color };
    });
    const landfill = week - diverted;
    const pct = Math.round((diverted / week) * 100);
    const year = landfill * 52;
    const potential = week * (1 - 0.14) * CAPTURE;

    out.innerHTML = `
      <div class="w-total">
        <small>Tu casa genera aproximadamente</small>
        <div class="big" style="color:var(--primary)">${fmt(week, 1)} <span>kg por semana</span></div>
        <p>De eso, <strong>${fmt(diverted, 1)} kg (${pct}%)</strong> se recuperan y <strong>${fmt(landfill, 1)} kg</strong> van al relleno o basural.</p>
      </div>
      <div class="waste-bar" role="img" aria-label="Composición de tus residuos">
        ${rows.map((r) => `<span style="flex:${r.kg};background:${r.color}" title="${r.name}: ${fmt(r.kg, 1)} kg"></span>`).join('')}
      </div>
      <div class="waste-legend">${rows.map((r) => `<span><i style="background:${r.color}"></i>${r.icon} ${r.name} · ${fmt(r.kg, 1)} kg${r.saved ? ' ✅' : ''}</span>`).join('')}</div>
      <div class="waste-facts">
        <div><strong>${fmt(year)} kg</strong><small>al relleno por año</small></div>
        <div><strong>${fmt(potential, 1)} kg</strong><small>por semana podrían recuperarse separando todo</small></div>
        <div><strong>${on.has('org') ? '✅' : fmt(week * 0.5 * CAPTURE, 1) + ' kg'}</strong><small>${on.has('org') ? 'ya compostás tus orgánicos' : 'por semana evitarías compostando'}</small></div>
      </div>
      <p class="w-tip">💡 ${on.has('org') ? '¡Bien! Los orgánicos son la mitad de la basura. Seguí sumando separación de reciclables.' : 'Los restos orgánicos son cerca de la mitad de la basura de una casa. Compostar es lo que más reduce lo que va al relleno: mirá la guía de abajo.'}</p>`;
    if (touched && window.PV) PV.unlock('waste');
  }

  form.addEventListener('input', () => { touched = true; calc(); });
  calc();

  // ---------------------------------------------------
  //  ¿Va al compost?
  // ---------------------------------------------------
  const ITEMS = [
    ['🍌', 'Cáscara de banana', true, 'Material verde: aporta nitrógeno.'],
    ['🧉', 'Yerba usada', true, '¡Excelente para el compost!'],
    ['🥚', 'Cáscaras de huevo', true, 'Mejor si están trituradas.'],
    ['☕', 'Borra de café', true, 'Aporta nitrógeno.'],
    ['🍂', 'Hojas secas', true, 'Material marrón: aporta carbono y aire.'],
    ['📦', 'Cartón sin tinta, cortado', true, 'Material marrón: ayuda a equilibrar la humedad.'],
    ['🥕', 'Restos de verduras', true, 'Material verde ideal.'],
    ['🍗', 'Huesos y restos de carne', false, 'Atraen moscas y roedores y generan olor en un compost casero.'],
    ['🧀', 'Lácteos', false, 'Se pudren y generan mal olor.'],
    ['🛢️', 'Aceite de cocina', false, 'Impermeabiliza y frena la descomposición. Va a un punto de acopio.'],
    ['🐶', 'Heces de mascotas', false, 'Pueden transmitir enfermedades.'],
    ['🧴', 'Plásticos “biodegradables”', false, 'La mayoría necesita condiciones industriales para degradarse.'],
    ['🌿', 'Pasto cortado (en capas finas)', true, 'Material verde: mezclalo con secos para que no se compacte.'],
    ['🗞️', 'Diario con tintas de color', false, 'Mejor reciclarlo con el papel.'],
  ];

  const quiz = document.getElementById('compostQuiz');
  let deck = [], i = 0, score = 0;

  function startQuiz() {
    deck = [...ITEMS].sort(() => Math.random() - 0.5).slice(0, 10);
    i = 0; score = 0;
    showItem();
  }

  function showItem() {
    if (i >= deck.length) {
      quiz.innerHTML = `
        <div class="cq-end"><div class="big">${score}/10</div>
        <p>${score >= 8 ? '🪱 ¡Sos un/a experto/a del compost!' : '🌱 ¡Bien! Repasá la guía y probá otra vez.'}</p>
        <button class="btn btn-small" id="cqAgain">Jugar otra vez</button></div>`;
      document.getElementById('cqAgain').addEventListener('click', startQuiz);
      if (score >= 8 && window.PV) PV.unlock('compost');
      return;
    }
    const [icon, name] = deck[i];
    quiz.innerHTML = `
      <div class="cq-top">Elemento ${i + 1} de 10 · ⭐ ${score}</div>
      <div class="cq-item"><span>${icon}</span><strong>${name}</strong></div>
      <div class="cq-btns">
        <button class="btn" data-a="1">✅ Va al compost</button>
        <button class="btn btn-outline" data-a="0">❌ No va</button>
      </div>
      <p class="cq-fb" aria-live="polite"></p>`;
  }

  quiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    const [, , ok, why] = deck[i];
    const right = (b.dataset.a === '1') === ok;
    if (right) score++;
    quiz.querySelectorAll('[data-a]').forEach((x) => (x.disabled = true));
    const fb = quiz.querySelector('.cq-fb');
    fb.className = 'cq-fb ' + (right ? 'ok' : 'bad');
    fb.textContent = `${right ? '¡Correcto!' : 'No.'} ${ok ? 'Sí va.' : 'No va.'} ${why}`;
    setTimeout(() => { i++; showItem(); }, 1600);
  });

  startQuiz();
})();
