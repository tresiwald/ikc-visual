import * as React from "react";
import {GraphScreenProps, GraphScreenStats} from "./GraphScreenInterfaces";
import Graph from "../Graph/Graph";
import {GraphElementFactory} from "../../model/GraphElementFactory";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeElement, GraphNodeData} from "../../model/GraphNodeData";
import {GraphLinkElement, GraphLinkData} from "../../model/GraphLinkData";
import {DialogNewNodeState} from "../../interfaces/DialogNewNodeInterfaces";
import {DialogNewNodeToConnectState} from "../../interfaces/DialogNewNodeToConnectInterfaces";
import {DialogNodeSearchToConnectState} from "../../interfaces/DialogNodeSearchToConnectInterfaces";
import {VISIBILITY} from "../../model/VISIBILITY";
import {TimeService} from "../../common/TimeService";
import {FlatButton} from "material-ui";
import {ViewFactory} from "../../model/ViewFactory";
import {GraphNodeType} from "../../model/GraphNodeType";
import CoreContextMenu from "../ContextMenus/CoreContextMenu";
import NodeContextMenu from "../ContextMenus/NodeContextMenu";
import {DOMHelperService} from "../../common/DOMHelperService";
import {DialogNodeSearchState} from "../../interfaces/DialogNodeSearchInterfaces";

/**
 * Wrapper react component for the graph component. This component will be used from any other application which use this package.
 */
export default class GraphScreen extends React.Component<GraphScreenProps, GraphScreenStats> {
    constructor(props: any) {
        super(props);
        this.state = {
            nodes: new Map<string, GraphNodeElement>(),
            links: new Map<string, GraphLinkElement>(),
            showLabels: false
        }
    }

    /**
     * Load the initial state
     */
    initState = () => {

        /** Check if reload is needed */
        if (this.state.timestamp != this.props.timestamp) {
            this.state.timestamp = this.props.timestamp

            /** Fill up the maps */
            let nodes = new Map<string, GraphNodeElement>()
            let links = new Map<string, GraphLinkElement>()

            this.props.viewToLoad.nodes.forEach((node) => {
                nodes.set(node.data.id, node)
            })
            this.props.viewToLoad.links.forEach((link) =>
                links.set(link.data.id, link)
            )

            this.state.nodes = nodes
            this.state.links = links
        }
    }
    /**
     * Save or update a link
     * @param link
     */
    saveLink = (link:GraphLinkElement) => {
        let links = this.state.links
        this.state.links.set(link.data.id, link)
    }

    /**
     * Save or update a node
     * @param node
     */
    saveNode = (node:GraphNodeElement) => {
        let nodes = this.state.nodes
        nodes.set(node.data.id, node)
    }

    /**
     * Return a certain node
     * @param nodeId
     * @return {GraphNodeElement}
     */
    getNode = (nodeId:string) => {
        return this.state.nodes.get(nodeId)
    }

    /**
     * Return a certain link
     * @param linkId
     * @return {GraphLinkElement}
     */
    getLink = (linkId:string) => {
        return this.state.links.get(linkId)
    }

    /**
     * Hides a certain node and save
     * @param nodeId
     */
    hideNode = (node:GraphNodeElement) => {
        node.visibility = VISIBILITY.HIDDEN
        this.saveNode(node)
    }

    /**
     * Hides a certain link and save
     * @param linkId
     */
    hideLink = (link:GraphLinkElement) => {
        link.visibility = VISIBILITY.HIDDEN
        this.saveLink(link)
    }

    /**
     * Shows a certain node and save
     * @param nodeId
     */
    showNode = (node:GraphNodeElement) => {
        node.visibility = VISIBILITY.VISIBLE
        this.saveNode(node)
    }

    /**
     * Shows a certain link and save
     * @param linkId
     */
    showLink = (link:GraphLinkElement) => {
        link.visibility = VISIBILITY.VISIBLE
        this.saveLink(link)
    }

    /**
     * Check if there additional elements to display
     * @param sourceNode
     */
    checkMoreElementsToDisplay = (sourceNode:GraphNodeElement) => {
        let links = this.state.links
        let nodes = this.state.nodes

        links.forEach((link) => {
            /** Make all children visible and their link to the new node */
            if (link.data.source == sourceNode.data.id) {
                this.showLink(link)

                /** Calculate new position for child node and make it visible*/
                let targetNode = this.getNode(link.data.target)
                if (targetNode.position.x == 0 && targetNode.position.y == 0) {
                    targetNode.position = DOMHelperService.calcNodePosition(sourceNode.position)
                }
                this.showNode(targetNode)

                /** Check if there are other hidden links which have to make visible */
                links.forEach((targetLink) => {
                    if (targetLink.data.source == targetNode.data.id && this.getNode(targetLink.data.target).visibility.value == VISIBILITY.VISIBLE.value) {
                        this.showLink(targetLink)
                    }
                    if (targetLink.data.target == targetNode.data.id && this.getNode(targetLink.data.source).visibility.value == VISIBILITY.VISIBLE.value) {
                        this.showLink(targetLink)
                    }
                })
            }

            /** Check if there are other hidden links which have to make visible */
            if (link.data.source == sourceNode.data.id && this.getNode(link.data.target).visibility.value == VISIBILITY.VISIBLE.value) {
                this.showLink(link)
            }
            if (link.data.target == sourceNode.data.id && this.getNode(link.data.source).visibility.value == VISIBILITY.VISIBLE.value) {
                this.showLink(link)
            }
        })
    }

    /**
     * Save the new link from graph component in the model, the view update has to executed from outside this package
     * @param newLink - the new link element to save
     * @param oldSourcePosition - oldposition of the source node
     */
    fromGraphNewLink = (newLink: GraphLinkElement, oldSourcePosition: GraphPosition) => {
        /** Save link */
        this.saveLink(newLink)

        /** Update source node to old position */
        this.fromGraphPositionUpdated(newLink.data.source, oldSourcePosition)

        /** Save the updated view and make sure that external models are notified about the new link */
        this.saveView()
        this.props.operationService.createLink(newLink.data.id, newLink.data.source, newLink.data.target, "")
    }

    /**
     * Save a new node a make sure all his children are visible
     * @param existingNode - node to save or update
     */
    fromGraphExistingNode = (existingNode: GraphNodeElement) => {
        this.saveNode(existingNode)
        this.checkMoreElementsToDisplay(existingNode)
        this.saveView()
    }

    /**
     * Update the position of a node
     * @param nodeId - id of the node
     * @param position - new position
     */
    fromGraphPositionUpdated = (nodeId: string, position: GraphPosition) => {
        let node = this.state.this.getNode(nodeId)
        node.position = position
        this.saveNode(node)
        this.saveView()
    }

    /**
     * Add a new node from the 'new node' dialog and forward the state of the dialog to the external model
     * @param state
     */
    fromDialogNewNode = (state: DialogNewNodeState) => {
        let node = state.node
        this.showNode(node)

        /** Make sure the dialog will close */
        this.state.dialogNewNodeOpen = false

        this.saveView()
        this.props.operationService.createNodeFromDialogState(state)
    }

    /**
     * Add a existing node to the view - created through the core context menu
     * @param nodeId
     */
    fromMenuExistingNode = (nodeId: string) => {
        let nodes = this.state.nodes

        /** Make node visible and update position */
        let node = this.getNode(nodeId)
        node.position = this.state.tappedPosition
        this.showNode(node)

        this.checkMoreElementsToDisplay(node)

        /** Make sure the menu will close */
        this.state.coreContextMenuOpen = false
        this.saveView()
    }

    /**
     * Add a new node from the dialog and connect it to a node
     * @param state - dialog state
     */
    fromDialogNewNodeToConnect = (state: DialogNewNodeToConnectState) => {
        /** Save new node and link */
        let node = GraphElementFactory.getGraphElementAsNode(state.link.data.target, new GraphPosition(this.state.tappedPosition.x + 10, this.state.tappedPosition.y + 10), VISIBILITY.VISIBLE)
        this.saveNode(node)

        let link = state.link
        this.saveLink(link)

        /** Make sure the dialog will close */
        this.state.dialogNewNodeToConnectOpen = false

        this.saveView()

        /** Update the external model */
        this.props.operationService.createNodeWithLinkFromDialogState(state)
    }

    /**
     * Add a existing node from a dialog and connect it to a node
     * @param state - dialog state
     */
    fromDialogExistingNodeToConnect = (state: DialogNodeSearchToConnectState) => {
        /** Save new node and link */
        let node = GraphElementFactory.getNode(
            this.state.this.getNode(state.link.target).data, new GraphPosition(this.state.tappedPosition.x + 40, this.state.tappedPosition.y + 40), VISIBILITY.VISIBLE)
        this.saveNode(node)

        let link = GraphElementFactory.getGraphElementAsLink(
            this.props.identityService.createNewLinkId(), this.state.tappedNode.id, state.link.target, VISIBILITY.VISIBLE)
        this.saveLink(link)

        /** Make sure the dialog will close */
        this.state.dialogSearchNodeToConnectOpen = false

        this.saveView()
        /** Update the external model */
        this.props.operationService.createLink(state.link.id, this.state.tappedNode.id, state.link.target, state.nodeName)
    }

    /**
     * Hide node command from menu
     */
    fromMenuHideNode = () => {
        this.hideNodeAndHisLinks(this.state.tappedNode.id)
    }

    /**
     * Hide specific node
     * @param id
     */
    hideNodeAndHisLinks = (id: string) => {
        let nodes = this.state.nodes
        let links = this.state.links

        /** Hide node */
        let node = this.getNode(id)
        this.hideNode(node)

        /** Hide links */
        links.forEach((link) => {
            if (link.data.source == id || link.data.target == id) {
                this.hideLink(link)
            }
        })

        this.saveView()
    }

    /**
     * Close the 'new node' dialog
     */
    closeNewNodeDialog = () => {
        this.setState({
            dialogNewNodeOpen: false
        })
    }

    /**
     * Open the 'new node' dialog, also close all open menus and save the tapped position
     */
    openNewNodeDialog = (element: any) => {
        this.setState({
            dialogNewNodeOpen: true,
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            tappedPosition: element.position
        })
    }

    /**
     * Close the 'new node and connect to existing node' dialog
     */
    closeNewNodeToConnectDialog = () => {
        this.setState({
            dialogNewNodeToConnectOpen: false
        })
    }

    /**
     * Open the 'new node and connect to existing node' dialog, also close all open menus and save the tapped position and tapped node
     */
    openNewNodeToConnectDialog = (element: any) => {
        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            dialogNewNodeToConnectOpen: true,
            tappedPosition: element.position(),
            tappedNode: element.data()
        })
    }

    /**
     * Close the 'search node and connect to existing node' dialog
     */
    closeSearchNodeToConnectDialog = () => {
        this.setState({
            dialogSearchNodeToConnectOpen: false
        })
    }

    /**
     * Open the 'search node and connect to existing node' dialog, also close all open menus
     */
    openSearchNodeToConnectDialog = () => {
        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            dialogSearchNodeToConnectOpen: true
        })
    }

    /**
     * Collapse a node from context menu
     */
    fromMenuCollapseNode() {
        /** Make sure menu closes */
        this.hideNodeMenu()
        this.handleNodeCollapse(this.state.tappedNode.id)
    }

    /**
     * Collapse node
     * @param nodeId - node id
     */
    handleNodeCollapse(nodeId: string) {
        let links = this.state.links
        let nodes = this.state.nodes

        /** Hide node */
        let node = this.getNode(nodeId)
        this.hideNode(node)

        /** Hide links */
        links.forEach((link) => {
            if (link.data.source == nodeId) {
                this.hideLink(link)
            } else if (link.data.target == nodeId) {
                this.hideLink(link)
            }
        })

        this.saveView()
    }

    /**
     * Get number of links with the certain node as target node
     * @param nodeId
     * @return {number}
     */
    getNumberOfTargetLinksForNode(nodeId: string): number {
        var counter = 0
        this.state.links.forEach((link) => {
            if (link.data.target == nodeId && link.visibility.value == VISIBILITY.VISIBLE.value) {
                counter = counter + 1
            }
        })
        return counter
    }

    /**
     * Get number of links with the certain node either as target node or source node
     * @param nodeId
     * @return {number}
     */
    getNumberOfLinksForNode(nodeId: string): number {
        var counter = 0
        this.state.links.forEach((link) => {
            if (link.data.target == nodeId && link.visibility.value == VISIBILITY.VISIBLE.value) {
                counter = counter + 1
            }
            if (link.data.source == nodeId && link.visibility.value == VISIBILITY.VISIBLE.value) {
                counter = counter + 1
            }
        })
        return counter
    }

    /**
     * Expand one link
     * @param linkId
     */
    fromMenuExpandLink(linkId: string) {
        let links = this.state.links
        let nodes = this.state.nodes

        /** Make link visible */
        let linkToExpand = this.getLink(linkId)
        this.showLink(linkToExpand)

        /** Make node visible */
        let targetNode = this.getNode(linkToExpand.data.target)
        if (targetNode.position.x == 0 && targetNode.position.y == 0) {
            targetNode.position = DOMHelperService.calcNodePosition(this.state.tappedPosition)
        }
        this.showNode(targetNode)
        
        this.saveView()
    }

    /**
     * Expand all links from the tapped node
     */
    fromMenuExpandAll() {
        let links = this.state.links
        let nodes = this.state.nodes
        let nodeId = this.state.tappedNode.id

        links.forEach((link) => {
            /** Make all links and nodes visible with the tapped node as source*/
            if (link.data.source == nodeId && link.visibility == VISIBILITY.HIDDEN) {
                this.showLink(link)
                

                let node = this.getNode(link.data.target)
                if (node.position.x == 0 && node.position.y == 0) {
                    node.position = DOMHelperService.calcNodePosition(this.state.tappedPosition)
                }
                this.showNode(node)
            }
        })

        /** Make sure all menus close */
        this.state.nodeContextMenuOpen = false
        this.state.coreContextMenuOpen = false
        this.saveView()
    }

    /**
     * Forward the request to display the node detail of the tapped node
     * Will called either from the menu or the graph
     */
    nodeDetailRequested = () => {
        this.hideNodeMenu()
        this.props.onNodeDetailRequest(this.state.tappedNode.id)
    }

    /** Display the core context menu on a certain position */
    showCoreContextMenu(position: GraphPosition) {
        this.state.tappedPosition = position
        this.showCoreMenu()
    }

    /** Display the node context menu over a certain node */
    showNodeContextMenu(node: GraphNodeElement) {

        /** Save node information for further menu operations*/
        this.state.tappedNode = node.data
        this.state.tappedPosition = node.position

        this.showNodeMenu();
    }

    /**
     * Save the current view and forward to the external package to save
     * This has to trigger a reload of this component
     */
    saveView = () => {
        let view = ViewFactory.viewFromMaps(this.state.nodes, this.state.links, this.props.viewToLoad.title)
        view.id = this.props.viewToLoad.id

        this.props.operationService.saveView(view)
    }


    /** Show core context menu and hide the node context menu*/
    showCoreMenu = () => {
        this.setState({
            coreContextMenuOpen: true,
            nodeContextMenuOpen: false
        })
    }

    /** Hide core context menu */
    hideCoreMenu = () => {
        this.setState({
            coreContextMenuOpen: false
        })
    }

    /** Show node context menu and hide the core context menu*/
    showNodeMenu = () => {
        this.setState({
            nodeContextMenuOpen: true,
            coreContextMenuOpen: false
        })
    }

    /** Show node context menu */
    hideNodeMenu = () => {
        this.setState({
            nodeContextMenuOpen: false
        })
    }

    /**
     * Save the type of the new node and open the 'new node' dialog
     * @param type
     */
    fromMenuNewNodeDialog = (type: GraphNodeType) => {
        this.hideCoreMenu()
        this.setState({
            newNodeType: type,
            dialogNewNodeOpen: true
        })
    }

    /**
     * Save the type of the new node and open the 'new node and oonnect to exsting node' dialog
     * @param type
     */
    fromMenuNewNodeToConnect = (type: GraphNodeType) => {
        this.hideNodeMenu()
        this.setState({
            newNodeType: type,
            dialogNewNodeToConnectOpen: true
        })
    }

    /**
     * If a link is selected add the custom class to the link and open the collapse toolbar
     * @param e
     */
    fromGraphLinkSelected = (e: any) => {
        let links = this.state.links
        let link = this.getLink(e.data().id)

        link.linkClasses.push('selected')
        this.saveLink(link)

        this.setState({
            collapseToolbarNeeded: true
        })
    }


    fromToolbarCollapseSelectedLinks = () => {
        let links = this.state.links
        let nodes = this.state.nodes

        /** Hide the links and remove the custom class */
        links.forEach((link) => {
            let indexOfClass = link.linkClasses.indexOf('selected')
            if (indexOfClass >= 0) {
                link.linkClasses.splice(indexOfClass, 1)
                this.hideLink(link)

                if (this.getNumberOfLinksForNode(link.data.target) == 0) {
                    let targetNode = this.getNode(link.data.target)
                    this.hideNode(targetNode)
                }
            }

        })
        /** Make sure the collapse toolbar will hide */
        this.state.collapseToolbarNeeded = false
        this.saveView()
    }


    fromMenuCollapseAll = () => {
        let links = this.state.links
        let nodes = this.state.nodes

        /** Hide all links with the tapped Node as source */
        links.forEach((link) => {
            if (link.visibility == VISIBILITY.VISIBLE && link.data.source == this.state.tappedNode.id) {
                this.hideLink(link)
                link.visibility = VISIBILITY.HIDDEN

                if (this.getNumberOfLinksForNode(link.data.target) == 0) {
                    let targetNode = this.getNode(link.data.target)
                    this.hideNode(targetNode)
                }
            }
        })

        /** Make sure all menus will close */
        this.state.nodeContextMenuOpen = false
        this.state.coreContextMenuOpen = false
        this.saveView()
    }

    /** Hide link labels */
    hideLinkLabels = () => {
        this.setState({
            showLabels: false
        })
    }

    /** Hide show labels */
    showLinkLabels = () => {
        this.setState({
            showLabels: true
        })
    }

    /**
     * Process all nodes to forward it to the graph => just send visible ones
     * @return {GraphNodeElement[]}
     */
    processNodesForGraph = () => {
        let nodes: GraphNodeElement[] = []
        this.state.nodes.forEach((node) => {
            if (node.visibility.value == VISIBILITY.VISIBLE.value) {
                node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id)
                nodes.push(node)
            }
        })
        return nodes
    }

    /**
     * Process all links to forward it to the graph => just send visible ones and may add labels
     * @return {GraphLinkElement[]}
     */
    processLinksForGraph = () => {
        let links: GraphLinkElement[] = []

        if (this.state.showLabels) {
            this.state.links.forEach((link) => {
                if (link.visibility.value == VISIBILITY.VISIBLE.value) {
                    link.data.label = this.props.nodeInformationProvider.getLinkLabel(link.data.source, link.data.id)
                    links.push(link)
                }
            })
        } else {
            this.state.links.forEach((link) => {
                if (link.visibility.value == VISIBILITY.VISIBLE.value) {
                    link.data.label = ""
                    links.push(link)
                }
            })
        }
        return links
    }

    /**
     * Process nodes for context menus => add all titles to them
     * @return {GraphNodeData[]}
     */
    processNodesForContextMenu = () => {
        let nodes: GraphNodeData[] = []

        this.state.nodes.forEach((node) => {
            node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id)
            nodes.push(node.data)
        })

        return nodes
    }

    /**
     * Process links for the node context menu => add all label to them
     * @return {GraphLinkData[]}
     */
    processLinksForNodeContextMenu = () => {
        let links: GraphLinkData[] = []

        this.state.links.forEach((link) => {
            if (link.data.source == this.state.tappedNode.id && link.visibility.value == VISIBILITY.HIDDEN.value) {
                link.data.label = this.props.nodeInformationProvider.getLinkLabel(link.data.source, link.data.id)
                links.push(link.data)
            }
        })

        return links
    }

    render() {
        this.initState()

        let nodes: GraphNodeElement[] = this.processNodesForGraph()
        let links: GraphLinkElement[] = this.processLinksForGraph()

        return (
            <div>
                <div>
                    <Graph
                        nodes={nodes}
                        links={links}
                        onNewNode={this.fromGraphExistingNode.bind(this)}
                        onNewLink={this.fromGraphNewLink.bind(this)}
                        onNodePositionUpdate={this.fromGraphPositionUpdated.bind(this)}
                        onCoreContextMenuRequested={this.showCoreContextMenu.bind(this)}
                        onNodeContextMenuRequested={this.showNodeContextMenu.bind(this)}
                        onLinkSelected={this.fromGraphLinkSelected.bind(this)}
                        onNodeDetailRequest={(node:GraphNodeData)=>{
                                        this.state.tappedNode = node
                                        this.nodeDetailRequested()
                                    }}
                        identityService={this.props.identityService}
                    />
                </div>


                {(() => {
                    /** Render core context menu if needed */
                    if (this.state.coreContextMenuOpen) {
                        let nodes: GraphNodeData[] = this.processNodesForContextMenu()

                        return (
                            <CoreContextMenu
                                nodes={nodes}
                                position={this.state.tappedPosition}
                                graphNodeTypes={this.props.nodeTypes}
                                requestClose={this.hideCoreMenu.bind(this)}
                                searchFieldFactory={this.props.searchFieldFactory}
                                onNewNode={this.fromMenuNewNodeDialog.bind(this)}
                                onExistingNode={this.fromMenuExistingNode.bind(this)}
                            />
                        )
                    }
                })()}

                {(() => {
                    /** Render node context menu if needed */
                    if (this.state.nodeContextMenuOpen) {
                        let nodes: GraphNodeData[] = this.processNodesForContextMenu()
                        let links: GraphLinkData[] = this.processLinksForNodeContextMenu()

                        return (
                            <NodeContextMenu
                                nodes={nodes}
                                links={links}
                                position={this.state.tappedPosition}
                                graphNodeTypes={this.props.nodeTypes}
                                requestClose={this.hideNodeMenu.bind(this)}
                                onEditNode={this.nodeDetailRequested.bind(this)}
                                onHideNode={this.fromMenuCollapseNode.bind(this)}
                                onExpandAll={this.fromMenuExpandAll.bind(this)}
                                onExpandNode={this.fromMenuExpandLink.bind(this)}
                                onCollapseAll={this.fromMenuCollapseAll.bind(this)}
                                onNewNodeToConnect={this.fromMenuNewNodeToConnect.bind(this)}
                                onExistingNodeToConnect={this.openSearchNodeToConnectDialog.bind(this)}
                                searchFieldFactory={this.props.searchFieldFactory}
                            />
                        )
                    }
                })()}

                {(() => {
                    /** Render 'new node' dialog if needed */
                    if (this.state.dialogNewNodeOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeNewNode(
                                this.state.dialogNewNodeOpen,
                                this.fromDialogNewNode.bind(this),
                                this.closeNewNodeDialog.bind(this),
                                GraphElementFactory.getGraphElementAsNode(this.props.identityService.createNewNodeId(), this.state.tappedPosition, VISIBILITY.VISIBLE),
                                this.state.newNodeType
                            )
                        )
                    }
                    /** Render 'new node and connect to existing node' dialog if needed */
                    if (this.state.dialogNewNodeToConnectOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeNewNodeToConnect(
                                this.state.dialogNewNodeToConnectOpen,
                                this.fromDialogNewNodeToConnect.bind(this),
                                this.closeNewNodeToConnectDialog.bind(this),
                                GraphElementFactory.getGraphElementAsLink(this.props.identityService.createNewLinkId(), this.state.tappedNode.id, this.props.identityService.createNewNodeId(), VISIBILITY.VISIBLE),
                                this.state.newNodeType
                            )
                        )
                    }
                    /** Render 'search node and connect to existing node' dialog if needed */
                    if (this.state.dialogSearchNodeToConnectOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeSearchToConnect(
                                this.state.dialogSearchNodeToConnectOpen, this.fromDialogExistingNodeToConnect.bind(this), this.closeSearchNodeToConnectDialog.bind(this)
                            )
                        )
                    }
                })()}

                <div id="toolbar">
                    {(() => {
                        /** Render collapse toolbar if needed */
                        if (this.state.collapseToolbarNeeded) {
                            return (
                                <FlatButton
                                    label='COLLAPSE'
                                    onTouchTap={this.fromToolbarCollapseSelectedLinks.bind(this)}
                                />
                            )
                        }
                    })()}
                    {(() => {
                        /** Update toolbar */
                        if (this.state.showLabels) {
                            return (
                                <FlatButton
                                    label='HIDE LINK LABELS'
                                    onTouchTap={this.hideLinkLabels.bind(this)}
                                />
                            )
                        } else {
                            return (
                                <FlatButton
                                    label='SHOW LINK LABELS'
                                    onTouchTap={this.showLinkLabels.bind(this)}
                                />
                            )
                        }
                    })()}
                </div>

            </div>
        )
    }

}