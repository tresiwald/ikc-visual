import * as React from "react";
import {GraphProps} from "./GraphInterfaces";

import * as GraphElementFactory from "../../model/GraphElementFactory"
import {GraphArrowData} from "../../model/GraphArrowData";
import {GraphPosition} from "../../model/GraphPosition";

let dagre = require('dagre');
let cydagre = require('cytoscape-dagre');
let cytoscape = require('cytoscape');
let cytoscapeCtxmenu = require('cytoscape-cxtmenu');

// register dependencies
cydagre(cytoscape, dagre);
cytoscapeCtxmenu(cytoscape, dagre);

export default class Graph extends React.Component<GraphProps, {}> {

    private cy:any

    constructor(props:any) {
        super(props);
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
                        'content': 'data(id)',
                        'text-opacity': 0.5,
                        'text-valign': 'center',
                        'text-halign': 'right',
                        'background-color': '#11479e'
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'width': 4,
                        //'label': 'data(label)',
                        'target-arrow-shape': 'triangle',
                        'line-color': '#9dbaea',
                        'target-arrow-color': '#9dbaea',
                        'curve-style': 'bezier'
                    }
                }
            ],

            elements: {
                nodes: that.props.nodes,
                edges: that.props.arrows
            },

        });
        this.cy.on('grab', function(e:any) {

            let node = e.cyTarget;
            let oldPos = node.position();
            console.log("Source: " + node.id());


            that.cy.on('free', function(e:any) {
                let targetNode = that.cy.filter(function(i:any, element:any){

                    if(!element.isNode()){
                        that.props.onNodePositionUpdate(
                            node.id(),
                            new GraphPosition(node.position('x'),node.position('y'))
                        )
                    }else if(element.isNode() && element.id() != node.id() && close(node.position(), element.position())) {
                        console.log("dropped on node (target): " + element.id());
                        that.props.onNewArrow(
                            GraphElementFactory.getGraphElementAsArrow(node.id(),element.id(),""),
                            oldPos
                        )
                    }


                });

            });

            function close(free:any, target:any) {
                let dx = Math.abs(free.x - target.x);
                let dy = Math.abs(free.y - target.y);
                let d = 10;
                if(dx < d && dy < d) return true;
                return false;
            }
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

    render() {
        return(
            <div id="ikc-visual"></div>
        )
    }

}