import {GraphNodeData} from "../model/GraphNodeData";

export interface DialogNodeSearchProps {
    open: boolean,
    timestamp: string
    onSave: Function
    onRequestClose: Function
    title: string
}

export interface DialogNodeSearchState {
    nodeName?: string
    timestamp?: string
    node?: GraphNodeData
}
