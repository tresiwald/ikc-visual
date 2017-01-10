import {DialogFactory} from "./interfaces/DialogFactory";
import * as React from "react";
import {DialogNodeDetail} from "./DialogNodeDetail";
import {TimeService} from "./common/TimeService"
import { GraphNodeData} from "./model/GraphNodeData";
import {DialogNodeSearch} from "./DialogNodeSearch";
import {DialogNodeSearchToConnect} from "./DialogNodeSearchToConnect";
import {DialogNodeDetailToConnect} from "./DialogNodeDetailToConnect";

export class TestDialogFactory implements DialogFactory{
    getDialogNodeDetailAsEdit(open: boolean, onSave: Function, onRequestClose: Function, node: GraphNodeData): any {
        return (
            <DialogNodeDetail asNewDialog={false} open={open} timestamp={TimeService.getTimestamp()} node={node} onSave={onSave} onRequestClose={onRequestClose}/>
        )
    }
    getDialogNodeDetailAsNew(open: boolean, onSave: Function, onRequestClose: Function): any {
        return (
            <DialogNodeDetail asNewDialog={true} open={open} timestamp={TimeService.getTimestamp()} onSave={onSave} onRequestClose={onRequestClose}/>
        )
    }

    getDialogNodeSearch(open: boolean, onSelect: Function, onRequestClose: Function): any {
        return (
            <DialogNodeSearch open={open} timestamp={TimeService.getTimestamp()} onSave={onSelect} onRequestClose={onRequestClose}/>
        )
    }

    getDialogNodeDetailAsNewToConnect(open: boolean, onSave: Function, onRequestClose: Function): any {
        return (
            <DialogNodeDetailToConnect asNewDialog={true} open={open} timestamp={TimeService.getTimestamp()} onSave={onSave} onRequestClose={onRequestClose}/>
        )
    }

    getDialogNodeSearchToConnect(open: boolean, onSelect: Function, onRequestClose: Function): any {
        return (
            <DialogNodeSearchToConnect open={open} timestamp={TimeService.getTimestamp()} onSave={onSelect} onRequestClose={onRequestClose}/>
        )
    }
}