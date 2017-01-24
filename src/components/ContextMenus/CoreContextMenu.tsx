import * as React from "react";
import {ListItem, Paper, List} from "material-ui";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeType} from "../../model/GraphNodeType";
import {GraphNodeData} from "../../model/GraphNodeData";
import {SearchFieldFactory} from "../../interfaces/SearchFieldFactory";
import {AgentService} from "../../common/AgentService";
import {DOMHelperService} from "../../common/DOMHelperService";

import render = __React.__DOM.render;
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;

export interface CoreContextMenuProps {
    nodes: GraphNodeData[]
    requestClose: Function,
    position: GraphPosition,
    graphNodeTypes: GraphNodeType[],
    searchFieldFactory: SearchFieldFactory;
    onNewNode: Function,
    onExistingNode: Function,
}
export interface CoreContextMenuState {
    active?: boolean
}

/**
 * React component to render the core-context-menu, it uses the search field provided by the searchFieldFactory
 */
export default class CoreContextMenu extends React.Component<CoreContextMenuProps,CoreContextMenuState> {
    constructor(props: any) {
        super(props);
        this.state = {
        };

    }

    initState() {

    }

    /**
     * Before the component will mount, a event listener will be registered on the 'click' event. If there is a 'click' event
     * outside the context menu, it will disappear
     */
    componentWillMount = () => {
        let that = this
        document.addEventListener('click', this.checkCloseNeeded.bind(this))
        document.addEventListener('touchstart', this.checkCloseNeeded.bind(this))
    }

    checkCloseNeeded = (e:any) => {
        var elementMouseIsOver = null
        if (e.type == 'click') {
            elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
        } else {
            elementMouseIsOver = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        }
        if (DOMHelperService.isDescendant(document.getElementById('coreContextMenu'), elementMouseIsOver)) {
            console.log(elementMouseIsOver)
        } else {
            this.props.requestClose()
        }
    }

    componentWillUnmount = () => {
        document.removeEventListener('click', this.checkCloseNeeded)
        document.removeEventListener('touchstart', this.checkCloseNeeded)

    }


    /**
     * Adjust element after the component did mount
     */
    componentDidMount = () => {
        this.adjustElement()
    }

    /**
     * Adjust element after the component did update
     */
    componentDidUpdate = () => {
        this.adjustElement()
    }


    /**
     * Adjust the position of the context menu, that is necessary on small screen to make sure the context menu is fully visible
     */
    adjustElement = () => {
        if (AgentService.agentIsMobile() && !AgentService.agentIsTabletLandscape()) {

            /** Get necessary information */
            let element = document.getElementById('coreContextMenu')
            let box = element.getBoundingClientRect()
            let bodyBox = document.body.getBoundingClientRect()

            /** Check left */
            if ((box.left + box.width) > bodyBox.width) {
                var adjustmentX = bodyBox.width - box.width
                element.style.left = adjustmentX + 'px'
            }

            /** Check top*/
            if ((box.top + box.height) > bodyBox.height) {
                var adjustmentY = bodyBox.height - box.height
                element.style.top = adjustmentY + 'px'
            }
        }
    }

    /** Map the menu taps with the provided functions */

    onRequestClose = () => {
        this.props.requestClose()
    }

    handleNewNode = (type: GraphNodeType) => {
        this.props.onNewNode(type)
    }

    handleExistingNode = (nodeId: string) => {
        this.props.onExistingNode(nodeId)
    }

    render() {
        this.initState();

        const styles = {
            coreContextMenu: {
                left: this.props.position.x,
                top: this.props.position.y,
            },
            contextMenuItem: {
                height: "44px"
            }
        }

        return (
            <div>
                <Paper id="coreContextMenu" style={styles.coreContextMenu}>
                    <List>
                        <ListItem primaryText="Add new" style={styles.contextMenuItem}
                                  nestedItems={
                                      this.props.graphNodeTypes.map((type) => {
                                        return <ListItem
                                            primaryText={type.name + " Node"}
                                            onTouchTap={() => this.handleNewNode(type)}
                                        ></ListItem>
                                    })
                                  }/>
                        {(() => {
                            return this.props.searchFieldFactory.getNodeSearchField(this.handleExistingNode.bind(this))
                        })()}

                    </List>
                </Paper>
            </div>
        )
    }
}