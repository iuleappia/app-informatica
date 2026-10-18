/* =========================================================
   VERSÕES DO EBOOK (site novo iuleapp-com)
   Mostra os cards "Escolha a sua versão" onde houver
   <div class="versoes-ebook"></div>, só com as versões do
   idioma do app (PT: PT-BR e PT-PT · ES: ES e MX · EN: EN). Para mudar preço/link, edite VERSOES abaixo.
   ========================================================= */
(function () {
  var SITE = 'https://iuleappia.github.io/iuleapp-com/';

  var VERSOES = {
    'pt-br': { tag: 'PT-BR', nome: 'Português do Brasil', produto: 'Ebook de Informática Completo', preco: 'R$47,90', cta: 'Ver ebook', url: SITE + 'pt-br/' },
    'pt-pt': { tag: 'PT-PT', nome: 'Português de Portugal', produto: 'Ebook de Informática Completo', preco: '€9,90', cta: 'Ver ebook', url: SITE + 'pt-pt/' },
    'es':    { tag: 'ES', nome: 'Español', produto: 'Ebook de Informática Completo', preco: 'US$9.90', cta: 'Ver ebook', url: SITE + 'es/' },
    'es-mx': { tag: 'MX', nome: 'Español (México)', produto: 'Ebook de Informática Completo', preco: '$199 MXN', cta: 'Ver ebook', url: SITE + 'es-mx/' },
    'en':    { tag: 'EN', nome: 'English', produto: 'Complete Computer Basics Ebook', preco: 'US$9.90', cta: 'See ebook', url: SITE + 'en/' }
  };

  var LANG = /\/es\//.test(location.pathname) ? 'es' : /\/en\//.test(location.pathname) ? 'en' : 'pt';

  var ORDEM = {
    pt: ['pt-br', 'pt-pt'],
    es: ['es', 'es-mx'],
    en: ['en']
  }[LANG];

  var TITULO = {
    pt: ['Escolha a sua versão do ebook', 'O mesmo conteúdo, adaptado a cada idioma e região.'],
    es: ['Elige tu versión del ebook', 'El mismo contenido, adaptado a cada idioma y región.'],
    en: ['Get the ebook', 'Available in English.']
  }[LANG];

  var CSS = '' +
    '.versoes-box{margin:30px 0 10px;text-align:left;}' +
    '.versoes-cab{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 20px;margin-bottom:16px;}' +
    '.versoes-cab h2{font-size:22px;color:#16213E;margin:0;}' +
    '.versoes-cab p{font-size:14px;color:#666;margin:0;}' +
    '.versoes-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;}' +
    '.versao{display:flex;flex-direction:column;background:#fff;border:1px solid #e6e6e6;border-radius:14px;padding:18px 16px;text-decoration:none;color:#111;transition:transform .2s,box-shadow .2s;}' +
    '.versao:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,.08);}' +
    '.versao .vtag{align-self:flex-start;font-size:11px;font-weight:bold;letter-spacing:.5px;color:#2f5fd0;background:#e8eefc;border-radius:20px;padding:4px 10px;margin-bottom:12px;}' +
    '.versao .vnome{font-size:17px;font-weight:bold;line-height:1.2;margin-bottom:6px;}' +
    '.versao .vprod{font-size:13px;color:#666;line-height:1.5;flex:1;}' +
    '.versao .vpreco{font-size:22px;font-weight:bold;margin:16px 0 10px;}' +
    '.versao .vcta{font-size:14px;font-weight:bold;color:#2f5fd0;}' +
    '.versao.atual{border:2px solid #2f5fd0;}' +
    'html.escuro .versoes-cab h2{color:#e6e9ef;}' +
    'html.escuro .versoes-cab p, html.escuro .versao .vprod{color:#b8c1d1;}' +
    'html.escuro .versao{background:#1a2130;border-color:#2e3850;color:#e6e9ef;}' +
    'html.escuro .versao .vtag{background:#1e2a4a;color:#93b4ff;}' +
    'html.escuro .versao .vcta{color:#93b4ff;}' +
    'html.escuro .versao.atual{border-color:#93b4ff;}';

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  function montar(alvo) {
    var box = el('div', 'versoes-box');
    var cab = el('div', 'versoes-cab');
    cab.append(el('h2', null, TITULO[0]), el('p', null, TITULO[1]));
    var grid = el('div', 'versoes-grid');
    ORDEM.forEach(function (k, i) {
      var v = VERSOES[k];
      var a = el('a', 'versao' + (i === 0 ? ' atual' : ''));
      a.href = v.url; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('data-produto', v.produto + ' (' + v.tag + ')');
      a.append(el('span', 'vtag', v.tag), el('span', 'vnome', v.nome), el('span', 'vprod', v.produto),
               el('span', 'vpreco', v.preco), el('span', 'vcta', v.cta + ' →'));
      grid.append(a);
    });
    box.append(cab, grid);
    alvo.append(box);
  }

  function iniciar() {
    var alvos = document.querySelectorAll('.versoes-ebook');
    if (!alvos.length) return;
    if (!document.getElementById('versoes-css')) {
      var s = document.createElement('style'); s.id = 'versoes-css'; s.textContent = CSS; document.head.appendChild(s);
    }
    alvos.forEach(montar);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
