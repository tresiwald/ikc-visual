import { GraphNodeData } from "../model/GraphNodeData";
/**
 * State and props interface for the "search node" dialog. Which has to be implemented to use this package
 */
export interface DialogNodeSearchProps {
    open: boolean;
    timestamp: string;
    onSave: Function;
    onRequestClose: Function;
    title: string;
}
export interface DialogNodeSearchState {
    nodeName?: string;
    timestamp?: string;
    node?: GraphNodeData;
}
