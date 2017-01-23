import {View} from "../model/View";
import {DialogNewNodeState} from "./DialogNewNodeInterfaces";
import {DialogNewNodeToConnectState} from "./DialogNewNodeToConnectInterfaces";
/**
 * Process certain events in the specific datastructure
 */
export interface OperationService {
    createNodeFromDialogState(state: DialogNewNodeState): void
    createNodeWithLinkFromDialogState(state: DialogNewNodeToConnectState): void
    createLink(id: string, source: string, target: string, label: string): void;
    saveView(view:View):void;
}