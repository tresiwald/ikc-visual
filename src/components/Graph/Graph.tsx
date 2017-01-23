import * as React from "react";
import {GraphProps, GraphState} from "./GraphInterfaces";
import {GraphElementFactory} from "../../model/GraphElementFactory";
import {GraphPosition} from "../../model/GraphPosition";
import {VISIBILITY} from "../../model/VISIBILITY";
import {DOMHelperService} from "../../common/DOMHelperService";
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;

let cytoscape = require('cytoscape');
let cytoscapeCtxmenu = require('cytoscape-cxtmenu');

declare function $(a: any): any

// register dependencies
cytoscapeCtxmenu(cytoscape);

declare function registerDropZone(onDrop: Function): any

/**
 * This react component wraps the cytoscape object. All events within the cytoscape context are registered at this point.
 */
export default class Graph extends React.Component<GraphProps, GraphState> {
    /** cytoscape object */
    private cy: any

    constructor(props: any) {
        super(props);
        this.state = {
            oldPosition: new Map<string, GraphPosition>(),
            pan: new GraphPosition(0, 0)
        }

    }

    /**
     * Render the cytoscape object
     */
    renderCytoscapeElement() {
        let that = this

        /** Check if there is already an cytoscape object */
        if (this.cy) {
            /** Remove all current nodes and links */
            this.cy.nodes().remove()
            this.cy.edges().remove()

            /** Add the new nodes and links */
            this.props.nodes.forEach((node) => {
                this.cy.add(node)
            })
            this.props.links.forEach((link) => {
                this.cy.add(link)
            })

            /** Update with the current pan value */
            this.cy.pan(this.state.pan)

        } else {
            /** Create the cytoscape object */
            this.cy = (window as any).cy = cytoscape({

                /** Define the container element for the visualisation */
                container: document.getElementById('ikc-visual'),

                /** Update the pan value*/
                pan: this.state.pan,

                /** Setup the layout */
                layout: {
                    name: 'preset',
                    fit: false,
                    pan: 2,
                },

                /** Define styling rules for the different elements and classes */
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
                            'label': 'data(label)',
                            'target-arrow-shape': 'triangle',
                            'line-color': '#9dbaea',
                            'target-arrow-color': '#9dbaea',
                            'curve-style': 'bezier',
                            'control-point-step-size': 5,
                            'edge-text-rotation': 'autorotate'
                        }
                    }, {
                        selector: 'edge.selected',
                        style: {
                            'target-arrow-shape': 'triangle',
                            'line-color': '#CC11AA',
                            'target-arrow-color': '#CC11AA',
                        }
                    }
                ],

                /** set the elements */
                elements: {
                    nodes: that.props.nodes,
                    edges: that.props.links
                },

            });

            /** Register events on the cytoscape core (whole visualisation) */

            /** Save the current tap position on 'taphold' */
            this.cy.on('taphold', function (e: any) {
                that.cy.position = e.cyPosition
            })

            /** Save the current pan value on 'pan' */
            this.cy.on('pan', function (e: any) {
                that.state.pan = e.cy.pan()
            })

            /** Notify to display the core context menu on 'cxttap' (rightclick) on a empty place on the core */
            this.cy.on('cxttap', function (e: any) {

                /** Make sure no node is the target */
                if (!e.cyTarget.id) {
                    let position = new GraphPosition(e.cyPosition.x + that.state.pan.x, e.cyPosition.y + that.state.pan.y)
                    that.props.onCoreContextMenuRequested(position)

                }
            })
            /** Notify to display the core context menu on 'taphold' (longtap) on a empty place on the core */
            this.cy.on('taphold', function (e: any) {

                /** Make sure no node is the target */
                if (!e.cyTarget.id) {
                    let position = new GraphPosition(e.cyPosition.x + that.state.pan.x, e.cyPosition.y + that.state.pan.y)
                    that.props.onCoreContextMenuRequested(position)
                }
            })
        }


        /** Register events on the cytoscape elements (nodes, links) */

        /**
         * Update changed node-position, when a the new position ends on a existing node the link create will be initiated
         * -> node grab (register free event)
         * -> node free (react to the new node position)
         */

        this.cy.nodes().on('grab', function (e: any) {

            let node = e.cyTarget;
            let oldPos = new GraphPosition(node.position('x'), node.position('y'))

            /** Register 'free' event listener */
            node.one('free', function (event: any) {

                /** Get the targetNode of the new postion, empty if the node ends in a empty position => no new link is needed*/
                let targetNode = that.cy.filter(function (i: number, element: any) {
                    if (element.isNode() && element.id() != node.id() && DOMHelperService.close(node.position(), element.position())) {
                        return true
                    }
                    return false
                });

                /** Initiate new link creation */
                if (targetNode.id()) {
                    console.log("add link between" + node.id() + " and " + targetNode.id());

                    /** Create new link and send it for further processing */
                    that.props.onNewLink(
                        GraphElementFactory.getGraphElementAsLink(that.props.identityService.createNewLinkId(), node.id(), targetNode.id(), VISIBILITY.VISIBLE),
                        oldPos
                    )
                    that.state.oldPosition.delete(node.id())
                } else {
                    console.log("update position for node: " + node.id());

                    /** Update the node positon */
                    that.props.onNodePositionUpdate(
                        node.id(),
                        new GraphPosition(node.position('x'), node.position('y'))
                    )
                }
            });

        });

        /** Register event to listen 'click' events on edges */
        this.cy.edges().on('click', function (e: any) {
            that.props.onLinkSelected(e.cyTarget)
        })


        /** Register event to listen 'click' events on node */
        this.cy.nodes().on('click', function (e: any) {
            if (!e.cyTarget.hasClass('parent')) {
                that.props.onNodeDetailRequest(e.cyTarget.data())
            }
        })

        /** Register event to listen 'cxttap' (right click) events on nodes, to open the node context menu */
        this.cy.nodes().on('cxttap', function (e: any) {
            let clone = GraphElementFactory.getNode(e.cyTarget.data(), new GraphPosition(e.cyTarget.position().x + that.state.pan.x, e.cyTarget.position().y + that.state.pan.y), VISIBILITY.VISIBLE)
            that.props.onNodeContextMenuRequested(clone)
        })

        /** Register event to listen 'taphold' events on nodes, to open the node context menu */
        this.cy.nodes().on('taphold', function (e: any) {
            let clone = GraphElementFactory.getNode(e.cyTarget.data(), new GraphPosition(e.cyTarget.position().x + that.state.pan.x, e.cyTarget.position().y + that.state.pan.y), VISIBILITY.VISIBLE)
            that.props.onNodeContextMenuRequested(clone)
        })

        /** Add the needed classes for all nodes */
        this.cy.nodes().forEach((node: any) => {
            let inputNode = that.props.nodes.filter((n) => n.data.id == node.id())[0]
            if (inputNode.nodeClasses.length) {
                inputNode.nodeClasses.forEach((c: any) => {
                    node.addClass(c)

                })
            }
        })

        /** Add the needed classes for all links */
        this.cy.edges().forEach((link: any) => {
            let inputLink = that.props.links.filter((n) => n.data.id == link.id())[0]
            if (inputLink.linkClasses.length) {
                inputLink.linkClasses.forEach((c: any) => {
                    link.addClass(c)

                })
            }
        })

    }

    /** Update cytoscape on updates */
    componentDidUpdate() {
        this.renderCytoscapeElement();
    }

    /** Update cytoscape on mount*/
    componentDidMount() {
        this.renderCytoscapeElement();
        registerDropZone(this.externalDrop.bind(this))
    }

    /**
     * Process an external drop on the cytoscape core with e.g. D'n'D a item from a search field
     * @param event
     */
    externalDrop(event: any) {
        let that = this

        let canvas = document.getElementById('ikc-visual')

        /** Add a temporary node to calculate the correct position */
        this.cy.add({
            group: "nodes",
            data: {id: "tmp"},
            classes: "tmp",
            renderedPosition: {
                x: event.clientX - canvas.getBoundingClientRect().left - this.state.pan.x,
                y: event.clientY - canvas.getBoundingClientRect().top - this.state.pan.y
            }
        });

        /** Get the temporary position and remove the node */
        let tmpNodePosition = this.cy.$('#tmp').position()
        this.cy.$('#tmp').remove()

        /**
         * Check if the drop occurred to a existing node => a new link is needed
         */
        this.cy.nodes().forEach((node: any) => {
            if (DOMHelperService.close(tmpNodePosition, node.position())) {

                /** Create the dropped node with a random position around the target node */
                this.props.onNewNode(
                    GraphElementFactory.getGraphElementAsNode(
                        event.id,
                        DOMHelperService.calcNodePosition(node.position()), VISIBILITY.VISIBLE
                    )
                )

                /** Create the link between the dropped node and the target node */
                this.props.onNewLink(
                    GraphElementFactory.getGraphElementAsLink(that.props.identityService.createNewLinkId(), event.id, node.id(), VISIBILITY.VISIBLE),
                    node.position()
                )
            }
        })


        /**
         *
         */
        this.props.onNewNode(
            GraphElementFactory.getGraphElementAsNode(
                event.id,
                new GraphPosition(
                    event.clientX - canvas.getBoundingClientRect().left - this.state.pan.x,
                    event.clientY - canvas.getBoundingClientRect().top - this.state.pan.y
                ), VISIBILITY.VISIBLE
            )
        )

    }

    render() {
        return (
            <div>
                <div id="ikc-visual"></div>
            </div>
        )
    }

}