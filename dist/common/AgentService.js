/** Provides methods to check information about the current agent (browser) */
"use strict";
var AgentService;
(function (AgentService) {
    function android() {
        return navigator.userAgent.match(/Android/i);
    }
    AgentService.android = android;
    function blackberry() {
        return navigator.userAgent.match(/BlackBerry/i);
    }
    AgentService.blackberry = blackberry;
    function ios() {
        return navigator.userAgent.match(/iPhone|iPod/i) || (navigator.userAgent.match(/iPad/i) && window.matchMedia("(orientation: portrait)").matches);
    }
    AgentService.ios = ios;
    function tabletLandscape() {
        return window.innerWidth > 1024 && window.matchMedia("(orientation: landscape)").matches;
    }
    AgentService.tabletLandscape = tabletLandscape;
    function opera() {
        return navigator.userAgent.match(/Opera Mini/i);
    }
    AgentService.opera = opera;
    function windows() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    }
    AgentService.windows = windows;
    function any() {
        return (this.android() || this.blackberry() || this.ios() || this.opera() || this.windows());
    }
    AgentService.any = any;
    /**
     * Check if the agent (browser) is used from a mobile device
     * @returns {boolean}
     */
    function agentIsMobile() {
        return this.any();
    }
    AgentService.agentIsMobile = agentIsMobile;
    /**
     * Check if the agent (browser) is used from a tablet and the orientation is landscape
     * @returns {boolean}
     */
    function agentIsTabletLandscape() {
        return this.tabletLandscape();
    }
    AgentService.agentIsTabletLandscape = agentIsTabletLandscape;
})(AgentService = exports.AgentService || (exports.AgentService = {}));
//# sourceMappingURL=AgentService.js.map