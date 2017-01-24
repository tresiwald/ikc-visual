import {GraphNodeData, GraphNodeElement} from "./GraphNodeData";
import {GraphPosition} from "./GraphPosition";
import {GraphLinkData, GraphLinkElement} from "./GraphLinkData";
import {VISIBILITY} from "./VISIBILITY";

/**
 * Factory to create new graph elements
 */
export module GraphElementFactory {

    /**
     * Create a graph node element
     * @param id - id of the graph element
     * @param position - position of the graph element
     * @param visibility - visibility of the graph element
     * @return {GraphNodeElement}
     */
    export function getGraphElementAsNode(id: string, position: GraphPosition, visibility: VISIBILITY): GraphNodeElement {
        return new GraphNodeElement(
            new GraphNodeData(id), position, visibility
        )
    }

    /**
     * Create a graph link element
     * @param id - id of the link element
     * @param sourceNode - id of the source node
     * @param destinationNode - id of the target node
     * @param visibility - visibility of the link
     * @return {GraphLinkElement}
     */
    export function getGraphElementAsLink(id: string, sourceNode: string, destinationNode: string, visibility: VISIBILITY): GraphLinkElement {
        return new GraphLinkElement(
            new GraphLinkData(
                id, sourceNode, destinationNode
            ), visibility
        )
    }

    /**
     * Create a graph node element
     * @param data - data of the graph node element
     * @param position - position of the graph element
     * @param visibility - visibility of the graph element
     * @return {GraphNodeElement}
     */
    export function getNode(data: GraphNodeData, position: GraphPosition, visibility: VISIBILITY): GraphNodeElement {
        return new GraphNodeElement(
            data, position, visibility
        )
    }
}