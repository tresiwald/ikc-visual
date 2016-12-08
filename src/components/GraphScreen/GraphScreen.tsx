import * as React from "react";
import {GraphScreenProps, GraphScreenStats} from "./GraphScreenInterfaces";
import Graph from "../Graph/Graph";
import {ContextMenu} from "../../model/ContextMenu";
import {ContextMenuCommand} from "../../model/ContextMenuCommand";
import * as GraphElementFactory from "../../model/GraphElementFactory";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeElement} from "../../model/GraphNodeData";
import {GraphArrowElement} from "../../model/GraphArrowData";
import {DialogEditNodeState} from "../../interfaces/DialogEditNodeInterfaces";


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
            this.state.nodes = [
                GraphElementFactory.getGraphElementAsNode('1', 'home', new GraphPosition(0, 0)),
                GraphElementFactory.getGraphElementAsNode('2', 'ikc', new GraphPosition(0, 50)),
                GraphElementFactory.getGraphElementAsNode('3', 'pawi', new GraphPosition(50, 0)),
                GraphElementFactory.getGraphElementAsNode('4', 'bda', new GraphPosition(50, 50))
            ]
            this.state.arrows = [
                GraphElementFactory.getGraphElementAsArrow('1', '2', 'project'),
                GraphElementFactory.getGraphElementAsArrow('2', '1', 'backlink'),
                GraphElementFactory.getGraphElementAsArrow('1', '3', 'project')
            ]
        }
    }

    onArrowCreated = (newArrow: GraphArrowElement, oldSourcePosition: GraphPosition) => {
        let arrows = this.state.arrows
        arrows.push(newArrow)
        this.state.arrows = arrows

        this.onNodePositionUpdated(newArrow.data.source, oldSourcePosition)
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

    handleSaveNode = (state: DialogEditNodeState) => {
        let nodes = this.state.nodes
        nodes.forEach((node) => {
            if (node.data.id == state.node.id) {
                node.data = state.node
            }
        })
        this.state.nodes = nodes
        this.handleCloseDialogNodeEdit()
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
                    () => {
                        console.log("delete node clicked")
                    }
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
                    onNewArrow={this.onArrowCreated.bind(this)}
                    onNodePositionUpdate={this.onNodePositionUpdated.bind(this)}
                />
                {(() => {
                    if (this.state.dialogNodeEditOpen) {
                        return (
                            this.props.dialogFactory.getDialogNodeEdit(
                                this.state.dialogNodeEditOpen, this.handleSaveNode.bind(this), this.handleCloseDialogNodeEdit.bind(this), this.state.nodeToEdit
                            )
                        )
                    }
                })()}
            </div>
        )
    }

}