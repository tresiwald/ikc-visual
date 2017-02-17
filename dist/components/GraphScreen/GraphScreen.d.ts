/// <reference types="react" />
import * as React from "react";
import { GraphScreenProps, GraphScreenStats } from "./GraphScreenInterfaces";
import { GraphPosition } from "../../model/GraphPosition";
import { GraphNodeElement, GraphNodeData } from "../../model/GraphNodeData";
import { GraphLinkElement, GraphLinkData } from "../../model/GraphLinkData";
import { DialogNewNodeState } from "../../interfaces/DialogNewNodeInterfaces";
import { DialogNewNodeToConnectState } from "../../interfaces/DialogNewNodeToConnectInterfaces";
import { DialogNodeSearchToConnectState } from "../../interfaces/DialogNodeSearchToConnectInterfaces";
import { GraphNodeType } from "../../model/GraphNodeType";
/**
 * Wrapper react component for the graph component. This component will be used from any other application which use this package.
 */
export default class GraphScreen extends React.Component<GraphScreenProps, GraphScreenStats> {
    constructor(props: any);
    /**
     * Load the initial state
     */
    componentWillReceiveProps: (nextProps: GraphScreenProps) => void;
    /**
     * Save or update a link
     * @param link
     */
    saveLink: (link: GraphLinkElement) => void;
    /**
     * Save or update a node
     * @param node
     */
    saveNode: (node: GraphNodeElement) => void;
    /**
     * Return a certain node
     * @param nodeId
     * @return {GraphNodeElement}
     */
    getNode: (nodeId: string) => GraphNodeElement;
    /**
     * Return a certain link
     * @param linkId
     * @return {GraphLinkElement}
     */
    getLink: (linkId: string) => GraphLinkElement;
    /**
     * Hides a certain node and save
     * @param node
     */
    hideNode: (node: GraphNodeElement) => void;
    /**
     * Hides a certain link and save
     * @param link
     */
    hideLink: (link: GraphLinkElement) => void;
    /**
     * Shows a certain node and save
     * @param node
     */
    showNode: (node: GraphNodeElement) => void;
    /**
     * Shows a certain link and save
     * @param link
     */
    showLink: (link: GraphLinkElement) => void;
    /**
     * Check if there additional elements to display
     * @param sourceNode
     */
    checkMoreElementsToDisplay: (sourceNode: GraphNodeElement) => void;
    /**
     * Save the new link from graph component in the model, the view update has to executed from outside this package
     * @param newLink - the new link element to save
     * @param oldSourcePosition - oldposition of the source node
     */
    fromGraphNewLink: (newLink: GraphLinkElement, oldSourcePosition: GraphPosition) => void;
    /**
     * Save a new node a make sure all his children are visible
     * @param existingNode - node to save or update
     */
    fromGraphExistingNode: (existingNode: GraphNodeElement) => void;
    /**
     * Update the position of a node
     * @param nodeId - id of the node
     * @param position - new position
     */
    fromGraphPositionUpdated: (nodeId: string, position: GraphPosition) => void;
    /**
     * Add a new node from the 'new node' dialog and forward the state of the dialog to the external model
     * @param state
     */
    fromDialogNewNode: (state: DialogNewNodeState) => void;
    /**
     * Add a existing node to the view - created through the core context menu
     * @param nodeId
     */
    fromMenuExistingNode: (nodeId: string) => void;
    /**
     * Add a new node from the dialog and connect it to a node
     * @param state - dialog state
     */
    fromDialogNewNodeToConnect: (state: DialogNewNodeToConnectState) => void;
    /**
     * Add a existing node from a dialog and connect it to a node
     * @param state - dialog state
     */
    fromDialogExistingNodeToConnect: (state: DialogNodeSearchToConnectState) => void;
    /**
     * Hide node command from menu
     */
    fromMenuHideNode: () => void;
    /**
     * Hide specific node
     * @param id
     */
    hideNodeAndHisLinks: (id: string) => void;
    /**
     * Close the 'new node' dialog
     */
    closeNewNodeDialog: () => void;
    /**
     * Open the 'new node' dialog, also close all open menus and save the tapped position
     */
    openNewNodeDialog: (element: any) => void;
    /**
     * Close the 'new node and connect to existing node' dialog
     */
    closeNewNodeToConnectDialog: () => void;
    /**
     * Open the 'new node and connect to existing node' dialog, also close all open menus and save the tapped position and tapped node
     */
    openNewNodeToConnectDialog: (element: any) => void;
    /**
     * Close the 'search node and connect to existing node' dialog
     */
    closeSearchNodeToConnectDialog: () => void;
    /**
     * Open the 'search node and connect to existing node' dialog, also close all open menus
     */
    openSearchNodeToConnectDialog: () => void;
    /**
     * Collapse a node from context menu
     */
    fromMenuCollapseNode(): void;
    /**
     * Collapse node
     * @param nodeId - node id
     */
    handleNodeCollapse(nodeId: string): void;
    /**
     * Get number of links with the certain node as target node
     * @param nodeId
     * @return {number}
     */
    getNumberOfTargetLinksForNode(nodeId: string): number;
    /**
     * Get number of links with the certain node either as target node or source node
     * @param nodeId
     * @return {number}
     */
    getNumberOfLinksForNode(nodeId: string): number;
    /**
     * Expand one link
     * @param linkId
     */
    fromMenuExpandLink(linkId: string): void;
    /**
     * Expand all links from the tapped node
     */
    fromMenuExpandAll(): void;
    /**
     * Forward the request to display the node detail of the tapped node
     * Will called either from the menu or the graph
     */
    nodeDetailRequested: () => void;
    /** Display the core context menu on a certain position */
    showCoreContextMenu(position: GraphPosition): void;
    /** Display the node context menu over a certain node */
    showNodeContextMenu(node: GraphNodeElement): void;
    /**
     * Save the current view and forward to the external package to save
     * This has to trigger a reload of this component
     */
    saveView: () => void;
    /** Show core context menu and hide the node context menu*/
    showCoreMenu: () => void;
    /** Hide core context menu */
    hideCoreMenu: () => void;
    /** Show node context menu and hide the core context menu*/
    showNodeMenu: () => void;
    /** Show node context menu */
    hideNodeMenu: () => void;
    /**
     * Save the type of the new node and open the 'new node' dialog
     * @param type
     */
    fromMenuNewNodeDialog: (type: GraphNodeType) => void;
    /**
     * Save the type of the new node and open the 'new node and oonnect to exsting node' dialog
     * @param type
     */
    fromMenuNewNodeToConnect: (type: GraphNodeType) => void;
    /**
     * If a link is selected add the custom class to the link and open the collapse toolbar
     * @param e
     */
    fromGraphLinkSelected: (e: any) => void;
    /**
     * Collapse all
     */
    fromToolbarCollapseSelectedLinks: () => void;
    /**
     * Collapse all children
     */
    fromMenuCollapseAll: () => void;
    /** Hide link labels */
    hideLinkLabels: () => void;
    /** Hide show labels */
    showLinkLabels: () => void;
    /**
     * Process all nodes to forward it to the graph => just send visible ones
     * @return {GraphNodeElement[]}
     */
    processNodesForGraph: () => GraphNodeElement[];
    /**
     * Process all links to forward it to the graph => just send visible ones and may add labels
     * @return {GraphLinkElement[]}
     */
    processLinksForGraph: () => GraphLinkElement[];
    /**
     * Process nodes for context menus => add all titles to them
     * @return {GraphNodeData[]}
     */
    processNodesForContextMenu: () => GraphNodeData[];
    /**
     * Process links for the node context menu => add all label to them
     * @return {GraphLinkData[]}
     */
    processLinksForNodeContextMenu: () => GraphLinkData[];
    render(): JSX.Element;
}
