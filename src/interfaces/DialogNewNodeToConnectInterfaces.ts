import {GraphLinkElement} from "../model/GraphLinkData";

export interface DialogNewNodeDetailToConnectProps {
    open: boolean,
    timestamp: string
    link: GraphLinkElement
    onSave: Function
    onRequestClose: Function
    type: string
}

export interface DialogNewNodeDetailToConnectState {
    timestamp?: string
    link: GraphLinkElement
}
