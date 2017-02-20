import * as React from "react";
import {ListItem, Paper, List} from "material-ui";
import {GraphLinkData} from "../../model/GraphLinkData";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeType} from "../../model/GraphNodeType";
import {SearchFieldFactory} from "../../interfaces/SearchFieldFactory";
import {GraphNodeData} from "../../model/GraphNodeData";
import {AgentService} from "../../common/AgentService";

import getMuiTheme = __MaterialUI.Styles.getMuiTheme;
import {DOMHelperService} from "../../common/DOMHelperService";

export interface NodeContextMenuProps {
    links: GraphLinkData[],
    nodes: GraphNodeData[],
    focus?: boolean,
    onExpandNode: Function,
    onExpandAll: Function,
    onCollapseAll: Function,
    onNewNodeToConnect: Function,
    onExistingNodeToConnect: Function,
    onEditNode: Function,
    onHideNode: Function,
    requestClose: Function,
    position: GraphPosition,
    graphNodeTypes: GraphNodeType[]
    searchFieldFactory: SearchFieldFactory;
}
export interface NodeContextMenuState {
}

/**
 * React component to render the node-context-menu, it uses the search field provided by the searchFieldFactory
 */
export default class NodeContextMenu extends React.Component<NodeContextMenuProps,NodeContextMenuState> {
    constructor(props: any) {
        super(props);
        this.state = {
        };

    }

    /**
     * Before the component will mount, a event listener will be registered on the 'click' event. If there is a 'click' event
     * outside the context menu, it will disappear
     */

    componentDidMount = () => {
        document.onclick = this.checkCloseNeeded.bind(this)
        document.ontouchstart = this.checkCloseNeeded.bind(this)

        /**  Adjust element after the component did mount */
        this.adjustElement()
    }

    checkCloseNeeded = (e:any) => {
        e.preventDefault()
        var elementMouseIsOver = null
        if (e.type == 'click') {
            elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
        } else {
            elementMouseIsOver = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        }
        if (DOMHelperService.isDescendant(document.getElementById('nodeContextMenu'), elementMouseIsOver)) {
            console.log(elementMouseIsOver)
        } else {
            document.onclick = null
            document.ontouchstart = null
            this.props.requestClose()
        }
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
            let element = document.getElementById('nodeContextMenu')
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

    handleExpandNode = (resultId: string) => {
        this.props.onExpandNode(resultId)
    }

    handleExpandAll = () => {
        this.props.onExpandAll()
    }

    handleCollapseAll = () => {
        this.props.onCollapseAll()
    }

    handleNewNodeToConnect = (type: GraphNodeType) => {
        this.props.onNewNodeToConnect(type)
    }

    handleExistingNodeToConnect = () => {
        this.props.onExistingNodeToConnect()
    }

    handleEditNode = () => {
        this.props.onEditNode()
    }

    handleHideNode = () => {
        this.props.onHideNode()
    }

    onRequestClose = () => {
        this.props.requestClose()
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
        }

        return (
            <div>
                <Paper id="nodeContextMenu" style={styles.nodeContextMenu}>
                    <List>
                        <ListItem primaryText="Edit Node" onTouchTap={this.handleEditNode.bind(this)}/>
                        <ListItem primaryText="Hide Node" onTouchTap={this.handleHideNode.bind(this)}/>
                        <ListItem primaryText="Link to" style={styles.contextMenuItem}
                                  nestedItems={
                                          (()=> {
                                              let returnList:any[] = []

                                              returnList.push(<ListItem
                                                    primaryText={'Existing Node'}
                                                     onTouchTap={this.handleExistingNodeToConnect.bind(this)}
                                                ></ListItem>)

                                              this.props.graphNodeTypes.forEach((type) => {
                                                returnList.push(<ListItem
                                                    primaryText={'New ' + type.name + " Node"}
                                                    onTouchTap={() => this.handleNewNodeToConnect(type)}
                                                ></ListItem>)
                                              })
                                              return returnList
                                          })()

                                  }/>
                        <ListItem primaryText="Collapse All Links" onTouchTap={this.handleCollapseAll.bind(this)}/>
                        <ListItem primaryText="Expand All Links" onTouchTap={this.handleExpandAll.bind(this)}/>
                        {(() => {
                            if (this.props.links.length > 0) {
                                let links = this.props.links.map((link) => link.id)
                                return this.props.searchFieldFactory.getLinkSearchField(this.handleExpandNode.bind(this), links)
                            }
                        })()}
                    </List>
                </Paper>
            </div>
        )
    }
}