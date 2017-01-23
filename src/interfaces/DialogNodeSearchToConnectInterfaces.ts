import {GraphLinkData} from "../model/GraphLinkData";

export interface DialogNodeSearchToConnectProps {
    open: boolean,
    timestamp: string
    onSave: Function
    onRequestClose: Function
    title: string
}

export interface DialogNodeSearchToConnectState {
    nodeName?: string
    timestamp?: string
    link?: GraphLinkData
}
