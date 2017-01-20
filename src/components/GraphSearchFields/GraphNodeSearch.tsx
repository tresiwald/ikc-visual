import * as React from "react";
import {ListItem, Paper, List, TextField, IconButton, FlatButton} from "material-ui";
import {MuiThemeProvider} from "material-ui/styles";
import MapsZoomOutMap from "material-ui/svg-icons/maps/zoom-out-map";
import render = __React.__DOM.render;
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;
import {GraphNodeData} from "../../model/GraphNodeData";

export interface GraphNodeSearchProps {
    nodes: GraphNodeData[],
    timestamp: string,
    focus?: boolean,
    onSelectNode: Function,
}
export interface GraphNodeSearchState {
    searchResults?: GraphNodeData[],
    searchText?: string,
    timestamp?: string,
    active?: boolean
}

export default class GraphNodeSearch extends React.Component<GraphNodeSearchProps,GraphNodeSearchState> {
    constructor(props: any) {
        super(props);
        this.state = {
            searchText: "",
            searchResults: [],
            timestamp: "",
            active: false
        };

    }

    initState() {
        if (this.props.timestamp != this.state.timestamp) {
            this.state.timestamp = this.props.timestamp;
        }
    }

    componentWillMount = () => {
        this.state.active = true
        this.performSearch()
    }

    componentWillUnmount = () => {
        this.state.active = false
    }


    handleSearchTextUpdate = (event: any) => {
        this.setState({
                searchText: event.target.value
            },
            () => {
                this.performSearch()
            });
    };

    handleSelectNode = (result: GraphNodeData) => {
        this.props.onSelectNode(result.id)
    }


    performSearch = () => {
        if (this.state.active) {
            let tmpResults: GraphNodeData[] = [];
            if (this.state.searchText == '') {
                tmpResults = this.props.nodes
            } else {
                this.props.nodes.forEach((item) => {
                    if (item.label.indexOf(this.state.searchText) >= 0) {
                        tmpResults.push(item)
                    }
                })
            }
            this.state.searchResults = tmpResults
        }
    }

    render() {
        this.initState();
        this.performSearch()
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
                        <TextField
                            hintText="Search text ..."
                            value={this.state.searchText}
                            onChange={this.handleSearchTextUpdate}
                            underlineFocusStyle={styles.underlineStyle}
                            fullWidth={true}
                            ref={(() => {
                        if(this.props.focus){
                            return focusInput
                        }else{
                            return null
                        }
                    })()}
                        />
                        <List>
                            {
                                this.state.searchResults.map((result) => {
                                    return <ListItem
                                        primaryText={result.label}
                                        rightIconButton={
                                            <IconButton onTouchTap={() => this.handleSelectNode(result)}>
                                            <MapsZoomOutMap></MapsZoomOutMap>
                                            </IconButton>
                                        }
                                    ></ListItem>
                                })
                            }
                        </List>
                </div>
        )
    }
}