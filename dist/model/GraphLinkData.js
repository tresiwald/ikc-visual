"use strict";
const VISIBILITY_1 = require("./VISIBILITY");
/**
 * Graph link element specify the graph element
 */
class GraphLinkElement {
    /**
     * Default constructor
     * @param data - data of the link
     * @param visibility - visibility of the link
     */
    constructor(data, visibility) {
        this.visibility = VISIBILITY_1.VISIBILITY.HIDDEN;
        this.linkClasses = [];
        this.data = data;
        this.visibility = visibility;
    }
}
exports.GraphLinkElement = GraphLinkElement;
/**
 * Graph link data specify the graph element data
 */
class GraphLinkData {
    /**
     * Default constructor
     * @param id - id of the link
     * @param source - id of the source node
     * @param target - id of the target node
     */
    constructor(id, source, target) {
        this.label = "";
        this.id = id;
        this.source = source;
        this.target = target;
    }
}
exports.GraphLinkData = GraphLinkData;
//# sourceMappingURL=GraphLinkData.js.map