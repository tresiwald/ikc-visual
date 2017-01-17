/*
import * as React from "react";
import {Dialog, FlatButton} from "material-ui";
import {TextField} from "material-ui";
import {DialogNodeDetailProps, DialogNodeDetailState} from "./interfaces/DialogNewNodeInterfaces";
import {GraphNodeData} from "./model/GraphNodeData";
import {GuidService} from "./common/GuidService";

export class DialogNodeDetail extends React.Component<DialogNodeDetailProps, DialogNodeDetailState>{

    constructor(props: DialogNodeDetailProps) {
        super(props);
        this.state = {
            timestamp:""
        }
    }

    initState = () => {
        if (this.state.timestamp != this.props.timestamp) {
            this.state.timestamp = this.props.timestamp;
            this.state.node = this.props.node;

            if(this.props.asNewDialog){
                this.state.node = new GraphNodeData(GuidService.getRandomGuid())
            }
        }
    }

    handleSave = () => {
        this.props.onSave(this.state);
    }

    handleCancel = () => {
        this.props.onRequestClose();
    }

    handleInputUpdate = (event: any) => {
        let node = this.state.node
        node.label = event.target.value
        this.setState({
            node:node
        })
    };

    render() {
        this.initState()

        const styles = {
            button: {
                color: "#4591bc",
            },
            underlineStyle: {
                borderColor: "#4591bc",
            },
            textField: {
                width: "100%",
            },
            tagField: {
                borderColor: "#4591bc",
            },
            dialog: {

            },
            searchIcon: {
                marginTop: "10px",
                color: "rgb(117, 117, 117)",
            },
            iconHover: {
                color: "#4591bc",
            },

        };

        const actionsText: any[] = [];

        actionsText.push(
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCancel.bind(this)}
                style={styles.button}
            />
        );

        actionsText.push(
            <FlatButton
                label="Save"
                primary={true}
                onTouchTap={this.handleSave.bind(this)}
                style={styles.button}
            />
        );
        return (
            <Dialog
                actions={actionsText}
                modal={false} open={this.props.open} onRequestClose={this.handleCancel.bind(this)}
                style={styles.dialog} className="dialog">

                <TextField
                    hintText="Node name..."
                    value={this.state.node.label}
                    underlineFocusStyle={styles.underlineStyle}
                    style={styles.textField}
                    onChange={this.handleInputUpdate}
                />
        </Dialog>
    );
    }
}*/
