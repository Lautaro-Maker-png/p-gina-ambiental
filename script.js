// =====================================================
//  Utilidades
// =====================================================
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// localStorage puede fallar (modo privado, permisos): siempre con try/catch
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  },
};

const fmt = (n, d = 1) => n.toFixed(d).replace('.', ',');

// =====================================================
//  Menú móvil y barra de navegación
// =====================================================
const navToggle = $('.nav-toggle');
const navLinks = $('.nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

$$('a', navLinks).forEach((a) =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  })
);

const nav = $('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll);
onScroll();

// =====================================================
//  Modo oscuro
// =====================================================
const themeBtn = $('#themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return document.documentElement.dataset.theme || (prefersDark.matches ? 'dark' : 'light');
}

function paintThemeButton() {
  themeBtn.textContent = currentTheme() === 'dark' ? '☀️' : '🌙';
}

themeBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('pv-theme', next); } catch (e) {}
  paintThemeButton();
});

prefersDark.addEventListener('change', paintThemeButton);
paintThemeButton();

// =====================================================
//  Contadores animados y aparición al hacer scroll
// =====================================================
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = (el.dataset.target.split('.')[1] || '').length;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / 1500, 1);
    el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), decimals);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      const counter = $('.stat-num', entry.target);
      if (counter) animateCounter(counter);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

function watchReveal(root = document) {
  $$('.reveal:not(.visible)', root).forEach((el) => observer.observe(el));
}
watchReveal();

// =====================================================
//  ¿Sabías que...?
// =====================================================
const facts = [
  'Reciclar aluminio ahorra cerca del 95% de la energía necesaria para fabricarlo desde cero.',
  'El vidrio puede reciclarse una y otra vez sin perder calidad.',
  'Un árbol adulto puede absorber alrededor de 20 kg de CO₂ por año.',
  'El fitoplancton de los océanos produce al menos la mitad del oxígeno del planeta.',
  'Cerca de un tercio de los alimentos que se producen en el mundo se pierde o se desperdicia.',
  'Alrededor del 75% de los principales cultivos del mundo dependen en alguna medida de los polinizadores.',
  'Las lámparas LED usan hasta un 80% menos de energía que las incandescentes.',
  'Las turberas cubren apenas el 3% de la tierra, pero guardan el doble de carbono que todos los bosques del mundo.',
  'La Amazonía alberga alrededor del 10% de las especies conocidas del planeta.',
  'Una canilla que gotea puede perder más de 30 litros de agua por día.',
  'Fabricar un solo jean puede requerir miles de litros de agua.',
  'Una botella de plástico puede tardar cientos de años en degradarse.',
];

let factIndex = 0;
const factText = $('#factText');

$('#factBtn').addEventListener('click', () => {
  let next;
  do { next = Math.floor(Math.random() * facts.length); } while (next === factIndex);
  factIndex = next;
  factText.classList.add('fade');
  setTimeout(() => {
    factText.textContent = facts[factIndex];
    factText.classList.remove('fade');
  }, 250);
});

// =====================================================
//  Antes y después (glaciar)
// =====================================================
const compareRange = $('#compareRange');
const compareBefore = $('#compareBefore');
const compareLine = $('#compareLine');

function updateCompare() {
  const v = compareRange.value;
  compareBefore.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
  compareLine.style.left = `${v}%`;
}
compareRange.addEventListener('input', updateCompare);
updateCompare();

// =====================================================
//  Calculadora de huella de carbono
//  Valores aproximados en toneladas de CO₂ equivalente por año
// =====================================================
const calcQuestions = [
  {
    id: 'transporte', cat: 'Transporte', title: '¿Cómo te movés en el día a día?',
    options: [
      ['Auto, casi siempre solo/a', 2.0], ['Auto compartido', 1.0], ['Moto', 0.8],
      ['Transporte público', 0.5], ['Bici o caminando', 0.05],
    ],
  },
  {
    id: 'vuelos', cat: 'Vuelos', title: '¿Cuántas horas volás por año?',
    options: [['Nunca', 0], ['1 a 5 horas', 0.5], ['6 a 15 horas', 1.5], ['Más de 15 horas', 3.0]],
  },
  {
    id: 'dieta', cat: 'Alimentación', title: '¿Cómo es tu alimentación?',
    options: [
      ['Carne roja casi todos los días', 2.5], ['Carne algunas veces por semana', 1.7],
      ['Vegetariana', 1.2], ['Vegana', 0.9],
    ],
  },
  {
    id: 'energia', cat: 'Energía en casa', title: '¿Cuánta energía usan en tu casa?',
    hint: '(aire acondicionado, calefacción, electrodomésticos)',
    options: [['Poca', 0.5], ['Normal', 1.0], ['Mucha', 1.8]],
  },
  {
    id: 'renovable', cat: null, title: '¿Usan energía renovable (por ejemplo, paneles solares)?',
    options: [['Sí', 0.5], ['No / no sé', 1]], multiplierOf: 'energia',
  },
  {
    id: 'compras', cat: 'Compras', title: '¿Cuánto comprás ropa, tecnología y otros productos nuevos?',
    options: [['Poco, reutilizo mucho', 0.5], ['Lo normal', 1.0], ['Bastante', 2.0]],
  },
  {
    id: 'residuos', cat: 'Residuos', title: '¿Qué hacés con tus residuos?',
    options: [['Separo y hago compost', 0.2], ['Separo algo', 0.4], ['No separo', 0.7]],
  },
];

const WORLD_AVG = 4.7; // t CO₂ por persona (promedio mundial aproximado)
const TARGET = 2.0;    // meta aproximada por persona compatible con frenar el calentamiento

const tipsByCat = {
  'Transporte': '🚲 Probá reemplazar algunos viajes en auto por bici, caminata o transporte público.',
  'Vuelos': '✈️ Los vuelos pesan mucho: elegí tren o micro cuando puedas y agrupá viajes.',
  'Alimentación': '🥗 Reducir la carne roja, aunque sea algunos días por semana, baja mucho tu huella.',
  'Energía en casa': '💡 Usá lámparas LED, desenchufá lo que no usás y regulá el aire acondicionado a 24 °C.',
  'Compras': '👕 Comprá menos y mejor: reparar, reutilizar y comprar usado reduce emisiones.',
  'Residuos': '♻️ Separar residuos y compostar evita emisiones de los basurales.',
};

const calcForm = $('#calcForm');
const calcResult = $('#calcResult');

calcForm.innerHTML =
  calcQuestions.map((q, qi) => `
    <fieldset>
      <legend>${qi + 1}. ${q.title} ${q.hint ? `<small>${q.hint}</small>` : ''}</legend>
      <div class="options">
        ${q.options.map(([label], oi) => `
          <label class="option">
            <input type="radio" name="${q.id}" value="${oi}" required>
            <span>${label}</span>
          </label>`).join('')}
      </div>
    </fieldset>`).join('') +
  '<button type="submit" class="btn calc-submit">Calcular mi huella 🌍</button>';

calcForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(calcForm);
  const values = {};
  calcQuestions.forEach((q) => { values[q.id] = q.options[Number(data.get(q.id))][1]; });

  const parts = calcQuestions
    .filter((q) => q.cat)
    .map((q) => {
      let v = values[q.id];
      const mult = calcQuestions.find((m) => m.multiplierOf === q.id);
      if (mult) v *= values[mult.id];
      return { cat: q.cat, value: v };
    });

  const total = parts.reduce((s, p) => s + p.value, 0);
  showCalcResult(total, parts);
});

function showCalcResult(total, parts) {
  let msg;
  if (total <= TARGET) msg = '¡Excelente! Tu huella está cerca de la meta para frenar el cambio climático. 🌟';
  else if (total <= WORLD_AVG) msg = 'Estás por debajo del promedio mundial. ¡Vas bien, y todavía podés mejorar! 🌿';
  else msg = 'Tu huella está por encima del promedio mundial. Mirá los consejos de abajo para reducirla. 💪';

  const max = Math.max(total, WORLD_AVG, TARGET);
  const bar = (label, value, color) => `
    <div class="cbar">
      <span>${label}</span>
      <div class="cbar-track"><div class="cbar-fill" data-w="${(value / max) * 100}" style="background:${color}"></div></div>
      <span class="cbar-val">${fmt(value)} t</span>
    </div>`;

  const sorted = [...parts].sort((a, b) => b.value - a.value);
  const maxPart = sorted[0].value || 1;

  calcResult.innerHTML = `
    <div class="result-total">
      <p>Tu huella estimada es de</p>
      <div class="big">${fmt(total)} t</div>
      <p>de CO₂ por año</p>
      <p class="result-msg">${msg}</p>
    </div>
    <div class="compare-bars">
      ${bar('Vos', total, '#52b788')}
      ${bar('Promedio mundial', WORLD_AVG, '#f4a261')}
      ${bar('Meta 2050', TARGET, '#48cae4')}
    </div>
    <div class="breakdown">
      <h3>¿De dónde viene tu huella?</h3>
      <div class="compare-bars">
        ${sorted.map((p) => `
          <div class="cbar">
            <span>${p.cat}</span>
            <div class="cbar-track"><div class="cbar-fill" data-w="${(p.value / maxPart) * 100}" style="background:#2d6a4f"></div></div>
            <span class="cbar-val">${fmt(p.value)} t</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="tips">
      <h3>Tus 3 mejores oportunidades para reducirla</h3>
      <ul>${sorted.slice(0, 3).map((p) => `<li>${tipsByCat[p.cat]}</li>`).join('')}</ul>
    </div>
    <p class="note">Estimación orientativa con valores promedio. Una huella real depende de muchos más factores.</p>
    <div class="center"><button class="btn btn-outline btn-small" id="calcAgain">Volver a calcular</button></div>`;

  calcResult.hidden = false;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => $$('.cbar-fill', calcResult).forEach((b) => (b.style.width = b.dataset.w + '%')))
  );
  calcResult.scrollIntoView({ behavior: 'smooth', block: 'start' });

  $('#calcAgain').addEventListener('click', () => {
    calcForm.reset();
    calcResult.hidden = true;
    calcForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// =====================================================
//  Juego: ¿en qué contenedor va?
// =====================================================
const gameItems = [
  ['🥤', 'Botella de plástico', 'amarillo'], ['🥫', 'Lata de conserva', 'amarillo'],
  ['🧴', 'Envase de shampoo', 'amarillo'], ['🛍️', 'Bolsa de plástico limpia', 'amarillo'],
  ['📰', 'Diario', 'azul'], ['📦', 'Caja de cartón', 'azul'],
  ['📄', 'Hoja de papel', 'azul'], ['📖', 'Revista vieja', 'azul'],
  ['🍾', 'Botella de vidrio', 'verde'], ['🫙', 'Frasco de mermelada', 'verde'],
  ['🍌', 'Cáscara de banana', 'marron'], ['🍎', 'Resto de manzana', 'marron'],
  ['🥚', 'Cáscara de huevo', 'marron'], ['🧉', 'Yerba usada', 'marron'],
  ['🥬', 'Hojas de lechuga', 'marron'],
  ['🔋', 'Pila usada', 'especial'], ['📱', 'Celular viejo', 'especial'],
  ['🛢️', 'Aceite de cocina usado', 'especial'], ['💊', 'Medicamentos vencidos', 'especial'],
];

const binNames = {
  amarillo: 'Plásticos y latas', azul: 'Papel y cartón', verde: 'Vidrio',
  marron: 'Orgánicos', especial: 'Punto especial',
};

const gItem = $('#gameItem');
const gFeedback = $('#gameFeedback');
const gStart = $('#gameStart');
const gTime = $('#gameTime');
const gScore = $('#gameScore');
const gBest = $('#gameBest');
const gBins = $$('.gbin');

let game = { running: false, score: 0, time: 60, timer: null, current: null, deck: [] };
let best = store.get('pv-game-best', 0);
gBest.textContent = best;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function nextItem() {
  if (!game.deck.length) game.deck = shuffle(gameItems);
  game.current = game.deck.pop();
  gItem.innerHTML = `<span class="game-emoji">${game.current[0]}</span><span class="game-name">${game.current[1]}</span>`;
  gItem.classList.remove('pop');
  void gItem.offsetWidth;
  gItem.classList.add('pop');
}

function startGame() {
  game = { running: true, score: 0, time: 60, timer: null, current: null, deck: shuffle(gameItems) };
  gScore.textContent = 0;
  gTime.textContent = 60;
  gFeedback.textContent = '';
  gFeedback.className = 'game-feedback';
  gStart.hidden = true;
  gBins.forEach((b) => (b.disabled = false));
  nextItem();
  game.timer = setInterval(() => {
    game.time--;
    gTime.textContent = game.time;
    if (game.time <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(game.timer);
  game.running = false;
  gBins.forEach((b) => (b.disabled = true));
  const record = game.score > best;
  if (record) {
    best = game.score;
    store.set('pv-game-best', best);
    gBest.textContent = best;
  }
  gItem.innerHTML = `<span class="game-emoji">${record ? '🏆' : '⏰'}</span><span class="game-name">¡Tiempo! Hiciste ${game.score} puntos</span>`;
  gFeedback.className = 'game-feedback ok';
  gFeedback.textContent = record ? '¡Nuevo récord!' : '';
  gStart.textContent = 'Jugar de nuevo';
  gStart.hidden = false;
}

gBins.forEach((btn) =>
  btn.addEventListener('click', () => {
    if (!game.running) return;
    const correct = btn.dataset.bin === game.current[2];
    game.score = Math.max(0, game.score + (correct ? 10 : -5));
    gScore.textContent = game.score;
    gFeedback.className = 'game-feedback ' + (correct ? 'ok' : 'bad');
    gFeedback.textContent = correct
      ? '✅ ¡Correcto!'
      : `❌ ${game.current[1]} va en: ${binNames[game.current[2]]}`;
    btn.classList.remove('flash-ok', 'flash-bad');
    void btn.offsetWidth;
    btn.classList.add(correct ? 'flash-ok' : 'flash-bad');
    nextItem();
  })
);

gStart.addEventListener('click', startGame);

// =====================================================
//  Quiz
// =====================================================
const quizQuestions = [
  {
    q: '¿Qué gas es el principal responsable del calentamiento global causado por las personas?',
    opts: ['Oxígeno', 'Dióxido de carbono (CO₂)', 'Nitrógeno', 'Helio'], a: 1,
    exp: 'El CO₂ se libera sobre todo al quemar combustibles fósiles y es el gas de efecto invernadero que más contribuye al calentamiento.',
  },
  {
    q: '¿Cuánto puede tardar una botella de plástico en degradarse?',
    opts: ['5 años', '50 años', 'Cientos de años', '1 año'], a: 2,
    exp: 'Se estima que puede tardar cientos de años, y aun así se fragmenta en microplásticos que quedan en el ambiente.',
  },
  {
    q: '¿Qué porcentaje del agua del planeta es agua dulce?',
    opts: ['Alrededor del 25%', 'Alrededor del 2,5%', 'Alrededor del 50%', 'Alrededor del 10%'], a: 1,
    exp: 'Solo cerca del 2,5% es dulce, y la mayor parte está congelada en glaciares y casquetes polares.',
  },
  {
    q: '¿Qué material se puede reciclar indefinidamente sin perder calidad?',
    opts: ['Papel', 'Vidrio', 'Telgopor', 'Plástico'], a: 1,
    exp: 'El vidrio puede fundirse y volver a fabricarse una y otra vez. El papel, en cambio, pierde calidad en cada reciclado.',
  },
  {
    q: '¿Qué día se celebra el Día Mundial del Medio Ambiente?',
    opts: ['22 de abril', '5 de junio', '21 de septiembre', '1 de enero'], a: 1,
    exp: 'Es el 5 de junio, impulsado por la ONU desde 1974. El 22 de abril es el Día de la Tierra.',
  },
  {
    q: '¿Qué animales polinizan gran parte de los cultivos que comemos?',
    opts: ['Palomas', 'Lombrices', 'Abejas', 'Hormigas'], a: 2,
    exp: 'Las abejas (junto con mariposas, aves y murciélagos) polinizan muchos cultivos de frutas, verduras y semillas.',
  },
  {
    q: '¿Cuál de estas es una fuente de energía renovable?',
    opts: ['Carbón', 'Gas natural', 'Petróleo', 'Energía solar'], a: 3,
    exp: 'La energía solar no se agota y no emite CO₂ al generar electricidad. Los otros tres son combustibles fósiles.',
  },
  {
    q: '¿Cuál es el bosque tropical más grande del mundo?',
    opts: ['La Amazonía', 'La Selva Negra', 'El Bosque de Sherwood', 'La Taiga'], a: 0,
    exp: 'La Amazonía se extiende por nueve países de Sudamérica y alberga una enorme parte de la biodiversidad del planeta.',
  },
  {
    q: '¿Dónde hay que descartar una pila usada?',
    opts: ['En la basura común', 'En el inodoro', 'En un punto de recolección especial', 'Enterrada en el jardín'], a: 2,
    exp: 'Las pilas contienen metales pesados que contaminan el suelo y el agua: van a puntos de recolección especiales.',
  },
  {
    q: '¿Qué es el compost?',
    opts: ['Un tipo de plástico', 'Abono hecho con residuos orgánicos', 'Un gas contaminante', 'Un pesticida'], a: 1,
    exp: 'Es abono natural que se obtiene al descomponer restos de comida y hojas. Reduce la basura y nutre la tierra.',
  },
];

const quizBox = $('#quizBox');
let quiz = { i: 0, score: 0, order: [] };

function startQuiz() {
  quiz = { i: 0, score: 0, order: shuffle(quizQuestions) };
  renderQuestion();
}

function renderQuestion() {
  const item = quiz.order[quiz.i];
  quizBox.innerHTML = `
    <div class="quiz-top"><span>Pregunta ${quiz.i + 1} de ${quiz.order.length}</span><span>⭐ ${quiz.score} correctas</span></div>
    <div class="progress progress-light"><div class="progress-bar" style="width:${(quiz.i / quiz.order.length) * 100}%"></div></div>
    <h3 class="quiz-q">${item.q}</h3>
    <div class="quiz-opts">
      ${item.opts.map((o, idx) => `<button class="quiz-opt" data-i="${idx}">${o}</button>`).join('')}
    </div>
    <div id="quizAfter"></div>`;

  $$('.quiz-opt', quizBox).forEach((btn) =>
    btn.addEventListener('click', () => answer(Number(btn.dataset.i)))
  );
}

function answer(idx) {
  const item = quiz.order[quiz.i];
  const buttons = $$('.quiz-opt', quizBox);
  buttons.forEach((b) => (b.disabled = true));
  buttons[item.a].classList.add('correct');
  const ok = idx === item.a;
  if (ok) quiz.score++;
  else buttons[idx].classList.add('wrong');

  const last = quiz.i === quiz.order.length - 1;
  $('#quizAfter').innerHTML = `
    <div class="quiz-exp"><strong>${ok ? '✅ ¡Correcto!' : '❌ No es correcto.'}</strong> ${item.exp}</div>
    <button class="btn quiz-next">${last ? 'Ver resultado' : 'Siguiente →'}</button>`;

  $('.quiz-next', quizBox).addEventListener('click', () => {
    if (last) return showQuizEnd();
    quiz.i++;
    renderQuestion();
  });
}

function showQuizEnd() {
  const n = quiz.order.length;
  const s = quiz.score;
  let msg;
  if (s === n) msg = '¡Perfecto! Sos un experto ambiental 🏆';
  else if (s >= 7) msg = '¡Muy bien! Sabés mucho del ambiente 🌳';
  else if (s >= 4) msg = 'Buen intento. ¡Leé las secciones de arriba y volvé a probar! 🌿';
  else msg = 'Hay mucho por descubrir. ¡Recorré la página y volvé a intentarlo! 🌱';

  quizBox.innerHTML = `
    <div class="quiz-end">
      <p>Tu resultado</p>
      <div class="big">${s} / ${n}</div>
      <p class="result-msg">${msg}</p>
      <div class="center"><button class="btn" id="quizRestart">Jugar otra vez</button></div>
    </div>`;
  $('#quizRestart').addEventListener('click', startQuiz);
}

startQuiz();

// =====================================================
//  Checklist "¿Qué puedo hacer yo?"
// =====================================================
const checks = $$('.action input');
const actionsBar = $('#progressBar');
const actionsText = $('#progressText');

const levels = [
  { min: 0, msg: 'Marcá al menos una acción para empezar 🌱' },
  { min: 1, msg: '¡Buen comienzo! Cada acción cuenta 🌿' },
  { min: 3, msg: 'Vas por muy buen camino 🌳' },
  { min: 6, msg: '¡Sos un guardián del planeta! 🌎' },
  { min: 8, msg: '¡Increíble! Compromiso ambiental total 🏆' },
];

const savedChecks = store.get('pv-actions', []);
checks.forEach((c, i) => (c.checked = !!savedChecks[i]));

function updateActions() {
  const done = checks.filter((c) => c.checked).length;
  actionsBar.style.width = `${(done / checks.length) * 100}%`;
  const level = [...levels].reverse().find((l) => done >= l.min);
  actionsText.textContent = done ? `${done}/${checks.length} — ${level.msg}` : level.msg;
  store.set('pv-actions', checks.map((c) => c.checked));
}

checks.forEach((c) => c.addEventListener('change', updateActions));
updateActions();

// =====================================================
//  Desafío de 30 días
// =====================================================
const challenge = [
  ['🛍️', 'Llevá tu propia bolsa a las compras'],
  ['🚿', 'Duchate en menos de 5 minutos'],
  ['💡', 'Apagá todas las luces que no uses'],
  ['🥤', 'No uses sorbetes ni vasos descartables'],
  ['🚶', 'Hacé un viaje a pie o en bici en vez de en auto'],
  ['♻️', 'Separá todos tus residuos del día'],
  ['🥗', 'Hacé un día sin carne'],
  ['🔌', 'Desenchufá los aparatos que no usás'],
  ['🧴', 'Usá una botella reutilizable todo el día'],
  ['🌱', 'Regá o plantá una planta'],
  ['📚', 'Aprendé algo nuevo sobre el ambiente'],
  ['🍎', 'Comprá frutas y verduras de estación'],
  ['🧺', 'Lavá la ropa con agua fría'],
  ['🗣️', 'Contale a alguien un dato de esta página'],
  ['🧹', 'Juntá la basura de un espacio público'],
  ['🍽️', 'No desperdicies comida: aprovechá las sobras'],
  ['🪥', 'Cerrá la canilla mientras te cepillás'],
  ['🔋', 'Llevá pilas usadas a un punto de recolección'],
  ['👕', 'Reparalo o donalo antes de tirarlo'],
  ['🌡️', 'Poné el aire acondicionado a 24 °C o más'],
  ['🥕', 'Empezá un compost con tus restos orgánicos'],
  ['📵', 'Pasá una hora sin pantallas, al aire libre'],
  ['🛒', 'Elegí productos con menos envoltorio'],
  ['🐝', 'Plantá una flor para los polinizadores'],
  ['🚌', 'Usá transporte público todo el día'],
  ['📄', 'Imprimí solo lo necesario, de los dos lados'],
  ['💧', 'Juntá agua de lluvia o reutilizá agua para regar'],
  ['🏪', 'Comprá en un comercio local'],
  ['🎁', 'Regalá algo hecho a mano o una experiencia'],
  ['🌍', 'Planeá 3 hábitos para seguir después del desafío'],
];

const chGrid = $('#chGrid');
const chBar = $('#chBar');
const chText = $('#chText');
let chDone = store.get('pv-challenge', []);

function renderChallenge() {
  chGrid.innerHTML = challenge.map(([icon, txt], i) => `
    <button class="day ${chDone[i] ? 'done' : ''}" data-i="${i}" aria-pressed="${!!chDone[i]}">
      <span class="day-icon">${icon}</span>
      <span class="day-num">Día ${i + 1}</span>${txt}
    </button>`).join('');
  updateChallengeProgress();
}

function updateChallengeProgress() {
  const n = chDone.filter(Boolean).length;
  chBar.style.width = `${(n / challenge.length) * 100}%`;
  chText.textContent = n === challenge.length
    ? '🏆 ¡Completaste el desafío de 30 días! Sos un ejemplo para el planeta.'
    : `${n} de ${challenge.length} días completados`;
}

chGrid.addEventListener('click', (e) => {
  const day = e.target.closest('.day');
  if (!day) return;
  const i = Number(day.dataset.i);
  chDone[i] = !chDone[i];
  day.classList.toggle('done', chDone[i]);
  day.setAttribute('aria-pressed', chDone[i]);
  store.set('pv-challenge', chDone);
  updateChallengeProgress();
});

$('#chReset').addEventListener('click', () => {
  if (!confirm('¿Seguro que querés reiniciar el desafío?')) return;
  chDone = [];
  store.set('pv-challenge', chDone);
  renderChallenge();
});

renderChallenge();

// =====================================================
//  Calendario ambiental
// =====================================================
const envDates = [
  [2, 2, '🦆', 'Día Mundial de los Humedales'],
  [3, 21, '🌳', 'Día Internacional de los Bosques'],
  [3, 22, '💧', 'Día Mundial del Agua'],
  [4, 22, '🌍', 'Día de la Tierra'],
  [5, 20, '🐝', 'Día Mundial de las Abejas'],
  [5, 22, '🦋', 'Día Internacional de la Diversidad Biológica'],
  [6, 5, '🌱', 'Día Mundial del Medio Ambiente'],
  [6, 8, '🌊', 'Día Mundial de los Océanos'],
  [7, 3, '🛍️', 'Día Internacional Libre de Bolsas de Plástico'],
  [9, 16, '☀️', 'Día Internacional de la Preservación de la Capa de Ozono'],
  [10, 24, '🌡️', 'Día Internacional contra el Cambio Climático'],
  [12, 5, '🪴', 'Día Mundial del Suelo'],
  [12, 11, '🏔️', 'Día Internacional de las Montañas'],
];

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function renderCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const withNext = envDates.map(([m, d, icon, name]) => {
    let date = new Date(today.getFullYear(), m - 1, d);
    if (date < today) date = new Date(today.getFullYear() + 1, m - 1, d);
    const days = Math.round((date - today) / 86400000);
    return { m, d, icon, name, days };
  });

  const next = [...withNext].sort((a, b) => a.days - b.days)[0];
  $('#nextDate').innerHTML = `
    <div class="nd-label">Próxima fecha ambiental</div>
    <div class="nd-name">${next.icon} ${next.name}</div>
    <div class="nd-days">${next.days === 0 ? '¡Es hoy!' : next.days === 1 ? 'Mañana' : `Faltan ${next.days} días`}</div>
    <div class="nd-label">${next.d} de ${MONTHS[next.m - 1]}.</div>`;

  withNext.sort((a, b) => a.days - b.days);
  $('#dates').innerHTML = withNext.map((x) => `
    <div class="date-card reveal">
      <div class="date-badge"><strong>${x.d}</strong><small>${MONTHS[x.m - 1]}</small></div>
      <div class="date-info"><strong>${x.icon} ${x.name}</strong>
        <small>${x.days === 0 ? '¡Hoy!' : `en ${x.days} día${x.days === 1 ? '' : 's'}`}</small></div>
    </div>`).join('');
  watchReveal($('#dates'));
}

renderCalendar();
