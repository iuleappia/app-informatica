/* =========================================================
   ESTUDO — progresso do aluno (salvo no próprio aparelho)
   - disciplinas lidas, melhor nota de cada simulado, erros
   - selos nas listas de disciplinas/simulados
   - motor do "Revisar meus erros" e do "Simulado Geral"
   Usado em: disciplinas/*, simulados/*, page/*, es/*, en/*
   ========================================================= */
(function () {

  var LANG = /\/es\//.test(location.pathname) ? 'es' : /\/en\//.test(location.pathname) ? 'en' : 'pt';

  var DISC = [
    { slug: 'introducao',  icon: '💻', nome: { pt: 'Introdução à Informática', es: 'Introducción a la Informática', en: 'Introduction to Computing' } },
    { slug: 'hardware',    icon: '🖥️', nome: { pt: 'Hardware', es: 'Hardware', en: 'Hardware' } },
    { slug: 'software',    icon: '⚙️', nome: { pt: 'Software', es: 'Software', en: 'Software' } },
    { slug: 'redes',       icon: '🌐', nome: { pt: 'Redes de Computadores', es: 'Redes de Computadoras', en: 'Computer Networks' } },
    { slug: 'arquitetura', icon: '🧠', nome: { pt: 'Arquitetura de Computadores', es: 'Arquitectura de Computadoras', en: 'Computer Architecture' } },
    { slug: 'barramentos', icon: '🔌', nome: { pt: 'Barramentos', es: 'Buses de Datos', en: 'Data Buses' } },
    { slug: 'algoritmo',   icon: '📊', nome: { pt: 'Algoritmo e Programação', es: 'Algoritmos y Programación', en: 'Algorithms and Programming' } },
    { slug: 'protocolos',  icon: '📡', nome: { pt: 'Protocolo de Rede', es: 'Protocolos de Red', en: 'Network Protocols' } }
  ];

  var TXT = {
    pt: { lida: '✓ Lida', melhor: 'Melhor nota', erros: 'erros para revisar' },
    es: { lida: '✓ Leída', melhor: 'Mejor nota', erros: 'errores para repasar' },
    en: { lida: '✓ Read', melhor: 'Best score', erros: 'mistakes to review' }
  }[LANG];

  /* ---------- armazenamento seguro ---------- */
  function get(k, def) {
    try { var v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); } catch (e) { return def; }
  }
  function set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function abs(href) {
    try { return new URL(href, location.href).pathname; } catch (e) { return href; }
  }
  function slugDe(path) {
    var m = String(path).match(/(?:simulado_)?([a-z]+)\.html$/);
    return m ? m[1] : '';
  }

  /* ---------- disciplinas lidas ---------- */
  function marcarLida(path) { set('lida:' + (path || location.pathname), Date.now()); }
  function foiLida(path) { return !!get('lida:' + path, 0); }

  /* ---------- notas ---------- */
  function salvarNota(acertos, total, path) {
    var k = 'nota:' + (path || location.pathname);
    var n = get(k, null) || { melhor: 0, total: total, vezes: 0 };
    n.melhor = Math.max(n.melhor || 0, acertos);
    n.total = total;
    n.ultima = acertos;
    n.vezes = (n.vezes || 0) + 1;
    n.data = Date.now();
    set(k, n);
    return n;
  }
  function nota(path) { return get('nota:' + path, null); }

  /* ---------- erros (por idioma) ---------- */
  var KERR = 'erros:' + LANG;
  function erros() { return get(KERR, []); }
  function registrarResposta(q, acertou, disciplina) {
    var lista = erros().filter(function (e) { return e.question !== q.question; });
    if (!acertou) {
      lista.unshift({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        disciplina: disciplina || slugDe(location.pathname),
        data: Date.now()
      });
    }
    set(KERR, lista.slice(0, 300));
  }
  function limparErros() { set(KERR, []); }

  /* ---------- selos nas listas ---------- */
  function badge(texto, cor) {
    var s = document.createElement('div');
    s.className = 'selo-progresso';
    s.textContent = texto;
    s.style.cssText = 'margin-top:10px;display:inline-block;font-size:12px;font-weight:bold;padding:4px 10px;border-radius:20px;color:#fff;background:' + cor;
    return s;
  }
  function corNota(p) { return p >= 0.8 ? '#2E7D32' : p >= 0.6 ? '#f59e0b' : '#C62828'; }

  function decorarListas() {
    document.querySelectorAll('a.card[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      var path = abs(href);
      if (/simulado_[a-z]+\.html$/.test(href)) {
        var n = nota(path);
        if (n && n.total) a.appendChild(badge(TXT.melhor + ': ' + n.melhor + '/' + n.total, corNota(n.melhor / n.total)));
      } else if (/disciplinas\/[a-z]+\.html$/.test(href)) {
        if (foiLida(path)) a.appendChild(badge(TXT.lida, '#2E7D32'));
      }
    });
  }

  /* ---------- carregar perguntas de outro simulado ---------- */
  function carregarQuestoes(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (html) {
      var m = html.match(/const questions\s*=\s*(\[[\s\S]*?\n\]);/);
      if (!m) throw new Error('sem perguntas');
      return (new Function('return ' + m[1]))();
    });
  }

  function embaralhar(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function embaralharAlternativas(q) {
    var ops = embaralhar(q.options.map(function (t, i) { return { t: t, ok: i === q.correctAnswer }; }));
    return {
      question: q.question,
      options: ops.map(function (o) { return o.t; }),
      correctAnswer: ops.findIndex(function (o) { return o.ok; }),
      explanation: q.explanation || '',
      disciplina: q.disciplina
    };
  }

  function evento(nome, dados) {
    try {
      var g = (typeof window.gtag === 'function') ? window.gtag : (window.parent && window.parent.gtag);
      if (g) g('event', nome, dados || {});
    } catch (e) {}
  }

  /* ---------- oferta de produto no fim dos simulados ----------
     Para trocar o produto, edite OFERTA abaixo (um por idioma). */
  var OFERTA = {
    pt: { nome: 'Ebook de Informática Completo', texto: 'Do básico ao avançado, para concursos e mercado de trabalho.', preco: 'R$ 47,90',
          botao: 'Conhecer o ebook', url: 'https://iuleappia.github.io/iuleapp-com/pt-br/', img: 'img/capa.webp',
          tituloBaixo: '📚 Quer acelerar seus estudos?', tituloAlto: '🚀 Mandou bem! Quer ir além?' },
    es: { nome: 'Ebook de Informática Completo', texto: 'De lo básico a lo avanzado para el estudio y el mercado laboral.', preco: 'US$ 9,90',
          botao: 'Ver el ebook', url: 'https://iuleappia.github.io/iuleapp-com/es/', img: 'img/capa.webp',
          tituloBaixo: '📚 ¿Quieres acelerar tus estudios?', tituloAlto: '🚀 ¡Bien hecho! ¿Quieres ir más allá?' },
    en: { nome: 'Complete Computer Basics Ebook', texto: 'From the basics to advanced topics, for study and the job market.', preco: 'US$ 9.90',
          botao: 'See the ebook', url: 'https://iuleappia.github.io/iuleapp-com/en/', img: 'https://iuleappia.github.io/iuleapp-com/assets/img/mockup-en.png',
          tituloBaixo: '📚 Want to boost your skills?', tituloAlto: '🚀 Great job! Ready for the next step?' }
  }[LANG];

  function raizApp() {
    var s = document.querySelector('script[src*="estudo.js"]');
    return s ? s.getAttribute('src').replace(/js\/estudo\.js.*$/, '') : '../';
  }

  function oferta(container, pct) {
    if (!container || !OFERTA) return;
    var o = OFERTA;
    var box = document.createElement('div');
    box.className = 'oferta';
    box.style.cssText = 'display:flex;gap:14px;align-items:center;text-align:left;margin:22px auto 0;max-width:520px;background:#fff8e1;border:2px solid #f59e0b;border-radius:14px;padding:14px;font-weight:normal;color:#333;';
    var img = document.createElement('img');
    img.src = /^https?:/.test(o.img) ? o.img : raizApp() + o.img; img.alt = o.nome;
    img.style.cssText = 'width:76px;height:100px;object-fit:cover;border-radius:8px;flex-shrink:0;box-shadow:0 2px 6px rgba(0,0,0,.15);';
    var info = document.createElement('div');
    var t = document.createElement('div'); t.textContent = pct >= 0.8 ? o.tituloAlto : o.tituloBaixo;
    t.style.cssText = 'font-weight:bold;font-size:15px;margin-bottom:4px;color:#b45309;';
    var b = document.createElement('b'); b.textContent = o.nome; b.style.cssText = 'display:block;font-size:16px;margin-bottom:4px;color:#222;';
    var p = document.createElement('div'); p.textContent = o.texto + (o.preco ? ' · ' + o.preco : '');
    p.style.cssText = 'font-size:13px;color:#555;line-height:1.4;margin-bottom:10px;';
    var a = document.createElement('a'); a.href = o.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = o.botao + ' ▶';
    a.style.cssText = 'display:inline-block;background:#f59e0b;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:9px 14px;border-radius:8px;';
    info.append(t, b, p, a);
    box.append(img, info);
    container.appendChild(box);
    evento('oferta_exibida', { produto: o.nome, pagina: location.pathname, nota_pct: Math.round((pct || 0) * 100) });
  }

  window.Estudo = {
    oferta: oferta,
    LANG: LANG, DISC: DISC,
    get: get, set: set, abs: abs,
    marcarLida: marcarLida, foiLida: foiLida,
    salvarNota: salvarNota, nota: nota,
    erros: erros, registrarResposta: registrarResposta, limparErros: limparErros,
    decorarListas: decorarListas, carregarQuestoes: carregarQuestoes,
    embaralhar: embaralhar, embaralharAlternativas: embaralharAlternativas,
    evento: evento
  };
})();
