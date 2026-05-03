# 0. 🧪 Periodic Table Game

**React 18** · **JavaScript** · **Create React App** · **Sass** — Juego en el navegador para ubicar los **118 elementos** en la tabla periódica según la imagen (o el nombre mostrado arriba), con **puntuación**, **vidas / pista**, **chart de referencia** y **EN / ES**.

Repo: [Gemdelle/periodic-table-pro](https://github.com/Gemdelle/periodic-table-pro)

---

## 1. 📋 Resumen

Amante de la química; juego armado en tiempo libre. El juego te hace ubicar cada uno según la imagen, con un chart para orientarte en la tabla, y lleva la cuenta de cuántos acertaste y cuántos no. Más adelante me gustaría sumar backend y más datos por elemento; por ahora es un front.

**Periodic Table Game** es una SPA liviana encima de eso: aparece un elemento al azar (imagen cuando existe el asset en `src/assets/elements/`), tenés que hacer clic en la celda correcta de la grilla. Las celdas muestran **?** hasta que adivinás el elemento; al acertar, ves la **foto** o la **nomenclatura** (símbolo) si no hay imagen. Podés abrir el **CHART** para repasar símbolos y nombres. Todo corre **sin backend**; el estado vive en React en memoria.

| # | Área | Qué hacés ahí |
|---|------|----------------|
| 🎯 | **Juego** | Adivinás el elemento por imagen/nombre y clickeás la celda en la tabla. |
| 📊 | **Puntuación** | Progreso **adivinados / total**, contadores **R** (aciertos) y **W** (errores). |
| 🗺️ | **Chart** | Modal con todos los elementos (imagen + símbolo + nombre según idioma). |
| ❤️ | **Vidas y pista** | Tres vidas; el **?** de ayuda resalta la celda correcta a costo de una vida. |
| 🌐 | **Idioma** | Banderas **EN** / **ES** para nombres en el chart y en el panel central. |

---

## 2. 🗺️ Tabla periódica y flujo del juego

La tabla usa **CSS Grid** (filas 1–7 + bloques de **lantánidos** y **actínidos** alineados con las columnas). Cada celda tiene número atómico con dígitos en imagen. **SKIP** cambia el elemento actual sin penalizar; al acertar, el elemento sale del pool hasta completar los 118.

---

## 3. 📊 Chart (referencia)

Desde **CHART** (junto a **SKIP**) abrís un modal con fondo `elements-chart.png` y una grilla con todos los elementos: imagen (si el archivo existe), símbolo y nombre en el idioma elegido.

---

## 4. 🔊 Audio y assets

Sonidos para acierto / error (`src/sounds/`). Imágenes de UI en `src/assets/` (frames, bullets, flags, números, etc.). Las fotos de elementos siguen el nombre en inglés del dato, por ejemplo `Gold.png` para el oro.

---

## 5. ▶️ Cómo ejecutar

**Requisito:** Node **≥ 18** y **npm**.

```bash
git clone https://github.com/Gemdelle/periodic-table-pro.git
cd periodic-table-pro
npm install
npm start
```

Abre **http://localhost:3000** (CRA lo indica en consola).

| Script | Uso |
|--------|-----|
| `npm start` | Desarrollo (hot reload) |
| `npm run build` | Build de producción en `build/` |

**Deploy a GitHub Pages** (opcional): el `package.json` incluye `homepage` y scripts `predeploy` / `deploy`. Necesitás `gh-pages` como devDependency si aún no está:

```bash
npm install --save-dev gh-pages
npm run deploy
```

Configurá **Pages** del repo para servir desde la rama **`gh-pages`** (o el flujo que uses). La `homepage` actual apunta a `https://gemdelle.github.io/periodic-table-pro` — ajustala si renombrás el repo.

---

## 6. 🚀 GitHub Pages (Create React App)

- El campo **`homepage`** en `package.json` define la base para assets en producción (subpath del repo en GitHub Pages).  
- Tras `npm run build`, los paths relativos respetan esa base.  
- **`npm run deploy`** sube la carpeta **`build/`** con `gh-pages` (si automatizás con Actions, revisá permisos y tokens del repo).

Demo (si está publicada): [https://gemdelle.github.io/periodic-table-pro/](https://gemdelle.github.io/periodic-table-pro/)

---

## 7. 📁 Estructura del repositorio

```
periodic-table-pro/
├── public/
│   └── index.html          HTML base + fuente Cinzel (Google Fonts)
├── src/
│   ├── App.js              Lógica del juego, tabla, chart, audio
│   ├── index.js            Entrada React
│   ├── data/
│   │   └── elements.js     118 elementos (posición en grilla, nombres EN/ES)
│   ├── styles/
│   │   └── main.scss       Estilos anidados (layout, chart, animaciones)
│   ├── assets/             bg, bullets, elements/*.png, flags, frames, icons, numbers
│   └── sounds/             efectos (acierto, etc.)
├── package.json
└── README.md
```

---

## 8. 🔮 Próximos pasos (nice to have)

- **Backend** para usuarios, partidas guardadas o leaderboards.  
- **Más datos por elemento** (propiedades, curiosidades, enlaces) servidos por API o JSON extendido.  
- **CI** (lint/test) y workflow de deploy automático si el proyecto crece.

---

PRs chicos y con descripción de cómo probar. Licencia / uso académico según tu criterio.
