import * as React from "react";
import {GraphScreenProps} from "ikc-visual-interfaces/src/common/components/GraphScreen/GraphScreenInterface";

let dagre = require('dagre');
let cydagre = require('cytoscape-dagre');
let cytoscape = require('cytoscape');

// register dependencies
cydagre(cytoscape, dagre);

export default class GraphScreen extends React.Component<GraphScreenProps, {}> {

    constructor(props:any) {
        super(props);
        this.initCytoscape();
    }

    initCytoscape() {
        let cy = (window as any).cy = cytoscape({
            container: document.getElementById('ikc-visual'),

            boxSelectionEnabled: false,
            autounselectify: true,

            layout: {
                name: 'dagre'
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
                nodes: [
                    {data: {id: 'home', label: 'home'}},
                    {data: {id: 'ikc', label: 'ikc'}},
                    {data: {id: 'pawi', label: 'pawi'}},
                    {data: {id: 'bda', label: 'bda'}},
                ],
                edges: [
                    {data: {source: 'home', target: 'ikc', label: 'project'}},
                    {data: {source: 'ikc', target: 'home', label: 'backlink'}},
                    {data: {source: 'home', target: 'pawi', label: 'project'}},
                ]
            },

        });
    }

}