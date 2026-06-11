// META PIXEL + EVENTOS

(function () {

    // CARREGAR PIXEL
    !function(f,b,e,v,n,t,s)
    {
        if(f.fbq)return;
        n=f.fbq=function(){
            n.callMethod ?
            n.callMethod.apply(n,arguments) : n.queue.push(arguments)
        };

        if(!f._fbq)f._fbq=n;

        n.push=n;
        n.loaded=!0;
        n.version='2.0';
        n.queue=[];

        t=b.createElement(e);
        t.async=!0;
        t.src=v;

        s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s);

    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    // ID DO PIXEL
    fbq('init', '1255142006053516');

    // PAGE VIEW
    fbq('track', 'PageView');


    // SCROLL 50%

    let scrollTracked = false;

    window.addEventListener("scroll",function(){

        if(scrollTracked) return;

        let scrollPercent =
        (window.scrollY + window.innerHeight) /
        document.documentElement.scrollHeight;

        if(scrollPercent > 0.5){

            scrollTracked = true;

            fbq('trackCustom','ScrollPage',{
                percent:50
            });

        }

    });


    // EVENTO BÍBLIA DO EXCEL

    document.addEventListener("click",function(e){

        const link = e.target.closest("a");

        if(!link) return;

        const url = link.href;

        if(url === "https://go.hotmart.com/B41563429U"){

            fbq('trackCustom','Biblia_do_Excel',{
                produto:'Bíblia do Excel'
            });

        }

    });

})();
