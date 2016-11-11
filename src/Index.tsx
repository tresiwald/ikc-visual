import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route} from "react-router";
import * as injectTapEventPlugin from "react-tap-event-plugin";

import {MuiThemeProvider} from "material-ui/styles";
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;
import {Paper} from "material-ui";

let dagre = require('dagre');
let cydagre = require('cytoscape-dagre');
let cytoscape = require('cytoscape');

// register dependencies
cydagre(cytoscape, dagre);

import {View} from "ikc-visual-interfaces/src/common/interfaces/View";

init();

function init() {

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
                {data: {id: 'home'}},
                {data: {id: 'ikc'}},
                {data: {id: 'pawi'}},
                {data: {id: 'bda'}},
            ],
            edges: [
                {data: {source: 'home', target: 'ikc', label: 'project'}},
                {data: {source: 'ikc', target: 'home', label: 'backlink'}},
                {data: {source: 'home', target: 'pawi', label: 'project'}},
            ]
        },

    });

}
/** Init need tap eventplug of material-ui */
injectTapEventPlugin();

/**
 *  maybe needed later?
 *
ReactDOM.render((
    <div id="wrapper">
        <MuiThemeProvider>
            <Paper zDepth={1}>
                <h1>Empty Template</h1>
            </Paper>
        </MuiThemeProvider>
    </div>
), document.getElementById("ikc-visual"));

    */