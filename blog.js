// =====================================================
//  Blog: artículos de Planeta Verde
//  Para agregar un artículo, sumá un objeto al principio de POSTS.
// =====================================================
(function () {
  const POSTS = [
    {
      id: 'mitos-reciclaje',
      icon: '♻️',
      color: '#52b788',
      tag: 'Residuos',
      title: '5 mitos sobre el reciclaje',
      summary: '¿Hay que lavar los envases? ¿Separar no sirve porque “después lo mezclan todo”? Desarmamos las creencias más comunes.',
      minutes: 4,
      body: `
        <p>Separar los residuos es uno de los hábitos ambientales más conocidos, pero también uno de los que más dudas genera. Repasamos cinco mitos frecuentes.</p>
        <h4>1. “No sirve separar, después lo mezclan todo”</h4>
        <p>En muchas ciudades los camiones recolectan los residuos reciclables en días u horarios diferentes, o los llevan a plantas de clasificación. Aunque el sistema no sea perfecto, un material que llega limpio y separado tiene muchas más chances de reciclarse. Además, cuanta más gente separa, más fuerza tiene el reclamo para mejorar la gestión.</p>
        <h4>2. “Hay que lavar los envases a fondo”</h4>
        <p>No hace falta gastar agua de más: alcanza con vaciarlos y enjuagarlos un poco para sacar los restos de comida. Lo importante es que estén <strong>limpios y secos</strong>, porque la suciedad puede arruinar otros materiales como el papel.</p>
        <h4>3. “Todo el plástico se recicla”</h4>
        <p>No todos los plásticos tienen mercado para reciclarse. Por eso, más importante que reciclar es <strong>reducir</strong>: evitar descartables, comprar a granel y elegir envases retornables.</p>
        <h4>4. “El papel sucio de grasa se recicla”</h4>
        <p>Las cajas de pizza muy engrasadas o las servilletas usadas no sirven para reciclar papel. En cambio, pueden ir al <strong>compost</strong> si no tienen restos de comida de origen animal en exceso.</p>
        <h4>5. “Reciclar es la solución”</h4>
        <p>Reciclar es importante, pero es el último paso. El orden correcto es: <strong>reducir, reutilizar y recién después reciclar</strong>. El mejor residuo es el que no se genera.</p>
        <p class="post-tip">💡 Probá el <a href="juegos.html#juego">juego de reciclaje</a> para practicar dónde va cada residuo.</p>`,
    },
    {
      id: 'humedales',
      icon: '🦆',
      color: '#3a86ff',
      tag: 'Ecosistemas',
      title: 'Humedales: las esponjas que nos protegen',
      summary: 'Esteros, bañados y deltas cumplen funciones clave: regulan inundaciones, filtran el agua y guardan carbono. ¿Por qué los estamos perdiendo?',
      minutes: 4,
      body: `
        <p>Los humedales son ambientes que están inundados de forma permanente o temporal: esteros, bañados, lagunas, turberas, deltas y vegas de altura. En Argentina ocupan una superficie enorme, desde los Esteros del Iberá hasta las turberas de Tierra del Fuego.</p>
        <h4>¿Por qué son tan importantes?</h4>
        <ul>
          <li><strong>Regulan inundaciones:</strong> funcionan como esponjas que absorben el agua de las crecidas y la liberan de a poco.</li>
          <li><strong>Filtran el agua:</strong> sus plantas y suelos retienen sedimentos y contaminantes.</li>
          <li><strong>Guardan carbono:</strong> las turberas almacenan grandes cantidades de carbono en muy poca superficie.</li>
          <li><strong>Son hogar de muchísimas especies:</strong> aves, peces, anfibios, carpinchos y ciervos de los pantanos.</li>
        </ul>
        <h4>¿Qué los amenaza?</h4>
        <p>Los rellenos para urbanizaciones, los endicamientos para agricultura y ganadería, las quemas y la contaminación. Cuando un humedal se rellena, el agua de las lluvias tiene que ir a otro lugar, y muchas veces termina inundando barrios vecinos.</p>
        <h4>¿Qué podemos hacer?</h4>
        <p>Informarnos, participar de las audiencias públicas cuando se evalúan proyectos sobre humedales, apoyar las áreas protegidas y difundir su importancia. El 2 de febrero es el Día Mundial de los Humedales.</p>
        <p class="post-tip">💡 Probá evaluar el caso del <a href="juegos.html#eia">barrio cerrado en un humedal</a>.</p>`,
    },
    {
      id: 'gestion-ambiental',
      icon: '🎓',
      color: '#e9c46a',
      tag: 'Carrera',
      title: '¿Qué hace una persona licenciada en Gestión Ambiental?',
      summary: 'Evaluar impactos, auditar empresas, diseñar políticas públicas, educar... Te contamos de qué se trata la profesión.',
      minutes: 3,
      body: `
        <p>La gestión ambiental busca que las actividades humanas (producir, construir, transportarnos, consumir) se hagan cuidando el ambiente. Quienes se forman en esta disciplina trabajan en la intersección entre la ciencia, la ley, la economía y la sociedad.</p>
        <h4>Algunas tareas de la profesión</h4>
        <ul>
          <li><strong>Evaluar impactos ambientales</strong> de obras y proyectos antes de que se aprueben.</li>
          <li><strong>Hacer auditorías ambientales</strong> para verificar que empresas y organismos cumplan la normativa.</li>
          <li><strong>Diseñar sistemas de gestión ambiental</strong>, por ejemplo según la norma ISO 14001.</li>
          <li><strong>Planificar la gestión de residuos</strong> en municipios y empresas.</li>
          <li><strong>Participar en el ordenamiento del territorio</strong> y en la conservación de áreas naturales.</li>
          <li><strong>Hacer educación ambiental</strong> en escuelas, comunidades y organizaciones.</li>
        </ul>
        <h4>¿Dónde se trabaja?</h4>
        <p>En municipios, ministerios y organismos de control, en empresas y consultoras, en organizaciones sociales y en instituciones educativas y de investigación.</p>
        <h4>¿Qué materias se estudian?</h4>
        <p>Ecología, química ambiental, clima y suelo, derecho ambiental, evaluación de impacto ambiental, gestión de residuos y auditoría ambiental, entre otras. ¡Muchas de las secciones de esta página están inspiradas en esas materias!</p>`,
    },
  ];

  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = POSTS.map((p) => `
    <article class="post-card" style="--pc:${p.color}">
      <div class="post-cover"><span>${p.icon}</span></div>
      <div class="post-info">
        <span class="post-tag">${p.tag} · ${p.minutes} min de lectura</span>
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <button class="btn btn-small" data-post="${p.id}">Leer artículo →</button>
      </div>
    </article>`).join('');

  let reader;
  function open(id) {
    const p = POSTS.find((x) => x.id === id);
    if (!reader) {
      reader = document.createElement('div');
      reader.className = 'modal';
      reader.innerHTML = '<div class="modal-box post-reader" role="dialog" aria-modal="true"><button class="modal-close" aria-label="Cerrar">✕</button><div class="post-content"></div></div>';
      document.body.appendChild(reader);
      reader.addEventListener('click', (e) => {
        if (e.target === reader || e.target.closest('.modal-close')) close();
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !reader.hidden) close(); });
    }
    reader.querySelector('.post-content').innerHTML = `
      <div class="post-hero" style="--pc:${p.color}"><span>${p.icon}</span></div>
      <span class="post-tag">${p.tag} · ${p.minutes} min de lectura</span>
      <h2>${p.title}</h2>
      ${p.body}`;
    reader.hidden = false;
    reader.querySelector('.modal-box').scrollTop = 0;
    reader.querySelector('.modal-close').focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
    if (window.PV) PV.unlock('reader');
  }
  function close() { reader.hidden = true; document.body.style.overflow = ''; }

  grid.addEventListener('click', (e) => { const b = e.target.closest('[data-post]'); if (b) open(b.dataset.post); });
})();
