"use strict";
const React = require("react");
const material_ui_1 = require("material-ui");
const AgentService_1 = require("../../common/AgentService");
const DOMHelperService_1 = require("../../common/DOMHelperService");
/**
 * React component to render the core-context-menu, it uses the search field provided by the searchFieldFactory
 */
class CoreContextMenu extends React.Component {
    constructor(props) {
        super(props);
        /**
         * Before the component will mount, a event listener will be registered on the 'click' event. If there is a 'click' event
         * outside the context menu, it will disappear.
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
            if (DOMHelperService_1.DOMHelperService.isDescendant(document.getElementById('coreContextMenu'), elementMouseIsOver)) {
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
                let element = document.getElementById('coreContextMenu');
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
        this.onRequestClose = () => {
            this.props.requestClose();
        };
        this.handleNewNode = (type) => {
            this.props.onNewNode(type);
        };
        this.handleExistingNode = (nodeId) => {
            this.props.onExistingNode(nodeId);
        };
        this.state = {};
    }
    render() {
        const styles = {
            coreContextMenu: {
                left: this.props.position.x,
                top: this.props.position.y,
            },
            contextMenuItem: {
                height: "44px"
            }
        };
        return (React.createElement("div", null,
            React.createElement(material_ui_1.Paper, { id: "coreContextMenu", style: styles.coreContextMenu },
                React.createElement(material_ui_1.List, null,
                    React.createElement(material_ui_1.ListItem, { primaryText: "Add new", style: styles.contextMenuItem, nestedItems: this.props.graphNodeTypes.map((type) => {
                            return React.createElement(material_ui_1.ListItem, { primaryText: type.name + " Node", onTouchTap: () => this.handleNewNode(type) });
                        }) }),
                    (() => {
                        return this.props.searchFieldFactory.getNodeSearchField(this.handleExistingNode.bind(this));
                    })()))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoreContextMenu;
//# sourceMappingURL=CoreContextMenu.js.map