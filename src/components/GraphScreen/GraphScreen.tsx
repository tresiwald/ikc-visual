import * as React from "react";
import {GraphScreenProps, GraphScreenStats} from "./GraphScreenInterfaces";
import Graph from "../Graph/Graph";
import {ContextMenu} from "../../model/ContextMenu";
import {ContextMenuCommand} from "../../model/ContextMenuCommand";
import {GraphElementFactory} from "../../model/GraphElementFactory";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeElement, GraphNodeData} from "../../model/GraphNodeData";
import {GraphLinkElement, GraphLinkData} from "../../model/GraphLinkData";
import {DialogNodeDetailProps} from "../../interfaces/DialogNodeDetailInterfaces";
import {GuidService} from "../../common/GuidService";
import {DialogNodeDetailToConnectState} from "../../interfaces/DialogNodeDetailInterfacesToConnect";
import {DialogNodeSearchToConnectState} from "../../interfaces/DialogNodeSearchToConnectInterfaces";
import {VISIBILITY} from "../../model/VISIBILITY";
import ExpandDialog from "../ExpandDialog/ExpandDialog";
import {TimeService} from "../../common/TimeService";
import {Menu, MenuItem, Paper} from "material-ui";
import {ViewFactory} from "../../model/ViewFactory";

export default class GraphScreen extends React.Component<GraphScreenProps, GraphScreenStats> {
    constructor(props: any) {
        super(props);
        this.state = {
            nodes: new Map<string, GraphNodeElement>(),
            links: new Map<string, GraphLinkElement>(),
            dialogEditNodeOpen: false
        }
        let that = this
        if(!this.isMobile.any()) {
            document.addEventListener('click', function (e: any) {
                let elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
                if(that.isDescendant(document.getElementById('coreContextDesktopMenu'), elementMouseIsOver)){
                    console.log(elementMouseIsOver)
                }else{
                    document.getElementById('coreContextDesktopMenu').style.display = 'none'
                }
                if(that.isDescendant(document.getElementById('nodeContextDesktopMenu'), elementMouseIsOver)){
                    console.log(elementMouseIsOver)
                }else{
                    document.getElementById('nodeContextDesktopMenu').style.display = 'none'
                }

            })
        }
    }

    initState = () => {
        if (this.state.timestamp != this.props.timestamp) {
            this.state.timestamp = this.props.timestamp

            let nodes = new Map<string, GraphNodeElement>()
            let links = new Map<string, GraphLinkElement>()

            this.props.viewToLoad.nodes.forEach((node) => {nodes.set(node.data.id, node)})
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
        this.props.operationService.createLink(newLink.data.id, newLink.data.source, newLink.data.target, newLink.data.label)

        this.setState({
            links: links
        },() => {
            this.saveView()
        })
    }

    onNodeCreated = (newNode: GraphNodeElement) => {
        let nodes = this.state.nodes
        nodes.set(newNode.data.id, newNode)

        let links = this.state.links
        links.forEach((link) => {
            if(link.data.source == newNode.data.id && nodes.get(link.data.target).visibility.value == VISIBILITY.VISIBLE.value){
                link.visibility = VISIBILITY.VISIBLE
            }
            if(link.data.target == newNode.data.id && nodes.get(link.data.source).visibility.value == VISIBILITY.VISIBLE.value){
                link.visibility = VISIBILITY.VISIBLE
            }
        })

        this.setState({
            nodes: nodes,
            links: links
        },() => {
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
        },() => {
            this.saveView()
        })
    }

    handleSaveNode = (state: DialogNodeDetailProps) => {
        let nodes = this.state.nodes

        nodes.forEach((node) => {
            if (node.data.id == state.node.id) {
                node.data = state.node
            }
        })
        this.state.nodes = nodes
        this.handleCloseDialogEditNode()
    }

    handleAddNewNode = (state: DialogNodeDetailProps) => {
        let nodes = this.state.nodes
        let node = GraphElementFactory.getNode(state.node, this.state.tappedPosition, VISIBILITY.VISIBLE)
        nodes.set(node.data.id, node)

        this.setState({
            nodes: nodes,
            dialogNewNodeOpen: false
        },() => {
            this.saveView()
        })
    }

    handleAddExistingNode = (state: DialogNodeDetailProps) => {
        let nodes = this.state.nodes
        let node = GraphElementFactory.getNode(state.node, this.state.tappedPosition, VISIBILITY.VISIBLE)
        nodes.set(node.data.id, node)

        this.setState({
            nodes: nodes,
            dialogSearchNodeOpen: false
        },() => {
            this.saveView()
        })
    }

    handleAddNewNodeWithLink = (state: DialogNodeDetailToConnectState) => {
        let nodes = this.state.nodes
        let node = GraphElementFactory.getNode(
            state.node, new GraphPosition(this.state.tappedPosition.x + 10, this.state.tappedPosition.y + 10), VISIBILITY.VISIBLE)

        nodes.set(node.data.id, node)

        let links = this.state.links
        let link = GraphElementFactory.getGraphElementAsLink(
            GuidService.getRandomGuid(), this.state.tappedNode.id, state.node.id, VISIBILITY.VISIBLE)

        links.set(link.data.id, link)

        this.setState({
            nodes: nodes,
            links: links,
            dialogNewNodeToConnectOpen: false
        },() => {
            this.saveView()
        })
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
        this.props.operationService.createLink(state.link.id, this.state.tappedNode.id, state.link.target, link.data.label)


        this.setState({
            nodes: nodes,
            links: links,
            dialogSearchNodeToConnectOpen: false
        },() => {
            this.saveView()
        })
    }

    handleDeleteNodeMobile = (element: any) => {
        this.handleDeleteNode(element.data().id)
    }

    handleDeleteNodeDesktop = () => {
        this.handleDeleteNode(this.state.tappedNode.id)
    }

    handleDeleteNode = (id:string) => {
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
        },() => {
            this.saveView()
        })
    }



    handleCloseDialogEditNode = () => {
        this.setState({
            dialogEditNodeOpen: false
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
            tappedPosition: element.position
        })
    }

    handleCloseDialogSearchNode = () => {
        this.setState({
            dialogSearchNodeOpen: false
        },() => {
            this.saveView()
        })
    }

    handleOpenDialogSearchNode = (element: any) => {
        this.setState({
            dialogSearchNodeOpen: true,
            tappedPosition: element.position
        })
    }

    handleOpenDialogSearchNodeDesktop = () => {
        this.setState({
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
            dialogSearchNodeToConnectOpen: true,
            tappedPosition: element.position(),
            tappedNode: element.data()
        })
    }

    handleOpenDialogSearchNodeToConnectDesktop = () => {
        this.setState({
            dialogSearchNodeToConnectOpen: true
        })
    }

    handleLinksCollapse(elements: GraphLinkData[]) {
        let links = this.state.links
        let nodes = this.state.nodes

        elements.forEach((element) => {
            let link = links.get(element.id)
            link.visibility = VISIBILITY.GROUPED
            links.set(link.data.id, link)


            //console.log(this.getNumberOfTargetLinksForNode(element.target))
            if (this.getNumberOfLinksForNode(element.target) == 0) {
                let node = nodes.get(element.target)
                node.visibility = VISIBILITY.HIDDEN
            }
            let node = nodes.get(element.source)
            node.nodeClasses.push('parent')
            nodes.set(node.data.id, node)
        })

        this.setState({
            links: links,
            nodes: nodes
        },() => {
            this.saveView()
        })
    }


    handleNodeCollapseMobile(element:any){
        this.handleNodeCollapse(element.data().id)
    }

    handleNodeCollapseDesktop(){
        this.handleNodeCollapse(this.state.tappedNode.id)
    }

    handleNodeCollapse(nodeId: string){
        let links = this.state.links
        let nodes = this.state.nodes

        let node = nodes.get(nodeId)
        node.visibility = VISIBILITY.GROUPED
        nodes.set(nodeId, node)

        links.forEach((link) => {
            if (link.data.source == nodeId) {
                link.visibility = VISIBILITY.GROUPED
            } else if (link.data.target == nodeId) {
                link.visibility = VISIBILITY.GROUPED

                let sourceNode = nodes.get(link.data.source)
                sourceNode.nodeClasses.push('parent')
                nodes.set(sourceNode.data.id, sourceNode)
            }
        })

        this.setState({
            links: links,
            nodes: nodes
        },() => {
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


    handleFilterWindowRequest(element: GraphNodeElement) {
        this.setState({
            filterWindowOpen: true,
            filterWindowNode: element
        })
    }

    handleRequestCloseFilterWindow() {
        this.setState({
            filterWindowOpen: false,
            filterWindowNode: null
        })
    }

    handleExpandLink(linkId: string) {
        let links = this.state.links
        let nodes = this.state.nodes

        let linkToExpand = links.get(linkId)
        linkToExpand.visibility = VISIBILITY.VISIBLE
        links.set(linkToExpand.data.id, linkToExpand)

        let targetNode = nodes.get(linkToExpand.data.target)
        targetNode.visibility = VISIBILITY.VISIBLE
        nodes.set(targetNode.data.id, targetNode)

        let sourceNode = nodes.get(linkToExpand.data.source)
        sourceNode.nodeClasses.splice(sourceNode.nodeClasses.indexOf('parent'), 1)
        nodes.set(sourceNode.data.id, sourceNode)

        this.setState({
            links: links,
            nodes: nodes
        },() => {
            this.saveView()
        })
    }

    handleExpandAll(nodeId: string) {
        let links = this.state.links
        let nodes = this.state.nodes

        links.forEach((link) => {
            if (link.data.source == nodeId) {
                link.visibility = VISIBILITY.VISIBLE

                let node = nodes.get(link.data.target)
                node.visibility = VISIBILITY.VISIBLE
                nodes.set(node.data.id, node)
            }
        })

        let sourceNode = nodes.get(nodeId)
        sourceNode.nodeClasses.splice(sourceNode.nodeClasses.indexOf('parent'), 1)
        nodes.set(sourceNode.data.id, sourceNode)

        this.setState({
            links: links,
            nodes: nodes
        },() => {
            this.saveView()
        })
    }

    handleNodeDetailRequested = () => {
        this.props.onNodeDetailRequest(this.state.tappedNode.id)
    }

    getListOfAllCollapsedLinks(nodeId: string): GraphLinkData[] {
        let list: GraphLinkData[] = []
        this.state.links.forEach((link) => {
            if (link.data.source == nodeId && link.visibility == VISIBILITY.GROUPED) {
                list.push(link.data)
            }
        })
        return list
    }

    showCoreContextDesktopMenu(position:GraphPosition){
        this.state.tappedPosition = position

        this.hideNodeMenu()
        this.showCoreMenu()

        let element = document.getElementById('coreContextDesktopMenu');
        element.style.marginLeft = (position.x ) + "px";
        element.style.marginTop = (position.y) + "px";
        (element.childNodes[0] as any).style.width = 'auto'
    }

    showNodeContextDesktopMenu(node:any){
        this.state.tappedNode = node.data()
        this.state.tappedPosition = node.position()

        this.hideCoreMenu()
        this.showNodeMenu();
        let element = document.getElementById('nodeContextDesktopMenu');
        element.style.marginLeft = (node.position().x) + "px";
        element.style.marginTop = (node.position().y) + "px";
        (element.childNodes[0] as any).style.width = 'auto';
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

    isDescendant(parent:any, child:any) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    saveView = () =>{
        let view = ViewFactory.viewFromMaps(this.state.nodes,this.state.links, this.props.viewToLoad.title)
        view.id = this.props.viewToLoad.id

        this.props.operationService.saveView(view)
    }


    showCoreMenu = () => {
        document.getElementById('coreContextDesktopMenu').style.display = 'inline-block';
    }
    hideCoreMenu = () => {
        document.getElementById('coreContextDesktopMenu').style.display = 'none';
    }
    showNodeMenu = () => {
        document.getElementById('nodeContextDesktopMenu').style.display = 'inline-block';
    }
    hideNodeMenu = () => {
        document.getElementById('nodeContextDesktopMenu').style.display = 'none';
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

        let coreMenu = new ContextMenu(
            "core",
            [
                new ContextMenuCommand(
                    "Add New Node",
                    that.handleOpenDialogNewNode.bind(that)
                ),
                new ContextMenuCommand(
                    "Add existing Node",
                    that.handleOpenDialogSearchNode.bind(that)
                ),
            ]
        )
        let nodeMenu = new ContextMenu(
            "node",
            [
                new ContextMenuCommand(
                    "Hide Node",
                    that.handleNodeCollapseMobile.bind(that)
                ),
                new ContextMenuCommand(
                    "Remove Node",
                    that.handleDeleteNodeMobile.bind(that)
                ),
                new ContextMenuCommand(
                    "Edit Node",
                    that.handleOpenDialogEditNode.bind(that)
                ),
                new ContextMenuCommand(
                    "Link to new Node",
                    that.handleOpenDialogNewNodeToConnect.bind(that)
                ),
                new ContextMenuCommand(
                    "Link to existing Node",
                    that.handleOpenDialogSearchNodeToConnect.bind(that)
                ),
            ]
        )

        let nodes: GraphNodeElement[] = []
        this.state.nodes.forEach((node) => {
            if (node.visibility.value == VISIBILITY.VISIBLE.value) {
                node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id)
                nodes.push(node)
            }
        })

        let links: GraphLinkElement[] = []
        this.state.links.forEach((link) => {
            if (link.visibility.value == VISIBILITY.VISIBLE.value) {
                link.data.label = this.props.nodeInformationProvider.getLinkLabel(link.data.source,link.data.id)
                links.push(link)
            }
        })


        return (
            <div>
                {(() => {
                    if (!this.isMobile.any()) {
                        return (
                            <div>
                                <Graph
                                    nodes={nodes}
                                    links={links}
                                    onNewNode={this.onNodeCreated.bind(this)}
                                    onNewLink={this.onLinkCreated.bind(this)}
                                    onNodePositionUpdate={this.onNodePositionUpdated.bind(this)}
                                    onEdgesCollapse={this.handleLinksCollapse.bind(this)}
                                    onFilterWindowRequested={this.handleFilterWindowRequest.bind(this)}
                                    onCoreDesktopMenuRequested={this.showCoreContextDesktopMenu.bind(this)}
                                    onNodeDesktopMenuRequested={this.showNodeContextDesktopMenu.bind(this)}
                                    onNodeDetailRequest={(node:GraphNodeData)=>{
                                        this.state.tappedNode = node
                                        this.handleNodeDetailRequested()
                                    }}
                                />
                                <Paper id="coreContextDesktopMenu" style={style}>
                                    <Menu>
                                        <MenuItem  primaryText={"Add existing Node"} onTouchTap={()=>{
                                            this.hideCoreMenu()
                                            this.handleOpenDialogSearchNodeDesktop()
                                        }}/>
                                        {(()=> {
                                            let returnList:any[] = []
                                            this.props.nodeTypesCreateFunctions.forEach((fn, nodeType) => {
                                                returnList.push(<MenuItem  primaryText={"Add new " + nodeType + " Node"} onTouchTap={() => {
                                                    this.hideCoreMenu()
                                                    fn()
                                                }}/>)
                                            })
                                            return returnList
                                        })()}
                                    </Menu>
                                </Paper>

                                <Paper id="nodeContextDesktopMenu" style={style}>
                                    <Menu>
                                        <MenuItem primaryText="Edit Node" onTouchTap={() => {
                                            this.hideNodeMenu()
                                            this.handleNodeDetailRequested()
                                        }}/>
                                        <MenuItem primaryText="Hide Node" onTouchTap={() => {
                                            this.hideNodeMenu()
                                            this.handleNodeCollapseDesktop()
                                        }}/>
                                        <MenuItem primaryText="Remove Node from View" onTouchTap={()=>{
                                            this.hideNodeMenu()
                                            this.handleDeleteNodeDesktop()
                                        }}/>
                                        <MenuItem primaryText="Link to existing Node" onTouchTap={()=>{
                                            this.hideNodeMenu()
                                            this.handleOpenDialogSearchNodeToConnectDesktop()
                                        }}/>
                                        {(()=> {
                                            let returnList:any[] = []
                                            this.props.nodeTypesCreateFunctions.forEach((fn, nodeType) => {
                                                returnList.push(<MenuItem  primaryText={"Link to new " + nodeType + " Node"} onTouchTap={() => {
                                                    this.hideNodeMenu()
                                                    fn()
                                                }}/>)
                                            })
                                            return returnList
                                        })()}
                                    </Menu>
                                </Paper>
                            </div>
                        )
                    } else {
                        return (
                            <Graph
                            nodes={nodes}
                            links={links}
                            coreMenu={coreMenu}
                            nodeMenu={nodeMenu}
                            onNewNode={this.onNodeCreated.bind(this)}
                            onNewLink={this.onLinkCreated.bind(this)}
                            onNodePositionUpdate={this.onNodePositionUpdated.bind(this)}
                            onEdgesCollapse={this.handleLinksCollapse.bind(this)}
                            onFilterWindowRequested={this.handleFilterWindowRequest.bind(this)}
                        />)
                    }
                })()}

                {(() => {
                    if (this.state.dialogEditNodeOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeDetailAsEdit(
                                this.state.dialogEditNodeOpen, this.handleSaveNode.bind(this), this.handleCloseDialogEditNode.bind(this), this.state.tappedNode
                            )
                        )
                    }
                    if (this.state.dialogNewNodeOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeDetailAsNew(
                                this.state.dialogNewNodeOpen, this.handleAddNewNode.bind(this), this.handleCloseDialogNewNode.bind(this)
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
                    if (this.state.dialogNewNodeToConnectOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeDetailAsNewToConnect(
                                this.state.dialogNewNodeToConnectOpen, this.handleAddNewNodeWithLink.bind(this), this.handleCloseDialogNewNodeToConnect.bind(this)
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

                {(() => {
                    if (this.state.filterWindowOpen) {
                        let collapsedLinks = this.getListOfAllCollapsedLinks(this.state.filterWindowNode.data.id)
                        if (collapsedLinks.length > 0) {
                            return (<div>
                                <ExpandDialog
                                    onExpandAll={this.handleExpandAll.bind(this)}
                                    onExpandNode={this.handleExpandLink.bind(this)}
                                    timestamp={TimeService.getTimestamp()}
                                    position={new GraphPosition(
                                    this.state.filterWindowNode.position.x,
                                    this.state.filterWindowNode.position.y
                                )}
                                    list={collapsedLinks}
                                    requestClose={this.handleRequestCloseFilterWindow.bind(this)}
                                />
                            </div>)
                        } else {
                            this.state.filterWindowOpen = false
                        }
                    }
                })()}


            </div>
        )
    }

}