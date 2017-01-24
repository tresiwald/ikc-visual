import {View} from "../model/View";
import {DialogNewNodeState} from "./DialogNewNodeInterfaces";
import {DialogNewNodeToConnectState} from "./DialogNewNodeToConnectInterfaces";
/**
 * Process certain events in the specific data structure. This has to be implemented to use this package.
 */
export interface OperationService {

    /**
     * Create new node, together with the state of the "new node" dialog
     * @param state
     */
    createNodeFromDialogState(state: DialogNewNodeState): void

    /**
     * Create new node and link, together with the state of the "new node and connect to an existing node" dialog
     * @param state
     */
    createNodeWithLinkFromDialogState(state: DialogNewNodeToConnectState): void

    /**
     * Create a link from a source node to target node with an id and a label
     * @param id - id of the new link
     * @param source - source node id of the new link
     * @param target - target node id of the new link
     * @param label - label of the new link
     */
    createLink(id: string, source: string, target: string, label: string): void;

    /**
     * Save a view object
     * @param view
     */
    saveView(view: View): void;
}