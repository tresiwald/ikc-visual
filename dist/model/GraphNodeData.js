"use strict";
const VISIBILITY_1 = require("./VISIBILITY");
/**
 * Graph data element specify the graph element
 */
class GraphNodeElement {
    /**
     * Default constructor
     * @param data - data of the node
     * @param position - position of the node
     * @param visibility - visibility of the node
     */
    constructor(data, position, visibility) {
        this.visibility = VISIBILITY_1.VISIBILITY.HIDDEN;
        this.nodeClasses = [];
        this.data = data;
        this.position = position;
        this.visibility = visibility;
    }
}
exports.GraphNodeElement = GraphNodeElement;
/**
 * Graph node data specify the graph element data
 */
class GraphNodeData {
    /**
     * Default constructor
     * @param id - id of the node
     */
    constructor(id) {
        this.label = "";
        this.id = id;
    }
}
exports.GraphNodeData = GraphNodeData;
//# sourceMappingURL=GraphNodeData.js.map