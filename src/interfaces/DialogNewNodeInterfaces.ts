import {GraphNodeElement} from "../model/GraphNodeData";
import {GraphNodeType} from "../model/GraphNodeType";

/**
 * State and props interface for the "new node" dialog. Which has to be implemented to use this package
 */
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
