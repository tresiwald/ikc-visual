import {GraphNodeData, GraphNodeElement} from "./GraphNodeData";
import {GraphPosition} from "./GraphPosition";
import {GraphLinkData, GraphLinkElement} from "./GraphLinkData";

export function getGraphElementAsNode(id:string, label:string, position:GraphPosition):GraphNodeElement {
    return new GraphNodeElement(
        new GraphNodeData(id,label), position
    )
}

export function getGraphElementAsLink(id: string, sourceNode:string, destinationNode:string, label:string):GraphLinkElement {
    return new GraphLinkElement(
        new GraphLinkData(
            id, sourceNode, destinationNode, label
        )
    )
}