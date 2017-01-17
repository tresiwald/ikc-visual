import {View} from "../model/View";
import {DialogNewNodeState} from "./DialogNewNodeInterfaces";
import {DialogNewNodeToConnectState} from "./DialogNewNodeToConnectInterfaces";
/**
 * Process certain events in the specific datastructure
 */
export interface OperationService {
    createNodeFromDialogState(state: DialogNewNodeState): void
    createNodeWithLinkFromDialogState(state: DialogNewNodeToConnectState): void
    createNode(id: string, label: string): void;
    createLink(id: string, source: string, target: string, label: string): void;
    updateNode(id: string, label: string): void;
    updateLink(id: string, source: string, target: string, label: string): void;
    deleteNode(id: string): void;
    deleteLink(id: string): void;
    saveView(view:View):void;
}