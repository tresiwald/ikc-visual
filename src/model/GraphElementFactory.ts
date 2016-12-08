import {GraphNodeData, GraphNodeElement} from "./GraphNodeData";
import {GraphPosition} from "./GraphPosition";
import {GraphArrowData, GraphArrowElement} from "./GraphArrowData";

export function getGraphElementAsNode(id:string, label:string, position:GraphPosition):GraphNodeElement {
    return new GraphNodeElement(
        new GraphNodeData(id,label), position
    )
}

export function getGraphElementAsArrow(sourceNode:string, destinationNode:string, label:string):GraphArrowElement {
    return new GraphArrowElement(
        new GraphArrowData(
            sourceNode, destinationNode, label
        )
    )
}