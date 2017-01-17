import {GraphNodeData} from "../model/GraphNodeData";

export interface NewDialogNodeDetailProps {
    open: boolean,
    timestamp: string
    node?: GraphNodeData
    onSave: Function
    onRequestClose: Function
    type: string
}

export interface NewDialogNodeDetailState {
    timestamp?: string
    node?: GraphNodeData
}
