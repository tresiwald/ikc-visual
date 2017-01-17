import {GraphNodeData} from "../model/GraphNodeData";

export interface NewDialogNodeDetailToConnectProps {
    open: boolean,
    timestamp: string
    node?: GraphNodeData
    onSave: Function
    onRequestClose: Function
    asNewDialog: boolean
}

export interface NewDialogNodeDetailToConnectState {
    timestamp?: string
    nodeName?: string
    node?: GraphNodeData
    label?:string
}
