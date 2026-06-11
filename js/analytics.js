// GOOGLE ANALYTICS IULEAPP

// carregar script do analytics
var gaScript = document.createElement("script");
gaScript.async = true;
gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ZJWSWYP3T8";
document.head.appendChild(gaScript);

window.dataLayer = window.dataLayer || [];

function gtag(){
dataLayer.push(arguments);
}

// iniciar analytics
gtag("js", new Date());

gtag("config", "G-ZJWSWYP3T8");


// rastrear cliques em botões e links
function initTracking(){

document.querySelectorAll("a").forEach(function(link){

link.addEventListener("click", function(){

var texto = this.innerText.trim();
var url = this.href;

gtag("event","clique_link",{
event_category:"engajamento",
event_label:texto,
link_url:url
});

if(url === "https://go.hotmart.com/B41563429U"){
gtag("event","Biblia_do_Excel",{
event_category:"conversao",
event_label:texto,
link_url:url
});
}

});

});

}

if(document.readyState === "loading"){
document.addEventListener("DOMContentLoaded", initTracking);
} else {
initTracking();
}
