import {ContextMenu} from "../../model/ContextMenu";
import {GraphElement} from "../../model/GraphElement";

export interface GraphProps {
    nodes: GraphElement[]
    arrows: GraphElement[]
    nodeMenu: ContextMenu
    coreMenu: ContextMenu
    onNewNode: Function
    onNewArrow: Function
    onNodePositionUpdate: Function
}
