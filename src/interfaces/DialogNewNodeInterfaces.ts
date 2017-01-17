import {GraphNodeElement} from "../model/GraphNodeData";

export interface DialogNewNodeProps {
    open: boolean,
    timestamp: string
    node: GraphNodeElement
    onSave: Function
    onRequestClose: Function
    type: string
}

export interface DialogNewNodeState {
    timestamp?: string
    node?: GraphNodeElement
}
