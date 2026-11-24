// =====================================================
//  Auditoría ambiental de tu casa, escuela u oficina
// =====================================================
(function () {
  // [área, icono, [[pregunta, recomendación si la respuesta no es "Sí"], ...]]
  const AREAS = [
    ['Energía', '⚡', [
      ['¿Usan lámparas LED en la mayoría de los ambientes?', 'Reemplazar las lámparas comunes por LED: consumen mucho menos y duran más.'],
      ['¿Apagan luces y equipos cuando no se usan?', 'Poner carteles o recordatorios para apagar luces y equipos al salir.'],
      ['¿Desenchufan cargadores y aparatos en “stand-by”?', 'Usar zapatillas con interruptor para cortar el consumo en espera.'],
      ['¿El aire acondicionado se usa a 24 °C o más y la calefacción a 20 °C o menos?', 'Regular la temperatura: cada grado de diferencia aumenta bastante el consumo.'],
      ['¿Aprovechan la luz natural durante el día?', 'Abrir cortinas y ubicar los puestos de trabajo o estudio cerca de las ventanas.'],
    ]],
    ['Agua', '💧', [
      ['¿Las canillas y los inodoros están sin pérdidas?', 'Revisar y reparar pérdidas: una canilla que gotea desperdicia miles de litros por año.'],
      ['¿Cierran la canilla mientras se lavan los dientes o enjabonan?', 'Promover el hábito de cerrar la canilla y colocar aireadores.'],
      ['¿Los inodoros tienen doble descarga o un sistema para ahorrar agua?', 'Instalar mochilas de doble descarga o colocar una botella llena dentro de la mochila.'],
      ['¿Riegan las plantas temprano a la mañana o a la tarde?', 'Regar en horarios frescos para evitar la evaporación, y reutilizar agua cuando se pueda.'],
    ]],
    ['Residuos', '🗑️', [
      ['¿Separan los residuos reciclables de los no reciclables?', 'Colocar recipientes diferenciados y señalizados para cada tipo de residuo.'],
      ['¿Hacen compost con los restos orgánicos?', 'Armar una compostera: reduce hasta la mitad de la basura y produce abono.'],
      ['¿Llevan pilas, electrónicos y aceite a puntos de recolección especiales?', 'Juntar estos residuos aparte y llevarlos a un punto verde o de recolección.'],
      ['¿Evitan usar descartables (vasos, cubiertos, botellas)?', 'Reemplazar descartables por vasos, tazas y botellas reutilizables.'],
      ['¿Reutilizan papel, frascos y cajas antes de tirarlos?', 'Usar el papel de los dos lados y darles una segunda vida a frascos y cajas.'],
    ]],
    ['Consumo y compras', '🛒', [
      ['¿Compran productos locales y de estación?', 'Priorizar productores locales: menos transporte y menos emisiones.'],
      ['¿Eligen productos con poco envoltorio o a granel?', 'Comprar a granel y con bolsas o frascos propios.'],
      ['¿Reparan las cosas antes de reemplazarlas?', 'Buscar servicios de reparación y comprar productos durables.'],
      ['¿Imprimen solo lo necesario y en doble faz?', 'Configurar la impresión en doble faz y priorizar documentos digitales.'],
    ]],
    ['Movilidad', '🚲', [
      ['¿La mayoría se traslada caminando, en bici o en transporte público?', 'Promover la bici, la caminata y el transporte público, por ejemplo con un lugar seguro para estacionar bicicletas.'],
      ['¿Comparten el auto cuando no hay otra opción?', 'Organizar viajes compartidos con personas que hacen el mismo recorrido.'],
      ['¿Evitan dejar el motor encendido mientras esperan?', 'Apagar el motor en esperas de más de un minuto.'],
    ]],
    ['Espacios verdes', '🌱', [
      ['¿Hay plantas, árboles o una huerta?', 'Sumar plantas nativas o armar una pequeña huerta.'],
      ['¿Eligen plantas nativas, que necesitan menos riego y atraen polinizadores?', 'Elegir especies nativas de la zona: requieren menos agua y cuidados.'],
      ['¿Evitan usar pesticidas y productos químicos fuertes?', 'Usar alternativas naturales para el control de plagas y la limpieza.'],
    ]],
  ];

  const ANS = [['si', 'Sí', 2], ['aveces', 'A veces', 1], ['no', 'No', 0]];
  const LABELS = [
    [85, 'A', '#2d9d5f', 'Excelente: el lugar es un ejemplo de gestión ambiental.'],
    [70, 'B', '#74b84a', 'Muy bien: hay buenas prácticas y algunos puntos para mejorar.'],
    [50, 'C', '#e9c46a', 'Regular: hay varias oportunidades de mejora.'],
    [30, 'D', '#f4a261', 'Bajo: conviene armar un plan de mejora por áreas.'],
    [0, 'E', '#e76f51', 'Muy bajo: ¡es un gran momento para empezar a cambiar!'],
  ];

  const form = document.getElementById('auditForm');
  const out = document.getElementById('auditOut');
  const placeInput = document.getElementById('auditPlace');
  const typeSel = document.getElementById('auditType');

  form.innerHTML = AREAS.map(([area, icon, qs], ai) => `
    <fieldset class="audit-area">
      <legend>${icon} ${area}</legend>
      ${qs.map(([q], qi) => `
        <div class="audit-q">
          <p>${q}</p>
          <div class="audit-ans">
            ${ANS.map(([v, l]) => `<label class="option"><input type="radio" name="a${ai}-${qi}" value="${v}" required><span>${l}</span></label>`).join('')}
          </div>
        </div>`).join('')}
    </fieldset>`).join('') + '<div class="btn-row"><button type="submit" class="btn">Generar informe 📝</button></div>';

  let lastReport = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const results = AREAS.map(([area, icon, qs], ai) => {
      let pts = 0;
      const recs = [];
      qs.forEach(([q, rec], qi) => {
        const v = data.get(`a${ai}-${qi}`);
        const a = ANS.find((x) => x[0] === v);
        pts += a[2];
        if (a[2] < 2) recs.push({ rec, prio: a[2] === 0 ? 'Alta' : 'Media' });
      });
      return { area, icon, pct: Math.round((pts / (qs.length * 2)) * 100), recs };
    });
    const total = Math.round(results.reduce((s, r) => s + r.pct, 0) / results.length);
    const label = LABELS.find((l) => total >= l[0]);
    const place = placeInput.value.trim() || (typeSel.value === 'hogar' ? 'Mi hogar' : typeSel.value === 'escuela' ? 'Mi escuela' : 'Mi lugar de trabajo');
    const date = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    lastReport = { results, total, label, place, date };
    renderReport();
    if (window.PV) PV.unlock('audit');
  });

  function esc(s) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function renderReport() {
    const { results, total, label, place, date } = lastReport;
    const recs = results.flatMap((r) => r.recs.map((x) => ({ ...x, area: r.area, icon: r.icon })))
      .sort((a, b) => (a.prio === 'Alta' ? -1 : 1) - (b.prio === 'Alta' ? -1 : 1));
    out.hidden = false;
    out.innerHTML = `
      <div class="audit-report" id="auditReport">
        <div class="audit-head">
          <div>
            <small>Informe de auditoría ambiental</small>
            <h3>${esc(place)}</h3>
            <small>${date} · Planeta Verde</small>
          </div>
          <div class="audit-label" style="--lbl:${label[2]}"><span>${label[1]}</span><small>${total}%</small></div>
        </div>
        <p class="audit-verdict">${label[3]}</p>
        <h4>Resultado por área</h4>
        <div class="compare-bars">
          ${results.map((r) => `
            <div class="cbar"><span>${r.icon} ${r.area}</span>
              <div class="cbar-track"><div class="cbar-fill" style="width:${r.pct}%;background:${LABELS.find((l) => r.pct >= l[0])[2]}"></div></div>
              <span class="cbar-val">${r.pct}%</span></div>`).join('')}
        </div>
        <h4>Plan de mejora (${recs.length} recomendaciones)</h4>
        ${recs.length ? `<table class="audit-table">
          <thead><tr><th>Área</th><th>Recomendación</th><th>Prioridad</th></tr></thead>
          <tbody>${recs.map((r) => `<tr><td>${r.icon} ${r.area}</td><td>${r.rec}</td><td><span class="prio ${r.prio === 'Alta' ? 'hi' : 'mid'}">${r.prio}</span></td></tr>`).join('')}</tbody>
        </table>` : '<p>🎉 ¡No hay recomendaciones! Todas las prácticas evaluadas ya se cumplen.</p>'}
        <p class="note">Autoevaluación orientativa. Para una auditoría formal se requiere un profesional y mediciones en el lugar.</p>
      </div>
      <div class="btn-row no-print">
        <button class="btn" id="auditDownload">⬇️ Descargar informe</button>
        <button class="btn btn-outline" id="auditPrint">🖨️ Imprimir</button>
        <button class="btn btn-outline" id="auditShare">📤 Compartir</button>
        <button class="btn btn-outline" id="auditAgain">🔁 Nueva auditoría</button>
      </div>
      <p class="modal-status no-print" id="auditStatus" aria-live="polite"></p>`;

    document.getElementById('auditPrint').addEventListener('click', () => {
      document.body.classList.add('print-audit');
      try { window.print(); } catch (e) {}
      setTimeout(() => document.body.classList.remove('print-audit'), 500);
    });

    document.getElementById('auditDownload').addEventListener('click', async () => {
      const css = `body{font-family:Arial,sans-serif;max-width:800px;margin:30px auto;padding:0 16px;color:#1f2d24}h3{margin:4px 0;color:#1b4332}h4{color:#1b4332;margin-top:24px}
        .audit-head{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #52b788;padding-bottom:12px}
        .audit-label{background:var(--lbl);color:#fff;border-radius:12px;padding:10px 18px;text-align:center}.audit-label span{display:block;font-size:40px;font-weight:bold}
        .cbar{display:grid;grid-template-columns:180px 1fr 50px;gap:10px;align-items:center;margin:6px 0}.cbar-track{background:#eee;border-radius:9px;height:14px;overflow:hidden}.cbar-fill{height:100%}
        table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left;vertical-align:top}.prio{font-weight:bold}.hi{color:#c0392b}.mid{color:#b9770e}.note{font-size:12px;color:#666;margin-top:20px}`;
      const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Auditoría ambiental - ${esc(lastReport.place)}</title><style>${css}</style></head><body>${document.getElementById('auditReport').innerHTML}</body></html>`;
      const status = document.getElementById('auditStatus');
      const res = window.PV ? await PV.download('auditoria-ambiental.html', html, 'text/html') : 'error';
      status.textContent = res === 'ok' ? '✅ Informe descargado. Podés abrirlo en el navegador e imprimirlo o guardarlo como PDF.' : res === 'declined' ? 'Descarga cancelada.' : 'No se pudo descargar desde acá. Probá con Imprimir.';
    });

    document.getElementById('auditShare').addEventListener('click', () => window.PV && PV.share({
      emoji: '📝',
      title: `Auditoría ambiental de ${place}`,
      value: `${label[1]} · ${total}%`,
      subtitle: '¿Qué tan sustentable es tu casa o tu escuela? Hacé la auditoría.',
      text: `📝 Hice la auditoría ambiental de ${place} en Planeta Verde: calificación ${label[1]} (${total}%). ¿Qué tan sustentable es tu casa o tu escuela? 🌱`,
    }));

    document.getElementById('auditAgain').addEventListener('click', () => {
      form.reset();
      out.hidden = true;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();
