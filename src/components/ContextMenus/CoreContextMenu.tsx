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
import GraphNodeSearch from "../GraphSearchFields/GraphNodeSearch";
import {TimeService} from "../../common/TimeService";

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
            underlineStyle: {
                borderColor: "#4591bc",
            },
            coreContextMenu: {
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
                <Paper id="coreContextMenu" style={styles.coreContextMenu}>
                    <List>
                        <ListItem primaryText="Add new" style={styles.contextMenuItem}
                                  nestedItems={
                                      this.props.graphNodeTypes.map((type) => {
                                        return <ListItem
                                            primaryText={type.name + " Node"}
                                            onTouchTap={() => console.log(type.name + " Node")}
                                        ></ListItem>
                                    })
                                  }/>
                        <GraphNodeSearch nodes ={this.props.nodes} onSelectNode={()=>console.log('node selected')} timestamp={TimeService.getTimestamp()}></GraphNodeSearch>

                    </List>
                </Paper>
            </div>
        )
    }
}