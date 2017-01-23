import * as React from "react";
import {ListItem, Paper, List, TextField, IconButton, FlatButton} from "material-ui";
import {MuiThemeProvider} from "material-ui/styles";
import {GraphLinkData} from "../../model/GraphLinkData";
import MapsZoomOutMap from "material-ui/svg-icons/maps/zoom-out-map";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeType} from "../../model/GraphNodeType";
import {SearchFieldFactory} from "../../interfaces/SearchFieldFactory";

import render = __React.__DOM.render;
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;
import {Menu} from "material-ui";
import {MenuItem} from "material-ui";
import {GraphNodeData} from "../../model/GraphNodeData";
import {AgentService} from "../../common/AgentService";

export interface NodeContextMenuProps {
    links: GraphLinkData[],
    nodes: GraphNodeData[],
    timestamp: string,
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
    timestamp?: string,
}

export default class NodeContextMenu extends React.Component<NodeContextMenuProps,NodeContextMenuState> {
    constructor(props: any) {
        super(props);
        this.state = {
            timestamp: "",
        };

    }

    initState() {
        if (this.props.timestamp != this.state.timestamp) {
            this.state.timestamp = this.props.timestamp;
        }
    }

    componentDidMount = () => {
        this.adjustElement()
        let that = this
        document.addEventListener('click', function handler(event: any) {
            let element = document.getElementById('nodeContextMenu')
            if (element) {
                let box = element.getBoundingClientRect()
                if (!(event.clientX > box.left && event.clientX < box.right && event.clientY > box.top && event.clientY < box.bottom)) {
                    that.props.requestClose()
                    document.removeEventListener('click', handler)
                }
            }
        })
    }

    componentDidUpdate = () => {
        this.adjustElement()
        let that = this
        document.addEventListener('click', function handler(event: any) {
            let element = document.getElementById('nodeContextMenu')
            if (element) {
                let box = element.getBoundingClientRect()
                if (!(event.clientX > box.left && event.clientX < box.right && event.clientY > box.top && event.clientY < box.bottom)) {
                    that.props.requestClose()
                    document.removeEventListener('click', handler)
                }
            }
        })
    }


    componentWillMount = () => {

    }
    adjustElement = () =>{
        if(AgentService.agentIsMobile() && !AgentService.agentIsTabletLandscape()) {
            var adjustmentY = 0

            let element = document.getElementById('nodeContextMenu')
            let box = element.getBoundingClientRect()
            let bodyBox = document.body.getBoundingClientRect()

            if ((box.left + box.width) > bodyBox.width) {
                var adjustmentX = bodyBox.width - box.width
                element.style.left = adjustmentX + 'px'
            }

            if ((box.top + box.height) > bodyBox.height) {
                var adjustmentY = bodyBox.height - box.height
                element.style.top = adjustmentY + 'px'
            }
        }
    }

    handleExpandNode = (resultId:string) => {
        this.props.onExpandNode(resultId)
    }

    handleExpandAll = () => {
        this.props.onExpandAll()
    }

    handleCollapseAll = () => {
        this.props.onCollapseAll()
    }

    handleNewNodeToConnect = (type:GraphNodeType) => {
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

    onRequestClose = () =>{
        this.props.requestClose()
    }

    render() {
        this.initState();
        const styles = {
            iconHover: {
                color: "#4591bc"
            },
            underlineStyle: {
                borderColor: "#4591bc",
            },
            nodeContextMenu: {
                left: this.props.position.x,
                top: this.props.position.y,
            },
            contextMenuItem:{
                height: "44px"
            }
        }

        const focusInput = (ref: any) => {
            setTimeout(() => {
                if (ref != null) {
                    ref.input.focus();
                }
            }, 200)
        };

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
                            if(this.props.links.length > 0) {
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