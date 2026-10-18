/* =========================================================
   TEMA CLARO / ESCURO
   - carregado no <head> de todas as páginas (junto com css/escuro.css)
   - sem escolha salva, segue o tema do celular/computador
   - o botão 🌙/☀️ fica no topo do app (#btnTema) e vale para todas as páginas
   ========================================================= */
(function () {
  var KEY = 'tema';

  function salvo() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function sistemaEscuro() { return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); }
  function atual() { var s = salvo(); return s ? s : (sistemaEscuro() ? 'escuro' : 'claro'); }

  function aplicar(doc, tema) {
    if (doc && doc.documentElement) doc.documentElement.classList.toggle('escuro', tema === 'escuro');
  }

  function frameDoc() {
    var f = document.getElementById('frame');
    try { return f && f.contentDocument; } catch (e) { return null; }
  }

  function atualizarBotao() {
    var b = document.getElementById('btnTema');
    if (b) b.textContent = atual() === 'escuro' ? '☀️' : '🌙';
  }

  function definir(tema) {
    try { localStorage.setItem(KEY, tema); } catch (e) {}
    aplicar(document, tema);
    aplicar(frameDoc(), tema);
    atualizarBotao();
    try {
      var g = window.gtag || (window.parent && window.parent.gtag);
      if (typeof g === 'function') g('event', 'tema_alterado', { tema: tema });
    } catch (e) {}
  }

  // aplica já, antes de desenhar a página (evita "piscar" branco)
  aplicar(document, atual());

  // acompanha a troca de tema do sistema, se o aluno não escolheu um
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var ouvir = function () { if (!salvo()) { aplicar(document, atual()); aplicar(frameDoc(), atual()); atualizarBotao(); } };
    if (mq.addEventListener) mq.addEventListener('change', ouvir); else if (mq.addListener) mq.addListener(ouvir);
  }

  function iniciar() {
    var b = document.getElementById('btnTema');
    if (b) b.addEventListener('click', function () { definir(atual() === 'escuro' ? 'claro' : 'escuro'); });
    atualizarBotao();
    var f = document.getElementById('frame');
    if (f) f.addEventListener('load', function () { aplicar(frameDoc(), atual()); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();

  window.Tema = { atual: atual, definir: definir };
})();
