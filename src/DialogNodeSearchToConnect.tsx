import * as React from "react";
import {Dialog, FlatButton} from "material-ui";
import {TextField} from "material-ui";
import {DialogNodeDetailProps} from "./interfaces/DialogNodeDetailInterfaces";
import {GraphNodeData} from "./model/GraphNodeData";
import {GuidService} from "./common/GuidService";
import {
    DialogNodeSearchToConnectProps,
    DialogNodeSearchToConnectState
} from "./interfaces/DialogNodeSearchToConnectInterfaces";

export class DialogNodeSearchToConnect extends React.Component<DialogNodeSearchToConnectProps, DialogNodeSearchToConnectState>{

    constructor(props: DialogNodeDetailProps) {
        super(props);
        this.state = {
            timestamp:""
        }
    }

    initState = () => {
        if (this.state.timestamp != this.props.timestamp) {
            this.state.timestamp = this.props.timestamp;
            this.state.node = new GraphNodeData(GuidService.getRandomGuid())
        }
    }

    handleSave = () => {
        this.props.onSave(this.state);
    }

    handleCancel = () => {
        this.props.onRequestClose();
    }


    handleInputUpdateNode = (event: any) => {
        let node = this.state.node
        node.label = event.target.value
        this.setState({
            node: node
        })
    };

    handleInputUpdateLabel = (event: any) => {
        this.setState({
            label: event.target.value
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
                    hintText="Node label..."
                    value={this.state.label}
                    underlineFocusStyle={styles.underlineStyle}
                    style={styles.textField}
                    onChange={this.handleInputUpdateLabel}
                />

                <TextField
                    hintText="Node name..."
                    value={this.state.node.label}
                    underlineFocusStyle={styles.underlineStyle}
                    style={styles.textField}
                    onChange={this.handleInputUpdateNode}
                />
        </Dialog>
    );
    }
}