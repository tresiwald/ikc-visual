import {GraphNodeData} from "../model/GraphNodeData";

export interface DialogNodeDetailProps {
    open: boolean,
    timestamp: string
    node?: GraphNodeData
    onSave: Function
    onRequestClose: Function
    asNewDialog: boolean
}

export interface DialogNodeDetailState {
    timestamp?: string
    nodeName?: string
    node?: GraphNodeData

}
