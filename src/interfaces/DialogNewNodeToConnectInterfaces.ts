import {GraphLinkElement} from "../model/GraphLinkData";
import {GraphNodeType} from "../model/GraphNodeType";

export interface DialogNewNodeToConnectProps {
    open: boolean,
    timestamp: string
    link: GraphLinkElement
    onSave: Function
    onRequestClose: Function
    type: GraphNodeType
}

export interface DialogNewNodeToConnectState {
    timestamp?: string
    link?: GraphLinkElement
}
