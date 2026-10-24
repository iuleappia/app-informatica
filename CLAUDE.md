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
  (each image also exists as .webp — pages use the .webp)
  capa.jpg      — Ebook de Informática cover
  concurso.jpg  — Concursos Públicos card
  crf.jpg       — Produtos Exclusivos card (used in home.html)
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
| Produtos Exclusivos | `../img/crf.jpg` | Detects `AndroidPay`: if in app → `window.location.href='produtos.html'`; if browser → `window.open('produtos.html','_blank')` |
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
| `algoritmo` | Algoritmo e Programação |
| `protocolos` | Protocolo de Rede |

Naming: `disciplinas/<slug>.html` / `simulados/simulado_<slug>.html`  

### Simulado pages

Each simulado has a `questions` array: `{ question, options, correctAnswer, explanation }`. `correctAnswer` is the index in `options` as written in the file; options and question order are shuffled at runtime (`prepareQuiz()`), so never prefix options with "a)", "b)"… After each answer the page shows the `explanation` and a "Próxima pergunta" button. Best score is stored in `localStorage` (`simulado_best:<path>`), and `simulado_concluido` is sent to GA via the parent shell's `gtag`. ES/EN files mirror the PT questions in the same order (PT algoritmo has 40, ES/EN 20).

Discipline and simulado pages have a `.btn-voltar` link (uses `history.back()`, falls back to the list page).

### Progresso do aluno (`js/estudo.js`)

Shared script loaded by home, list pages, discipline pages, simulados, `revisao.html` and `simulado_geral.html` (path `../js/` or `../../js/`). Everything is saved in `localStorage` on the device:

- `lida:<pathname>` — discipline read (marked when the student scrolls to the end or clicks "Iniciar Simulado")
- `nota:<pathname>` — `{melhor,total,ultima,vezes,data}` for each simulado (and for `simulado_geral.html`)
- `erros:<pt|es|en>` — wrong questions (added on a wrong answer, removed when answered right anywhere)

`Estudo.decorarListas()` adds "✓ Lida" / "Melhor nota" badges to `a.card` links on the list pages. `Estudo.DISC` holds the 8 slugs, icons and names in 3 languages.

New pages in each simulados folder (PT/ES/EN), generated with the same strings:
- `revisao.html` — practice only the saved mistakes, with explanations
- `simulado_geral.html` — exam mode: 20 q/30 min or 40 q/60 min, balanced across subjects, no feedback until the end, then score by subject + answer key. It loads questions by fetching the 8 simulado HTML files and parsing their `questions` array, so the array must keep the format `const questions = [ ... \n];`.

Home (`page/home.html`, `es/home.html`, `en/home.html`): progress card, Kit Excel na Prática card (PT only, same as in Cursos, right below the progress card → `https://iuleappia.github.io/iuleapp-com/excel-pt/`), "Sugestão de Estudo" based on progress, and tip/Excel/fact of the day (32 items each, rotate by day of year, "↻ Outra" button).

### Visual: marca, modo escuro e imagens

- Shell top bar uses the brand palette (navy `#0B1020→#16213E`, cyan `#00E5FF/#00B8D4`, yellow `#FFD60A`) with "IuleApp ·" before the page title. Excel pages use Excel green `#1D6F42`.
- **Dark mode:** every page has `<link rel="stylesheet" href="…/css/escuro.css">` + `<script src="…/js/tema.js">` right before `</head>`. `tema.js` sets `html.escuro` before render (saved choice in `localStorage.tema`, otherwise the system theme). The 🌙/☀️ button (`#btnTema`) is in the shell top bar and also updates the page inside the iframe. All dark rules live in `css/escuro.css` (scoped to `html.escuro`). **New pages must include both tags.**
- Images: pages use `img/*.webp` (≈75% smaller) with `loading="lazy"`; the `.jpg` files stay only for `og:image`.

### Versões do ebook (site novo)

`js/versoes.js` renders the "Escolha a sua versão" cards (PT-BR, PT-PT, ES, MX, EN → `https://iuleappia.github.io/iuleapp-com/<versão>/`) into any `<div class="versoes-ebook"></div>`. Used on Home and Cursos; each language shows only its own versions (PT: PT-BR + PT-PT · ES: ES + MX · EN: EN). Edit prices/links in its `VERSOES` object. The ebook cards on Home/Cursos also point to the new site (PT `pt-br/`, ES `es/`, EN `en/`).

### concursos/index.html

Status is computed from the dates (`statusAtual()`): after `inscricaoAte` → "Inscrições Encerradas"; after `dataProva` → "Prova Realizada". The `status` field only matters while registrations are still open (`inscricoes_abertas` or `previsto`). Past contests are sorted to the end and faded.

---

## Analytics & Tracking (`js/`)

- **`js/analytics.js`** — Google Analytics `G-ZJWSWYP3T8`. Loads gtag async, tracks all link clicks as `clique_link`, fires a dedicated `Biblia_do_Excel` conversion event for the Hotmart URL `go.hotmart.com/B41563429U`. Uses `readyState` guard.
- **`js/meta-pixel.js`** — Meta Pixel `1255142006053516`. Tracks `PageView`, scroll past 50% (`ScrollPage`), and the same Hotmart link as `Biblia_do_Excel`.

Both scripts must be placed **as the first tags inside `<head>`**, before `<meta charset>`.

- **`js/rastreio-app.js`** — loaded only by the 3 shells (`index.html`, `es/index.html`, `en/index.html`), right after the pixel. Tracks what happens *inside the iframe*: GA `page_view` + Pixel `PageView` on every page opened in the app (skips the first home load, already counted by the shell), `clique_link` on any link, and on sales links (Hotmart, Google Play store, `/ebook-informatica/`, `/iuleapp-com/`) GA `clique_venda` + Pixel `InitiateCheckout` and `Clique_Venda`. Also keeps `Biblia_do_Excel`.
- Study events sent via `Estudo.evento()` (to the parent shell's `gtag`): `simulado_concluido`, `simulado_geral_concluido`, `revisao_concluida`, `oferta_exibida`.
- **Offer card** at the end of simulados, Simulado Geral and Revisão: `Estudo.oferta()` in `js/estudo.js`. Change the product per language in the `OFERTA` object (PT/ES: Ebook de Informática Completo; EN: Complete Computer Basics Ebook — all linking to the new site https://iuleappia.github.io/iuleapp-com/ pt-br/, es/, en/).

### Pages that include tracking scripts

Only main entry points carry the scripts — individual discipline/simulado pages do not:

`index.html`, `page/cursos.html`, `page/produtos.html`, `en/index.html`, `en/cursos.html`, `es/index.html`, `es/cursos.html`, `concursos/index.html`

---

## Adding a new page

1. Create the HTML in the correct folder.
2. Add `<script src="[correct relative path]/js/analytics.js"></script>` and `meta-pixel.js` as first tags in `<head>` only if the page is an entry point.
3. Update `index.html` (and `en/index.html`, `es/index.html` if applicable) to include the new button and `abrirPagina('page/newpage.html', this)`.
4. Mirror the page in `en/` and `es/` folders if multilingual support is needed.
