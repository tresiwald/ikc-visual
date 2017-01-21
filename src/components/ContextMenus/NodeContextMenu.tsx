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

export interface NodeContextMenuProps {
    links: GraphLinkData[],
    nodes: GraphNodeData[],
    timestamp: string,
    focus?: boolean,
    onExpandNode: Function,
    onExpandAll: Function,
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

    componentWillMount = () => {
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


    handleExpandNode = (result: GraphLinkData) => {
        this.props.onExpandNode(result.id)
    }

    handleExpandAll = () => {
        //this.props.onExpandAll(this.props.list[0].source)
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
                        <ListItem primaryText="Edit Node" onTouchTap={() => {
                                            console.log('Edit Node')
                                            }}/>
                        <ListItem primaryText="Hide Node" onTouchTap={() => {
                                            console.log('Hide Node')
                                            }}/>
                        <ListItem primaryText="Link to" style={styles.contextMenuItem}
                                  nestedItems={
                                          (()=> {
                                              let returnList:any[] = []

                                              returnList.push(<ListItem
                                                    primaryText={'Existing Node'}
                                                    onTouchTap={() => console.log("Existing Node")}
                                                ></ListItem>)

                                              this.props.graphNodeTypes.forEach((type) => {
                                                returnList.push(<ListItem
                                                    primaryText={'New ' + type.name + " Node"}
                                                    onTouchTap={() => console.log(type.name + " Node")}
                                                ></ListItem>)
                                              })
                                              return returnList
                                          })()

                                  }/>
                        <ListItem primaryText="Collapse All Links" onTouchTap={() => {
                                            console.log('Collapse All Links')
                                            }}/>
                        <ListItem primaryText="Expand All Links" onTouchTap={() => {
                                            console.log('Expand All Links')
                                            }}/>
                        {(() => {
                            return this.props.searchFieldFactory.getLinkSearchField( () => console.log('select link'))
                        })()}
                    </List>
                </Paper>
            </div>
        )
    }
}