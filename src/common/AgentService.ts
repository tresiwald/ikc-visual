
/** Provides methods to check information about the current agent (browser) */

export module AgentService {

    export function android() {
        return navigator.userAgent.match(/Android/i);
    }

    export function blackberry() {
        return navigator.userAgent.match(/BlackBerry/i);
    }

    export function ios() {
        return navigator.userAgent.match(/iPhone|iPod/i) || (navigator.userAgent.match(/iPad/i) && window.matchMedia("(orientation: portrait)").matches);
    }

    export function tabletLandscape() {
        return window.innerWidth > 1024 && window.matchMedia("(orientation: landscape)").matches;
    }

    export function opera() {
        return navigator.userAgent.match(/Opera Mini/i);
    }

    export function windows() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    }

    export function any() {
        return (this.android() || this.blackberry() || this.ios() || this.opera() || this.windows());
    }

    /**
     * Check if the agent (browser) is used from a mobile device
     * @returns {boolean}
     */
    export function agentIsMobile():boolean {
        return this.any()
    }

    /**
     * Check if the agent (browser) is used from a tablet and the orientation is landscape
     * @returns {boolean}
     */
    export function agentIsTabletLandscape():boolean {
        return this.TabletLandscape()
    }
}