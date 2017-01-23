export module AgentService{

    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPod/i);
        },
        TabletLandscape:function () {
            return window.innerWidth > 1024 && window.matchMedia("(orientation: landscape)").matches;
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function () {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
        }
    };

    export function agentIsMobile(){
        return this.isMobile.any()
    }
    export function agentIsTabletLandscape(){
        return this.isMobile.TabletLandscape()
    }
}