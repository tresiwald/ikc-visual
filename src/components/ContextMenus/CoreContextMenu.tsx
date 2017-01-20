import * as React from "react";
import {ListItem, Paper, List, TextField, IconButton, FlatButton} from "material-ui";
import {MuiThemeProvider} from "material-ui/styles";
import {GraphLinkData} from "../../model/GraphLinkData";
import MapsZoomOutMap from "material-ui/svg-icons/maps/zoom-out-map";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeType} from "../../model/GraphNodeType";

import render = __React.__DOM.render;
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;
import {Menu} from "material-ui";
import {MenuItem} from "material-ui";
import {GraphNodeData} from "../../model/GraphNodeData";

export interface CoreContextMenuProps {
    nodes: GraphNodeData[]
    timestamp: string,
    requestClose: Function,
    position: GraphPosition,
    graphNodeTypes: GraphNodeType[],
}
export interface CoreContextMenuState {
    timestamp?: string
    active?: boolean
}

export default class CoreContextMenu extends React.Component<CoreContextMenuProps,CoreContextMenuState> {
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
            let element = document.getElementById('coreContextMenu')
            if (element) {
                let box = element.getBoundingClientRect()
                if (!(event.clientX > box.left && event.clientX < box.right && event.clientY > box.top && event.clientY < box.bottom)) {
                    that.props.requestClose()
                    document.removeEventListener('click', handler)
                }
            }
        })
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
            listItem: {
                marginLeft: "-72px"
            },
            underlineStyle: {
                borderColor: "#4591bc",
            },
            position: {
                left: this.props.position.x + 60,
                top: this.props.position.y - 30
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
                    <Paper id="coreContextMenu" style={styles.position}>
                        <List>
                            <ListItem primaryText = "Menu" children={
                            <Menu>
                                <MenuItem primaryText="Edit Node" onTouchTap={() => {
                                        console.log('Edit Node')
                                        }}/>
                                <MenuItem primaryText="Hide Node" onTouchTap={() => {
                                        console.log('Hide Node')
                                        }}/>
                                <MenuItem primaryText="Remove Node from View" onTouchTap={()=>{
                                        console.log('Remove Node')
                                        }}/>
                                <MenuItem primaryText="Collapse All" onTouchTap={() => {
                                        console.log('Collapse All')
                                        }}/>
                                <MenuItem primaryText="Link to existing Node" onTouchTap={()=>{
                                        console.log('Edit Node')
                                        }}/>
                                {(() => {
                                    let returnList: any[] = []
                                    this.props.graphNodeTypes.forEach((nodeType) => {
                                        returnList.push(<MenuItem
                                            primaryText={"Link to new " + nodeType.name + " Node"}
                                            onTouchTap={() =>
                                        console.log('Edit Node')}/>)
                                    })
                                    return returnList
                                })()}
                            </Menu>
                        }/>
                        </List>
                    </Paper>
                </div>
        )
    }
}