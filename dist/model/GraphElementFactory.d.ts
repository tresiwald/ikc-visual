import { GraphNodeData, GraphNodeElement } from "./GraphNodeData";
import { GraphPosition } from "./GraphPosition";
import { GraphLinkElement } from "./GraphLinkData";
import { VISIBILITY } from "./VISIBILITY";
/**
 * Factory to create new graph elements
 */
export declare module GraphElementFactory {
    /**
     * Create a graph node element
     * @param id - id of the graph element
     * @param position - position of the graph element
     * @param visibility - visibility of the graph element
     * @return {GraphNodeElement}
     */
    function getGraphElementAsNode(id: string, position: GraphPosition, visibility: VISIBILITY): GraphNodeElement;
    /**
     * Create a graph link element
     * @param id - id of the link element
     * @param sourceNode - id of the source node
     * @param destinationNode - id of the target node
     * @param visibility - visibility of the link
     * @return {GraphLinkElement}
     */
    function getGraphElementAsLink(id: string, sourceNode: string, destinationNode: string, visibility: VISIBILITY): GraphLinkElement;
    /**
     * Create a graph node element
     * @param data - data of the graph node element
     * @param position - position of the graph element
     * @param visibility - visibility of the graph element
     * @return {GraphNodeElement}
     */
    function getNode(data: GraphNodeData, position: GraphPosition, visibility: VISIBILITY): GraphNodeElement;
}
