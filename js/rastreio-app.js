/* =========================================================
   RASTREIO DENTRO DO APP (páginas abertas no iframe)
   Carregado só nos shells: index.html, es/index.html, en/index.html
   - page_view no Google Analytics a cada página aberta no app
   - PageView no Meta Pixel a cada página aberta no app
   - cliques em links das páginas internas (clique_link)
   - cliques em links de venda (Hotmart / Play / site do ebook):
       GA: clique_venda | Pixel: InitiateCheckout + Clique_Venda
   - mantém o evento Biblia_do_Excel (GA + Pixel)
   ========================================================= */
(function () {

  var BIBLIA = "https://go.hotmart.com/B41563429U";
  var primeira = true;
  var VENDA =/hotmart\.com|play\.google\.com\/store|\/ebook-informatica\/|\/iuleapp-com\//i;

  function ga() { if (typeof window.gtag === "function") window.gtag.apply(null, arguments); }
  function px() { if (typeof window.fbq === "function") window.fbq.apply(null, arguments); }

  function idioma() {
    return /\/es\//.test(location.pathname) ? "es" : /\/en\//.test(location.pathname) ? "en" : "pt";
  }

  function nomeProduto(link) {
    if (link.getAttribute("data-produto")) return link.getAttribute("data-produto");
    var card = link.closest(".card-produto, .card, .oferta, .item-produto, .produto");
    var h = card && card.querySelector("h3, b, .nome");
    return ((h && h.textContent) || link.textContent || "").trim().slice(0, 80);
  }

  function aoClicar(e) {
    var link = e.target.closest && e.target.closest("a[href]");
    if (!link) return;
    var url = link.href;
    var texto = (link.textContent || "").trim().slice(0, 80);
    var pagina = this.location ? this.location.pathname : "";

    ga("event", "clique_link", { event_category: "engajamento", event_label: texto, link_url: url, pagina: pagina });

    if (VENDA.test(url)) {
      var produto = nomeProduto(link);
      ga("event", "clique_venda", { event_category: "conversao", produto: produto, link_url: url, pagina: pagina, idioma: idioma() });
      px("track", "InitiateCheckout", { content_name: produto, content_category: "curso_digital" });
      px("trackCustom", "Clique_Venda", { produto: produto, pagina: pagina, idioma: idioma() });
    }

    if (url.indexOf(BIBLIA) === 0) {
      ga("event", "Biblia_do_Excel", { event_category: "conversao", event_label: texto, link_url: url });
      px("trackCustom", "Biblia_do_Excel", { produto: "Bíblia do Excel" });
    }
  }

  function aoCarregar() {
    var frame = document.getElementById("frame");
    var doc, loc;
    try { doc = frame.contentDocument; loc = frame.contentWindow.location; } catch (e) { return; }
    if (!doc || !loc || loc.href === "about:blank") return;

    // a 1ª página (home) já foi contada pelo PageView/page_view do próprio shell
    if (primeira) { primeira = false; }
    else {
      ga("event", "page_view", {
        page_location: loc.href,
        page_path: loc.pathname,
        page_title: doc.title || loc.pathname
      });
      px("track", "PageView");
    }

    if (!doc.__rastreioApp) {
      doc.__rastreioApp = true;
      doc.addEventListener("click", aoClicar.bind(frame.contentWindow), true);
    }
  }

  function iniciar() {
    var frame = document.getElementById("frame");
    if (!frame) return;
    frame.addEventListener("load", aoCarregar);
    if (frame.contentDocument && frame.contentDocument.readyState === "complete") aoCarregar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
