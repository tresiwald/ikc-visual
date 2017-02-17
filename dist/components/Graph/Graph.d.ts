/// <reference types="react" />
import * as React from "react";
import { GraphProps, GraphState } from "./GraphInterfaces";
/**
 * This react component wraps the cytoscape object. All events within the cytoscape context are registered at this point.
 */
export default class Graph extends React.Component<GraphProps, GraphState> {
    /** cytoscape object */
    private cy;
    constructor(props: any);
    /**
     * Render the cytoscape object
     */
    renderCytoscapeElement(): void;
    /** Update cytoscape on updates */
    componentDidUpdate(): void;
    /** Update cytoscape on mount*/
    componentDidMount(): void;
    /**
     * Process an external drop on the cytoscape core with e.g. D'n'D a item from a search field
     * @param event
     */
    externalDrop(event: any): void;
    render(): JSX.Element;
}
