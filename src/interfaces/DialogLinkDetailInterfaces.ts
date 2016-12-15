import {GraphLinkData} from "../model/GraphLinkData";

export interface DialogLinkDetailProps {
    open: boolean,
    timestamp: string
    node?: GraphLinkData
    onSave: Function
    onRequestClose: Function
    asNewDialog: boolean
}

export interface DialogLinkDetailState {
    timestamp?: string
    nodeName?: string
    node?: GraphLinkData
}
