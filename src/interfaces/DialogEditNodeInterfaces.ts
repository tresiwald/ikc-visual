
import {GraphNodeElement, GraphNodeData} from "../model/GraphNodeData";
export interface DialogEditNodeProps {
    open: boolean,
    timestamp: string
    node: GraphNodeData
    onSave: Function
    onRequestClose: Function,
}

export interface DialogEditNodeState {
    timestamp?: string
    nodeName?: string
    node?: GraphNodeData

}
