import * as React from "react";
import {ListItem, Paper, List, TextField, IconButton, FlatButton} from "material-ui";
import {MuiThemeProvider} from "material-ui/styles";
import {GraphLinkData} from "../../model/GraphLinkData";
import MapsZoomOutMap from "material-ui/svg-icons/maps/zoom-out-map";
import {GraphPosition} from "../../model/GraphPosition";
import render = __React.__DOM.render;
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;

export interface ExpandDialogProps {
    list: GraphLinkData[],
    timestamp: string,
    focus?: boolean,
    onExpandNode: Function,
    onExpandAll: Function,
    requestClose: Function,
    position: GraphPosition
}
export interface ExpandDialogState {
    searchResults?: GraphLinkData[],
    searchText?: string,
    timestamp?: string,
    active?: boolean
}

export default class ExpandDialog extends React.Component<ExpandDialogProps,ExpandDialogState> {
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
        let that = this
        document.addEventListener('click', function handler(event: any) {
            let element = document.getElementById('expandPaper')
            if (element) {
                let box = element.getBoundingClientRect()
                if (!(event.clientX > box.left && event.clientX < box.right && event.clientY > box.top && event.clientY < box.bottom)) {
                    that.props.requestClose()
                    document.removeEventListener('click', handler)
                }
            }
        })
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

    handleExpandNode = (result: GraphLinkData) => {
        this.props.onExpandNode(result.id)
    }

    handleExpandAll = () => {
        this.props.onExpandAll(this.props.list[0].source)
    }

    performSearch = () => {
        if (this.state.active) {
            let tmpResults: GraphLinkData[] = [];
            if (this.state.searchText == '') {
                tmpResults = this.props.list
            } else {
                this.props.list.forEach((item) => {
                    if (item.target.indexOf(this.state.searchText) >= 0) {
                        tmpResults.push(item)
                    }
                })
            }
            this.state.searchResults = tmpResults
        }
    }

    onRequestClose = () =>{
        this.props.requestClose()
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
            <MuiThemeProvider>
                <div>
                    <Paper id="expandPaper" style={styles.position}>
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
                                        primaryText={result.target}
                                        secondaryText={result.label}
                                        rightIconButton={
                                            <IconButton onTouchTap={() => this.handleExpandNode(result)}>
                                            <MapsZoomOutMap></MapsZoomOutMap>
                                            </IconButton>
                                        }
                                    ></ListItem>
                                })
                            }
                        </List>
                        <FlatButton label="Cancel" onTouchTap={this.onRequestClose}/>
                        <FlatButton label="Expand All" onTouchTap={this.handleExpandAll}/>
                    </Paper>
                </div>
            </MuiThemeProvider>
        )
    }
}