import * as React from "react";
import {GraphScreenProps, GraphScreenStats} from "./GraphScreenInterfaces";
import Graph from "../Graph/Graph";
import {ContextMenu} from "../../model/ContextMenu";
import {ContextMenuCommand} from "../../model/ContextMenuCommand";
import {GraphElementFactory} from "../../model/GraphElementFactory";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeElement} from "../../model/GraphNodeData";
import {GraphLinkElement} from "../../model/GraphLinkData";
import {DialogNodeDetailProps} from "../../interfaces/DialogNodeDetailInterfaces";
import {GuidService} from "../../common/GuidService";
import {DialogNodeDetailToConnectState} from "../../interfaces/DialogNodeDetailInterfacesToConnect";
import {DialogNodeSearchToConnectState} from "../../interfaces/DialogNodeSearchToConnectInterfaces";

export default class GraphScreen extends React.Component<GraphScreenProps, GraphScreenStats> {
    constructor(props: any) {
        super(props);
        this.state = {
            nodes: [],
            links: [],
            dialogEditNodeOpen: false
        }
    }

    initState = () => {
        if (this.state.timestamp != this.props.timestamp) {
            this.state.timestamp = this.props.timestamp

            this.state.nodes = this.props.viewToLoad.nodes as GraphNodeElement[]
            this.state.links = this.props.viewToLoad.links as GraphLinkElement[]
        }
    }

    onLinkCreated = (newLink: GraphLinkElement, oldSourcePosition: GraphPosition) => {
        let links = this.state.links
        links.push(newLink)
        this.state.links = links
        this.onNodePositionUpdated(newLink.data.source, oldSourcePosition)
    }

    onNodeCreated = (newNode: GraphNodeElement) => {
        let nodes = this.state.nodes
        nodes.push(newNode)
        this.setState({
            nodes: nodes
        })
    }

    onNodePositionUpdated = (nodeId: string, position: GraphPosition) => {
        let nodes = this.state.nodes
        nodes.forEach((node) => {
            if (node.data.id == nodeId) {
                node.position = position
            }
        })
        this.setState({
            nodes: nodes
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
        nodes.push(GraphElementFactory.getNode(state.node, this.state.tappedPosition))

        this.setState({
            nodes: nodes,
            dialogNewNodeOpen: false
        })
    }

    handleAddExistingNode = (state: DialogNodeDetailProps) => {
        let nodes = this.state.nodes
        nodes.push(GraphElementFactory.getNode(state.node, this.state.tappedPosition))

        this.setState({
            nodes: nodes,
            dialogSearchNodeOpen: false
        })
    }

    handleAddNewNodeWithLink = (state: DialogNodeDetailToConnectState) => {
        let nodes = this.state.nodes
        nodes.push(GraphElementFactory.getNode(
            state.node, new GraphPosition(this.state.tappedPosition.x + 10, this.state.tappedPosition.y + 10))
        )

        let links = this.state.links
        links.push(GraphElementFactory.getGraphElementAsLink(
            GuidService.getRandomGuid(),this.state.nodeToConnect.id, state.node.id, state.label
        ))

        this.setState({
            nodes: nodes,
            links: links,
            dialogNewNodeToConnectOpen: false
        })
    }

    handleAddExistingNodeWithLink = (state: DialogNodeSearchToConnectState) => {
        let nodes = this.state.nodes
        nodes.push(GraphElementFactory.getNode(
            state.node, new GraphPosition(this.state.tappedPosition.x + 40, this.state.tappedPosition.y + 40))
        )

        let links = this.state.links
        links.push(GraphElementFactory.getGraphElementAsLink(
            GuidService.getRandomGuid(),this.state.nodeToConnect.id, state.node.id, state.label
        ))

        this.setState({
            nodes: nodes,
            links: links,
            dialogSearchNodeToConnectOpen: false
        })
    }

    handleDeleteNode = (element: any) => {
        let id = element.data().id

        this.setState({
            nodes: this.state.nodes.filter((node) => node.data.id != id),
            links: this.state.links.filter((link) => (link.data.source != id && link.data.target != id))
        })
    }

    handleCloseDialogEditNode = () => {
        this.setState({
            dialogEditNodeOpen: false
        })
    }

    handleOpenDialogEditNode = (element: any) => {
        console.log(element)
        this.setState({
            dialogEditNodeOpen: true,
            nodeToEdit: element.data()
        })
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
        })
    }

    handleOpenDialogSearchNode = (element: any) => {
        this.setState({
            dialogNewNodeToConnectOpen: true,
            tappedPosition: element.position
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
            nodeToConnect: element.data()
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
            nodeToConnect:  element.data()
        })
    }

    render() {
        this.initState()
        let that = this
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
                    that.handleDeleteNode.bind(that)
                ),
                new ContextMenuCommand(
                    "Delete Node",
                    that.handleDeleteNode.bind(that)
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

        return (
            <div>
                <Graph
                    nodes={this.state.nodes}
                    links={this.state.links}
                    coreMenu={coreMenu}
                    nodeMenu={nodeMenu}
                    onNewNode={this.onNodeCreated.bind(this)}
                    onNewLink={this.onLinkCreated.bind(this)}
                    onNodePositionUpdate={this.onNodePositionUpdated.bind(this)}
                />
                {(() => {
                    if (this.state.dialogEditNodeOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeDetailAsEdit(
                                this.state.dialogEditNodeOpen, this.handleSaveNode.bind(this), this.handleCloseDialogEditNode.bind(this), this.state.nodeToEdit
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
            </div>
        )
    }

}