import {ContextMenu} from "../../model/ContextMenu";
import {GraphElement} from "../../model/GraphElement";
import {GraphPosition} from "../../model/GraphPosition";

export interface GraphProps {
    nodes: GraphElement[]
    arrows: GraphElement[]
    nodeMenu: ContextMenu
    coreMenu: ContextMenu
    onNewNode: Function
    onNewLink: Function
    onNodePositionUpdate: Function
}

export interface GraphState {
    oldPosition?: Map<string, GraphPosition>
}
