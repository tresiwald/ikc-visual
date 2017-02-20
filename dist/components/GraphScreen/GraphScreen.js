"use strict";
const React = require("react");
const Graph_1 = require("../Graph/Graph");
const GraphElementFactory_1 = require("../../model/GraphElementFactory");
const GraphPosition_1 = require("../../model/GraphPosition");
const VISIBILITY_1 = require("../../model/VISIBILITY");
const material_ui_1 = require("material-ui");
const ViewFactory_1 = require("../../model/ViewFactory");
const CoreContextMenu_1 = require("../ContextMenus/CoreContextMenu");
const NodeContextMenu_1 = require("../ContextMenus/NodeContextMenu");
const DOMHelperService_1 = require("../../common/DOMHelperService");
/**
 * Wrapper react component for the graph component. This component will be used from any other application which use this package.
 */
class GraphScreen extends React.Component {
    constructor(props) {
        super(props);
        /**
         * Load the initial state
         */
        this.componentWillReceiveProps = (nextProps) => {
            this.initState(nextProps);
        };
        this.componentWillMount = () => {
            this.initState(this.props);
        };
        this.initState = (props) => {
            let nodes = new Map();
            let links = new Map();
            /** Fill up the maps */
            this.props.viewToLoad.nodes.forEach((node) => {
                nodes.set(node.data.id, node);
            });
            this.props.viewToLoad.links.forEach((link) => links.set(link.data.id, link));
            this.setState({
                nodes: nodes,
                links: links
            });
        };
        /**
         * Save or update a link
         * @param link
         */
        this.saveLink = (link) => {
            let links = this.state.links;
            links.set(link.data.id, link);
        };
        /**
         * Save or update a node
         * @param node
         */
        this.saveNode = (node) => {
            let nodes = this.state.nodes;
            nodes.set(node.data.id, node);
        };
        /**
         * Return a certain node
         * @param nodeId
         * @return {GraphNodeElement}
         */
        this.getNode = (nodeId) => {
            let node = this.state.nodes.get(nodeId);
            if (node == undefined) {
                console.log(nodeId + 'undefined');
            }
            return node;
        };
        /**
         * Return a certain link
         * @param linkId
         * @return {GraphLinkElement}
         */
        this.getLink = (linkId) => {
            return this.state.links.get(linkId);
        };
        /**
         * Hides a certain node and save
         * @param node
         */
        this.hideNode = (node) => {
            node.visibility = VISIBILITY_1.VISIBILITY.HIDDEN;
            this.saveNode(node);
        };
        /**
         * Hides a certain link and save
         * @param link
         */
        this.hideLink = (link) => {
            link.visibility = VISIBILITY_1.VISIBILITY.HIDDEN;
            this.saveLink(link);
        };
        /**
         * Shows a certain node and save
         * @param node
         */
        this.showNode = (node) => {
            node.visibility = VISIBILITY_1.VISIBILITY.VISIBLE;
            this.saveNode(node);
        };
        /**
         * Shows a certain link and save
         * @param link
         */
        this.showLink = (link) => {
            link.visibility = VISIBILITY_1.VISIBILITY.VISIBLE;
            this.saveLink(link);
        };
        /**
         * Check if there additional elements to display
         * @param sourceNode
         */
        this.checkMoreElementsToDisplay = (sourceNode) => {
            let links = this.state.links;
            let nodes = this.state.nodes;
            /** Make sure not more than 7 links are displayed  */
            var counter = 0;
            links.forEach((link) => {
                /** Make all children visible and their link to the new node */
                if (link.data.source == sourceNode.data.id && counter < 7) {
                    counter = counter + 1;
                    this.showLink(link);
                    /** Calculate new position for child node and make it visible*/
                    let targetNode = this.getNode(link.data.target);
                    if (targetNode.position.x == 0 && targetNode.position.y == 0) {
                        targetNode.position = DOMHelperService_1.DOMHelperService.calcNodePosition(sourceNode.position);
                    }
                    this.showNode(targetNode);
                    /** Check if there are other hidden links which have to make visible */
                    links.forEach((targetLink) => {
                        if (targetLink.data.source == targetNode.data.id && this.getNode(targetLink.data.target).visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                            this.showLink(targetLink);
                        }
                        if (targetLink.data.target == targetNode.data.id && this.getNode(targetLink.data.source).visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                            this.showLink(targetLink);
                        }
                    });
                }
                /** Check if there are other hidden links which have to make visible */
                if (link.data.source == sourceNode.data.id && this.getNode(link.data.target).visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                    this.showLink(link);
                }
                if (link.data.target == sourceNode.data.id && this.getNode(link.data.source).visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                    this.showLink(link);
                }
            });
        };
        /**
         * Save the new link from graph component in the model, the view update has to executed from outside this package
         * @param newLink - the new link element to save
         * @param oldSourcePosition - oldposition of the source node
         */
        this.fromGraphNewLink = (newLink, oldSourcePosition) => {
            /** Save link */
            this.saveLink(newLink);
            /** Update source node to old position */
            this.fromGraphPositionUpdated(newLink.data.source, oldSourcePosition);
            /** Save the updated view and make sure that external models are notified about the new link */
            this.saveView();
            this.props.operationService.createLink(newLink.data.id, newLink.data.source, newLink.data.target, "");
        };
        /**
         * Save a new node a make sure all his children are visible
         * @param existingNode - node to save or update
         */
        this.fromGraphExistingNode = (existingNode) => {
            this.saveNode(existingNode);
            this.checkMoreElementsToDisplay(existingNode);
            this.saveView();
        };
        /**
         * Update the position of a node
         * @param nodeId - id of the node
         * @param position - new position
         */
        this.fromGraphPositionUpdated = (nodeId, position) => {
            let node = this.getNode(nodeId);
            node.position = position;
            this.saveNode(node);
            this.saveView();
        };
        /**
         * Add a new node from the 'new node' dialog and forward the state of the dialog to the external model
         * @param state
         */
        this.fromDialogNewNode = (state) => {
            let node = state.node;
            this.showNode(node);
            this.saveView();
            /** Make sure the dialog will close */
            this.setState({
                dialogNewNodeOpen: false
            }, () => {
                this.props.operationService.createNodeFromDialogState(state);
            });
        };
        /**
         * Add a existing node to the view - created through the core context menu
         * @param nodeId
         */
        this.fromMenuExistingNode = (nodeId) => {
            /** Make node visible and update position */
            let node = this.getNode(nodeId);
            node.position = this.state.tappedPosition;
            this.showNode(node);
            this.checkMoreElementsToDisplay(node);
            /** Make sure the menu will close */
            this.saveView();
            this.setState({
                coreContextMenuOpen: false
            });
        };
        /**
         * Add a new node from the dialog and connect it to a node
         * @param state - dialog state
         */
        this.fromDialogNewNodeToConnect = (state) => {
            /** Save new node and link */
            let node = GraphElementFactory_1.GraphElementFactory.getGraphElementAsNode(state.link.data.target, new GraphPosition_1.GraphPosition(this.state.tappedPosition.x + 10, this.state.tappedPosition.y + 10), VISIBILITY_1.VISIBILITY.VISIBLE);
            this.saveNode(node);
            let link = state.link;
            this.saveLink(link);
            this.saveView();
            /** Update the external model */
            /** Make sure the dialog will close */
            this.setState({
                dialogNewNodeToConnectOpen: false
            }, () => {
                this.props.operationService.createNodeWithLinkFromDialogState(state);
            });
        };
        /**
         * Add a existing node from a dialog and connect it to a node
         * @param state - dialog state
         */
        this.fromDialogExistingNodeToConnect = (state) => {
            /** Save new node and link */
            let node = GraphElementFactory_1.GraphElementFactory.getNode(this.getNode(state.link.target).data, new GraphPosition_1.GraphPosition(this.state.tappedPosition.x + 40, this.state.tappedPosition.y + 40), VISIBILITY_1.VISIBILITY.VISIBLE);
            this.saveNode(node);
            let link = GraphElementFactory_1.GraphElementFactory.getGraphElementAsLink(this.props.identityService.createNewLinkId(), this.state.tappedNode.id, state.link.target, VISIBILITY_1.VISIBILITY.VISIBLE);
            this.saveLink(link);
            this.saveView();
            /** Update the external model */
            /** Make sure the dialog will close */
            this.setState({
                dialogSearchNodeToConnectOpen: false
            }, () => {
                this.props.operationService.createLink(state.link.id, this.state.tappedNode.id, state.link.target, state.nodeName);
            });
        };
        /**
         * Hide node command from menu
         */
        this.fromMenuHideNode = () => {
            this.hideNodeAndHisLinks(this.state.tappedNode.id);
        };
        /**
         * Hide specific node
         * @param id
         */
        this.hideNodeAndHisLinks = (id) => {
            let links = this.state.links;
            /** Hide node */
            let node = this.getNode(id);
            this.hideNode(node);
            /** Hide links */
            links.forEach((link) => {
                if (link.data.source == id) {
                    this.hideLink(link);
                    if (this.getNumberOfLinksForNode(link.data.target) == 0) {
                        this.hideNode(this.getNode(link.data.target));
                    }
                }
                else if (link.data.target == id) {
                    this.hideLink(link);
                    if (this.getNumberOfLinksForNode(link.data.source) == 0) {
                        this.hideNode(this.getNode(link.data.source));
                    }
                }
            });
            this.saveView();
        };
        /**
         * Close the 'new node' dialog
         */
        this.closeNewNodeDialog = () => {
            this.setState({
                dialogNewNodeOpen: false
            });
        };
        /**
         * Open the 'new node' dialog, also close all open menus and save the tapped position
         */
        this.openNewNodeDialog = (element) => {
            this.setState({
                dialogNewNodeOpen: true,
                nodeContextMenuOpen: false,
                coreContextMenuOpen: false,
                tappedPosition: element.position
            });
        };
        /**
         * Close the 'new node and connect to existing node' dialog
         */
        this.closeNewNodeToConnectDialog = () => {
            this.setState({
                dialogNewNodeToConnectOpen: false
            });
        };
        /**
         * Open the 'new node and connect to existing node' dialog, also close all open menus and save the tapped position and tapped node
         */
        this.openNewNodeToConnectDialog = (element) => {
            this.setState({
                nodeContextMenuOpen: false,
                coreContextMenuOpen: false,
                dialogNewNodeToConnectOpen: true,
                tappedPosition: element.position(),
                tappedNode: element.data()
            });
        };
        /**
         * Close the 'search node and connect to existing node' dialog
         */
        this.closeSearchNodeToConnectDialog = () => {
            this.setState({
                dialogSearchNodeToConnectOpen: false
            });
        };
        /**
         * Open the 'search node and connect to existing node' dialog, also close all open menus
         */
        this.openSearchNodeToConnectDialog = () => {
            this.setState({
                nodeContextMenuOpen: false,
                coreContextMenuOpen: false,
                dialogSearchNodeToConnectOpen: true
            });
        };
        /**
         * Forward the request to display the node detail of the tapped node
         * Will called either from the menu or the graph
         */
        this.nodeDetailRequested = () => {
            this.hideNodeMenu();
            this.props.onNodeDetailRequest(this.state.tappedNode.id);
        };
        /**
         * Save the current view and forward to the external package to save
         * This has to trigger a reload of this component
         */
        this.saveView = () => {
            let view = ViewFactory_1.ViewFactory.viewFromMaps(this.state.nodes, this.state.links, this.props.viewToLoad.title);
            view.id = this.props.viewToLoad.id;
            this.props.operationService.saveView(view);
        };
        /** Show core context menu and hide the node context menu*/
        this.showCoreMenu = () => {
            this.setState({
                coreContextMenuOpen: true,
                nodeContextMenuOpen: false
            });
        };
        /** Hide core context menu */
        this.hideCoreMenu = () => {
            this.setState({
                coreContextMenuOpen: false
            });
        };
        /** Show node context menu and hide the core context menu*/
        this.showNodeMenu = () => {
            this.setState({
                nodeContextMenuOpen: true,
                coreContextMenuOpen: false
            });
        };
        /** Show node context menu */
        this.hideNodeMenu = () => {
            this.setState({
                nodeContextMenuOpen: false
            });
        };
        /**
         * Save the type of the new node and open the 'new node' dialog
         * @param type
         */
        this.fromMenuNewNodeDialog = (type) => {
            this.hideCoreMenu();
            this.setState({
                newNodeType: type,
                dialogNewNodeOpen: true
            });
        };
        /**
         * Save the type of the new node and open the 'new node and oonnect to exsting node' dialog
         * @param type
         */
        this.fromMenuNewNodeToConnect = (type) => {
            this.hideNodeMenu();
            this.setState({
                newNodeType: type,
                dialogNewNodeToConnectOpen: true
            });
        };
        /**
         * If a link is selected add the custom class to the link and open the collapse toolbar
         * @param e
         */
        this.fromGraphLinkSelected = (e) => {
            let links = this.state.links;
            let link = this.getLink(e.data().id);
            let indexOfClass = link.linkClasses.indexOf('selected');
            if (indexOfClass == -1) {
                /** Add custom class */
                link.linkClasses.push('selected');
                this.saveLink(link);
                this.setState({
                    collapseToolbarNeeded: true
                });
            }
            else {
                /** Remove custom class */
                link.linkClasses.splice(indexOfClass, 1);
                this.saveLink(link);
                /** Check if collapse toolbar still needed */
                let lastSelectedLink = true;
                links.forEach((link) => {
                    let index = link.linkClasses.indexOf('selected');
                    if (index != -1) {
                        lastSelectedLink = false;
                    }
                });
                if (lastSelectedLink) {
                    this.setState({
                        collapseToolbarNeeded: false
                    });
                }
                else {
                    this.setState({
                        collapseToolbarNeeded: true
                    });
                }
            }
        };
        /**
         * Collapse all
         */
        this.fromToolbarCollapseSelectedLinks = () => {
            let links = this.state.links;
            let nodes = this.state.nodes;
            /** Hide the links and remove the custom class */
            links.forEach((link) => {
                let indexOfClass = link.linkClasses.indexOf('selected');
                if (indexOfClass >= 0) {
                    link.linkClasses.splice(indexOfClass, 1);
                    this.hideLink(link);
                    if (this.getNumberOfLinksForNode(link.data.target) == 0) {
                        this.hideNode(this.getNode(link.data.target));
                    }
                }
            });
            /** Make sure the collapse toolbar will hide */
            this.setState({
                collapseToolbarNeeded: false
            }, () => {
                this.saveView();
            });
        };
        /**
         * Collapse all children
         */
        this.fromMenuCollapseAll = () => {
            let links = this.state.links;
            let nodes = this.state.nodes;
            /** Hide all links with the tapped Node as source */
            links.forEach((link) => {
                if (link.visibility == VISIBILITY_1.VISIBILITY.VISIBLE && link.data.source == this.state.tappedNode.id) {
                    this.hideLink(link);
                    link.visibility = VISIBILITY_1.VISIBILITY.HIDDEN;
                    if (this.getNumberOfLinksForNode(link.data.target) == 0) {
                        this.hideNode(this.getNode(link.data.target));
                    }
                }
            });
            /** Make sure all menus will close */
            this.setState({
                nodeContextMenuOpen: false,
                coreContextMenuOpen: false
            }, () => {
                this.saveView();
            });
        };
        /** Hide link labels */
        this.hideLinkLabels = () => {
            this.setState({
                showLabels: false
            });
        };
        /** Hide show labels */
        this.showLinkLabels = () => {
            this.setState({
                showLabels: true
            });
        };
        /**
         * Process all nodes to forward it to the graph => just send visible ones
         * @return {GraphNodeElement[]}
         */
        this.processNodesForGraph = () => {
            let nodes = [];
            this.state.nodes.forEach((node) => {
                if (node.visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                    node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id);
                    nodes.push(node);
                }
            });
            return nodes;
        };
        /**
         * Process all links to forward it to the graph => just send visible ones and may add labels
         * @return {GraphLinkElement[]}
         */
        this.processLinksForGraph = () => {
            let links = [];
            if (this.state.showLabels) {
                this.state.links.forEach((link) => {
                    if (link.visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                        link.data.label = this.props.nodeInformationProvider.getLinkLabel(link.data.source, link.data.id);
                        links.push(link);
                    }
                });
            }
            else {
                this.state.links.forEach((link) => {
                    if (link.visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                        link.data.label = "";
                        links.push(link);
                    }
                });
            }
            return links;
        };
        /**
         * Process nodes for context menus => add all titles to them
         * @return {GraphNodeData[]}
         */
        this.processNodesForContextMenu = () => {
            let nodes = [];
            this.state.nodes.forEach((node) => {
                node.data.label = this.props.nodeInformationProvider.getNodeTitle(node.data.id);
                nodes.push(node.data);
            });
            return nodes;
        };
        /**
         * Process links for the node context menu => add all label to them
         * @return {GraphLinkData[]}
         */
        this.processLinksForNodeContextMenu = () => {
            let links = [];
            this.state.links.forEach((link) => {
                if (link.data.source == this.state.tappedNode.id && link.visibility.value == VISIBILITY_1.VISIBILITY.HIDDEN.value) {
                    link.data.label = this.props.nodeInformationProvider.getLinkLabel(link.data.source, link.data.id);
                    links.push(link.data);
                }
            });
            return links;
        };
        this.state = {
            nodes: new Map(),
            links: new Map(),
            showLabels: false,
            tappedPosition: new GraphPosition_1.GraphPosition(0, 0)
        };
    }
    /**
     * Collapse a node from context menu
     */
    fromMenuCollapseNode() {
        /** Make sure menu closes */
        this.hideNodeMenu();
        this.handleNodeCollapse(this.state.tappedNode.id);
    }
    /**
     * Collapse node
     * @param nodeId - node id
     */
    handleNodeCollapse(nodeId) {
        let links = this.state.links;
        /** Hide node */
        let node = this.getNode(nodeId);
        this.hideNode(node);
        /** Hide links */
        links.forEach((link) => {
            if (link.data.source == nodeId) {
                this.hideLink(link);
                if (this.getNumberOfLinksForNode(link.data.target) == 0) {
                    this.hideNode(this.getNode(link.data.target));
                }
            }
            else if (link.data.target == nodeId) {
                this.hideLink(link);
                if (this.getNumberOfLinksForNode(link.data.source) == 0) {
                    this.hideNode(this.getNode(link.data.source));
                }
            }
        });
        this.saveView();
    }
    /**
     * Get number of links with the certain node as target node
     * @param nodeId
     * @return {number}
     */
    getNumberOfTargetLinksForNode(nodeId) {
        var counter = 0;
        this.state.links.forEach((link) => {
            if (link.data.target == nodeId && link.visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                counter = counter + 1;
            }
        });
        return counter;
    }
    /**
     * Get number of links with the certain node either as target node or source node
     * @param nodeId
     * @return {number}
     */
    getNumberOfLinksForNode(nodeId) {
        var counter = 0;
        this.state.links.forEach((link) => {
            if (link.data.target == nodeId && link.visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                counter = counter + 1;
            }
            if (link.data.source == nodeId && link.visibility.value == VISIBILITY_1.VISIBILITY.VISIBLE.value) {
                counter = counter + 1;
            }
        });
        return counter;
    }
    /**
     * Expand one link
     * @param linkId
     */
    fromMenuExpandLink(linkId) {
        let links = this.state.links;
        let nodes = this.state.nodes;
        /** Make link visible */
        let linkToExpand = this.getLink(linkId);
        this.showLink(linkToExpand);
        /** Make node visible */
        let targetNode = this.getNode(linkToExpand.data.target);
        if (targetNode.position.x == 0 && targetNode.position.y == 0) {
            targetNode.position = DOMHelperService_1.DOMHelperService.calcNodePosition(this.state.tappedPosition);
        }
        this.showNode(targetNode);
        this.saveView();
    }
    /**
     * Expand all links from the tapped node
     */
    fromMenuExpandAll() {
        let links = this.state.links;
        let nodes = this.state.nodes;
        let nodeId = this.state.tappedNode.id;
        links.forEach((link) => {
            /** Make all links and nodes visible with the tapped node as source*/
            if (link.data.source == nodeId && link.visibility == VISIBILITY_1.VISIBILITY.HIDDEN) {
                this.showLink(link);
                let node = this.getNode(link.data.target);
                if (node.position.x == 0 && node.position.y == 0) {
                    node.position = DOMHelperService_1.DOMHelperService.calcNodePosition(this.state.tappedPosition);
                }
                this.showNode(node);
            }
        });
        /** Make sure all menus close */
        this.setState({
            nodeContextMenuOpen: false,
            coreContextMenuOpen: false
        }, () => {
            this.saveView();
        });
    }
    /** Display the core context menu on a certain position */
    showCoreContextMenu(position) {
        this.setState({
            tappedPosition: position
        }, () => {
            this.showCoreMenu();
        });
    }
    /** Display the node context menu over a certain node */
    showNodeContextMenu(node) {
        /** Save node information for further menu operations*/
        this.setState({
            tappedNode: node.data,
            tappedPosition: node.position
        }, () => {
            this.showNodeMenu();
        });
    }
    render() {
        let nodes = this.processNodesForGraph();
        let links = this.processLinksForGraph();
        return (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement(Graph_1.default, { nodes: nodes, links: links, onNewNode: this.fromGraphExistingNode.bind(this), onNewLink: this.fromGraphNewLink.bind(this), onNodePositionUpdate: this.fromGraphPositionUpdated.bind(this), onCoreContextMenuRequested: this.showCoreContextMenu.bind(this), onNodeContextMenuRequested: this.showNodeContextMenu.bind(this), onLinkSelected: this.fromGraphLinkSelected.bind(this), onNodeDetailRequest: (node) => {
                        this.setState({
                            tappedNode: node
                        }, () => {
                            this.nodeDetailRequested();
                        });
                    }, identityService: this.props.identityService })),
            (() => {
                /** Render core context menu if needed */
                if (this.state.coreContextMenuOpen) {
                    let nodes = this.processNodesForContextMenu();
                    return (React.createElement(CoreContextMenu_1.default, { nodes: nodes, position: this.state.tappedPosition, graphNodeTypes: this.props.nodeTypes, requestClose: this.hideCoreMenu.bind(this), searchFieldFactory: this.props.searchFieldFactory, onNewNode: this.fromMenuNewNodeDialog.bind(this), onExistingNode: this.fromMenuExistingNode.bind(this) }));
                }
            })(),
            (() => {
                /** Render node context menu if needed */
                if (this.state.nodeContextMenuOpen) {
                    let nodes = this.processNodesForContextMenu();
                    let links = this.processLinksForNodeContextMenu();
                    return (React.createElement(NodeContextMenu_1.default, { nodes: nodes, links: links, position: this.state.tappedPosition, graphNodeTypes: this.props.nodeTypes, requestClose: this.hideNodeMenu.bind(this), onEditNode: this.nodeDetailRequested.bind(this), onHideNode: this.fromMenuCollapseNode.bind(this), onExpandAll: this.fromMenuExpandAll.bind(this), onExpandNode: this.fromMenuExpandLink.bind(this), onCollapseAll: this.fromMenuCollapseAll.bind(this), onNewNodeToConnect: this.fromMenuNewNodeToConnect.bind(this), onExistingNodeToConnect: this.openSearchNodeToConnectDialog.bind(this), searchFieldFactory: this.props.searchFieldFactory }));
                }
            })(),
            (() => {
                /** Render 'new node' dialog if needed */
                if (this.state.dialogNewNodeOpen) {
                    return (this.props.dialogFactory.getDialogNodeNewNode(this.state.dialogNewNodeOpen, this.fromDialogNewNode.bind(this), this.closeNewNodeDialog.bind(this), GraphElementFactory_1.GraphElementFactory.getGraphElementAsNode(this.props.identityService.createNewNodeId(), this.state.tappedPosition, VISIBILITY_1.VISIBILITY.VISIBLE), this.state.newNodeType));
                }
                /** Render 'new node and connect to existing node' dialog if needed */
                if (this.state.dialogNewNodeToConnectOpen) {
                    return (this.props.dialogFactory.getDialogNodeNewNodeToConnect(this.state.dialogNewNodeToConnectOpen, this.fromDialogNewNodeToConnect.bind(this), this.closeNewNodeToConnectDialog.bind(this), GraphElementFactory_1.GraphElementFactory.getGraphElementAsLink(this.props.identityService.createNewLinkId(), this.state.tappedNode.id, this.props.identityService.createNewNodeId(), VISIBILITY_1.VISIBILITY.VISIBLE), this.state.newNodeType));
                }
                /** Render 'search node and connect to existing node' dialog if needed */
                if (this.state.dialogSearchNodeToConnectOpen) {
                    return (this.props.dialogFactory.getDialogNodeSearchToConnect(this.state.dialogSearchNodeToConnectOpen, this.fromDialogExistingNodeToConnect.bind(this), this.closeSearchNodeToConnectDialog.bind(this)));
                }
            })(),
            React.createElement("div", { id: "toolbar" },
                (() => {
                    /** Render collapse toolbar if needed */
                    if (this.state.collapseToolbarNeeded) {
                        return (React.createElement(material_ui_1.FlatButton, { label: 'COLLAPSE', onTouchTap: this.fromToolbarCollapseSelectedLinks.bind(this) }));
                    }
                })(),
                (() => {
                    /** Update toolbar */
                    if (this.state.showLabels) {
                        return (React.createElement(material_ui_1.FlatButton, { label: 'HIDE LINK LABELS', onTouchTap: this.hideLinkLabels.bind(this) }));
                    }
                    else {
                        return (React.createElement(material_ui_1.FlatButton, { label: 'SHOW LINK LABELS', onTouchTap: this.showLinkLabels.bind(this) }));
                    }
                })())));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GraphScreen;
//# sourceMappingURL=GraphScreen.js.map