// =====================================================
//  Glosario ambiental con buscador
// =====================================================
(function () {
  // [término, categoría, definición]
  const TERMS = [
    ['Acuífero', 'Agua', 'Formación geológica subterránea que almacena agua y permite extraerla, por ejemplo con pozos. El Acuífero Guaraní es uno de los más grandes del mundo.'],
    ['Adaptación climática', 'Clima', 'Ajustes que hacen las sociedades y los ecosistemas para reducir los daños del cambio climático, como obras contra inundaciones o cultivos resistentes a la sequía.'],
    ['Antropoceno', 'Clima', 'Nombre propuesto para la época actual, en la que la actividad humana se volvió la principal fuerza que modifica el planeta.'],
    ['Área protegida', 'Ecología', 'Territorio delimitado y gestionado para conservar la naturaleza, como un parque nacional o una reserva.'],
    ['Audiencia pública', 'Legal', 'Instancia de participación en la que cualquier persona puede opinar sobre un proyecto o una norma antes de que se decida. Está prevista en la Ley General del Ambiente.'],
    ['Auditoría ambiental', 'Gestión', 'Evaluación sistemática para verificar si una organización cumple con la normativa y con sus objetivos ambientales.'],
    ['Biodegradable', 'Residuos', 'Material que puede ser descompuesto por microorganismos en un tiempo relativamente corto.'],
    ['Biodiversidad', 'Ecología', 'Variedad de la vida en todos sus niveles: genes, especies y ecosistemas.'],
    ['Bioma', 'Ecología', 'Gran comunidad de seres vivos definida por el clima y la vegetación dominante, como la selva, el desierto o la tundra.'],
    ['Biogás', 'Residuos', 'Gas (principalmente metano) que se produce cuando la materia orgánica se descompone sin oxígeno. Se puede usar como combustible.'],
    ['Cadena trófica', 'Ecología', 'Secuencia de quién come a quién en un ecosistema, por la que pasa la energía de un ser vivo a otro.'],
    ['Cambio climático', 'Clima', 'Cambio del clima a largo plazo atribuido directa o indirectamente a la actividad humana, que se suma a la variabilidad natural.'],
    ['Capa de ozono', 'Clima', 'Zona de la atmósfera con mucho ozono, que nos protege de la radiación ultravioleta del sol. El Protocolo de Montreal logró frenar su deterioro.'],
    ['Carbono neutral', 'Clima', 'Situación en la que las emisiones de gases de efecto invernadero se equilibran con la misma cantidad absorbida o compensada.'],
    ['Compost', 'Residuos', 'Abono natural que se obtiene al descomponer restos orgánicos, como cáscaras, yerba y hojas.'],
    ['Consulta previa', 'Legal', 'Derecho de los pueblos indígenas a ser consultados de forma libre e informada antes de decisiones que los afecten (Convenio 169 de la OIT).'],
    ['Contaminación', 'Gestión', 'Presencia en el ambiente de sustancias o energía en cantidades que dañan la salud o los ecosistemas.'],
    ['Corredor biológico', 'Ecología', 'Franja de ambiente natural que conecta áreas y permite que la fauna se desplace entre ellas.'],
    ['Daño ambiental', 'Legal', 'Alteración relevante que modifica negativamente el ambiente, sus recursos o el equilibrio de los ecosistemas. Quien lo causa debe recomponerlo.'],
    ['Deforestación', 'Ecología', 'Eliminación de bosques para destinar la tierra a otros usos, como agricultura o urbanización.'],
    ['Desarrollo sostenible', 'Gestión', 'Desarrollo que satisface las necesidades del presente sin comprometer la capacidad de las generaciones futuras de satisfacer las suyas.'],
    ['Desertificación', 'Ecología', 'Degradación de las tierras en zonas secas por el clima y las actividades humanas, como el sobrepastoreo.'],
    ['Disposición final', 'Residuos', 'Última etapa de la gestión de residuos: el lugar donde quedan definitivamente, como un relleno sanitario.'],
    ['Economía circular', 'Gestión', 'Modelo que busca mantener los materiales en uso el mayor tiempo posible, reduciendo, reutilizando, reparando y reciclando.'],
    ['Ecorregión', 'Ecología', 'Territorio con características similares de clima, suelo, flora y fauna. Argentina tiene 18.'],
    ['Ecosistema', 'Ecología', 'Conjunto de seres vivos de un lugar, el ambiente físico en el que viven y las relaciones entre ellos.'],
    ['Efecto invernadero', 'Clima', 'Fenómeno natural por el que ciertos gases retienen calor en la atmósfera. Las actividades humanas lo intensifican.'],
    ['Eficiencia energética', 'Gestión', 'Usar menos energía para obtener el mismo resultado, por ejemplo con lámparas LED.'],
    ['Energía renovable', 'Clima', 'Energía que proviene de fuentes que se regeneran naturalmente, como el sol, el viento o el agua.'],
    ['Erosión', 'Ecología', 'Desgaste y pérdida del suelo por acción del agua o el viento, que se acelera cuando se elimina la vegetación.'],
    ['Especie endémica', 'Ecología', 'Especie que vive solo en una región determinada y en ningún otro lugar del mundo.'],
    ['Especie exótica invasora', 'Ecología', 'Especie introducida fuera de su área natural que se expande y causa daños, como el castor en Tierra del Fuego.'],
    ['Estudio de Impacto Ambiental', 'Gestión', 'Documento técnico que identifica y evalúa los impactos de un proyecto y propone medidas para prevenirlos o mitigarlos.'],
    ['Eutrofización', 'Agua', 'Exceso de nutrientes en el agua (por ejemplo, fertilizantes) que provoca la proliferación de algas y deja sin oxígeno a otros seres vivos.'],
    ['Evaluación de Impacto Ambiental', 'Gestión', 'Procedimiento obligatorio para analizar, antes de su aprobación, los efectos que puede tener una obra o actividad sobre el ambiente.'],
    ['Gases de efecto invernadero', 'Clima', 'Gases que retienen calor en la atmósfera, como el dióxido de carbono, el metano y el óxido nitroso.'],
    ['Gestión ambiental', 'Gestión', 'Conjunto de acciones para administrar las actividades humanas de forma que se proteja el ambiente.'],
    ['Huella de carbono', 'Clima', 'Total de gases de efecto invernadero emitidos directa o indirectamente por una persona, organización o producto.'],
    ['Huella hídrica', 'Agua', 'Volumen total de agua dulce usado para producir los bienes y servicios que consumimos.'],
    ['Humedal', 'Agua', 'Zona inundada de forma permanente o temporal, como esteros, bañados o deltas. Regulan inundaciones y almacenan carbono.'],
    ['Impacto ambiental', 'Gestión', 'Cualquier cambio en el ambiente, positivo o negativo, causado por una actividad humana.'],
    ['Impactos acumulativos', 'Gestión', 'Efectos que resultan de la suma de varios proyectos o actividades en una misma zona a lo largo del tiempo.'],
    ['ISO 14001', 'Gestión', 'Norma internacional que establece los requisitos de un sistema de gestión ambiental en una organización.'],
    ['Línea de base', 'Gestión', 'Descripción del estado del ambiente antes de un proyecto, que sirve para comparar y medir sus impactos.'],
    ['Lixiviado', 'Residuos', 'Líquido que se forma cuando el agua atraviesa los residuos y arrastra sustancias contaminantes.'],
    ['Material particulado (PM2,5)', 'Gestión', 'Partículas muy pequeñas suspendidas en el aire que pueden entrar en los pulmones y afectar la salud.'],
    ['Microplásticos', 'Residuos', 'Fragmentos de plástico de menos de 5 milímetros que contaminan el agua, el suelo y los seres vivos.'],
    ['Mitigación', 'Clima', 'Acciones para reducir las emisiones de gases de efecto invernadero o aumentar su absorción.'],
    ['Napa freática', 'Agua', 'Capa de agua subterránea más cercana a la superficie, que puede contaminarse con facilidad.'],
    ['Ordenamiento ambiental del territorio', 'Legal', 'Herramienta para decidir qué usos son adecuados para cada zona de acuerdo con sus características ambientales.'],
    ['Plan de gestión ambiental', 'Gestión', 'Conjunto de medidas, responsables y plazos para prevenir, mitigar y controlar los impactos de un proyecto.'],
    ['Polinización', 'Ecología', 'Traslado del polen entre flores, necesario para que muchas plantas produzcan frutos y semillas. Lo hacen insectos, aves y el viento.'],
    ['Presupuestos mínimos', 'Legal', 'Normas nacionales de protección ambiental que rigen en todo el país y que las provincias pueden ampliar pero no reducir.'],
    ['Principio precautorio', 'Legal', 'Si hay peligro de daño grave o irreversible, la falta de certeza científica no puede usarse como excusa para no actuar.'],
    ['Reciclaje', 'Residuos', 'Proceso que transforma residuos en materia prima para fabricar nuevos productos.'],
    ['Recomposición', 'Legal', 'Obligación de restablecer el ambiente dañado a su estado anterior, en la medida de lo posible.'],
    ['Relleno sanitario', 'Residuos', 'Sitio diseñado para disponer residuos de forma controlada, con impermeabilización y tratamiento de lixiviados y gases.'],
    ['Residuos peligrosos', 'Residuos', 'Residuos que pueden dañar la salud o el ambiente, como químicos, pilas o residuos patogénicos.'],
    ['Resiliencia', 'Ecología', 'Capacidad de un ecosistema o una comunidad de recuperarse después de una perturbación.'],
    ['RSU', 'Residuos', 'Residuos Sólidos Urbanos: los que se generan en hogares, comercios y espacios públicos.'],
    ['Servicios ecosistémicos', 'Ecología', 'Beneficios que la naturaleza brinda a las personas, como agua limpia, polinización, regulación del clima o recreación.'],
    ['Sobrepastoreo', 'Ecología', 'Pastoreo excesivo del ganado que degrada la vegetación y el suelo.'],
    ['Sumidero de carbono', 'Clima', 'Sistema que absorbe más carbono del que libera, como los bosques, los océanos y las turberas.'],
    ['Sustentabilidad', 'Gestión', 'Capacidad de mantener un equilibrio entre el desarrollo económico, el bienestar social y la protección del ambiente.'],
    ['Turbera', 'Agua', 'Humedal donde se acumula materia vegetal sin descomponer. Almacena enormes cantidades de carbono.'],
    ['Valorización', 'Residuos', 'Aprovechamiento de los residuos mediante reutilización, reciclaje o recuperación de energía.'],
  ];

  const CATS = ['Todas', 'Ecología', 'Clima', 'Agua', 'Residuos', 'Gestión', 'Legal'];
  const CAT_ICON = { Ecología: '🌿', Clima: '🌡️', Agua: '💧', Residuos: '♻️', Gestión: '📋', Legal: '⚖️' };

  const search = document.getElementById('glSearch');
  if (!search) return;
  const cats = document.getElementById('glCats');
  const list = document.getElementById('glList');
  const count = document.getElementById('glCount');
  const load = (k, f) => { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let opened = new Set(load('pv-gloss', []));
  let cat = 'Todas';

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  cats.innerHTML = CATS.map((c) => `<button class="gl-cat ${c === cat ? 'active' : ''}" data-c="${c}">${CAT_ICON[c] || '📚'} ${c}</button>`).join('');

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  let community = []; // términos aprobados por el dueño (llegan desde aportes.js)

  // aportes.js llama a esta función cuando cambian los términos aprobados
  window.PVGlossary = {
    setCommunity(list) {
      community = (list || []).filter((x) => CAT_ICON[x.cat]).map((x) => [x.term, x.cat, x.def, x.alias || '']);
      render();
    },
  };

  function render() {
    const q = norm(search.value.trim());
    const all = TERMS.map((x) => [...x, null]).concat(community)
      .sort((a, b) => norm(a[0]).localeCompare(norm(b[0]), 'es'));
    const items = all.filter(([t, c, d]) => (cat === 'Todas' || c === cat) && (!q || norm(t).includes(q) || norm(d).includes(q)));
    count.textContent = `${items.length} término${items.length === 1 ? '' : 's'}${community.length ? ` (${community.length} de la comunidad)` : ''} · ${opened.size} leído${opened.size === 1 ? '' : 's'}`;
    let letter = '';
    list.innerHTML = items.length ? items.map(([t, c, d, alias]) => {
      const l = (norm(t)[0] || '#').toUpperCase();
      const head = l !== letter ? `<div class="gl-letter">${esc(letter = l)}</div>` : '';
      const fromCommunity = alias !== null;
      return `${head}<details class="gl-term ${opened.has(t) ? 'read' : ''} ${fromCommunity ? 'community' : ''}" data-t="${esc(t)}">
        <summary><span>${esc(t)}</span><small>${fromCommunity ? '✨ ' : ''}${CAT_ICON[c]} ${esc(c)}</small></summary>
        <p>${esc(d)}</p>${fromCommunity ? `<p class="gl-by">✨ Aporte de la comunidad${alias ? ` · ${esc(alias)}` : ''}</p>` : ''}</details>`;
    }).join('') : '<p class="gl-empty">No encontramos ese término. ¿Querés sugerirlo? Usá el formulario de abajo 👇</p>';
  }

  search.addEventListener('input', render);
  cats.addEventListener('click', (e) => {
    const b = e.target.closest('.gl-cat');
    if (!b) return;
    cat = b.dataset.c;
    cats.querySelectorAll('.gl-cat').forEach((x) => x.classList.toggle('active', x === b));
    render();
  });
  list.addEventListener('toggle', (e) => {
    const d = e.target;
    if (!d.open) return;
    opened.add(d.dataset.t);
    d.classList.add('read');
    save('pv-gloss', [...opened]);
    count.textContent = count.textContent.replace(/\d+ leído(s)?/, `${opened.size} leído${opened.size === 1 ? '' : 's'}`);
    if (opened.size >= 10 && window.PV) PV.unlock('glossary');
  }, true);

  render();
})();
