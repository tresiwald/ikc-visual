import * as React from "react";
import {ListItem, Paper, List} from "material-ui";
import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeType} from "../../model/GraphNodeType";
import {GraphNodeData} from "../../model/GraphNodeData";
import {SearchFieldFactory} from "../../interfaces/SearchFieldFactory";
import {AgentService} from "../../common/AgentService";

import render = __React.__DOM.render;
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;

export interface CoreContextMenuProps {
    nodes: GraphNodeData[]
    timestamp: string,
    requestClose: Function,
    position: GraphPosition,
    graphNodeTypes: GraphNodeType[],
    searchFieldFactory: SearchFieldFactory;
    onNewNode: Function,
    onExistingNode: Function,
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

    componentDidMount = () => {
        this.adjustElement()
    }

    componentDidUpdate = () => {
        this.adjustElement()
    }

    adjustElement = () => {
        if (AgentService.agentIsMobile() && !AgentService.agentIsTabletLandscape()) {
            var adjustmentY = 0

            let element = document.getElementById('coreContextMenu')
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
            contextMenuItem: {
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