"use strict";
const GraphNodeData_1 = require("./GraphNodeData");
const GraphLinkData_1 = require("./GraphLinkData");
/**
 * Factory to create new graph elements
 */
var GraphElementFactory;
(function (GraphElementFactory) {
    /**
     * Create a graph node element
     * @param id - id of the graph element
     * @param position - position of the graph element
     * @param visibility - visibility of the graph element
     * @return {GraphNodeElement}
     */
    function getGraphElementAsNode(id, position, visibility) {
        return new GraphNodeData_1.GraphNodeElement(new GraphNodeData_1.GraphNodeData(id), position, visibility);
    }
    GraphElementFactory.getGraphElementAsNode = getGraphElementAsNode;
    /**
     * Create a graph link element
     * @param id - id of the link element
     * @param sourceNode - id of the source node
     * @param destinationNode - id of the target node
     * @param visibility - visibility of the link
     * @return {GraphLinkElement}
     */
    function getGraphElementAsLink(id, sourceNode, destinationNode, visibility) {
        return new GraphLinkData_1.GraphLinkElement(new GraphLinkData_1.GraphLinkData(id, sourceNode, destinationNode), visibility);
    }
    GraphElementFactory.getGraphElementAsLink = getGraphElementAsLink;
    /**
     * Create a graph node element
     * @param data - data of the graph node element
     * @param position - position of the graph element
     * @param visibility - visibility of the graph element
     * @return {GraphNodeElement}
     */
    function getNode(data, position, visibility) {
        return new GraphNodeData_1.GraphNodeElement(data, position, visibility);
    }
    GraphElementFactory.getNode = getNode;
})(GraphElementFactory = exports.GraphElementFactory || (exports.GraphElementFactory = {}));
//# sourceMappingURL=GraphElementFactory.js.map