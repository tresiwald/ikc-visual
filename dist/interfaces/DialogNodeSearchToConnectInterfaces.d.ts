import { GraphLinkData } from "../model/GraphLinkData";
/**
 * State and props interface for the "search node and connect to an exsting node" dialog. Which has to be implemented to use this package
 */
export interface DialogNodeSearchToConnectProps {
    open: boolean;
    timestamp: string;
    onSave: Function;
    onRequestClose: Function;
    title: string;
}
export interface DialogNodeSearchToConnectState {
    nodeName?: string;
    timestamp?: string;
    link?: GraphLinkData;
}
