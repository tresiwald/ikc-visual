import { GraphLinkElement } from "../model/GraphLinkData";
import { GraphNodeType } from "../model/GraphNodeType";
/**
 * State and props interface for the "new node and connect to an existing" dialog. Which has to be implemented to use this package
 */
export interface DialogNewNodeToConnectProps {
    open: boolean;
    timestamp: string;
    link: GraphLinkElement;
    onSave: Function;
    onRequestClose: Function;
    type: GraphNodeType;
}
export interface DialogNewNodeToConnectState {
    timestamp?: string;
    link?: GraphLinkElement;
}
