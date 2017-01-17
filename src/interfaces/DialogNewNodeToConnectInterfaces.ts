import {GraphLinkElement} from "../model/GraphLinkData";
import {GraphNodeType} from "../model/GraphNodeType";

export interface DialogNewNodeDetailToConnectProps {
    open: boolean,
    timestamp: string
    link: GraphLinkElement
    onSave: Function
    onRequestClose: Function
    type: GraphNodeType
}

export interface DialogNewNodeDetailToConnectState {
    timestamp?: string
    link: GraphLinkElement
}
