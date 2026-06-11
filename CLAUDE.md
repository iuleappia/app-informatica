# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS web app simulating a mobile app experience for studying Computer Science (Informática). No build system, no package manager — open `index.html` directly in a browser.

Deployed at: `https://iuleappia.github.io/app-informatica/`

---

## Architecture

### App Shell Pattern

`index.html` (root) acts as the app shell: fixed top bar (`#tituloPagina` + language switcher) + bottom nav menu (5 buttons) + a central `<iframe id="frame">`. Navigation works by swapping the iframe's `src` via `abrirPagina(url, botao)`.

The function also:
- Opens external domains in a new tab (hotmart, pay.hotmart.com, payment.hotmart.com, wa.me, whatsapp.com, instagram.com, youtube.com)
- Updates `#tituloPagina` dynamically from the button's text (stripping the `<span>` emoji)
- Marks the active button with `.ativo` class (blue text + blue underline via `::before`)

### Folder Structure

```
index.html              ← App shell (PT). Loads pages from page/
en/index.html           ← App shell (EN). Loads pages directly from en/
es/index.html           ← App shell (ES). Loads pages directly from es/
app-config.json         ← { "url": "https://iuleappia.github.io/app-informatica/" } (used by Android app)
page/                   ← PT pages loaded inside the root iframe
  home.html, cursos.html, disciplinas.html, simulados.html, excel.html, produtos.html
en/                     ← EN mirror: home, cursos, disciplinas, simulados, excel (no produtos)
es/                     ← ES mirror: home, cursos, disciplinas, simulados, excel (no produtos)
disciplinas/            ← Individual PT discipline pages (8 files)
simulados/              ← Individual PT simulado pages (8 files)
en/disciplinas/         ← 8 EN discipline pages
en/simulados/           ← 8 EN simulado pages
es/disciplinas/         ← 8 ES discipline pages
es/simulados/           ← 8 ES simulado pages
js/                     ← Shared scripts (analytics + pixel)
img/                    ← Shared images (see list below)
concursos/              ← Standalone concursos section
```

### img/ inventory

```
img/
  capa.jpg      — Ebook de Informática cover
  concurso.jpg  — Concursos Públicos card
  crf.png       — Produtos Exclusivos card (used in home.html)
  excel.jpg     — Bíblia do Excel
  point.jpg     — PowerPoint product
  power.jpg     — Power BI product
  vba.jpg       — VBA product
  word.jpg      — Word product
```

### app-config.json

Used exclusively by the Android app (`PaginaInicial.java`) to know which URL to load on startup. Not read by any page in this repo.

```json
{ "url": "https://iuleappia.github.io/app-informatica/" }
```

---

## i18n Pattern

Three independent language trees: root (PT), `en/`, `es/`. Each has its own `index.html` shell. The PT shell loads pages from `page/` (e.g. `abrirPagina('page/home.html', this)`); the EN/ES shells load pages directly from their own folder (e.g. `abrirPagina('home.html', this)`).

`produtos.html` exists only in PT (`page/produtos.html`). Language switcher links between the three `index.html` shells and persists the choice in `localStorage` (`userLang` key).

---

## Relative Path Rules

| File location | Script path | Image path | Sibling pages |
|---|---|---|---|
| Root (`index.html`) | `js/` | `img/` | `page/` |
| `page/*.html` | `../js/` | `../img/` | `../disciplinas/`, `../simulados/` |
| `en/` or `es/` shell | `../js/` | `../img/` | relative within own lang folder |
| `en/disciplinas/` or `es/simulados/` | `../../js/` | `../../img/` | — |
| `concursos/` | `../js/` | `../img/` | — |

---

## page/home.html — Content Details

The home page has two sections:

**1. Random content blocks (4 blocks, picked on each load):**

| Block | ID | Color | Content source |
|---|---|---|---|
| 🔥 Dica de Informática | `#dica` | green left-border | `dicas[]` — 5 Windows keyboard shortcuts |
| 📊 Função do Excel | `#excel` | blue left-border | `excel[]` — 5 Excel functions |
| 📅 Sugestão de Estudo | `#estudo` | orange left-border | 2 random picks from `disciplinas[]` |
| 🧠 Curiosidade | `#curiosidade` | purple left-border | `curiosidades[]` — 5 IT facts |

**2. Product cards (3 cards):**

| Card | Image | Link behavior |
|---|---|---|
| Concursos Públicos | `../img/concurso.jpg` | `window.top.location.href` — escapes the iframe to navigate the full page |
| Produtos Exclusivos | `../img/crf.png` | Detects `AndroidPay`: if in app → `window.location.href='produtos.html'`; if browser → `window.open('produtos.html','_blank')` |
| Ebook de Informática (R$47,90) | `../img/capa.jpg` | External Google Play link in new tab |

> **Important:** The Concursos card uses `window.top.location.href` (not `abrirPagina`) because `concursos/index.html` is a standalone page that should replace the full shell, not load inside the iframe.

---

## page/produtos.html — Behavior

Lists 4 purchasable products. Each button detects context:

```js
if (typeof AndroidPay !== 'undefined') {
  AndroidPay.abrirProduto('product_id')  // Android app: opens asset HTML
} else {
  abrirModal()                           // Browser: shows "available in app" modal
}
```

**Products listed:**

| Product | ID | Price | Border color |
|---|---|---|---|
| Resumão de Informática – Receita Federal | `resumao_informatica_rfb` | R$19,90 | `#2e9e44` (green) |
| Resumão de Informática – INSS | `resumao_informatica_inss` | R$19,90 | `#3949ab` (indigo) |
| Resumão de Informática – Correios | `resumao_informatica_correios` | R$19,90 | `#E65100` (orange) |
| Introdução à Informática Premium | `introducao_informatica` | R$9,90 | `#2e9e44` (green) |

The modal shows a link to the Google Play app store with a "Baixar na Google Play" button.

To add a new product: copy an `.item-produto` block, change `AndroidPay.abrirProduto('new_id')` and update the texts/price/color.

---

## Disciplines & Simulados (8 pairs × 3 languages = 48 pages)

| Slug | PT Title |
|---|---|
| `introducao` | Introdução à Informática |
| `hardware` | Hardware |
| `software` | Software |
| `redes` | Redes de Computadores |
| `arquitetura` | Arquitetura de Computadores |
| `barramentos` | Barramentos |
| `algoritimo` | Algoritmo e Programação |
| `protocolos` | Protocolo de Rede |

Naming: `disciplinas/<slug>.html` / `simulados/simulado_<slug>.html`  
(Note: `algoritimo` has a typo — keep consistent with existing filename when adding simulado links.)

---

## Analytics & Tracking (`js/`)

- **`js/analytics.js`** — Google Analytics `G-ZJWSWYP3T8`. Loads gtag async, tracks all link clicks as `clique_link`, fires a dedicated `Biblia_do_Excel` conversion event for the Hotmart URL `go.hotmart.com/B41563429U`. Uses `readyState` guard.
- **`js/meta-pixel.js`** — Meta Pixel `1255142006053516`. Tracks `PageView`, scroll past 50% (`ScrollPage`), and the same Hotmart link as `Biblia_do_Excel`.

Both scripts must be placed **as the first tags inside `<head>`**, before `<meta charset>`.

### Pages that include tracking scripts

Only main entry points carry the scripts — individual discipline/simulado pages do not:

`index.html`, `page/cursos.html`, `page/produtos.html`, `en/index.html`, `en/cursos.html`, `es/index.html`, `es/cursos.html`, `concursos/index.html`

---

## Adding a new page

1. Create the HTML in the correct folder.
2. Add `<script src="[correct relative path]/js/analytics.js"></script>` and `meta-pixel.js` as first tags in `<head>` only if the page is an entry point.
3. Update `index.html` (and `en/index.html`, `es/index.html` if applicable) to include the new button and `abrirPagina('page/newpage.html', this)`.
4. Mirror the page in `en/` and `es/` folders if multilingual support is needed.
