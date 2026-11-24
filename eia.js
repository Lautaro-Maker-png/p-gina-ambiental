// =====================================================
//  Evaluá un proyecto: simulador de Evaluación de Impacto Ambiental
//  Casos ficticios y simplificados con fines educativos
// =====================================================
(function () {
  const PROJECTS = [
    {
      id: 'humedal',
      icon: '🏘️',
      title: 'Barrio cerrado en un humedal',
      place: 'Delta de un gran río, cerca de una ciudad',
      desc: 'Una desarrolladora quiere rellenar 200 hectáreas de humedal para construir un barrio cerrado con 800 lotes y lagunas artificiales. El terreno se eleva con tierra para que no se inunde.',
      data: ['Superficie: 200 ha de humedal', 'Relleno: elevar el terreno 3 metros', 'Barrios vecinos: a 2 km, en zona baja'],
      impacts: [
        ['El humedal pierde su capacidad de absorber agua y los barrios vecinos se inundan más', true],
        ['Pérdida de hábitat de aves, peces, carpinchos y otras especies', true],
        ['Se libera carbono que estaba almacenado en el suelo del humedal', true],
        ['Más tránsito y más demanda de agua, cloacas y energía en la zona', true],
        ['Aumento del nivel del mar en la costa atlántica', false],
        ['Contaminación radiactiva del río', false],
        ['El relleno mejora naturalmente la calidad del agua', false],
      ],
      measures: [
        ['Estudio hidrológico de toda la cuenca, incluyendo el efecto sobre los barrios vecinos', true],
        ['Audiencia pública con vecinos, organizaciones y especialistas', true],
        ['Reducir el proyecto o relocalizarlo fuera de las zonas de humedal de mayor valor', true],
        ['Mantener corredores biológicos conectados para la fauna', true],
        ['Plantar césped en todo el predio para “compensar” lo rellenado', false],
        ['Cambiarle el nombre al proyecto por “Eco Barrio”', false],
        ['Construir terraplenes más altos sin estudiar hacia dónde va el agua', false],
      ],
      verdicts: { aprobar: 0, condiciones: 8, estudios: 12, rechazar: 20 },
      best: 'rechazar',
      verdictExp: 'Los humedales funcionan como esponjas: absorben el agua de las crecidas. Rellenarlos es un cambio prácticamente irreversible que traslada las inundaciones a otros barrios. Por el principio precautorio, lo más adecuado es rechazar el proyecto tal como está planteado. Pedir más estudios o un rediseño fuera del humedal también son respuestas razonables.',
      learn: ['Servicios ecosistémicos de los humedales', 'Principio precautorio', 'Impactos acumulativos sobre la cuenca'],
    },
    {
      id: 'solar',
      icon: '☀️',
      title: 'Parque solar en zona árida',
      place: 'Llanura desértica al pie de la cordillera',
      desc: 'Una empresa propone instalar un parque solar de 300 hectáreas con paneles fotovoltaicos. Generaría energía limpia para unos 100.000 hogares. El predio tiene vegetación nativa de zona árida y por allí se desplazan guanacos.',
      data: ['Superficie: 300 ha', 'Vida útil: 25 a 30 años', 'Agua disponible en la zona: muy escasa'],
      impacts: [
        ['Remoción de suelo y vegetación nativa durante la construcción', true],
        ['El cerco perimetral puede cortar el desplazamiento de la fauna (guanacos)', true],
        ['Uso de agua para limpiar los paneles en una zona donde escasea', true],
        ['Residuos de paneles al final de su vida útil', true],
        ['Grandes emisiones de CO₂ durante la operación', false],
        ['Contaminación del aire por humo', false],
        ['Ruido intenso que afecta a toda la provincia', false],
      ],
      measures: [
        ['Dejar pasos de fauna en el cerco perimetral', true],
        ['Limpieza en seco o con agua reciclada', true],
        ['Rescatar flora nativa y revegetar las áreas afectadas', true],
        ['Plan de reciclaje de paneles y de cierre al final de la vida útil', true],
        ['Desmontar toda la vegetación de los alrededores “por las dudas”', false],
        ['No hacer monitoreo, porque la energía es limpia', false],
        ['Enterrar los paneles rotos en el mismo predio', false],
      ],
      verdicts: { aprobar: 5, condiciones: 20, estudios: 10, rechazar: 0 },
      best: 'condiciones',
      verdictExp: 'La energía solar ayuda a reducir emisiones, pero ningún proyecto tiene impacto cero. Lo adecuado es aprobarlo con condiciones: pasos de fauna, uso responsable del agua, revegetación y un plan de cierre que contemple el reciclaje de los paneles.',
      learn: ['Las energías limpias también se evalúan', 'Medidas de mitigación', 'Plan de cierre y ciclo de vida'],
    },
    {
      id: 'relleno',
      icon: '🗑️',
      title: 'Relleno sanitario para una ciudad',
      place: 'Afueras de una ciudad de 150.000 habitantes',
      desc: 'El municipio quiere cerrar el basural a cielo abierto actual y construir un relleno sanitario: un sitio diseñado para disponer los residuos de forma controlada. El terreno elegido está a 4 km de las viviendas más cercanas.',
      data: ['Residuos: unas 150 toneladas por día', 'Napa de agua: a 8 metros de profundidad', 'Hoy: basural a cielo abierto con quemas frecuentes'],
      impacts: [
        ['Riesgo de contaminación de las napas por lixiviados (líquidos de la basura)', true],
        ['Emisión de metano, un gas de efecto invernadero', true],
        ['Olores, moscas y roedores en zonas cercanas', true],
        ['Tránsito de camiones en los caminos de acceso', true],
        ['Impacto positivo: permite cerrar el basural a cielo abierto', true],
        ['Derretimiento de glaciares cercanos', false],
        ['Ninguno: la basura enterrada desaparece', false],
      ],
      measures: [
        ['Membrana impermeable y sistema para captar y tratar lixiviados', true],
        ['Captar el biogás para quemarlo o generar energía', true],
        ['Pozos de monitoreo del agua subterránea', true],
        ['Programa de separación en origen y reciclaje para reducir lo que llega', true],
        ['Quemar la basura a cielo abierto para reducir volumen', false],
        ['Ubicarlo junto al río para facilitar el drenaje', false],
        ['Recibir también residuos peligrosos de industrias sin control', false],
      ],
      verdicts: { aprobar: 5, condiciones: 20, estudios: 10, rechazar: 0 },
      best: 'condiciones',
      verdictExp: 'Un relleno sanitario bien diseñado es mucho mejor que un basural a cielo abierto. Hay que aprobarlo con condiciones estrictas: impermeabilización, tratamiento de lixiviados, captación de biogás y monitoreo. Además, se debe acompañar con políticas para reducir y separar residuos (Ley 25.916).',
      learn: ['Gestión integral de residuos', 'Impactos positivos y negativos', 'Monitoreo ambiental'],
    },
    {
      id: 'litio',
      icon: '🔋',
      title: 'Extracción de litio en un salar',
      place: 'Salar de altura en la Puna',
      desc: 'Una minera propone extraer litio bombeando salmuera del subsuelo de un salar y evaporándola en grandes piletas. En la cuenca hay vegas (humedales de altura) con flamencos, y comunidades indígenas que viven del pastoreo y la extracción artesanal de sal. Otros proyectos ya operan en la misma cuenca.',
      data: ['Precipitaciones: menos de 100 mm por año', 'Otros proyectos en la cuenca: 2', 'Estudio del agua de toda la cuenca: no existe'],
      impacts: [
        ['Uso intensivo de agua (salmuera y agua dulce) en una zona extremadamente árida', true],
        ['Posible afectación de las vegas y de los flamencos', true],
        ['Afectación de comunidades indígenas y de sus actividades tradicionales', true],
        ['Impactos acumulativos con los otros proyectos de la misma cuenca', true],
        ['Contaminación por plásticos en el océano', false],
        ['Aumento de las lluvias en la región', false],
        ['Destrucción de selva tropical', false],
      ],
      measures: [
        ['Estudio hidrogeológico de toda la cuenca antes de decidir', true],
        ['Consulta previa, libre e informada a las comunidades indígenas', true],
        ['Monitoreo independiente y público del agua', true],
        ['Evaluar tecnologías que usen menos agua o reinyecten la salmuera', true],
        ['Empezar a operar y estudiar el agua después', false],
        ['Reemplazar la consulta por donaciones a las comunidades', false],
        ['Evaluar el proyecto sin considerar los otros que ya operan', false],
      ],
      verdicts: { aprobar: 0, condiciones: 10, estudios: 20, rechazar: 10 },
      best: 'estudios',
      verdictExp: 'Sin un estudio del agua de toda la cuenca no se pueden conocer los impactos acumulativos sobre las vegas y las comunidades. Lo más adecuado es pedir más estudios antes de decidir, además de garantizar la consulta previa, libre e informada a los pueblos indígenas (Convenio 169 de la OIT).',
      learn: ['Impactos acumulativos', 'Consulta previa a pueblos indígenas', 'Información de línea de base'],
    },
  ];

  const VERDICTS = [
    ['aprobar', '✅', 'Aprobar tal como está'],
    ['condiciones', '📋', 'Aprobar con condiciones'],
    ['estudios', '🔬', 'Pedir más estudios antes de decidir'],
    ['rechazar', '⛔', 'Rechazar'],
  ];

  const box = document.getElementById('eiaBox');
  const load = (k, f) => { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let bests = load('pv-eia', {});

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  let state;

  function scrollTop() {
    const top = box.getBoundingClientRect().top + window.scrollY - 90;
    if (Math.abs(window.scrollY - top) > 200) window.scrollTo({ top, behavior: 'smooth' });
  }

  // ---------- Menú de proyectos ----------
  function menu() {
    box.innerHTML = `
      <h3 class="eia-title">Elegí un proyecto para evaluar</h3>
      <div class="eia-projects">
        ${PROJECTS.map((p) => `
          <button class="eia-card" data-id="${p.id}">
            <span class="eia-card-icon">${p.icon}</span>
            <strong>${p.title}</strong>
            <small>${p.place}</small>
            <span class="eia-card-score">${bests[p.id] !== undefined ? `Tu mejor puntaje: ${bests[p.id]}/100` : 'Sin evaluar'}</span>
          </button>`).join('')}
      </div>`;
    box.querySelectorAll('.eia-card').forEach((b) =>
      b.addEventListener('click', () => start(PROJECTS.find((p) => p.id === b.dataset.id)))
    );
  }

  // ---------- Inicio ----------
  function start(p) {
    state = { p, scores: {}, step: 0 };
    box.innerHTML = `
      ${header(0)}
      <div class="eia-brief">
        <div class="eia-brief-icon">${p.icon}</div>
        <div>
          <h3>${p.title}</h3>
          <p class="eia-place">📍 ${p.place}</p>
          <p>${p.desc}</p>
          <ul class="eia-data">${p.data.map((d) => `<li>${d}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="btn-row"><button class="btn" id="eiaGo">Comenzar evaluación →</button><button class="btn btn-outline" id="eiaBack">← Otros proyectos</button></div>`;
    document.getElementById('eiaGo').addEventListener('click', () => checkStep('impacts'));
    document.getElementById('eiaBack').addEventListener('click', menu);
    scrollTop();
  }

  function header(step) {
    const steps = ['Proyecto', 'Impactos', 'Medidas', 'Decisión', 'Informe'];
    return `<div class="eia-progress">${steps.map((s, i) => `<span class="${i < step ? 'done' : i === step ? 'cur' : ''}">${s}</span>`).join('')}</div>`;
  }

  // ---------- Pasos 1 y 2: elegir opciones ----------
  function checkStep(kind) {
    const p = state.p;
    const isImp = kind === 'impacts';
    const opts = shuffle(p[kind]);
    box.innerHTML = `
      ${header(isImp ? 1 : 2)}
      <h3 class="eia-q">${isImp ? '🔍 ¿Qué impactos podría generar este proyecto?' : '🛡️ ¿Qué medidas recomendarías?'}</h3>
      <p class="eia-hint">${isImp ? 'Marcá todos los impactos que correspondan. Ojo: algunas opciones no tienen nada que ver.' : 'Marcá las medidas que realmente prevengan o reduzcan los impactos. Cuidado con las falsas soluciones.'}</p>
      <div class="eia-opts">
        ${opts.map(([t, ok], i) => `
          <label class="eia-opt" data-ok="${ok}">
            <input type="checkbox" value="${i}">
            <span class="eia-check"></span>
            <span class="eia-opt-text">${t}</span>
          </label>`).join('')}
      </div>
      <div class="eia-feedback" id="eiaFb"></div>
      <div class="btn-row"><button class="btn" id="eiaCheck">Confirmar</button></div>`;

    const btn = document.getElementById('eiaCheck');
    btn.addEventListener('click', () => {
      const labels = [...box.querySelectorAll('.eia-opt')];
      const selected = labels.filter((l) => l.querySelector('input').checked);
      if (!selected.length) {
        document.getElementById('eiaFb').innerHTML = '<p class="warn">Elegí al menos una opción.</p>';
        return;
      }
      let hits = 0, errs = 0;
      const total = labels.filter((l) => l.dataset.ok === 'true').length;
      labels.forEach((l) => {
        const ok = l.dataset.ok === 'true';
        const on = l.querySelector('input').checked;
        l.querySelector('input').disabled = true;
        l.classList.add('locked');
        if (on && ok) { hits++; l.classList.add('right'); l.insertAdjacentHTML('beforeend', '<em>✓ Correcto</em>'); }
        else if (on && !ok) { errs++; l.classList.add('wrong'); l.insertAdjacentHTML('beforeend', `<em>✗ ${isImp ? 'No corresponde' : 'Falsa solución'}</em>`); }
        else if (!on && ok) { l.classList.add('missed'); l.insertAdjacentHTML('beforeend', '<em>Te faltó</em>'); }
      });
      const score = Math.round(Math.max(0, (hits - errs) / total) * 40);
      state.scores[kind] = { score, hits, errs, total };
      document.getElementById('eiaFb').innerHTML = `
        <p><strong>${score}/40 puntos.</strong> Acertaste ${hits} de ${total}${errs ? ` y elegiste ${errs} incorrecta${errs > 1 ? 's' : ''}` : ''}.</p>`;
      btn.textContent = isImp ? 'Siguiente: medidas →' : 'Siguiente: decisión →';
      btn.replaceWith(btn.cloneNode(true));
      document.getElementById('eiaCheck').addEventListener('click', () => (isImp ? checkStep('measures') : verdict()));
    });
    scrollTop();
  }

  // ---------- Paso 3: decisión ----------
  function verdict() {
    const p = state.p;
    box.innerHTML = `
      ${header(3)}
      <h3 class="eia-q">⚖️ ¿Cuál es tu dictamen?</h3>
      <p class="eia-hint">Teniendo en cuenta los impactos y las medidas posibles, ¿qué decidirías como autoridad ambiental?</p>
      <div class="eia-verdicts">
        ${VERDICTS.map(([id, icon, label]) => `<button class="eia-verdict" data-v="${id}"><span>${icon}</span>${label}</button>`).join('')}
      </div>
      <div id="eiaFb"></div>`;

    box.querySelectorAll('.eia-verdict').forEach((b) =>
      b.addEventListener('click', () => {
        const v = b.dataset.v;
        const score = p.verdicts[v];
        state.scores.verdict = { score, choice: v };
        box.querySelectorAll('.eia-verdict').forEach((x) => {
          x.disabled = true;
          if (x.dataset.v === p.best) x.classList.add('right');
          else if (x === b) x.classList.add(score >= 10 ? 'partial' : 'wrong');
        });
        const title = v === p.best ? '✅ ¡Excelente decisión!' : score >= 10 ? '🟡 Es una opción razonable, pero hay una mejor.' : '❌ No es la decisión más adecuada.';
        document.getElementById('eiaFb').innerHTML = `
          <div class="quiz-exp"><strong>${title} (${score}/20)</strong><br>${p.verdictExp}</div>
          <div class="btn-row"><button class="btn" id="eiaReport">Ver informe final →</button></div>`;
        document.getElementById('eiaReport').addEventListener('click', report);
      })
    );
    scrollTop();
  }

  // ---------- Informe final ----------
  function report() {
    const p = state.p;
    const s = state.scores;
    const total = s.impacts.score + s.measures.score + s.verdict.score;
    const grade = total >= 80 ? ['🏅', 'Evaluador/a experto/a'] : total >= 50 ? ['👍', 'Buen trabajo'] : ['🌱', 'Seguí practicando'];
    const verdictLabel = VERDICTS.find((v) => v[0] === s.verdict.choice)[2];

    bests[p.id] = Math.max(bests[p.id] || 0, total);
    save('pv-eia', bests);
    if (window.PV) {
      PV.unlock('eia1');
      if (total >= 80) PV.unlock('eiaPro');
      if (PROJECTS.every((x) => bests[x.id] !== undefined)) PV.unlock('eiaAll');
    }

    box.innerHTML = `
      ${header(4)}
      <div class="eia-report">
        <div class="eia-report-head">
          <small>Informe de evaluación · ${p.icon} ${p.title}</small>
          <div class="big">${total}<span>/100</span></div>
          <p class="result-msg">${grade[0]} ${grade[1]}</p>
        </div>
        <table class="eia-table">
          <tr><td>🔍 Identificación de impactos</td><td>${s.impacts.hits}/${s.impacts.total} aciertos${s.impacts.errs ? `, ${s.impacts.errs} errores` : ''}</td><td><strong>${s.impacts.score}/40</strong></td></tr>
          <tr><td>🛡️ Medidas de mitigación</td><td>${s.measures.hits}/${s.measures.total} aciertos${s.measures.errs ? `, ${s.measures.errs} errores` : ''}</td><td><strong>${s.measures.score}/40</strong></td></tr>
          <tr><td>⚖️ Dictamen</td><td>${verdictLabel}</td><td><strong>${s.verdict.score}/20</strong></td></tr>
        </table>
        <div class="eia-learn">
          <h4>📚 Conceptos clave de este caso</h4>
          <div class="chips">${p.learn.map((l) => `<span class="chip">${l}</span>`).join('')}</div>
        </div>
        <div class="btn-row">
          <button class="btn" id="eiaShare">📤 Compartir informe</button>
          <button class="btn btn-outline" id="eiaRetry">🔁 Reintentar</button>
          <button class="btn btn-outline" id="eiaMenu">📂 Otro proyecto</button>
        </div>
      </div>`;

    document.getElementById('eiaRetry').addEventListener('click', () => start(p));
    document.getElementById('eiaMenu').addEventListener('click', menu);
    document.getElementById('eiaShare').addEventListener('click', () => window.PV && PV.share({
      emoji: p.icon,
      title: `Evalué el impacto ambiental de: ${p.title}`,
      value: `${total}/100`,
      subtitle: `Mi dictamen: ${verdictLabel}. ¿Qué decidirías vos?`,
      text: `${p.icon} Evalué el proyecto "${p.title}" en Planeta Verde y saqué ${total}/100. Mi dictamen: ${verdictLabel}. ¿Qué decidirías vos? 🌱`,
    }));
    scrollTop();
  }

  menu();

  // =====================================================
  //  Derechos: contar leyes leídas
  // =====================================================
  const laws = [...document.querySelectorAll('#laws .law')];
  const count = document.getElementById('rightsCount');
  let read = new Set(load('pv-laws', []));

  function paintLaws() {
    laws.forEach((l, i) => l.classList.toggle('read', read.has(i)));
    count.textContent = read.size === laws.length ? '✅ ¡Leíste todas!' : `${read.size} de ${laws.length} leídas`;
  }

  laws.forEach((l, i) =>
    l.addEventListener('toggle', () => {
      if (!l.open) return;
      read.add(i);
      save('pv-laws', [...read]);
      paintLaws();
      if (read.size === laws.length && window.PV) PV.unlock('rights');
    })
  );
  paintLaws();
})();
