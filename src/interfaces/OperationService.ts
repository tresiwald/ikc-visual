import {View} from "../model/View";
import {NewDialogNodeDetailState} from "./NewDialogNodeDetailInterfaces";
import {NewDialogNodeDetailToConnectState} from "./NewDialogNodeDetailInterfacesToConnect";
/**
 * Process certain events in the specific datastructure
 */
export interface OperationService {
    createNodeFromDialogState(state: NewDialogNodeDetailState): void
    createNodeWithLinkFromDialogState(state: NewDialogNodeDetailToConnectState): void
    createNode(id: string, label: string): void;
    createLink(id: string, source: string, target: string, label: string): void;
    updateNode(id: string, label: string): void;
    updateLink(id: string, source: string, target: string, label: string): void;
    deleteNode(id: string): void;
    deleteLink(id: string): void;
    saveView(view:View):void;
}