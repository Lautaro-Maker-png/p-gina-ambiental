// =====================================================
//  Recursos para docentes: secuencias y fichas imprimibles
// =====================================================
(function () {
  const grid = document.getElementById('teachGrid');
  if (!grid) return;

  const ACTS = [
    {
      id: 'red', icon: '🕸️', title: 'La red de la vida', level: 'Primaria (2.º ciclo)', time: '60 minutos', areas: 'Ciencias Naturales',
      link: 'aprender.html#cadena', linkLabel: 'Red alimentaria del pastizal',
      goals: ['Reconocer productores, herbívoros y carnívoros.', 'Comprender que las especies dependen unas de otras.', 'Valorar el rol de los polinizadores.'],
      steps: ['Preguntar: ¿quién come a quién en el patio de la escuela o en una plaza?', 'En grupos, usar la red alimentaria de la página: quitar las abejas, los grandes depredadores y los pastos, y anotar qué pasa.', 'Cada grupo dibuja la red de un ecosistema cercano (una plaza, un río, una huerta).', 'Puesta en común: ¿qué especie es la más importante de cada red y por qué?'],
      questions: ['¿Qué pasó cuando quitaste a las abejas? ¿Por qué?', 'Nombrá un productor, un herbívoro y un carnívoro del pastizal.', '¿Qué pasa si desaparecen los depredadores? ¿Es bueno o malo para el ecosistema?', 'Escribí dos acciones para proteger a los polinizadores.'],
      eval: 'Dibujo de la red de un ecosistema cercano con al menos 6 especies y una explicación de qué pasaría si falta una de ellas.',
    },
    {
      id: 'agua', icon: '💧', title: 'Detectives del agua', level: 'Primaria (2.º ciclo) y Secundaria (1.º y 2.º año)', time: '80 minutos', areas: 'Ciencias Naturales y Matemática',
      link: 'medi.html#hidrica', linkLabel: 'Calculadora de huella hídrica',
      goals: ['Diferenciar el agua que usamos directamente del agua “escondida” en los productos.', 'Estimar y comparar cantidades.', 'Proponer cambios de hábitos.'],
      steps: ['Antes de mirar la página, cada estudiante estima cuánta agua hace falta para producir un jean, una taza de café y un kilo de carne.', 'Dar vuelta las tarjetas “¿Cuánta agua hay en…?” y comparar con las estimaciones.', 'Calcular la huella hídrica personal con la calculadora.', 'En parejas, proponer tres cambios y calcular cuánto bajaría la huella.'],
      questions: ['¿Qué dato te sorprendió más? ¿Por qué?', '¿Cuál es la diferencia entre el agua directa y el agua “escondida”?', 'Si una familia de 4 personas deja de comer 1 kg de carne vacuna por semana, ¿cuántos litros de agua “escondida” ahorra en un año?', 'Escribí tres cambios que podrías hacer en tu casa.'],
      eval: 'Resolución del problema matemático y lista de cambios justificada.',
    },
    {
      id: 'auditoria', icon: '📝', title: 'Auditamos la escuela', level: 'Secundaria', time: '2 clases', areas: 'Ciencias Naturales, Construcción de Ciudadanía y proyectos',
      link: 'medi.html#auditoria', linkLabel: 'Auditoría ambiental',
      goals: ['Aplicar una herramienta de diagnóstico ambiental.', 'Trabajar en equipo para relevar información.', 'Elaborar y comunicar un plan de mejora.'],
      steps: ['Dividir el curso en seis grupos: energía, agua, residuos, consumo, movilidad y espacios verdes.', 'Cada grupo recorre la escuela, observa y conversa con el personal para responder sus preguntas.', 'Completar juntos la auditoría en la página (tipo de lugar: escuela) y descargar el informe.', 'Elegir las tres recomendaciones prioritarias y presentarlas a la dirección.'],
      questions: ['¿Qué área obtuvo el puntaje más bajo? ¿Por qué creen que pasa?', '¿Qué recomendación se puede aplicar sin costo?', '¿Quiénes tendrían que participar para que el plan funcione?', 'Proponé un indicador para medir si la mejora funcionó.'],
      eval: 'Informe de auditoría y presentación oral del plan de mejora.',
    },
    {
      id: 'eia', icon: '⚖️', title: 'Consejo evaluador: audiencia pública simulada', level: 'Secundaria (ciclo superior) y Nivel Superior', time: '2 clases', areas: 'Formación Ética y Ciudadana, Geografía y Gestión Ambiental',
      link: 'juegos.html#eia', linkLabel: 'Evaluá un proyecto',
      goals: ['Comprender el procedimiento de Evaluación de Impacto Ambiental.', 'Argumentar desde distintos puntos de vista.', 'Valorar la participación ciudadana en las decisiones ambientales.'],
      steps: ['Elegir uno de los casos del simulador (por ejemplo, el barrio en un humedal o el feedlot).', 'Repartir roles: empresa, autoridad ambiental, vecinos, organización ambiental y equipo técnico.', 'Cada grupo prepara sus argumentos con base en impactos y medidas.', 'Realizar la audiencia pública simulada; la autoridad emite un dictamen fundado.', 'Comparar el dictamen con la resolución del simulador.'],
      questions: ['¿Qué impactos identificó tu grupo?', '¿Qué medidas de mitigación propusieron?', '¿Qué argumento de otro grupo te pareció más sólido?', '¿Por qué es importante la participación ciudadana en una EIA?'],
      eval: 'Dictamen escrito con impactos, medidas y decisión fundamentada.',
    },
    {
      id: 'clima', icon: '🌡️', title: 'Nuestro clima en 2100', level: 'Secundaria', time: '60 minutos', areas: 'Geografía y Ciencias Naturales',
      link: 'aprender.html#simulador', linkLabel: 'Simulador del clima',
      goals: ['Comparar escenarios de calentamiento global.', 'Relacionar emisiones con impactos.', 'Reflexionar sobre acciones individuales y colectivas.'],
      steps: ['Explorar los cuatro escenarios del simulador.', 'Completar una tabla comparativa con olas de calor, nivel del mar y corales.', 'Debate: ¿qué diferencia hay entre +1,5 °C y +2 °C?', 'Escribir una carta a una persona que viva en el año 2100.'],
      questions: ['Completá: con +2 °C las olas de calor extremas serían ___ veces más frecuentes.', '¿Qué pasaría con los corales en cada escenario?', '¿Qué acciones pueden tomar los gobiernos, las empresas y las personas?', 'Escribí un párrafo de tu carta al 2100.'],
      eval: 'Tabla comparativa completa y carta al futuro.',
    },
    {
      id: 'ecorregiones', icon: '🗺️', title: 'Ecorregiones en el aula', level: 'Secundaria (1.º ciclo)', time: '2 clases', areas: 'Geografía y Biología',
      link: 'aprender.html#ecorregiones', linkLabel: 'Mapa de ecorregiones',
      goals: ['Conocer la diversidad de ambientes de Argentina.', 'Relacionar clima, flora y fauna.', 'Identificar amenazas y áreas protegidas.'],
      steps: ['Cada grupo elige una ecorregión del mapa.', 'Investigan su clima, flora, fauna, amenazas y áreas protegidas, y amplían con otras fuentes.', 'Arman un póster o una presentación.', 'Exposición y comparación entre ecorregiones.'],
      questions: ['Ecorregión elegida:', 'Clima:', 'Tres especies de flora y tres de fauna:', 'Principal amenaza y una propuesta para enfrentarla:'],
      eval: 'Póster o presentación con información completa y fuentes citadas.',
    },
    {
      id: 'derechos', icon: '📜', title: 'Mis derechos ambientales', level: 'Secundaria (ciclo superior)', time: '60 minutos', areas: 'Construcción de Ciudadanía y Formación Ética',
      link: 'derechos.html', linkLabel: 'Tus derechos ambientales',
      goals: ['Conocer el artículo 41 de la Constitución Nacional.', 'Identificar herramientas de participación.', 'Redactar un pedido de información pública ambiental.'],
      steps: ['Leer el artículo 41 y conversar sobre su significado.', 'Elegir un problema ambiental del barrio o la ciudad.', 'Identificar qué organismo es responsable.', 'Redactar un pedido de información según la Ley 25.831.'],
      questions: ['¿Qué derechos y qué deberes establece el artículo 41?', 'Problema ambiental elegido:', '¿A qué organismo le pedirías información?', 'Escribí el texto del pedido de información:'],
      eval: 'Pedido de información redactado correctamente.',
    },
  ];

  grid.innerHTML = ACTS.map((a) => `
    <article class="teach-card">
      <div class="teach-top"><span>${a.icon}</span><div><h3>${a.title}</h3><small>${a.level}</small></div></div>
      <ul class="teach-meta"><li>⏱️ ${a.time}</li><li>📚 ${a.areas}</li><li>🔗 <a href="${a.link}">${a.linkLabel}</a></li></ul>
      <p>${a.goals[0]}</p>
      <div class="btn-row">
        <button class="btn btn-small" data-view="${a.id}">👁️ Ver ficha</button>
        <button class="btn btn-small btn-outline" data-dl="${a.id}">⬇️ Descargar</button>
      </div>
    </article>`).join('');

  const lines = (n) => Array.from({ length: n }, () => '<div class="line"></div>').join('');

  function fichaHTML(a) {
    return `
      <header class="f-head"><small>🌱 Planeta Verde · Ficha docente</small><h2>${a.icon} ${a.title}</h2>
      <p><strong>Nivel:</strong> ${a.level} · <strong>Duración:</strong> ${a.time} · <strong>Áreas:</strong> ${a.areas}</p></header>
      <h3>Objetivos</h3><ul>${a.goals.map((g) => `<li>${g}</li>`).join('')}</ul>
      <h3>Recurso de Planeta Verde</h3><p>Sección “${a.linkLabel}”.</p>
      <h3>Secuencia</h3><ol>${a.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      <h3>Evaluación</h3><p>${a.eval}</p>
      <div class="f-student">
        <h3>Ficha para el estudiante</h3>
        <p>Nombre: ____________________________ Curso: ________ Fecha: ________</p>
        ${a.questions.map((q, i) => `<div class="f-q"><p><strong>${i + 1}.</strong> ${q}</p>${lines(3)}</div>`).join('')}
      </div>
      <p class="f-foot">Marco: Ley 27.621 de Educación Ambiental Integral.</p>`;
  }

  const css = `body{font-family:Arial,sans-serif;max-width:780px;margin:24px auto;padding:0 16px;color:#1f2d24;line-height:1.5}
    h2{color:#1b4332;margin:4px 0}h3{color:#1b4332;margin:18px 0 6px;font-size:16px}.f-head{border-bottom:3px solid #52b788;padding-bottom:10px}
    .f-head small{color:#2d6a4f;font-weight:bold}.f-student{border:2px dashed #95d5b2;border-radius:10px;padding:10px 16px;margin-top:20px}
    .line{border-bottom:1px solid #999;height:26px}.f-q{margin-bottom:10px}.f-foot{font-size:12px;color:#666;margin-top:20px}`;

  let modal;
  function view(a) {
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `<div class="modal-box ficha-box" role="dialog" aria-modal="true"><button class="modal-close" aria-label="Cerrar">✕</button>
        <div class="ficha" id="fichaContent"></div>
        <div class="btn-row no-print"><button class="btn btn-small" id="fichaPrint">🖨️ Imprimir</button><button class="btn btn-small btn-outline" id="fichaDl">⬇️ Descargar</button></div>
        <p class="modal-status no-print" id="fichaStatus"></p></div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.modal-close')) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
      document.getElementById('fichaPrint').addEventListener('click', () => {
        document.body.classList.add('print-ficha');
        try { window.print(); } catch (e) {}
        setTimeout(() => document.body.classList.remove('print-ficha'), 500);
        document.getElementById('fichaStatus').textContent = 'Si no se abrió la ventana de impresión, usá “Descargar” y abrí el archivo para imprimirlo.';
      });
      document.getElementById('fichaDl').addEventListener('click', () => download(modal.dataset.id, document.getElementById('fichaStatus')));
    }
    modal.dataset.id = a.id;
    document.getElementById('fichaContent').innerHTML = fichaHTML(a);
    document.getElementById('fichaStatus').textContent = '';
    modal.hidden = false;
    modal.querySelector('.modal-box').scrollTop = 0;
    modal.querySelector('.modal-close').focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
  }
  function close() { modal.hidden = true; document.body.style.overflow = ''; }

  async function download(id, statusEl) {
    const a = ACTS.find((x) => x.id === id);
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Ficha: ${a.title}</title><style>${css}</style></head><body>${fichaHTML(a)}</body></html>`;
    const res = window.PV ? await PV.download(`ficha-${a.id}.html`, html, 'text/html') : 'error';
    if (statusEl) statusEl.textContent = res === 'ok' ? '✅ Ficha descargada. Abrila en el navegador para imprimirla o guardarla como PDF.' : res === 'declined' ? 'Descarga cancelada.' : 'No se pudo descargar desde acá.';
    return res;
  }

  grid.addEventListener('click', async (e) => {
    const v = e.target.closest('[data-view]');
    const d = e.target.closest('[data-dl]');
    if (v) view(ACTS.find((x) => x.id === v.dataset.view));
    if (d) {
      const res = await download(d.dataset.dl);
      d.textContent = res === 'ok' ? '✅ Descargada' : '⬇️ Descargar';
    }
  });
})();
