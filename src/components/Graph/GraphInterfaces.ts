import {ContextMenu} from "../../model/ContextMenu";
import {GraphElement, GraphElementData} from "../../model/GraphElement";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeElement} from "../../model/GraphNodeData";
import {GraphLinkElement} from "../../model/GraphLinkData";

export interface GraphProps {
    nodes: GraphNodeElement[]
    links: GraphLinkElement[]
    nodeMenu?: ContextMenu
    coreMenu?: ContextMenu
    onNewNode: Function
    onNewLink: Function
    onNodePositionUpdate: Function
    onFilterWindowRequested?: Function
    onNodeDetailRequest?: Function
    onCoreDesktopMenuRequested?:Function
    onNodeDesktopMenuRequested?:Function
    onLinkSelected?:Function
}

export interface GraphState {
    oldPosition?: Map<string, GraphPosition>
    pan?: GraphPosition
    toolbarVisible?: boolean
}
