import * as React from "react";
import {GraphScreenProps, GraphScreenStats} from "./GraphScreenInterfaces";
import Graph from "../Graph/Graph";
import {ContextMenu} from "../../model/ContextMenu";
import {ContextMenuCommand} from "../../model/ContextMenuCommand";
import * as GraphElementFactory from "../../model/GraphElementFactory";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeElement} from "../../model/GraphNodeData";
import {GraphLinkElement} from "../../model/GraphLinkData";
import {DialogNodeDetailProps} from "../../interfaces/DialogNodeDetailInterfaces";
import * as GuidService from "../../common/GuidService"


export default class GraphScreen extends React.Component<GraphScreenProps, GraphScreenStats> {
    constructor(props: any) {
        super(props);
        this.state = {
            nodes: [],
            arrows: [],
            dialogNodeEditOpen: false
        }
    }

    initState = () => {
        if (this.state.timestamp != this.props.timestamp) {
            this.state.timestamp = this.props.timestamp

            let node1 = GraphElementFactory.getGraphElementAsNode(GuidService.getRandomGuid(), 'home', new GraphPosition(100, 100))
            let node2 = GraphElementFactory.getGraphElementAsNode(GuidService.getRandomGuid(), 'ikc', new GraphPosition(100, 200))
            let node3 = GraphElementFactory.getGraphElementAsNode(GuidService.getRandomGuid(), 'pawi', new GraphPosition(200, 100))
            let node4 = GraphElementFactory.getGraphElementAsNode(GuidService.getRandomGuid(), 'bda', new GraphPosition(200, 200))

            this.state.nodes = [
               node1, node2, node3, node4
            ]

            this.state.arrows = [
                GraphElementFactory.getGraphElementAsLink(GuidService.getRandomGuid(), node1.data.id, node2.data.id, 'project'),
                GraphElementFactory.getGraphElementAsLink(GuidService.getRandomGuid(), node2.data.id, node1.data.id, 'backlink'),
                GraphElementFactory.getGraphElementAsLink(GuidService.getRandomGuid(), node1.data.id, node3.data.id, 'project')
            ]
        }
    }

    onLinkCreated = (newLink: GraphLinkElement, oldSourcePosition: GraphPosition) => {
        let arrows = this.state.arrows
        arrows.push(newLink)
        this.state.arrows = arrows

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
        this.handleCloseDialogNodeEdit()
    }

    handleDeleteNode = (element: any) => {
        let id = element.data().id

        this.setState({
            nodes: this.state.nodes.filter( (node) => node.data.id != id),
            arrows: this.state.arrows.filter( (arrow) => (arrow.data.source != id && arrow.data.target != id))
        })
    }

    handleCloseDialogNodeEdit = () => {
        this.setState({
            dialogNodeEditOpen: false
        })
    }

    handleOpenDialogNodeEdit = (element: any) => {
        console.log(element)
        this.setState({
            dialogNodeEditOpen: true,
            nodeToEdit: element.data()
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
                    () => {
                        console.log("add new node clicked")
                    }
                ),
                new ContextMenuCommand(
                    "Add existing Node",
                    () => {
                        console.log("add existing node clicked")
                    }
                ),
            ]
        )
        let nodeMenu = new ContextMenu(
            "node",
            [
                new ContextMenuCommand(
                    "Delete Node",
                    that.handleDeleteNode.bind(this)
                ),
                new ContextMenuCommand(
                    "Edit Node",
                    that.handleOpenDialogNodeEdit.bind(this)
                ),
            ]
        )

        return (
            <div>
                <Graph
                    nodes={this.state.nodes}
                    arrows={this.state.arrows}
                    coreMenu={coreMenu}
                    nodeMenu={nodeMenu}
                    onNewNode={this.onNodeCreated.bind(this)}
                    onNewLink={this.onLinkCreated.bind(this)}
                    onNodePositionUpdate={this.onNodePositionUpdated.bind(this)}
                />
                {(() => {
                    if (this.state.dialogNodeEditOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeDetailAsEdit(
                                this.state.dialogNodeEditOpen, this.handleSaveNode.bind(this), this.handleCloseDialogNodeEdit.bind(this), this.state.nodeToEdit
                            )
                        )
                    }
                })()}
            </div>
        )
    }

}