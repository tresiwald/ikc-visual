/// <reference types="react" />
import * as React from "react";
import { GraphLinkData } from "../../model/GraphLinkData";
import { GraphPosition } from "../../model/GraphPosition";
import { GraphNodeType } from "../../model/GraphNodeType";
import { SearchFieldFactory } from "../../interfaces/SearchFieldFactory";
import { GraphNodeData } from "../../model/GraphNodeData";
export interface NodeContextMenuProps {
    links: GraphLinkData[];
    nodes: GraphNodeData[];
    focus?: boolean;
    onExpandNode: Function;
    onExpandAll: Function;
    onCollapseAll: Function;
    onNewNodeToConnect: Function;
    onExistingNodeToConnect: Function;
    onEditNode: Function;
    onHideNode: Function;
    requestClose: Function;
    position: GraphPosition;
    graphNodeTypes: GraphNodeType[];
    searchFieldFactory: SearchFieldFactory;
}
export interface NodeContextMenuState {
}
/**
 * React component to render the node-context-menu, it uses the search field provided by the searchFieldFactory
 */
export default class NodeContextMenu extends React.Component<NodeContextMenuProps, NodeContextMenuState> {
    constructor(props: any);
    initState(): void;
    /**
     * Before the component will mount, a event listener will be registered on the 'click' event. If there is a 'click' event
     * outside the context menu, it will disappear
     */
    componentDidMount: () => void;
    checkCloseNeeded: (e: any) => void;
    /**
     * Adjust element after the component did update
     */
    componentDidUpdate: () => void;
    /**
     * Adjust the position of the context menu, that is necessary on small screen to make sure the context menu is fully visible
     */
    adjustElement: () => void;
    /** Map the menu taps with the provided functions */
    handleExpandNode: (resultId: string) => void;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    handleNewNodeToConnect: (type: GraphNodeType) => void;
    handleExistingNodeToConnect: () => void;
    handleEditNode: () => void;
    handleHideNode: () => void;
    onRequestClose: () => void;
    render(): JSX.Element;
}
