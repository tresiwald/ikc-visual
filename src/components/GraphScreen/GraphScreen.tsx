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

export default class GraphScreen extends React.Component<GraphScreenProps, GraphScreenStats> {
    constructor(props: any) {
        super(props);
        this.state = {
            nodes: new Map<string, GraphNodeElement>(),
            links: new Map<string, GraphLinkElement>(),
            showLabels: false
        }
        document.addEventListener('click', this.handleCheckClickForContextMenus.bind(this))
        document.addEventListener('touchstart', this.handleCheckClickForContextMenus.bind(this))
    }

    handleCheckClickForContextMenus(e: any) {
        var elementMouseIsOver = null
        if (e.type == 'click') {
            elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
        } else {
            elementMouseIsOver = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        }
        if (DOMHelperService.isDescendant(document.getElementById('coreContextMenu'), elementMouseIsOver)) {
            console.log(elementMouseIsOver)
        } else {
            if (this.state.coreContextMenuOpen) {
                this.hideCoreMenu()
            }
        }
        if (DOMHelperService.isDescendant(document.getElementById('nodeContextMenu'), elementMouseIsOver)) {
            console.log(elementMouseIsOver)
        } else {
            if (this.state.nodeContextMenuOpen) {
                this.hideNodeMenu()
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleCheckClickForContextMenus.bind(this))
        document.removeEventListener('touchstart', this.handleCheckClickForContextMenus.bind(this))
    }

    initState = () => {
        if (this.state.timestamp != this.props.timestamp) {
            this.state.timestamp = this.props.timestamp

            let nodes = new Map<string, GraphNodeElement>()
            let links = new Map<string, GraphLinkElement>()

            this.props.viewToLoad.nodes.forEach((node) => {
                nodes.set(node.data.id, node)
            })
            this.props.viewToLoad.links.forEach((link) => links.set(link.data.id, link))

            this.state.nodes = nodes
            this.state.links = links
        }
    }

    onLinkCreated = (newLink: GraphLinkElement, oldSourcePosition: GraphPosition) => {
        let links = this.state.links
        links.set(newLink.data.id, newLink)

        this.onNodePositionUpdated(newLink.data.source, oldSourcePosition)

        this.state.links = links
        this.saveView()
        this.props.operationService.createLink(newLink.data.id, newLink.data.source, newLink.data.target, "")

        this.forceUpdate()
    }

    onNodeCreated = (newNode: GraphNodeElement) => {
        let nodes = this.state.nodes
        newNode.visibility = VISIBILITY.VISIBLE
        nodes.set(newNode.data.id, newNode)

        let links = this.state.links
        links.forEach((link) => {
            if (link.data.source == newNode.data.id) {
                link.visibility = VISIBILITY.VISIBLE

                let targetNode = nodes.get(link.data.target)
                if (targetNode.position.x == 0 && targetNode.position.y == 0) {
                    targetNode.position = DOMHelperService.calcNodePosition(newNode.position)
                }
                targetNode.visibility = VISIBILITY.VISIBLE
                nodes.set(targetNode.data.id, targetNode)

                links.forEach((targetLink) => {
                    if (targetLink.data.source == targetNode.data.id && nodes.get(targetLink.data.target).visibility.value == VISIBILITY.VISIBLE.value) {
                        targetLink.visibility = VISIBILITY.VISIBLE
                    }
                    if (targetLink.data.target == targetNode.data.id && nodes.get(targetLink.data.source).visibility.value == VISIBILITY.VISIBLE.value) {
                        targetLink.visibility = VISIBILITY.VISIBLE
                    }
                })
            }

            if (link.data.source == newNode.data.id && nodes.get(link.data.target).visibility.value == VISIBILITY.VISIBLE.value) {
                link.visibility = VISIBILITY.VISIBLE
            }
            if (link.data.target == newNode.data.id && nodes.get(link.data.source).visibility.value == VISIBILITY.VISIBLE.value) {
                link.visibility = VISIBILITY.VISIBLE
            }
        })

        this.state.nodes = nodes
        this.state.links = links
        this.saveView()
    }

    onNodePositionUpdated = (nodeId: string, position: GraphPosition) => {
        let nodes = this.state.nodes
        let node = nodes.get(nodeId)

        node.position = position
        nodes.set(nodeId, node)

        this.state.nodes = nodes
        this.saveView()
    }

    handleAddNewNode = (state: DialogNewNodeState) => {
        let nodes = this.state.nodes
        let node = state.node
        node.visibility = VISIBILITY.VISIBLE
        nodes.set(node.data.id, node)


        this.state.nodes = nodes
        this.state.dialogNewNodeOpen = false

        this.saveView()
        this.props.operationService.createNodeFromDialogState(state)
        this.forceUpdate()
    }

    handleAddExistingNode = (state: DialogNewNodeState) => {
        let nodes = this.state.nodes
        let links = this.state.links

        let node = state.node
        node.visibility = VISIBILITY.VISIBLE
        nodes.set(node.data.id, node)

        links.forEach((link) => {
            if (link.data.source == state.node.data.id) {
                link.visibility = VISIBILITY.VISIBLE

                let targetNode = nodes.get(link.data.target)
                targetNode.visibility = VISIBILITY.VISIBLE
                nodes.set(targetNode.data.id, targetNode)

                links.forEach((targetLink) => {
                    if (targetLink.data.source == targetNode.data.id && nodes.get(targetLink.data.target).visibility.value == VISIBILITY.VISIBLE.value) {
                        targetLink.visibility = VISIBILITY.VISIBLE
                    }
                    if (targetLink.data.target == targetNode.data.id && nodes.get(targetLink.data.source).visibility.value == VISIBILITY.VISIBLE.value) {
                        targetLink.visibility = VISIBILITY.VISIBLE
                    }
                })
            }
            if (link.data.source == node.data.id && nodes.get(link.data.target).visibility.value == VISIBILITY.VISIBLE.value) {
                link.visibility = VISIBILITY.VISIBLE
            }
            if (link.data.target == node.data.id && nodes.get(link.data.source).visibility.value == VISIBILITY.VISIBLE.value) {
                link.visibility = VISIBILITY.VISIBLE
            }
        })

        this.state.nodes = nodes
        this.state.links = links
        this.state.dialogSearchNodeOpen = false
        this.saveView()
    }

    handleAddExistingNodeFromMenu = (nodeId: string) => {
        let nodes = this.state.nodes
        let links = this.state.links

        let node = nodes.get(nodeId)
        node.visibility = VISIBILITY.VISIBLE
        node.position = this.state.tappedPosition
        nodes.set(node.data.id, node)

        links.forEach((link) => {
            if (link.data.source == node.data.id) {
                link.visibility = VISIBILITY.VISIBLE

                let targetNode = nodes.get(link.data.target)
                targetNode.visibility = VISIBILITY.VISIBLE

                if (targetNode.position.x == 0 && targetNode.position.y == 0) {
                    targetNode.position = DOMHelperService.calcNodePosition(node.position)
                }

                nodes.set(targetNode.data.id, targetNode)

                links.forEach((targetLink) => {
                    if (targetLink.data.source == targetNode.data.id && nodes.get(targetLink.data.target).visibility.value == VISIBILITY.VISIBLE.value) {
                        targetLink.visibility = VISIBILITY.VISIBLE
                    }
                    if (targetLink.data.target == targetNode.data.id && nodes.get(targetLink.data.source).visibility.value == VISIBILITY.VISIBLE.value) {
                        targetLink.visibility = VISIBILITY.VISIBLE
                    }
                })
            }
            if (link.data.source == node.data.id && nodes.get(link.data.target).visibility.value == VISIBILITY.VISIBLE.value) {
                link.visibility = VISIBILITY.VISIBLE
            }
            if (link.data.target == node.data.id && nodes.get(link.data.source).visibility.value == VISIBILITY.VISIBLE.value) {
                link.visibility = VISIBILITY.VISIBLE
            }
        })

        this.state.nodes = nodes
        this.state.links = links
        this.state.coreContextMenuOpen = false
        this.saveView()
    }


    handleAddNewNodeWithLink = (state: DialogNewNodeToConnectState) => {
        let nodes = this.state.nodes
        let node = GraphElementFactory.getGraphElementAsNode(state.link.data.target, new GraphPosition(this.state.tappedPosition.x + 10, this.state.tappedPosition.y + 10), VISIBILITY.VISIBLE)
        nodes.set(node.data.id, node)

        let links = this.state.links
        let link = state.link
        links.set(link.data.id, link)


        this.state.nodes = nodes
        this.state.links = links
        this.state.dialogNewNodeToConnectOpen = false

        this.saveView()

        this.props.operationService.createNodeWithLinkFromDialogState(state)

        this.forceUpdate()
    }

    handleAddExistingNodeWithLink = (state: DialogNodeSearchToConnectState) => {
        let nodes = this.state.nodes
        let node = GraphElementFactory.getNode(
            nodes.get(state.link.target).data, new GraphPosition(this.state.tappedPosition.x + 40, this.state.tappedPosition.y + 40), VISIBILITY.VISIBLE)

        nodes.set(node.data.id, node)

        let links = this.state.links
        let link = GraphElementFactory.getGraphElementAsLink(
            this.props.identityService.createNewLinkId(), this.state.tappedNode.id, state.link.target, VISIBILITY.VISIBLE)

        links.set(link.data.id, link)

        this.state.nodes = nodes
        this.state.links = links
        this.state.dialogSearchNodeToConnectOpen = false

        this.saveView()
        this.props.operationService.createLink(state.link.id, this.state.tappedNode.id, state.link.target, state.nodeName)

        this.forceUpdate()
    }

    /*handleDeleteNodeMobile = (element: any) => {
     this.handleDeleteNode(element.data().id)
     }*/

    handleDeleteNodeFromMenu = () => {
        this.handleDeleteNode(this.state.tappedNode.id)
    }

    handleDeleteNode = (id: string) => {
        let nodes = this.state.nodes
        let links = this.state.links

        let node = nodes.get(id)
        node.visibility = VISIBILITY.HIDDEN

        nodes.set(node.data.id, node)

        links.forEach((link) => {
            if (link.data.source == id || link.data.target == id) {
                link.visibility = VISIBILITY.HIDDEN
            }
        })

        this.state.nodes = nodes
        this.state.links = links
        this.saveView()
    }

    /*handleOpenDialogEditNode = (element: any) => {
     console.log(element)
     this.props.onNodeDetailRequest(element.id())
     /*this.setState({
     dialogEditNodeOpen: true,
     nodeToEdit: element.data()
     })
     }*/

    handleCloseDialogNewNode = () => {
        this.setState({
            dialogNewNodeOpen: false
        })
    }

    handleOpenDialogNewNode = (element: any) => {
        this.setState({
            dialogNewNodeOpen: true,
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            tappedPosition: element.position
        })
    }

    handleCloseDialogSearchNode = () => {
        this.setState({
            dialogSearchNodeOpen: false
        }, () => {
            this.saveView()
        })
    }

    /*handleOpenDialogSearchNode = (element: any) => {
     this.setState({
     dialogSearchNodeOpen: true,
     nodeContextMenuOpen: false,
     coreContextMenuOpen: false,
     tappedPosition: element.position
     })
     }*/

    handleOpenDialogSearchNode = () => {
        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            dialogSearchNodeOpen: true
        })
    }


    handleCloseDialogNewNodeToConnect = () => {
        this.setState({
            dialogNewNodeToConnectOpen: false
        })
    }

    handleOpenDialogNewNodeToConnect = (element: any) => {
        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            dialogNewNodeToConnectOpen: true,
            tappedPosition: element.position(),
            tappedNode: element.data()
        })
    }

    handleCloseDialogSearchNodeToConnect = () => {
        this.setState({
            dialogSearchNodeToConnectOpen: false
        })
    }

    /*handleOpenDialogSearchNodeToConnect = (element: any) => {
     this.setState({
     nodeContextMenuOpen: false,
     coreContextMenuOpen: false,
     dialogSearchNodeToConnectOpen: true,
     tappedPosition: element.position(),
     tappedNode: element.data()
     })
     }*/

    handleOpenDialogSearchNodeToConnect = () => {
        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            dialogSearchNodeToConnectOpen: true
        })
    }

    /*handleLinksCollapse(elements: GraphLinkData[]) {
     let links = this.state.links
     let nodes = this.state.nodes

     elements.forEach((element) => {
     let link = links.get(element.id)
     link.visibility = VISIBILITY.HIDDEN
     links.set(link.data.id, link)


     //console.log(this.getNumberOfTargetLinksForNode(element.target))
     if (this.getNumberOfLinksForNode(element.target) == 0) {
     let node = nodes.get(element.target)
     node.visibility = VISIBILITY.HIDDEN
     }
     })

     this.state.nodes = nodes
     this.state.links = links
     this.state.nodeContextMenuOpen = false
     this.state.coreContextMenuOpen = false
     this.saveView()
     }*/


    handleNodeCollapseFromMenu() {
        this.hideNodeMenu()
        this.handleNodeCollapse(this.state.tappedNode.id)
    }

    handleNodeCollapse(nodeId: string) {
        let links = this.state.links
        let nodes = this.state.nodes

        let node = nodes.get(nodeId)
        node.visibility = VISIBILITY.HIDDEN
        nodes.set(nodeId, node)

        links.forEach((link) => {
            if (link.data.source == nodeId) {
                link.visibility = VISIBILITY.HIDDEN
            } else if (link.data.target == nodeId) {
                link.visibility = VISIBILITY.HIDDEN

            }
        })

        this.state.nodes = nodes
        this.state.links = links
        this.saveView()
    }

    getNumberOfTargetLinksForNode(nodeId: string): number {
        var counter = 0
        this.state.links.forEach((link) => {
            if (link.data.target == nodeId && link.visibility.value == VISIBILITY.VISIBLE.value) {
                counter = counter + 1
            }
        })
        return counter
    }

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

    handleExpandLinkFromMenu(linkId: string) {
        let links = this.state.links
        let nodes = this.state.nodes

        let linkToExpand = links.get(linkId)
        linkToExpand.visibility = VISIBILITY.VISIBLE
        links.set(linkToExpand.data.id, linkToExpand)

        let targetNode = nodes.get(linkToExpand.data.target)
        if (targetNode.position.x == 0 && targetNode.position.y == 0) {
            targetNode.position = DOMHelperService.calcNodePosition(this.state.tappedPosition)
        }
        targetNode.visibility = VISIBILITY.VISIBLE
        nodes.set(targetNode.data.id, targetNode)


        this.setState({
            nodes: nodes,
            links: links
        }, () => {
            this.saveView()
        })

    }

    handleExpandAllFromMenu() {
        let links = this.state.links
        let nodes = this.state.nodes
        let nodeId = this.state.tappedNode.id

        links.forEach((link) => {
            if (link.data.source == nodeId && link.visibility == VISIBILITY.HIDDEN) {
                link.visibility = VISIBILITY.VISIBLE

                let node = nodes.get(link.data.target)
                node.visibility = VISIBILITY.VISIBLE
                if (node.position.x == 0 && node.position.y == 0) {
                    node.position = DOMHelperService.calcNodePosition(this.state.tappedPosition)
                }
                nodes.set(node.data.id, node)
            }
        })

        this.state.nodes = nodes
        this.state.links = links
        this.state.nodeContextMenuOpen = false
        this.state.coreContextMenuOpen = false
        this.saveView()
    }

    handleNodeDetailRequested = () => {
        this.hideNodeMenu()
        this.props.onNodeDetailRequest(this.state.tappedNode.id)
    }


    showCoreContextMenu(position: GraphPosition) {
        this.state.tappedPosition = position

        this.showCoreMenu()
    }

    showNodeContextMenu(node: GraphNodeElement) {
        this.state.tappedNode = node.data
        this.state.tappedPosition = node.position

        this.showNodeMenu();
    }

    saveView = () => {
        let view = ViewFactory.viewFromMaps(this.state.nodes, this.state.links, this.props.viewToLoad.title)
        view.id = this.props.viewToLoad.id

        this.props.operationService.saveView(view)
    }


    showCoreMenu = () => {
        this.setState({
            coreContextMenuOpen: true,
            nodeContextMenuOpen: false
        })
    }
    hideCoreMenu = () => {
        this.setState({
            coreContextMenuOpen: false
        })
    }
    showNodeMenu = () => {
        this.setState({
            nodeContextMenuOpen: true,
            coreContextMenuOpen: false
        })
    }
    hideNodeMenu = () => {
        this.setState({
            nodeContextMenuOpen: false
        })
    }

    handleNewNodeFromMenu = (type: GraphNodeType) => {
        this.hideCoreMenu()
        this.setState({
            newNodeType: type,
            dialogNewNodeOpen: true
        })
    }

    handleNewNodeToConnectFromMenu = (type: GraphNodeType) => {
        this.hideNodeMenu()
        this.setState({
            newNodeType: type,
            dialogNewNodeToConnectOpen: true
        })
    }

    onLinkSelected = (e: any) => {
        let links = this.state.links
        let link = links.get(e.data().id)
        link.linkClasses.push('selected')
        links.set(link.data.id, link)

        this.saveView()

        this.setState({
            links: links,
            collapseToolbarNeeded: true
        })
    }

    handleClickOnCollapse = () => {
        let links = this.state.links
        let nodes = this.state.nodes

        links.forEach((link) => {
            let indexOfClass = link.linkClasses.indexOf('selected')
            if (indexOfClass >= 0) {
                link.visibility = VISIBILITY.HIDDEN
                link.linkClasses.splice(indexOfClass, 1)

                if (this.getNumberOfLinksForNode(link.data.target) == 0) {
                    let targetNode = nodes.get(link.data.target)
                    targetNode.visibility = VISIBILITY.HIDDEN
                    nodes.set(targetNode.data.id, targetNode)
                }
            }

        })

        this.state.nodes = nodes
        this.state.links = links
        this.state.collapseToolbarNeeded = false
        this.saveView()
    }


    handleCollapseAllFromMenu = () => {
        let links = this.state.links
        let nodes = this.state.nodes

        links.forEach((link) => {
            if (link.visibility == VISIBILITY.VISIBLE && link.data.source == this.state.tappedNode.id) {
                link.visibility = VISIBILITY.HIDDEN

                if (this.getNumberOfLinksForNode(link.data.target) == 0) {
                    let targetNode = nodes.get(link.data.target)
                    targetNode.visibility = VISIBILITY.HIDDEN
                    nodes.set(targetNode.data.id, targetNode)

                }
            }
        })

        this.state.nodes = nodes
        this.state.links = links
        this.state.nodeContextMenuOpen = false
        this.state.coreContextMenuOpen = false
        this.saveView()
    }

    hideLinkLabels = () => {
        this.setState({
            showLabels: false
        })
    }

    showLinkLabels = () => {
        this.setState({
            showLabels: true
        })
    }

    render() {
        this.initState()

        let nodes: GraphNodeElement[] = []
        this.state.nodes.forEach((node) => {
            if (node.visibility.value == VISIBILITY.VISIBLE.value) {
                node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id)
                nodes.push(node)
            }
        })

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


        return (
            <div>
                <div>
                    <Graph
                        nodes={nodes}
                        links={links}
                        onNewNode={this.onNodeCreated.bind(this)}
                        onNewLink={this.onLinkCreated.bind(this)}
                        onNodePositionUpdate={this.onNodePositionUpdated.bind(this)}
                        onCoreContextMenuRequested={this.showCoreContextMenu.bind(this)}
                        onNodeContextMenuRequested={this.showNodeContextMenu.bind(this)}
                        onLinkSelected={this.onLinkSelected.bind(this)}
                        onNodeDetailRequest={(node:GraphNodeData)=>{
                                        this.state.tappedNode = node
                                        this.handleNodeDetailRequested()
                                    }}
                        identityService={this.props.identityService}
                    />
                </div>


                {(() => {
                    if (this.state.coreContextMenuOpen) {
                        let nodes: GraphNodeData[] = []

                        this.state.nodes.forEach((node) => {
                            node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id)
                            nodes.push(node.data)
                        })

                        return (
                            <CoreContextMenu
                                nodes={nodes}
                                position={this.state.tappedPosition}
                                graphNodeTypes={this.props.nodeTypes}
                                requestClose={this.hideCoreMenu.bind(this)}
                                searchFieldFactory={this.props.searchFieldFactory}
                                onNewNode={this.handleNewNodeFromMenu.bind(this)}
                                onExistingNode={this.handleAddExistingNodeFromMenu.bind(this)}
                            />
                        )
                    }
                })()}

                {(() => {
                    if (this.state.nodeContextMenuOpen) {
                        let nodes: GraphNodeData[] = []
                        let links: GraphLinkData[] = []

                        this.state.nodes.forEach((node) => {
                            node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id)
                            nodes.push(node.data)
                        })
                        this.state.links.forEach((link) => {
                            if (link.data.source == this.state.tappedNode.id && link.visibility.value == VISIBILITY.HIDDEN.value) {
                                link.data.label = this.props.nodeInformationProvider.getLinkLabel(link.data.source, link.data.id)
                                links.push(link.data)
                            }
                        })

                        return (
                            <NodeContextMenu
                                nodes={nodes}
                                links={links}
                                position={this.state.tappedPosition}
                                graphNodeTypes={this.props.nodeTypes}
                                requestClose={this.hideCoreMenu.bind(this)}
                                onEditNode={this.handleNodeDetailRequested.bind(this)}
                                onHideNode={this.handleNodeCollapseFromMenu.bind(this)}
                                onExpandAll={this.handleExpandAllFromMenu.bind(this)}
                                onExpandNode={this.handleExpandLinkFromMenu.bind(this)}
                                onCollapseAll={this.handleCollapseAllFromMenu.bind(this)}
                                onNewNodeToConnect={this.handleNewNodeToConnectFromMenu.bind(this)}
                                onExistingNodeToConnect={this.handleOpenDialogSearchNodeToConnect.bind(this)}
                                searchFieldFactory={this.props.searchFieldFactory}
                            />
                        )
                    }
                })()}

                {(() => {
                    if (this.state.dialogNewNodeOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeNewNode(
                                this.state.dialogNewNodeOpen,
                                this.handleAddNewNode.bind(this),
                                this.handleCloseDialogNewNode.bind(this),
                                GraphElementFactory.getGraphElementAsNode(this.props.identityService.createNewNodeId(), this.state.tappedPosition, VISIBILITY.VISIBLE),
                                this.state.newNodeType
                            )
                        )
                    }
                    if (this.state.dialogNewNodeToConnectOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeNewNodeToConnect(
                                this.state.dialogNewNodeToConnectOpen,
                                this.handleAddNewNodeWithLink.bind(this),
                                this.handleCloseDialogNewNodeToConnect.bind(this),
                                GraphElementFactory.getGraphElementAsLink(this.props.identityService.createNewLinkId(), this.state.tappedNode.id, this.props.identityService.createNewNodeId(), VISIBILITY.VISIBLE),
                                this.state.newNodeType
                            )
                        )
                    }
                    if (this.state.dialogSearchNodeOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeSearch(
                                this.state.dialogSearchNodeOpen, this.handleAddExistingNode.bind(this), this.handleCloseDialogSearchNode.bind(this)
                            )
                        )
                    }
                    if (this.state.dialogSearchNodeToConnectOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeSearchToConnect(
                                this.state.dialogSearchNodeToConnectOpen, this.handleAddExistingNodeWithLink.bind(this), this.handleCloseDialogSearchNodeToConnect.bind(this)
                            )
                        )
                    }
                })()}

                <div id="toolbar">
                    {(() => {
                        if (this.state.collapseToolbarNeeded) {
                            return (
                                <FlatButton
                                    label='COLLAPSE'
                                    onTouchTap={this.handleClickOnCollapse.bind(this)}
                                />
                            )
                        }
                    })()}
                    {(() => {
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