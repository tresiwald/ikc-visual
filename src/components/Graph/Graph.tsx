import * as React from "react";
import * as ReactDOM from "react-dom";
import {GraphProps, GraphState} from "./GraphInterfaces";
import {GuidService} from "../../common/GuidService";
import {GraphElementFactory} from "../../model/GraphElementFactory";
import {GraphPosition} from "../../model/GraphPosition";
import {MuiThemeProvider} from "material-ui/styles";
import ExpandDialog from "../ExpandDialog/ExpandDialog";
import {GraphLinkData} from "../../model/GraphLinkData";
import {TimeService} from "../../common/TimeService";
import {VISIBILITY} from "../../model/VISIBILITY";
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;

let cytoscape = require('cytoscape');
let cytoscapeCtxmenu = require('cytoscape-cxtmenu');

declare function $(a: any): any

// register dependencies
cytoscapeCtxmenu(cytoscape);

declare function registerDropZone(onDrop: Function): any

export default class Graph extends React.Component<GraphProps, GraphState> {
    private cy: any
    private nodeIdentifier = 'collapsedNodes';
    private edgeIdentifier = 'collapsedEdges';
    private container: any
    private nodeListWrapper: any

    constructor(props: any) {
        super(props);
        this.state = {
            oldPosition: new Map<string, GraphPosition>(),
            pan: new GraphPosition(0, 0)
        }

    }

    renderCytoscapeElement() {
        let that = this

        // init basic context
        this.cy = (window as any).cy = cytoscape({
            container: document.getElementById('ikc-visual'),

            pan: this.state.pan,

            boxSelectionEnabled: true,
            autounselectify: false,
            selectionType: 'additive',

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
                }, {
                    selector: 'edge',
                    style: {
                        'width': 1,
                        //'label': 'data(label)',
                        'target-arrow-shape': 'triangle',
                        'line-color': '#9dbaea',
                        'target-arrow-color': '#9dbaea',
                        'curve-style': 'bezier',
                        'control-point-step-size': 5,
                        'edge-text-rotation': 'autorotate'
                    }
                }, {
                    selector: 'edge:selected',
                    style: {
                        'target-arrow-shape': 'triangle',
                        'line-color': '#CC11AA',
                        'target-arrow-color': '#CC11AA',
                    }
                }, {
                    selector: 'node.parent',
                    style: {
                        'background-color': '#CC11AA',
                    }
                },
            ],

            elements: {
                nodes: that.props.nodes,
                edges: that.props.links
            },

        });

        this.cy.nodes().forEach((node:any)=> {
            let inputNode = that.props.nodes.filter((n) => n.data.id == node.id())[0]
            if (inputNode.nodeClasses.length) {
                inputNode.nodeClasses.forEach((c: any) => {
                    node.addClass(c)

                })
            }
        })


        // save position on tap
        this.cy.on('taphold', function (e: any) {
            that.cy.position = e.cyPosition
        })

        // save pan context
        this.cy.on('pan', function (e: any) {
            that.state.pan = e.cy.pan()
        })

        // setup drag and drop to connect to nodes
        this.cy.nodes().on('grab', function (e: any) {

            let node = e.cyTarget;
            let oldPos = new GraphPosition(node.position('x'), node.position('y'))
            node.on('free', function (event: any) {
                let targetNode = that.cy.filter(function (i: number, element: any) {
                    if (element.isNode() && element.id() != node.id() && that.close(node.position(), element.position())) {
                        return true
                    }
                    return false
                });

                if (targetNode.id()) {
                    console.log("add link between" + node.id() + " and " + targetNode.id());
                    that.props.onNewLink(
                        GraphElementFactory.getGraphElementAsLink(GuidService.getRandomGuid(), node.id(), targetNode.id(), "",VISIBILITY.VISIBLE),
                        oldPos
                    )
                    that.state.oldPosition.delete(node.id())
                } else {
                    console.log("update position for node: " + node.id());
                    that.props.onNodePositionUpdate(
                        node.id(),
                        new GraphPosition(node.position('x'), node.position('y'))
                    )
                }
                node.off('free')
            });

        });

        // setup overlay
        /*this.container = $(this.cy.container())
        this.nodeListWrapper = $('<div id="nodeListWrapper"></div>')
        this.nodeListWrapper.css({
            position: 'absolute',
            zIndex: 15002,
            width: 300,
            height: 400,
            display: 'block',
            overflow: 'hidden',
            'pointer-events': 'none',
            visibility:'hidden',
            padding: 10
        });
        $("body").append(this.nodeListWrapper);*/

        this.nodeListWrapper = document.createElement('div')

        this.cy.on('tap', 'node.parent', function (evt: any) {

            let node = evt.cyTarget;

            that.props.onFilterWindowRequested(GraphElementFactory.getNode(node.data(),node.position(), VISIBILITY.VISIBLE))

        });

        // add contextmenu
        this.cy.cxtmenu(this.props.coreMenu);
        this.cy.cxtmenu(this.props.nodeMenu);

    }

    componentDidUpdate() {
        this.renderCytoscapeElement();
    }

    componentDidMount() {
        this.renderCytoscapeElement();
        registerDropZone(this.externalDrop.bind(this))

        let that = this
        let div = document.createElement('div')
        div.id = 'toolbar'
        div.innerHTML = "COLLAPSE"
        div.addEventListener('click', function () {
            let selectedEdges = that.cy.$("edge:selected");
            that.collapseEdges(selectedEdges)
        })
        document.getElementById('ikc-visual').appendChild(div)
    }

    close(free: any, target: any) {
        let dx = Math.abs(free.x - target.x);
        let dy = Math.abs(free.y - target.y);
        let d = 10;
        if (dx < d && dy < d) return true;
        return false;
    }

    calcNodePosition(radius: number, angle: number, source: GraphPosition): GraphPosition {
        let pos = new GraphPosition(
            Math.round(source.x + radius * Math.cos((Math.PI / 180) * angle)),
            Math.round(source.y + radius * Math.sin((Math.PI / 180) * angle))
        )
        return pos
    }

    externalDrop(event: any) {
        let that = this

        let canvas = document.getElementById('ikc-visual')

        this.cy.add({
            group: "nodes",
            data: {id: "tmp"},
            classes: "tmp",
            renderedPosition: {
                x: event.clientX - canvas.getBoundingClientRect().left - this.state.pan.x,
                y: event.clientY - canvas.getBoundingClientRect().top - this.state.pan.y
            }
        });

        let tmpNodePosition = this.cy.$('#tmp').position()

        this.cy.$('#tmp').remove()

        this.cy.nodes().forEach((node: any) => {
            if (that.close(tmpNodePosition, node.position())) {
                this.props.onNewNode(
                    GraphElementFactory.getGraphElementAsNode(
                        event.id,
                        "test",
                        that.calcNodePosition(100, Math.random() * 360, node.position()),VISIBILITY.VISIBLE
                    )
                )
                this.props.onNewLink(
                    GraphElementFactory.getGraphElementAsLink(GuidService.getRandomGuid(), node.id(), event.id, "",VISIBILITY.VISIBLE),
                    node.position()
                )
            }
        })

        this.props.onNewNode(
            GraphElementFactory.getGraphElementAsNode(
                event.id,
                "test",
                new GraphPosition(
                    event.clientX - canvas.getBoundingClientRect().left - this.state.pan.x,
                    event.clientY - canvas.getBoundingClientRect().top - this.state.pan.y
                ),VISIBILITY.VISIBLE
            )
        )

    }

    collapseEdges(edges: any) {
        if(edges.length == 1){
            this.props.onEdgesCollapse([edges.data()])
        }else{
            let list:GraphLinkData[] = []
            edges.forEach((edge:any) =>{
                list.push(edge.data())
            })
            this.props.onEdgesCollapse(list)
        }
    }

    render() {
        return (
            <div>
                <div id="ikc-visual"></div>
            </div>
        )
    }

}