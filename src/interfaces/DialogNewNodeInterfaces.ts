import {GraphNodeElement} from "../model/GraphNodeData";
import {GraphNodeType} from "../model/GraphNodeType";

export interface DialogNewNodeProps {
    open: boolean,
    timestamp: string
    node: GraphNodeElement
    onSave: Function
    onRequestClose: Function
    type: GraphNodeType
}

export interface DialogNewNodeState {
    timestamp?: string
    node?: GraphNodeElement
}
