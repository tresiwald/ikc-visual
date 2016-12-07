import * as React from "react";
import {GraphScreenProps, GraphScreenStats} from "./GraphScreenInterfaces";
import Graph from "../Graph/Graph";
import {ContextMenu} from "../../model/ContextMenu";
import {ContextMenuCommand} from "../../model/ContextMenuCommand";
import * as GraphElementFactory from "../../model/GraphElementFactory"
import {GraphElement} from "../../model/GraphElement";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeElement} from "../../model/GraphNodeData";
import {GraphArrowElement} from "../../model/GraphArrowData";



export default class GraphScreen extends React.Component<GraphScreenProps, GraphScreenStats> {
    constructor(props:any) {
        super(props);
        this.state = {
            nodes: [],
            arrows: []
        }
    }

    initState = () => {
        if (this.state.timestamp != this.props.timestamp) {
            this.state.timestamp = this.props.timestamp
            this.state.nodes = [
                GraphElementFactory.getGraphElementAsNode('home', new GraphPosition(0,0)),
                GraphElementFactory.getGraphElementAsNode('ikc', new GraphPosition(0,50)),
                GraphElementFactory.getGraphElementAsNode('pawi', new GraphPosition(50,0)),
                GraphElementFactory.getGraphElementAsNode('bda', new GraphPosition(50,50))
            ]
            this.state.arrows = [
                GraphElementFactory.getGraphElementAsArrow('home','ikc','project'),
                GraphElementFactory.getGraphElementAsArrow('ikc','home','backlink'),
                GraphElementFactory.getGraphElementAsArrow('home','pawi','project')
            ]
        }
    }

    onArrowCreated = (newArrow: GraphArrowElement, oldSourcePosition:GraphPosition) => {
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

    onNodePositionUpdated = (nodeId:string, position:GraphPosition) =>{
        let nodes = this.state.nodes
        nodes.forEach((node) =>{
            if(node.data.id == nodeId){
                node.position = position
            }
        })
        this.setState({
            nodes: nodes
        })
    }

    render() {
        this.initState()

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
                    () => {
                        console.log("edit node clicked")
                    }
                ),
            ]
        )

        return(
            <Graph
                nodes={this.state.nodes}
                arrows={this.state.arrows}
                coreMenu={coreMenu}
                nodeMenu={nodeMenu}
                onNewNode={this.onNodeCreated.bind(this)}
                onNewArrow={this.onArrowCreated.bind(this)}
                onNodePositionUpdate={this.onNodePositionUpdated.bind(this)}
            />
        )
    }

}