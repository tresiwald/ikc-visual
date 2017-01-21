import * as React from "react";
import {GraphScreenProps, GraphScreenStats} from "./GraphScreenInterfaces";
import Graph from "../Graph/Graph";
import {ContextMenu} from "../../model/ContextMenu";
import {ContextMenuCommand} from "../../model/ContextMenuCommand";
import {GraphElementFactory} from "../../model/GraphElementFactory";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeElement, GraphNodeData} from "../../model/GraphNodeData";
import {GraphLinkElement, GraphLinkData} from "../../model/GraphLinkData";
import {DialogNewNodeState} from "../../interfaces/DialogNewNodeInterfaces";
import {DialogNewNodeToConnectState} from "../../interfaces/DialogNewNodeToConnectInterfaces";
import {DialogNodeSearchToConnectState} from "../../interfaces/DialogNodeSearchToConnectInterfaces";
import {VISIBILITY} from "../../model/VISIBILITY";
import ExpandDialog from "../ExpandDialog/ExpandDialog";
import {TimeService} from "../../common/TimeService";
import {Menu, MenuItem, Paper, FlatButton} from "material-ui";
import {ViewFactory} from "../../model/ViewFactory";
import {GraphNodeType} from "../../model/GraphNodeType";
import CoreContextMenu from "../ContextMenus/CoreContextMenu";
import NodeContextMenu from "../ContextMenus/NodeContextMenu";

export default class GraphScreen extends React.Component<GraphScreenProps, GraphScreenStats> {
    constructor(props: any) {
        super(props);
        this.state = {
            nodes: new Map<string, GraphNodeElement>(),
            links: new Map<string, GraphLinkElement>(),
            showLabels: false
        }
        let that = this
        if (!this.isMobile.any()) {
            document.addEventListener('click', function (e: any) {
                let elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
                if (that.isDescendant(document.getElementById('coreContextMenu'), elementMouseIsOver)) {
                    console.log(elementMouseIsOver)
                } else {
                    that.hideCoreMenu()
                }
                if (that.isDescendant(document.getElementById('nodeContextMenu'), elementMouseIsOver)) {
                    console.log(elementMouseIsOver)
                } else {
                    that.hideNodeMenu()
                }

            })
        }
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

    updateView = () => {
        let nodes: GraphNodeElement[] = []
        this.state.nodes.forEach((node) => {
            nodes.push(node)
        })

        let links: GraphLinkElement[] = []
        this.state.links.forEach((link) => {
            links.push(link)
        })

        let view = ViewFactory.viewFromNodesAndLinks(nodes, links)

        this.props.onViewUpdate(view)
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
        nodes.set(newNode.data.id, newNode)

        let links = this.state.links
        links.forEach((link) => {
            if(link.data.source == newNode.data.id){
                link.visibility = VISIBILITY.VISIBLE

                let targetNode = nodes.get(link.data.target)
                if(targetNode.position.x == 0 && targetNode.position.y == 0){
                    targetNode.position = this.calcNodePosition(newNode.position)
                }
                targetNode.visibility = VISIBILITY.VISIBLE
                nodes.set(targetNode.data.id, targetNode)

                links.forEach((targetLink) => {
                    if(targetLink.data.source == targetNode.data.id && nodes.get(targetLink.data.target).visibility.value == VISIBILITY.VISIBLE.value){
                        targetLink.visibility = VISIBILITY.VISIBLE
                    }
                    if(targetLink.data.target == targetNode.data.id && nodes.get(targetLink.data.source).visibility.value == VISIBILITY.VISIBLE.value){
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

        this.setState({
            nodes: nodes,
            links: links
        }, () => {
            this.saveView()
        })
    }

    onNodePositionUpdated = (nodeId: string, position: GraphPosition) => {
        let nodes = this.state.nodes
        let node = nodes.get(nodeId)

        node.position = position
        nodes.set(nodeId, node)

        this.setState({
            nodes: nodes
        }, () => {
            this.saveView()
        })
    }

    handleAddNewNode = (state: DialogNewNodeState) => {
        let nodes = this.state.nodes
        let node = state.node
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
        nodes.set(node.data.id, node)

        links.forEach((link) => {
            if(link.data.source == state.node.data.id){
                link.visibility = VISIBILITY.VISIBLE

                let targetNode = nodes.get(link.data.target)
                targetNode.visibility = VISIBILITY.VISIBLE
                nodes.set(targetNode.data.id, targetNode)

                links.forEach((targetLink) => {
                    if(targetLink.data.source == targetNode.data.id && nodes.get(targetLink.data.target).visibility.value == VISIBILITY.VISIBLE.value){
                        targetLink.visibility = VISIBILITY.VISIBLE
                    }
                    if(targetLink.data.target == targetNode.data.id && nodes.get(targetLink.data.source).visibility.value == VISIBILITY.VISIBLE.value){
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

        this.setState({
            nodes: nodes,
            links: links,
            dialogSearchNodeOpen: false
        }, () => {
            this.saveView()
        })
    }

    handleAddExistingNodeFromMenu = (nodeId:string) => {
        let nodes = this.state.nodes
        let links = this.state.links

        let node = nodes.get(nodeId)
        node.visibility = VISIBILITY.VISIBLE
        node.position = this.state.tappedPosition
        nodes.set(node.data.id, node)

        links.forEach((link) => {
            if(link.data.source == node.data.id){
                link.visibility = VISIBILITY.VISIBLE

                let targetNode = nodes.get(link.data.target)
                targetNode.visibility = VISIBILITY.VISIBLE

                if(targetNode.position.x == 0 && targetNode.position.y == 0){
                    targetNode.position = this.calcNodePosition(node.position)
                }

                nodes.set(targetNode.data.id, targetNode)

                links.forEach((targetLink) => {
                    if(targetLink.data.source == targetNode.data.id && nodes.get(targetLink.data.target).visibility.value == VISIBILITY.VISIBLE.value){
                        targetLink.visibility = VISIBILITY.VISIBLE
                    }
                    if(targetLink.data.target == targetNode.data.id && nodes.get(targetLink.data.source).visibility.value == VISIBILITY.VISIBLE.value){
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

        this.setState({
            nodes: nodes,
            links: links,
            coreContextMenuOpen: false
        }, () => {
            this.saveView()
        })
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
            TimeService.getTimestamp(), this.state.tappedNode.id, state.link.target, VISIBILITY.VISIBLE)

        links.set(link.data.id, link)

        this.state.nodes = nodes
        this.state.links = links
        this.state.dialogSearchNodeToConnectOpen = false

        this.saveView()
        this.props.operationService.createLink(state.link.id, this.state.tappedNode.id, state.link.target, state.nodeName)

        this.forceUpdate()
    }

    handleDeleteNodeMobile = (element: any) => {
        this.handleDeleteNode(element.data().id)
    }

    handleDeleteNodeDesktop = () => {
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

        this.setState({
            nodes: nodes,
            links: links
        }, () => {
            this.saveView()
        })
    }

    handleOpenDialogEditNode = (element: any) => {
        console.log(element)
        this.props.onNodeDetailRequest(element.id())
        /*this.setState({
         dialogEditNodeOpen: true,
         nodeToEdit: element.data()
         })*/
    }

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

    handleOpenDialogSearchNode = (element: any) => {
        this.setState({
            dialogSearchNodeOpen: true,
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            tappedPosition: element.position
        })
    }

    handleOpenDialogSearchNodeDesktop = () => {
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

    handleOpenDialogSearchNodeToConnect = (element: any) => {
        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            dialogSearchNodeToConnectOpen: true,
            tappedPosition: element.position(),
            tappedNode: element.data()
        })
    }

    handleOpenDialogSearchNodeToConnectDesktop = () => {
        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            dialogSearchNodeToConnectOpen: true
        })
    }

    handleLinksCollapse(elements: GraphLinkData[]) {
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

        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            links: links,
            nodes: nodes
        }, () => {
            this.saveView()
        })
    }


    handleNodeCollapseMobile(element: any) {
        this.handleNodeCollapse(element.data().id)
    }

    handleNodeCollapseDesktop() {
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

        this.setState({
            links: links,
            nodes: nodes
        }, () => {
            this.saveView()
        })
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

    handleExpandLink(linkId: string) {
        let links = this.state.links
        let nodes = this.state.nodes

        let linkToExpand = links.get(linkId)
        linkToExpand.visibility = VISIBILITY.VISIBLE
        links.set(linkToExpand.data.id, linkToExpand)

        let targetNode = nodes.get(linkToExpand.data.target)
        if(targetNode.position.x == 0 && targetNode.position.y == 0){
            targetNode.position = this.calcNodePosition(this.state.tappedPosition)
        }
        targetNode.visibility = VISIBILITY.VISIBLE
        nodes.set(targetNode.data.id, targetNode)

        this.setState({
            links: links,
            nodes: nodes
        }, () => {
            this.saveView()
        })
    }

    handleExpandAll() {
        let links = this.state.links
        let nodes = this.state.nodes
        let nodeId = this.state.tappedNode.id

        links.forEach((link) => {
            if (link.data.source == nodeId && link.visibility == VISIBILITY.HIDDEN) {
                link.visibility = VISIBILITY.VISIBLE

                let node = nodes.get(link.data.target)
                node.visibility = VISIBILITY.VISIBLE
                if(node.position.x == 0 && node.position.y == 0){
                    node.position = this.calcNodePosition(this.state.tappedPosition)
                }
                nodes.set(node.data.id, node)
            }
        })

        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            links: links,
            nodes: nodes
        }, () => {
            this.saveView()
        })
    }

    handleNodeDetailRequested = () => {
        this.hideNodeMenu()
        this.props.onNodeDetailRequest(this.state.tappedNode.id)
    }

    getListOfAllCollapsedLinks(nodeId: string): GraphLinkData[] {
        let list: GraphLinkData[] = []
        this.state.links.forEach((link) => {
            if (link.data.source == nodeId && link.visibility == VISIBILITY.HIDDEN) {
                list.push(link.data)
            }
        })
        return list
    }

    showCoreContextDesktopMenu(position: GraphPosition) {
        this.state.tappedPosition = position

        this.hideNodeMenu()
        this.showCoreMenu()
    }

    showNodeContextDesktopMenu(node: GraphNodeElement) {
        this.state.tappedNode = node.data
        this.state.tappedPosition = node.position

        this.hideCoreMenu()
        this.showNodeMenu();
    }

    isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function () {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
        }
    };

    isDescendant(parent: any, child: any) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    saveView = () => {
        let view = ViewFactory.viewFromMaps(this.state.nodes, this.state.links, this.props.viewToLoad.title)
        view.id = this.props.viewToLoad.id

        this.props.operationService.saveView(view)
    }


    showCoreMenu = () => {
        this.setState({
            coreContextMenuOpen:true
        })
    }
    hideCoreMenu = () => {
        this.setState({
            coreContextMenuOpen:false
        })
    }
    showNodeMenu = () => {
        this.setState({
            nodeContextMenuOpen:true
        })
    }
    hideNodeMenu = () => {
        this.setState({
            nodeContextMenuOpen:false
        })
    }

    handleNewNodeRequested = (type: GraphNodeType) => {
        this.hideCoreMenu()
        this.setState({
            newNodeType: type,
            dialogNewNodeOpen: true
        })
    }

    handleNewNodeRequestedToConnect = (type: GraphNodeType) => {
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

                if(this.getNumberOfLinksForNode(link.data.target) == 0){
                    let targetNode = nodes.get(link.data.target)
                    targetNode.visibility = VISIBILITY.HIDDEN
                    nodes.set(targetNode.data.id, targetNode)
                }
            }

        })

        this.setState({
            links: links,
            nodes: nodes,
            collapseToolbarNeeded: false
        })
    }


    handleCollapseAll = () => {
        let links = this.state.links
        let nodes = this.state.nodes

        links.forEach((link) => {
            if (link.visibility == VISIBILITY.VISIBLE && link.data.source == this.state.tappedNode.id) {
                link.visibility = VISIBILITY.HIDDEN

                if(this.getNumberOfLinksForNode(link.data.target) == 0){
                    let targetNode = nodes.get(link.data.target)
                    targetNode.visibility = VISIBILITY.HIDDEN
                    nodes.set(targetNode.data.id, targetNode)

                }
            }
        })

        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false,
            links: links,
            nodes: nodes
        })
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

    calcNodePosition(source: GraphPosition): GraphPosition{
        let randomAngle = Math.random() * 180
        let randomRadius = Math.random() * 40

        return new GraphPosition(
            Math.round(source.x + ((80 + randomRadius) * Math.cos((Math.PI / 180) *  randomAngle))),
            Math.round(source.y + ((80 + randomRadius) * Math.sin((Math.PI / 180) *  randomAngle)))
        )
    }

    render() {
        this.initState()
        let that = this

        const style = {
            display: 'none',
            margin: '16px 32px 16px 0',
            position: 'absolute',
            transition: 'none'
        };

        let nodes: GraphNodeElement[] = []
        this.state.nodes.forEach((node) => {
            if (node.visibility.value == VISIBILITY.VISIBLE.value) {
                node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id)
                nodes.push(node)
            }
        })

        let links: GraphLinkElement[] = []

        if(this.state.showLabels) {
            this.state.links.forEach((link) => {
                if (link.visibility.value == VISIBILITY.VISIBLE.value) {
                    link.data.label = this.props.nodeInformationProvider.getLinkLabel(link.data.source, link.data.id)
                    links.push(link)
                }
            })
        }else{
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
                        onCoreDesktopMenuRequested={this.showCoreContextDesktopMenu.bind(this)}
                        onNodeDesktopMenuRequested={this.showNodeContextDesktopMenu.bind(this)}
                        onLinkSelected={this.onLinkSelected.bind(this)}
                        onNodeDetailRequest={(node:GraphNodeData)=>{
                                        this.state.tappedNode = node
                                        this.handleNodeDetailRequested()
                                    }}
                    />
                </div>



                {(() =>{
                    if(this.state.coreContextMenuOpen){
                        let nodes:GraphNodeData[] = []

                        this.state.nodes.forEach((node) =>{
                            node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id)
                            nodes.push(node.data)
                        })

                        return(
                            <CoreContextMenu
                                nodes={nodes}
                                position={this.state.tappedPosition}
                                graphNodeTypes={this.props.nodeTypes}
                                requestClose={this.hideCoreMenu.bind(this)}
                                timestamp={TimeService.getTimestamp()}
                                searchFieldFactory={this.props.searchFieldFactory}
                                onNewNode={this.handleNewNodeRequested.bind(this)}
                                onExistingNode={this.handleAddExistingNodeFromMenu.bind(this)}
                            />
                        )
                    }
                })()}

                {(() =>{
                    if(this.state.nodeContextMenuOpen){
                        let nodes:GraphNodeData[] = []
                        let links:GraphLinkData[] = []

                        this.state.nodes.forEach((node) =>{
                            node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id)
                            nodes.push(node.data)
                        })
                        this.state.links.forEach((link) =>{
                            if(link.data.source == this.state.tappedNode.id && link.visibility.value == VISIBILITY.HIDDEN.value) {
                                link.data.label = this.props.nodeInformationProvider.getLinkLabel(link.data.source, link.data.id)
                                links.push(link.data)
                            }
                        })

                        return(
                            <NodeContextMenu
                                nodes={nodes}
                                links={links}
                                position={this.state.tappedPosition}
                                graphNodeTypes={this.props.nodeTypes}
                                requestClose={this.hideCoreMenu.bind(this)}
                                timestamp={TimeService.getTimestamp()}
                                onEditNode={this.handleNodeDetailRequested.bind(this)}
                                onHideNode={this.handleNodeCollapseDesktop.bind(this)}
                                onExpandAll={this.handleExpandAll.bind(this)}
                                onExpandNode={this.handleExpandLink.bind(this)}
                                onCollapseAll={this.handleCollapseAll.bind(this)}
                                onNewNodeToConnect={this.handleNewNodeRequestedToConnect.bind(this)}
                                onExistingNodeToConnect={this.handleOpenDialogSearchNodeToConnectDesktop.bind(this)}
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
                                GraphElementFactory.getGraphElementAsNode(TimeService.getTimestamp(), this.state.tappedPosition, VISIBILITY.VISIBLE),
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
                                GraphElementFactory.getGraphElementAsLink(TimeService.getTimestamp(), this.state.tappedNode.id, (Number.parseFloat(TimeService.getTimestamp()) + 1).toString(), VISIBILITY.VISIBLE),
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