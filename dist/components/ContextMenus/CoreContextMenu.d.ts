/// <reference types="react" />
import * as React from "react";
import { GraphPosition } from "../../model/GraphPosition";
import { GraphNodeType } from "../../model/GraphNodeType";
import { GraphNodeData } from "../../model/GraphNodeData";
import { SearchFieldFactory } from "../../interfaces/SearchFieldFactory";
export interface CoreContextMenuProps {
    nodes: GraphNodeData[];
    requestClose: Function;
    position: GraphPosition;
    graphNodeTypes: GraphNodeType[];
    searchFieldFactory: SearchFieldFactory;
    onNewNode: Function;
    onExistingNode: Function;
}
export interface CoreContextMenuState {
    active?: boolean;
}
/**
 * React component to render the core-context-menu, it uses the search field provided by the searchFieldFactory
 */
export default class CoreContextMenu extends React.Component<CoreContextMenuProps, CoreContextMenuState> {
    constructor(props: any);
    initState(): void;
    /**
     * Before the component will mount, a event listener will be registered on the 'click' event. If there is a 'click' event
     * outside the context menu, it will disappear.
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
    onRequestClose: () => void;
    handleNewNode: (type: GraphNodeType) => void;
    handleExistingNode: (nodeId: string) => void;
    render(): JSX.Element;
}
