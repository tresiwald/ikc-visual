import * as React from "react";
import {GraphProps, GraphState} from "./GraphInterfaces";
import * as GuidService from "../../common/GuidService"

import * as GraphElementFactory from "../../model/GraphElementFactory"
import {GraphLinkData} from "../../model/GraphLinkData";
import {GraphPosition} from "../../model/GraphPosition";

let dagre = require('dagre');
let cydagre = require('cytoscape-dagre');
let cytoscape = require('cytoscape');
let cytoscapeCtxmenu = require('cytoscape-cxtmenu');

// register dependencies
cydagre(cytoscape, dagre);
cytoscapeCtxmenu(cytoscape, dagre);

export default class Graph extends React.Component<GraphProps, GraphState> {

    private cy:any

    constructor(props:any) {
        super(props);
        this.state = {
            oldPosition: new Map<string, GraphPosition>()
        }
    }

    renderCytoscapeElement(){
        let that = this
        this.cy = (window as any).cy = cytoscape({
            container: document.getElementById('ikc-visual'),

            boxSelectionEnabled: false,
            autounselectify: true,

            layout: {
                name: 'preset'
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
                        'width': 3,
                        //'label': 'data(label)',
                        'target-arrow-shape': 'triangle',
                        'line-color': '#9dbaea',
                        'target-arrow-color': '#9dbaea',
                        'curve-style': 'bezier',
                        'edge-text-rotation': 'autorotate'
                    }
                }
            ],

            elements: {
                nodes: that.props.nodes,
                edges: that.props.arrows
            },

        });


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
                    console.log("add arrow between" + node.id() + " and " + targetNode.id());
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

    render() {
        return(
            <div id="ikc-visual"></div>
        )
    }

}