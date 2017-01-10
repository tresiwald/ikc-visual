import {GraphNodeData} from "../model/GraphNodeData";

export interface DialogNodeSearchToConnectProps {
    open: boolean,
    timestamp: string
    onSave: Function
    onRequestClose: Function
}

export interface DialogNodeSearchToConnectState {
    nodeName?: string
    timestamp?: string
    node?: GraphNodeData
    label?: string
}
