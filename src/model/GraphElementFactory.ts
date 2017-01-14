import {GraphNodeData, GraphNodeElement} from "./GraphNodeData";
import {GraphPosition} from "./GraphPosition";
import {GraphLinkData, GraphLinkElement} from "./GraphLinkData";
import {VISIBILITY} from "./VISIBILITY";

export module GraphElementFactory {
    export function getGraphElementAsNode(id: string, label: string, position: GraphPosition, visbility:VISIBILITY): GraphNodeElement {
        return new GraphNodeElement(
            new GraphNodeData(id, label), position, visbility
        )
    }

    export function getGraphElementAsLink(id: string, sourceNode: string, destinationNode: string, label: string, visbility:VISIBILITY): GraphLinkElement {
        return new GraphLinkElement(
            new GraphLinkData(
                id, sourceNode, destinationNode, label
            ),visbility
        )
    }

    export function getNode(data: GraphNodeData, position: GraphPosition, visbility:VISIBILITY): GraphNodeElement{
        return new GraphNodeElement(
            data, position, visbility
        )
    }
}