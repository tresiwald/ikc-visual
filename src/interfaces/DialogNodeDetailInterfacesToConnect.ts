import {GraphNodeData} from "../model/GraphNodeData";

export interface DialogNodeDetailToConnectProps {
    open: boolean,
    timestamp: string
    node?: GraphNodeData
    onSave: Function
    onRequestClose: Function
    asNewDialog: boolean
}

export interface DialogNodeDetailToConnectState {
    timestamp?: string
    nodeName?: string
    node?: GraphNodeData
    label?:string
}
