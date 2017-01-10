import * as React from "react";
import {GraphProps, GraphState} from "./GraphInterfaces";
import {GuidService} from "../../common/GuidService"

import {GraphElementFactory} from "../../model/GraphElementFactory"
import {GraphPosition} from "../../model/GraphPosition";

let cytoscape = require('cytoscape');
let cytoscapeCtxmenu = require('cytoscape-cxtmenu');
let cytoscapeAutomove = require('cytoscape-automove');

// register dependencies
cytoscapeCtxmenu(cytoscape);
cytoscapeAutomove(cytoscape);

export default class Graph extends React.Component<GraphProps, GraphState> {

    private cy:any

    constructor(props:any) {
        super(props);
        this.state = {
            oldPosition: new Map<string, GraphPosition>(),
            pan: new GraphPosition(0,0)
        }
    }

    renderCytoscapeElement(){
        let that = this

        this.cy = (window as any).cy = cytoscape({
            container: document.getElementById('ikc-visual'),

            pan: this.state.pan,


            layout: {
                name: 'preset',
                fit: false,
                pan: 2,
            },

            style: [
                {
                    selector: 'node',
                    style: {
                        'content': 'data(label)',
                        'text-opacity': 0.8,
                        'text-valign': 'center',
                        'text-halign': 'right',
                        'background-color': '#11479e'
                    }
                },{
                    selector: 'edge',
                    style: {
                        'width': 1,
                        //'label': 'data(label)',
                        'target-arrow-shape': 'triangle',
                        'line-color': '#9dbaea',
                        'target-arrow-color': '#9dbaea',
                        'curve-style': 'bezier',
                        'control-point-step-size': 1,
                        'edge-text-rotation': 'autorotate'
                    }
                },{
                    selector: '.tmp',
                    style: {
                        'content': 'data(label)',
                        'text-opacity': 0.8,
                        'text-valign': 'center',
                        'text-halign': 'right',
                        'background-color': '#6299c4'
                    }
                }
            ],

            elements: {
                nodes: that.props.nodes,
                edges: that.props.links
            },

        });

        this.cy.on('taphold', function(e:any){
            that.cy.position = e.cyPosition
        })

        this.cy.on('pan', function(e:any){
            that.state.pan = e.cy.pan()
        })

        this.cy.on('add', function (e:any){
            console.log('added')
            console.log(e)
        })

        this.cy.nodes().on('grab', function(e:any) {

            let node = e.cyTarget;
            let oldPos = new GraphPosition(node.position('x'),node.position('y'))
            node.on('free', function(event:any) {
                let targetNode = that.cy.filter(function(i:number, element:any){
                    if(element.isNode() && element.id() != node.id() && that.close(node.position(), element.position())) {
                       return true
                    }
                    return false
                });

                if(targetNode.id()){
                    console.log("add link between" + node.id() + " and " + targetNode.id());
                    that.props.onNewLink(
                        GraphElementFactory.getGraphElementAsLink(GuidService.getRandomGuid(),node.id(),targetNode.id(),""),
                        oldPos
                    )
                    that.state.oldPosition.delete(node.id())
                }else{
                    console.log("update position for node: " + node.id());
                    that.props.onNodePositionUpdate(
                        node.id(),
                        new GraphPosition(node.position('x'),node.position('y'))
                    )
                }
                node.off('free')
            });

        });
        this.cy.cxtmenu(this.props.coreMenu);
        this.cy.cxtmenu(this.props.nodeMenu);


    }
    componentDidUpdate(){
        this.renderCytoscapeElement();
    }

    componentDidMount(){
        this.renderCytoscapeElement();
    }

    close(free:any, target:any) {
        let dx = Math.abs(free.x - target.x);
        let dy = Math.abs(free.y - target.y);
        let d = 10;
        if(dx < d && dy < d) return true;
        return false;
    }

    calcNodePosition(radius:number, angle:number, source: GraphPosition):GraphPosition{
        let pos = new GraphPosition(
            Math.round(source.x + radius * Math.cos((Math.PI / 180) * angle)),
            Math.round(source.y + radius * Math.sin((Math.PI / 180) * angle))
        )
        return pos
    }

    externalDrop(event:any){
        let that = this
        let tmpNodePosition = this.cy.$('#tmp').position()

        this.cy.$('#tmp').remove()

        this.cy.nodes().forEach((node:any) => {
            if(that.close(tmpNodePosition, node.position())){
                this.props.onNewNode(
                    GraphElementFactory.getGraphElementAsNode(
                        event.dataTransfer.getData("id"),
                        event.dataTransfer.getData("label"),
                        that.calcNodePosition(100, Math.random() * 360, node.position())
                    )
                )
                this.props.onNewLink(
                    GraphElementFactory.getGraphElementAsLink(GuidService.getRandomGuid(),node.id(),event.dataTransfer.getData("id"),""),
                    node.position()
                )
            }
        })

        this.props.onNewNode(
            GraphElementFactory.getGraphElementAsNode(
                event.dataTransfer.getData("id"),
                event.dataTransfer.getData("label"),
                tmpNodePosition
            )
        )

    }

    onDragOver(e:any) {
        let canvas = document.getElementById('ikc-visual')

        if(this.cy.$('#tmp').length > 0){
            this.cy.$('#tmp').position({
                x: e.clientX - canvas.getBoundingClientRect().left - this.state.pan.x,
                y: e.clientY - canvas.getBoundingClientRect().top - this.state.pan.y
            });
        }else{
            this.cy.add({
                group: "nodes",
                data: {id: "tmp"},
                classes: "tmp",
                renderedPosition: {
                    x: e.clientX - canvas.getBoundingClientRect().left - this.state.pan.x,
                    y: e.clientY - canvas.getBoundingClientRect().top - this.state.pan.y
                }
            });
        }
        console.log(e.dataTransfer.getData("id"))
        e.preventDefault();
    }

    render() {
        return(
            <div onDrop={this.externalDrop.bind(this)} onDragOver={this.onDragOver.bind(this)} id="ikc-visual"></div>
        )
    }

}