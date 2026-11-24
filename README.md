# 🌱 Planeta Verde

Sitio de educación ambiental interactivo: calculadoras, simuladores, juegos, derechos ambientales de Argentina y recursos para docentes. Es HTML, CSS y JavaScript puro, sin dependencias ni paso de compilación.

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio, índice de herramientas, sobre el proyecto, logros y ranking |
| `aprender.html` | Clima, simulador de temperatura, reciclaje, biodiversidad, ecorregiones, red alimentaria, agua, calidad del aire y del agua |
| `medi.html` | Huella de carbono, huella hídrica, residuos y compost, auditoría ambiental |
| `juegos.html` | Juego de reciclaje, quiz por temas, simulador de Evaluación de Impacto Ambiental |
| `derechos.html` | Artículo 41, leyes ambientales, principios y glosario |
| `actua.html` | Acciones, desafío de 30 días, calendario y puntos verdes |
| `blog.html` | Artículos |
| `docentes.html` | Secuencias didácticas y fichas imprimibles |

## Código

- `layout.js`: menú, pie de página y botón de logros, comunes a todas las páginas. Para agregar una página al menú, sumala en `PAGES`.
- `achievements.js`: insignias, niveles, avisos y tarjetas para compartir.
- `script.js`: menú, modo oscuro, calculadora de carbono, juego, quiz, acciones, desafío y calendario.
- Un archivo por herramienta: `eia.js`, `ecoregiones.js`, `foodweb.js`, `clima-agua.js`, `calidad.js`, `residuos.js`, `audit.js`, `glossary.js`, `blog.js`, `docentes.js` y `ranking.js`.
- `style.css`: todos los estilos, con modo claro y oscuro.
- `manifest.webmanifest`, `sw.js` y los íconos: permiten instalar el sitio como app y usarlo sin conexión.

Cada módulo se activa solo si su sección existe en la página, así que todas las páginas cargan los mismos scripts.

## Cómo editar

- **Agregar un artículo al blog:** sumá un objeto al principio de `POSTS` en `blog.js`.
- **Agregar preguntas al quiz:** sumá una fila a la lista `Q` en `script.js` (tema, nivel, pregunta, opciones, índice de la correcta y explicación).
- **Agregar un caso de EIA:** sumá un objeto a `PROJECTS` en `eia.js`.
- **Agregar términos al glosario:** sumá una fila a `TERMS` en `glossary.js`.
- **Después de cambiar archivos**, subí el número de `VERSION` en `sw.js` para que quienes instalaron la app reciban la versión nueva.

## Publicar con GitHub Pages

En el repositorio, entrá a **Settings → Pages**, elegí la rama y la carpeta `/ (root)`, y guardá. En unos minutos el sitio queda disponible en una dirección pública.

> El ranking de la comunidad usa la base de datos de los artefactos de Claude, así que solo funciona cuando la página se abre desde su enlace de Claude. En GitHub Pages muestra un aviso en su lugar.

## Datos

Las cifras son aproximadas y provienen de informes de la ONU, el IPCC, IPBES, la FAO, la OMS, el Código Alimentario Argentino y Water Footprint Network. El contorno del mapa es de Natural Earth (dominio público). Las calculadoras dan estimaciones orientativas, y la sección de derechos es de divulgación: no reemplaza el asesoramiento legal.
