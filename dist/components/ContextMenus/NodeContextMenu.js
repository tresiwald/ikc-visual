"use strict";
const React = require("react");
const material_ui_1 = require("material-ui");
const AgentService_1 = require("../../common/AgentService");
const DOMHelperService_1 = require("../../common/DOMHelperService");
/**
 * React component to render the node-context-menu, it uses the search field provided by the searchFieldFactory
 */
class NodeContextMenu extends React.Component {
    constructor(props) {
        super(props);
        /**
         * Before the component will mount, a event listener will be registered on the 'click' event. If there is a 'click' event
         * outside the context menu, it will disappear
         */
        this.componentDidMount = () => {
            document.onclick = this.checkCloseNeeded.bind(this);
            document.ontouchstart = this.checkCloseNeeded.bind(this);
            /**  Adjust element after the component did mount */
            this.adjustElement();
        };
        this.checkCloseNeeded = (e) => {
            e.preventDefault();
            var elementMouseIsOver = null;
            if (e.type == 'click') {
                elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
            }
            else {
                elementMouseIsOver = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
            }
            if (DOMHelperService_1.DOMHelperService.isDescendant(document.getElementById('nodeContextMenu'), elementMouseIsOver)) {
                console.log(elementMouseIsOver);
            }
            else {
                document.onclick = null;
                document.ontouchstart = null;
                this.props.requestClose();
            }
        };
        /**
         * Adjust element after the component did update
         */
        this.componentDidUpdate = () => {
            this.adjustElement();
        };
        /**
         * Adjust the position of the context menu, that is necessary on small screen to make sure the context menu is fully visible
         */
        this.adjustElement = () => {
            if (AgentService_1.AgentService.agentIsMobile() && !AgentService_1.AgentService.agentIsTabletLandscape()) {
                /** Get necessary information */
                let element = document.getElementById('nodeContextMenu');
                let box = element.getBoundingClientRect();
                let bodyBox = document.body.getBoundingClientRect();
                /** Check left */
                if ((box.left + box.width) > bodyBox.width) {
                    var adjustmentX = bodyBox.width - box.width;
                    element.style.left = adjustmentX + 'px';
                }
                /** Check top*/
                if ((box.top + box.height) > bodyBox.height) {
                    var adjustmentY = bodyBox.height - box.height;
                    element.style.top = adjustmentY + 'px';
                }
            }
        };
        /** Map the menu taps with the provided functions */
        this.handleExpandNode = (resultId) => {
            this.props.onExpandNode(resultId);
        };
        this.handleExpandAll = () => {
            this.props.onExpandAll();
        };
        this.handleCollapseAll = () => {
            this.props.onCollapseAll();
        };
        this.handleNewNodeToConnect = (type) => {
            this.props.onNewNodeToConnect(type);
        };
        this.handleExistingNodeToConnect = () => {
            this.props.onExistingNodeToConnect();
        };
        this.handleEditNode = () => {
            this.props.onEditNode();
        };
        this.handleHideNode = () => {
            this.props.onHideNode();
        };
        this.onRequestClose = () => {
            this.props.requestClose();
        };
        this.state = {};
    }
    render() {
        const styles = {
            nodeContextMenu: {
                left: this.props.position.x,
                top: this.props.position.y,
            },
            contextMenuItem: {
                height: "44px"
            }
        };
        return (React.createElement("div", null,
            React.createElement(material_ui_1.Paper, { id: "nodeContextMenu", style: styles.nodeContextMenu },
                React.createElement(material_ui_1.List, null,
                    React.createElement(material_ui_1.ListItem, { primaryText: "Edit Node", onTouchTap: this.handleEditNode.bind(this) }),
                    React.createElement(material_ui_1.ListItem, { primaryText: "Hide Node", onTouchTap: this.handleHideNode.bind(this) }),
                    React.createElement(material_ui_1.ListItem, { primaryText: "Link to", style: styles.contextMenuItem, nestedItems: (() => {
                            let returnList = [];
                            returnList.push(React.createElement(material_ui_1.ListItem, { primaryText: 'Existing Node', onTouchTap: this.handleExistingNodeToConnect.bind(this) }));
                            this.props.graphNodeTypes.forEach((type) => {
                                returnList.push(React.createElement(material_ui_1.ListItem, { primaryText: 'New ' + type.name + " Node", onTouchTap: () => this.handleNewNodeToConnect(type) }));
                            });
                            return returnList;
                        })() }),
                    React.createElement(material_ui_1.ListItem, { primaryText: "Collapse All Links", onTouchTap: this.handleCollapseAll.bind(this) }),
                    React.createElement(material_ui_1.ListItem, { primaryText: "Expand All Links", onTouchTap: this.handleExpandAll.bind(this) }),
                    (() => {
                        if (this.props.links.length > 0) {
                            let links = this.props.links.map((link) => link.id);
                            return this.props.searchFieldFactory.getLinkSearchField(this.handleExpandNode.bind(this), links);
                        }
                    })()))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeContextMenu;
//# sourceMappingURL=NodeContextMenu.js.map