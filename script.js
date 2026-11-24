// =====================================================
//  Funciones comunes y secciones principales.
//  Cada sección se activa solo si existe en la página actual.
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const unlock = (id) => { if (window.PV) PV.unlock(id); };
const share = (data) => { if (window.PV) PV.share(data); };

// Botón que pide confirmación con un segundo clic (confirm() puede estar bloqueado)
function confirmButton(btn, label, onConfirm) {
  let armed = false, t;
  const original = btn.textContent;
  btn.addEventListener('click', () => {
    if (!armed) {
      armed = true;
      btn.textContent = label;
      btn.classList.add('armed');
      t = setTimeout(() => { armed = false; btn.textContent = original; btn.classList.remove('armed'); }, 4000);
      return;
    }
    clearTimeout(t);
    armed = false;
    btn.textContent = original;
    btn.classList.remove('armed');
    onConfirm();
  });
}

// =====================================================
//  Menú móvil y barra de navegación
// =====================================================
(function () {
  const navToggle = $('.nav-toggle');
  const navLinks = $('.nav-links');
  const nav = $('.nav');
  if (!nav) return;

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

  if (!nav.classList.contains('solid')) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

// =====================================================
//  Modo oscuro
// =====================================================
(function () {
  const themeBtn = $('#themeToggle');
  if (!themeBtn) return;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () => document.documentElement.dataset.theme || (prefersDark.matches ? 'dark' : 'light');
  const paint = () => { themeBtn.textContent = currentTheme() === 'dark' ? '☀️' : '🌙'; };

  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set('pv-theme', next);
    paint();
  });

  // Safari viejo no tiene addEventListener en MediaQueryList
  if (prefersDark.addEventListener) prefersDark.addEventListener('change', paint);
  else if (prefersDark.addListener) prefersDark.addListener(paint);
  paint();
})();

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

// threshold 0 + margen: funciona también con elementos más altos que la pantalla
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      const counter = $('.stat-num', entry.target);
      if (counter) animateCounter(counter);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0, rootMargin: '0px 0px -8% 0px' }
) : null;

function watchReveal(root = document) {
  $$('.reveal:not(.visible)', root).forEach((el) => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('visible');
  });
}
watchReveal();

// =====================================================
//  ¿Sabías que...?
// =====================================================
(function () {
  const btn = $('#factBtn');
  if (!btn) return;
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
    'Argentina tiene 18 ecorregiones: desde selvas subtropicales hasta la Antártida.',
    'En amplias zonas de la llanura chaco-pampeana el agua subterránea tiene arsénico de origen natural.',
  ];
  const text = $('#factText');
  let index = 0, seen = 0;
  btn.addEventListener('click', () => {
    let next;
    do { next = Math.floor(Math.random() * facts.length); } while (next === index);
    index = next;
    if (++seen >= 5) unlock('curious');
    text.classList.add('fade');
    setTimeout(() => { text.textContent = facts[index]; text.classList.remove('fade'); }, 250);
  });
})();

// =====================================================
//  Antes y después (glaciar)
// =====================================================
(function () {
  const range = $('#compareRange');
  if (!range) return;
  const before = $('#compareBefore');
  const line = $('#compareLine');
  const update = () => {
    before.style.clipPath = `inset(0 ${100 - range.value}% 0 0)`;
    line.style.left = `${range.value}%`;
  };
  range.addEventListener('input', update);
  update();
})();

// =====================================================
//  Calculadora de huella de carbono
//  Valores aproximados en toneladas de CO₂ equivalente por año
// =====================================================
(function () {
  const calcForm = $('#calcForm');
  if (!calcForm) return;
  const calcResult = $('#calcResult');

  const calcQuestions = [
    {
      id: 'transporte', cat: 'Transporte', title: '¿Cómo te movés en el día a día?',
      options: [['Auto, casi siempre solo/a', 2.0], ['Auto compartido', 1.0], ['Moto', 0.8], ['Transporte público', 0.5], ['Bici o caminando', 0.05]],
    },
    { id: 'vuelos', cat: 'Vuelos', title: '¿Cuántas horas volás por año?', options: [['Nunca', 0], ['1 a 5 horas', 0.5], ['6 a 15 horas', 1.5], ['Más de 15 horas', 3.0]] },
    {
      id: 'dieta', cat: 'Alimentación', title: '¿Cómo es tu alimentación?',
      options: [['Carne roja casi todos los días', 2.5], ['Carne algunas veces por semana', 1.7], ['Vegetariana', 1.2], ['Vegana', 0.9]],
    },
    {
      id: 'energia', cat: 'Energía en casa', title: '¿Cuánta energía usan en tu casa?', hint: '(aire acondicionado, calefacción, electrodomésticos)',
      options: [['Poca', 0.5], ['Normal', 1.0], ['Mucha', 1.8]],
    },
    { id: 'renovable', cat: null, title: '¿Usan energía renovable (por ejemplo, paneles solares)?', options: [['Sí', 0.5], ['No / no sé', 1]], multiplierOf: 'energia' },
    { id: 'compras', cat: 'Compras', title: '¿Cuánto comprás ropa, tecnología y otros productos nuevos?', options: [['Poco, reutilizo mucho', 0.5], ['Lo normal', 1.0], ['Bastante', 2.0]] },
    { id: 'residuos', cat: 'Residuos', title: '¿Qué hacés con tus residuos?', options: [['Separo y hago compost', 0.2], ['Separo algo', 0.4], ['No separo', 0.7]] },
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

  calcForm.innerHTML = calcQuestions.map((q, qi) => `
    <fieldset>
      <legend>${qi + 1}. ${q.title} ${q.hint ? `<small>${q.hint}</small>` : ''}</legend>
      <div class="options">
        ${q.options.map(([label], oi) => `
          <label class="option"><input type="radio" name="${q.id}" value="${oi}" required><span>${label}</span></label>`).join('')}
      </div>
    </fieldset>`).join('') + '<button type="submit" class="btn calc-submit">Calcular mi huella 🌍</button>';

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(calcForm);
    const values = {};
    calcQuestions.forEach((q) => { values[q.id] = q.options[Number(data.get(q.id))][1]; });
    const parts = calcQuestions.filter((q) => q.cat).map((q) => {
      let v = values[q.id];
      const mult = calcQuestions.find((m) => m.multiplierOf === q.id);
      if (mult) v *= values[mult.id];
      return { cat: q.cat, value: v };
    });
    show(parts.reduce((s, p) => s + p.value, 0), parts);
  });

  function show(total, parts) {
    let msg;
    if (total <= TARGET) msg = '¡Excelente! Tu huella está cerca de la meta para frenar el cambio climático. 🌟';
    else if (total <= WORLD_AVG) msg = 'Estás por debajo del promedio mundial. ¡Vas bien, y todavía podés mejorar! 🌿';
    else msg = 'Tu huella está por encima del promedio mundial. Mirá los consejos de abajo para reducirla. 💪';

    const max = Math.max(total, WORLD_AVG, TARGET);
    const bar = (label, value, color, ref) => `
      <div class="cbar"><span>${label}</span>
        <div class="cbar-track"><div class="cbar-fill" data-w="${(value / ref) * 100}" style="background:${color}"></div></div>
        <span class="cbar-val">${fmt(value)} t</span></div>`;
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
        ${bar('Vos', total, '#52b788', max)}${bar('Promedio mundial', WORLD_AVG, '#f4a261', max)}${bar('Meta 2050', TARGET, '#48cae4', max)}
      </div>
      <div class="breakdown"><h3>¿De dónde viene tu huella?</h3>
        <div class="compare-bars">${sorted.map((p) => bar(p.cat, p.value, '#2d6a4f', maxPart)).join('')}</div>
      </div>
      <div class="tips"><h3>Tus 3 mejores oportunidades para reducirla</h3>
        <ul>${sorted.slice(0, 3).map((p) => `<li>${tipsByCat[p.cat]}</li>`).join('')}</ul>
      </div>
      <p class="note">Estimación orientativa con valores promedio. Una huella real depende de muchos más factores.</p>
      <div class="center btn-row">
        <button type="button" class="btn btn-small" id="calcShare">📤 Compartir mi resultado</button>
        <button type="button" class="btn btn-outline btn-small" id="calcAgain">Volver a calcular</button>
      </div>`;

    calcResult.hidden = false;
    unlock('calc');
    $('#calcShare').addEventListener('click', () => share({
      emoji: total <= TARGET ? '🌟' : total <= WORLD_AVG ? '🌿' : '🌍',
      title: 'Mi huella de carbono es de',
      value: `${fmt(total)} t`,
      subtitle: `de CO₂ por año. El promedio mundial es de ${fmt(WORLD_AVG)} t.`,
      text: `🌍 Calculé mi huella de carbono en Planeta Verde: ${fmt(total)} toneladas de CO₂ por año (el promedio mundial es ${fmt(WORLD_AVG)} t). ¿Cuál es la tuya? 🌱`,
    }));
    $('#calcAgain').addEventListener('click', () => {
      calcForm.reset();
      calcResult.hidden = true;
      calcForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    requestAnimationFrame(() => requestAnimationFrame(() =>
      $$('.cbar-fill', calcResult).forEach((b) => (b.style.width = b.dataset.w + '%'))));
    calcResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();

// =====================================================
//  Juego: ¿en qué contenedor va?
// =====================================================
(function () {
  const gStart = $('#gameStart');
  if (!gStart) return;

  const items = [
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
  const binNames = { amarillo: 'Plásticos y latas', azul: 'Papel y cartón', verde: 'Vidrio', marron: 'Orgánicos', especial: 'Punto especial' };

  const gItem = $('#gameItem'), gFeedback = $('#gameFeedback'), gTime = $('#gameTime');
  const gScore = $('#gameScore'), gBest = $('#gameBest'), gBins = $$('.gbin');

  const gShare = document.createElement('button');
  gShare.className = 'btn btn-outline btn-small';
  gShare.textContent = '📤 Compartir puntaje';
  gShare.hidden = true;
  gStart.after(gShare);

  let game = { running: false, score: 0, time: 60, timer: null, current: null, deck: [] };
  let best = store.get('pv-game-best', 0);
  let lastScore = 0;
  gBest.textContent = best;

  function nextItem() {
    if (!game.deck.length) game.deck = shuffle(items);
    game.current = game.deck.pop();
    gItem.innerHTML = `<span class="game-emoji">${game.current[0]}</span><span class="game-name">${game.current[1]}</span>`;
    gItem.classList.remove('pop');
    void gItem.offsetWidth;
    gItem.classList.add('pop');
  }

  function start() {
    clearInterval(game.timer);
    game = { running: true, score: 0, time: 60, timer: null, current: null, deck: shuffle(items) };
    gScore.textContent = 0;
    gTime.textContent = 60;
    gFeedback.textContent = '';
    gFeedback.className = 'game-feedback';
    gStart.hidden = true;
    gShare.hidden = true;
    gBins.forEach((b) => (b.disabled = false));
    nextItem();
    gBins[0].focus({ preventScroll: true });
    game.timer = setInterval(() => {
      game.time--;
      gTime.textContent = game.time;
      if (game.time <= 0) end();
    }, 1000);
  }

  function end() {
    clearInterval(game.timer);
    game.running = false;
    gBins.forEach((b) => (b.disabled = true));
    const record = game.score > best;
    if (record) { best = game.score; store.set('pv-game-best', best); gBest.textContent = best; }
    gItem.innerHTML = `<span class="game-emoji">${record ? '🏆' : '⏰'}</span><span class="game-name">¡Tiempo! Hiciste ${game.score} puntos</span>`;
    gFeedback.className = 'game-feedback ok';
    gFeedback.textContent = record ? '¡Nuevo récord!' : '';
    gStart.textContent = 'Jugar de nuevo';
    gStart.hidden = false;
    gShare.hidden = false;
    lastScore = game.score;
    if (game.score >= 150) unlock('game150');
    if (game.score >= 300) unlock('game300');
  }

  gBins.forEach((btn) => btn.addEventListener('click', () => {
    if (!game.running) return;
    const correct = btn.dataset.bin === game.current[2];
    game.score = Math.max(0, game.score + (correct ? 10 : -5));
    gScore.textContent = game.score;
    gFeedback.className = 'game-feedback ' + (correct ? 'ok' : 'bad');
    gFeedback.textContent = correct ? '✅ ¡Correcto!' : `❌ ${game.current[1]} va en: ${binNames[game.current[2]]}`;
    btn.classList.remove('flash-ok', 'flash-bad');
    void btn.offsetWidth;
    btn.classList.add(correct ? 'flash-ok' : 'flash-bad');
    nextItem();
  }));

  gStart.addEventListener('click', start);
  gShare.addEventListener('click', () => share({
    emoji: '♻️',
    title: 'En el juego de reciclaje hice',
    value: `${lastScore} pts`,
    subtitle: '¿Sabés en qué contenedor va cada residuo? Probá superarme.',
    text: `♻️ Hice ${lastScore} puntos en el juego de reciclaje de Planeta Verde. ¿Me superás? 🌱`,
  }));
})();

// =====================================================
//  Quiz: 40 preguntas por tema y dificultad
// =====================================================
(function () {
  const quizBox = $('#quizBox');
  if (!quizBox) return;

  // [tema, nivel, pregunta, opciones, índice correcto, explicación]
  const Q = [
    ['Clima', 'Fácil', '¿Qué gas es el principal responsable del calentamiento global causado por las personas?', ['Oxígeno', 'Dióxido de carbono (CO₂)', 'Nitrógeno', 'Helio'], 1, 'El CO₂ se libera sobre todo al quemar combustibles fósiles y es el gas de efecto invernadero que más contribuye al calentamiento.'],
    ['Clima', 'Fácil', '¿Cuál de estas es una fuente de energía renovable?', ['Carbón', 'Gas natural', 'Petróleo', 'Energía solar'], 3, 'La energía solar no se agota y no emite CO₂ al generar electricidad. Los otros tres son combustibles fósiles.'],
    ['Clima', 'Fácil', '¿Qué es el efecto invernadero?', ['Un tipo de cultivo bajo techo', 'La retención de calor en la atmósfera por ciertos gases', 'Un agujero en la capa de ozono', 'La contaminación del agua'], 1, 'Es un fenómeno natural que mantiene el planeta habitable. El problema es que las actividades humanas lo intensifican.'],
    ['Clima', 'Medio', '¿Qué acuerdo internacional busca limitar el calentamiento global muy por debajo de 2 °C?', ['Protocolo de Montreal', 'Acuerdo de París', 'Tratado Antártico', 'Convenio de Basilea'], 1, 'El Acuerdo de París (2015) busca limitar el calentamiento muy por debajo de 2 °C y hacer esfuerzos para no superar 1,5 °C.'],
    ['Clima', 'Medio', '¿Qué organismo de la ONU evalúa la ciencia sobre el cambio climático?', ['La FAO', 'La UNESCO', 'El IPCC', 'La OMS'], 2, 'El IPCC (Grupo Intergubernamental de Expertos sobre el Cambio Climático) publica los informes científicos de referencia.'],
    ['Clima', 'Medio', '¿Qué sector emite más gases de efecto invernadero a nivel mundial?', ['La energía (electricidad, calor y transporte)', 'Los residuos', 'El turismo', 'La pesca'], 0, 'El uso de energía, que incluye la generación de electricidad, la industria y el transporte, es responsable de la mayor parte de las emisiones.'],
    ['Clima', 'Difícil', '¿Qué gas, emitido en gran parte por la ganadería, calienta mucho más que el CO₂ por cada tonelada?', ['Metano', 'Oxígeno', 'Argón', 'Hidrógeno'], 0, 'El metano tiene un poder de calentamiento mucho mayor que el CO₂, aunque permanece menos tiempo en la atmósfera.'],
    ['Clima', 'Difícil', '¿Qué tratado logró frenar el deterioro de la capa de ozono?', ['Acuerdo de París', 'Protocolo de Kioto', 'Protocolo de Montreal', 'Acuerdo de Escazú'], 2, 'El Protocolo de Montreal (1987) eliminó gradualmente las sustancias que dañan la capa de ozono. Es considerado uno de los tratados ambientales más exitosos.'],
    ['Residuos', 'Fácil', '¿Cuánto puede tardar una botella de plástico en degradarse?', ['5 años', '50 años', 'Cientos de años', '1 año'], 2, 'Se estima que puede tardar cientos de años, y aun así se fragmenta en microplásticos que quedan en el ambiente.'],
    ['Residuos', 'Fácil', '¿Qué material se puede reciclar indefinidamente sin perder calidad?', ['Papel', 'Vidrio', 'Telgopor', 'Plástico'], 1, 'El vidrio puede fundirse y volver a fabricarse una y otra vez. El papel, en cambio, pierde calidad en cada reciclado.'],
    ['Residuos', 'Fácil', '¿Dónde hay que descartar una pila usada?', ['En la basura común', 'En el inodoro', 'En un punto de recolección especial', 'Enterrada en el jardín'], 2, 'Las pilas contienen metales pesados que contaminan el suelo y el agua: van a puntos de recolección especiales.'],
    ['Residuos', 'Fácil', '¿Qué es el compost?', ['Un tipo de plástico', 'Abono hecho con residuos orgánicos', 'Un gas contaminante', 'Un pesticida'], 1, 'Es abono natural que se obtiene al descomponer restos de comida y hojas. Reduce la basura y nutre la tierra.'],
    ['Residuos', 'Fácil', '¿Cuál es el orden correcto de las “3R”?', ['Reciclar, reutilizar, reducir', 'Reducir, reutilizar, reciclar', 'Reutilizar, reciclar, reducir', 'Da igual el orden'], 1, 'Primero reducir (no generar el residuo), después reutilizar y, por último, reciclar.'],
    ['Residuos', 'Medio', '¿Qué es un lixiviado?', ['Un tipo de compost', 'El líquido que se forma cuando el agua atraviesa los residuos', 'Un plástico biodegradable', 'Un gas de los rellenos'], 1, 'Los lixiviados arrastran sustancias contaminantes y pueden llegar a las napas si el relleno no está bien impermeabilizado.'],
    ['Residuos', 'Medio', 'Aproximadamente, ¿qué parte de la basura domiciliaria en Argentina son restos orgánicos?', ['Menos del 5%', 'Cerca de la mitad', 'Más del 90%', 'Nada'], 1, 'Alrededor de la mitad de lo que tiramos en casa son restos orgánicos que podrían compostarse.'],
    ['Residuos', 'Difícil', '¿Qué ley argentina regula los residuos peligrosos?', ['Ley 24.051', 'Ley 26.331', 'Ley 25.831', 'Ley 26.639'], 0, 'La Ley 24.051 regula la generación, transporte, tratamiento y disposición final de residuos peligrosos.'],
    ['Agua', 'Fácil', '¿Qué parte de la superficie del planeta está cubierta por agua?', ['Alrededor del 30%', 'Alrededor del 50%', 'Alrededor del 70%', 'Alrededor del 95%'], 2, 'Cerca del 70% de la superficie terrestre está cubierta por agua, pero casi toda es salada.'],
    ['Agua', 'Fácil', '¿Qué gasta menos agua?', ['Un baño de inmersión', 'Una ducha corta', 'Lavar la vereda con manguera', 'Dejar la canilla abierta al cepillarse'], 1, 'Una ducha de 5 minutos usa mucha menos agua que llenar una bañera.'],
    ['Agua', 'Medio', '¿Qué porcentaje del agua del planeta es agua dulce?', ['Alrededor del 25%', 'Alrededor del 2,5%', 'Alrededor del 50%', 'Alrededor del 10%'], 1, 'Solo cerca del 2,5% es dulce, y la mayor parte está congelada en glaciares y casquetes polares.'],
    ['Agua', 'Medio', '¿Qué es la huella hídrica?', ['La marca que deja el agua en las paredes', 'El volumen de agua usado para producir lo que consumimos', 'La cantidad de lluvia de un año', 'Un tipo de acuífero'], 1, 'Incluye el agua “escondida” en alimentos, ropa y otros productos, no solo la que sale de la canilla.'],
    ['Agua', 'Medio', '¿Qué alimento tiene la mayor huella hídrica por kilo?', ['Papa', 'Manzana', 'Carne vacuna', 'Arroz'], 2, 'Producir 1 kg de carne vacuna requiere en promedio unos 15.000 litros de agua, sobre todo para el alimento del ganado.'],
    ['Agua', 'Medio', '¿Qué contaminante de origen natural afecta el agua subterránea en amplias zonas de la llanura chaco-pampeana?', ['Mercurio', 'Arsénico', 'Plomo', 'Petróleo'], 1, 'El arsénico está presente naturalmente en muchos acuíferos de la región. Su consumo prolongado causa una enfermedad conocida como HACRE.'],
    ['Agua', 'Difícil', '¿Qué es la eutrofización?', ['La congelación de un lago', 'El exceso de nutrientes que provoca proliferación de algas y falta de oxígeno', 'La evaporación del agua de mar', 'La salinización del suelo'], 1, 'Fertilizantes y efluentes aportan nutrientes que hacen crecer algas en exceso. Al descomponerse, consumen el oxígeno del agua.'],
    ['Biodiversidad', 'Fácil', '¿Qué animales polinizan gran parte de los cultivos que comemos?', ['Palomas', 'Lombrices', 'Abejas', 'Hormigas'], 2, 'Las abejas (junto con mariposas, aves y murciélagos) polinizan muchos cultivos de frutas, verduras y semillas.'],
    ['Biodiversidad', 'Fácil', '¿Cuál es el bosque tropical más grande del mundo?', ['La Amazonía', 'La Selva Negra', 'El Bosque de Sherwood', 'La Taiga'], 0, 'La Amazonía se extiende por nueve países de Sudamérica y alberga una enorme parte de la biodiversidad del planeta.'],
    ['Biodiversidad', 'Fácil', '¿Cuál es el felino más grande de América?', ['Puma', 'Gato montés', 'Yaguareté', 'Ocelote'], 2, 'El yaguareté es Monumento Natural Nacional en Argentina y está en peligro de extinción.'],
    ['Biodiversidad', 'Medio', '¿Cuántas ecorregiones tiene Argentina?', ['5', '10', '18', '30'], 2, 'Argentina tiene 18 ecorregiones, desde la Selva Paranaense hasta la Antártida.'],
    ['Biodiversidad', 'Medio', '¿En qué ecorregión vive el huemul?', ['Puna', 'Chaco Seco', 'Bosques Patagónicos', 'Pampa'], 2, 'El huemul es un ciervo de los Andes patagónicos, en peligro de extinción y Monumento Natural Nacional.'],
    ['Biodiversidad', 'Medio', '¿Qué es una especie endémica?', ['Una especie que causa enfermedades', 'Una especie que vive solo en una región determinada', 'Una especie traída de otro continente', 'Una especie extinta'], 1, 'Las especies endémicas no existen en ningún otro lugar del mundo, por eso su conservación es especialmente importante.'],
    ['Biodiversidad', 'Difícil', '¿Qué especie invasora causa graves daños en los bosques de Tierra del Fuego?', ['El castor', 'El pingüino', 'El guanaco', 'El zorro colorado'], 0, 'El castor fue introducido en 1946. Sus diques inundan y matan grandes extensiones de bosque nativo.'],
    ['Biodiversidad', 'Difícil', '¿Qué ley protege los bosques nativos en Argentina?', ['Ley 26.331', 'Ley 24.051', 'Ley 27.592', 'Ley 25.916'], 0, 'La Ley de Bosques (26.331) obliga a las provincias a ordenar sus bosques en tres categorías de conservación.'],
    ['Gestión y derecho', 'Fácil', '¿Qué día se celebra el Día Mundial del Medio Ambiente?', ['22 de abril', '5 de junio', '21 de septiembre', '1 de enero'], 1, 'Es el 5 de junio, impulsado por la ONU desde 1974. El 22 de abril es el Día de la Tierra.'],
    ['Gestión y derecho', 'Fácil', '¿Qué significa que algo sea “sustentable”?', ['Que es caro', 'Que puede mantenerse en el tiempo sin agotar los recursos', 'Que es importado', 'Que es descartable'], 1, 'La sustentabilidad busca equilibrar lo económico, lo social y lo ambiental para el presente y el futuro.'],
    ['Gestión y derecho', 'Medio', '¿Qué artículo de la Constitución Nacional reconoce el derecho a un ambiente sano?', ['Artículo 14', 'Artículo 41', 'Artículo 75', 'Artículo 1'], 1, 'El artículo 41, incorporado en la reforma de 1994, reconoce el derecho a un ambiente sano y el deber de preservarlo.'],
    ['Gestión y derecho', 'Medio', '¿Qué procedimiento analiza los impactos de una obra antes de aprobarla?', ['La auditoría contable', 'La Evaluación de Impacto Ambiental', 'El censo', 'La licitación'], 1, 'La EIA es obligatoria para obras y actividades que puedan degradar el ambiente (Ley 25.675, artículos 11 a 13).'],
    ['Gestión y derecho', 'Medio', '¿Qué acuerdo regional protege a las personas defensoras del ambiente?', ['Acuerdo de Escazú', 'Protocolo de Kioto', 'Tratado de Asunción', 'Convenio de Ramsar'], 0, 'El Acuerdo de Escazú es el primer tratado del mundo con disposiciones específicas para proteger a defensores ambientales.'],
    ['Gestión y derecho', 'Difícil', '¿Qué principio dice que la falta de certeza científica no es excusa para no actuar ante un peligro de daño grave?', ['Principio de congruencia', 'Principio precautorio', 'Principio de progresividad', 'Principio de subsidiariedad'], 1, 'El principio precautorio está en el artículo 4 de la Ley General del Ambiente.'],
    ['Gestión y derecho', 'Difícil', '¿Qué norma internacional establece los requisitos de un sistema de gestión ambiental?', ['ISO 9001', 'ISO 14001', 'ISO 27001', 'ISO 45001'], 1, 'La ISO 14001 ayuda a las organizaciones a controlar sus impactos ambientales y mejorar de forma continua.'],
    ['Gestión y derecho', 'Difícil', 'Según la Ley 25.831, ¿en qué plazo máximo debe responder un organismo un pedido de información ambiental?', ['5 días hábiles', '30 días hábiles', '6 meses', 'No tiene plazo'], 1, 'El plazo máximo es de 30 días hábiles, y no hace falta explicar para qué se pide la información.'],
  ].map(([cat, lvl, q, opts, a, exp]) => ({ cat, lvl, q, opts, a, exp }));

  const CATS = ['Todos', 'Clima', 'Residuos', 'Agua', 'Biodiversidad', 'Gestión y derecho'];
  const LVLS = ['Todos', 'Fácil', 'Medio', 'Difícil'];
  let sel = { cat: 'Todos', lvl: 'Todos' };
  let quiz;

  const pool = () => Q.filter((x) => (sel.cat === 'Todos' || x.cat === sel.cat) && (sel.lvl === 'Todos' || x.lvl === sel.lvl));

  function setup() {
    const n = Math.min(10, pool().length);
    quizBox.innerHTML = `
      <h3 class="quiz-q">🧠 Armá tu quiz</h3>
      <p class="quiz-label">Tema</p>
      <div class="chips quiz-chips" data-k="cat">${CATS.map((c) => `<button class="gl-cat ${c === sel.cat ? 'active' : ''}" data-v="${c}">${c}</button>`).join('')}</div>
      <p class="quiz-label">Dificultad</p>
      <div class="chips quiz-chips" data-k="lvl">${LVLS.map((c) => `<button class="gl-cat ${c === sel.lvl ? 'active' : ''}" data-v="${c}">${c}</button>`).join('')}</div>
      <p class="quiz-count">${pool().length} preguntas disponibles · vas a responder ${n}</p>
      <div class="btn-row"><button class="btn" id="quizGo" ${n ? '' : 'disabled'}>Empezar quiz →</button></div>`;
    $$('.quiz-chips', quizBox).forEach((g) => g.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      sel[g.dataset.k] = b.dataset.v;
      setup();
    }));
    $('#quizGo').addEventListener('click', start);
  }

  function start() {
    // Se mezclan las preguntas y también el orden de las opciones
    const order = shuffle(pool()).slice(0, 10).map((x) => {
      const idx = shuffle(x.opts.map((_, i) => i));
      return { ...x, opts: idx.map((i) => x.opts[i]), a: idx.indexOf(x.a) };
    });
    quiz = { i: 0, score: 0, order };
    render();
  }

  function render() {
    const item = quiz.order[quiz.i];
    quizBox.innerHTML = `
      <div class="quiz-top"><span>Pregunta ${quiz.i + 1} de ${quiz.order.length} · ${item.cat} · ${item.lvl}</span><span>⭐ ${quiz.score} correctas</span></div>
      <div class="progress progress-light"><div class="progress-bar" style="width:${(quiz.i / quiz.order.length) * 100}%"></div></div>
      <h3 class="quiz-q">${item.q}</h3>
      <div class="quiz-opts">${item.opts.map((o, idx) => `<button class="quiz-opt" data-i="${idx}">${o}</button>`).join('')}</div>
      <div id="quizAfter"></div>`;
    $$('.quiz-opt', quizBox).forEach((btn) => btn.addEventListener('click', () => answer(Number(btn.dataset.i))));
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
    const next = $('.quiz-next', quizBox);
    next.focus({ preventScroll: true });
    next.addEventListener('click', () => {
      if (last) return end();
      quiz.i++;
      render();
    });
  }

  function end() {
    const n = quiz.order.length, s = quiz.score, pct = s / n;
    let msg;
    if (s === n) msg = '¡Perfecto! Sos un experto ambiental 🏆';
    else if (pct >= 0.7) msg = '¡Muy bien! Sabés mucho del ambiente 🌳';
    else if (pct >= 0.4) msg = 'Buen intento. ¡Recorré la sección Aprender y volvé a probar! 🌿';
    else msg = 'Hay mucho por descubrir. ¡Recorré la página y volvé a intentarlo! 🌱';

    quizBox.innerHTML = `
      <div class="quiz-end">
        <p>Tu resultado · ${sel.cat === 'Todos' ? 'Todos los temas' : sel.cat} · ${sel.lvl === 'Todos' ? 'Todas las dificultades' : sel.lvl}</p>
        <div class="big">${s} / ${n}</div>
        <p class="result-msg">${msg}</p>
        <div class="center btn-row">
          <button class="btn" id="quizRestart">Jugar otra vez</button>
          <button class="btn btn-outline" id="quizSetup">Cambiar tema</button>
          <button class="btn btn-outline" id="quizShare">📤 Compartir</button>
        </div>
      </div>`;
    $('#quizRestart').addEventListener('click', start);
    $('#quizSetup').addEventListener('click', setup);
    $('#quizShare').addEventListener('click', () => share({
      emoji: s === n ? '🏆' : '🧠',
      title: 'En el quiz ambiental saqué',
      value: `${s}/${n}`,
      subtitle: msg.replace(/\s\S+$/u, ''),
      text: `🧠 Saqué ${s}/${n} en el quiz ambiental de Planeta Verde. ¿Cuánto sabés vos del ambiente? 🌱`,
    }));
    if (n >= 5 && pct >= 0.7) unlock('quiz7');
    if (n === 10 && s === n) unlock('quiz10');
  }

  setup();
})();

// =====================================================
//  Checklist "¿Qué puedo hacer yo?"
// =====================================================
(function () {
  const checks = $$('.action input');
  if (!checks.length) return;
  const bar = $('#progressBar');
  const text = $('#progressText');
  const levels = [
    { min: 0, msg: 'Marcá al menos una acción para empezar 🌱' },
    { min: 1, msg: '¡Buen comienzo! Cada acción cuenta 🌿' },
    { min: 3, msg: 'Vas por muy buen camino 🌳' },
    { min: 6, msg: '¡Sos un guardián del planeta! 🌎' },
    { min: 8, msg: '¡Increíble! Compromiso ambiental total 🏆' },
  ];
  const saved = store.get('pv-actions', []);
  checks.forEach((c, i) => (c.checked = !!saved[i]));

  function update(save) {
    const done = checks.filter((c) => c.checked).length;
    bar.style.width = `${(done / checks.length) * 100}%`;
    const level = [...levels].reverse().find((l) => done >= l.min);
    text.textContent = done ? `${done}/${checks.length} — ${level.msg}` : level.msg;
    if (save) store.set('pv-actions', checks.map((c) => c.checked));
    if (done >= 6) unlock('habits');
  }
  checks.forEach((c) => c.addEventListener('change', () => update(true)));
  update(false);
})();

// =====================================================
//  Desafío de 30 días
// =====================================================
(function () {
  const grid = $('#chGrid');
  if (!grid) return;
  const challenge = [
    ['🛍️', 'Llevá tu propia bolsa a las compras'], ['🚿', 'Duchate en menos de 5 minutos'],
    ['💡', 'Apagá todas las luces que no uses'], ['🥤', 'No uses sorbetes ni vasos descartables'],
    ['🚶', 'Hacé un viaje a pie o en bici en vez de en auto'], ['♻️', 'Separá todos tus residuos del día'],
    ['🥗', 'Hacé un día sin carne'], ['🔌', 'Desenchufá los aparatos que no usás'],
    ['🧴', 'Usá una botella reutilizable todo el día'], ['🌱', 'Regá o plantá una planta'],
    ['📚', 'Aprendé algo nuevo sobre el ambiente'], ['🍎', 'Comprá frutas y verduras de estación'],
    ['🧺', 'Lavá la ropa con agua fría'], ['🗣️', 'Contale a alguien un dato de esta página'],
    ['🧹', 'Juntá la basura de un espacio público'], ['🍽️', 'No desperdicies comida: aprovechá las sobras'],
    ['🪥', 'Cerrá la canilla mientras te cepillás'], ['🔋', 'Llevá pilas usadas a un punto de recolección'],
    ['👕', 'Reparalo o donalo antes de tirarlo'], ['🌡️', 'Poné el aire acondicionado a 24 °C o más'],
    ['🥕', 'Empezá un compost con tus restos orgánicos'], ['📵', 'Pasá una hora sin pantallas, al aire libre'],
    ['🛒', 'Elegí productos con menos envoltorio'], ['🐝', 'Plantá una flor para los polinizadores'],
    ['🚌', 'Usá transporte público todo el día'], ['📄', 'Imprimí solo lo necesario, de los dos lados'],
    ['💧', 'Juntá agua de lluvia o reutilizá agua para regar'], ['🏪', 'Comprá en un comercio local'],
    ['🎁', 'Regalá algo hecho a mano o una experiencia'], ['🌍', 'Planeá 3 hábitos para seguir después del desafío'],
  ];
  const bar = $('#chBar');
  const text = $('#chText');
  let done = store.get('pv-challenge', []);

  function render() {
    grid.innerHTML = challenge.map(([icon, txt], i) => `
      <button class="day ${done[i] ? 'done' : ''}" data-i="${i}" aria-pressed="${!!done[i]}">
        <span class="day-icon">${icon}</span><span class="day-num">Día ${i + 1}</span>${txt}
      </button>`).join('');
    progress();
  }

  function progress() {
    const n = done.filter(Boolean).length;
    if (n >= 7) unlock('week');
    if (n === challenge.length) unlock('planet');
    bar.style.width = `${(n / challenge.length) * 100}%`;
    text.textContent = n === challenge.length
      ? '🏆 ¡Completaste el desafío de 30 días! Sos un ejemplo para el planeta.'
      : `${n} de ${challenge.length} días completados`;
  }

  grid.addEventListener('click', (e) => {
    const day = e.target.closest('.day');
    if (!day) return;
    const i = Number(day.dataset.i);
    done[i] = !done[i];
    day.classList.toggle('done', done[i]);
    day.setAttribute('aria-pressed', done[i]);
    store.set('pv-challenge', done);
    progress();
  });

  confirmButton($('#chReset'), '¿Seguro? Tocá de nuevo para reiniciar', () => {
    done = [];
    store.set('pv-challenge', done);
    render();
  });

  render();
})();

// =====================================================
//  Calendario ambiental
// =====================================================
(function () {
  const datesEl = $('#dates');
  if (!datesEl) return;
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const list = envDates.map(([m, d, icon, name]) => {
    let date = new Date(today.getFullYear(), m - 1, d);
    if (date < today) date = new Date(today.getFullYear() + 1, m - 1, d);
    return { m, d, icon, name, days: Math.round((date - today) / 86400000) };
  }).sort((a, b) => a.days - b.days);

  const next = list[0];
  $('#nextDate').innerHTML = `
    <div class="nd-label">Próxima fecha ambiental</div>
    <div class="nd-name">${next.icon} ${next.name}</div>
    <div class="nd-days">${next.days === 0 ? '¡Es hoy!' : next.days === 1 ? 'Mañana' : `Faltan ${next.days} días`}</div>
    <div class="nd-label">${next.d} de ${MONTHS[next.m - 1]}.</div>`;

  datesEl.innerHTML = list.map((x) => `
    <div class="date-card reveal">
      <div class="date-badge"><strong>${x.d}</strong><small>${MONTHS[x.m - 1]}</small></div>
      <div class="date-info"><strong>${x.icon} ${x.name}</strong>
        <small>${x.days === 0 ? '¡Hoy!' : `en ${x.days} día${x.days === 1 ? '' : 's'}`}</small></div>
    </div>`).join('');
  watchReveal(datesEl);
})();
