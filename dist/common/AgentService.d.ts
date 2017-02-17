/** Provides methods to check information about the current agent (browser) */
export declare module AgentService {
    function android(): RegExpMatchArray;
    function blackberry(): RegExpMatchArray;
    function ios(): boolean | RegExpMatchArray;
    function tabletLandscape(): boolean;
    function opera(): RegExpMatchArray;
    function windows(): RegExpMatchArray;
    function any(): any;
    /**
     * Check if the agent (browser) is used from a mobile device
     * @returns {boolean}
     */
    function agentIsMobile(): boolean;
    /**
     * Check if the agent (browser) is used from a tablet and the orientation is landscape
     * @returns {boolean}
     */
    function agentIsTabletLandscape(): boolean;
}
