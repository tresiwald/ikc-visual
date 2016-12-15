import {DialogFactory} from "./interfaces/DialogFactory";
import * as React from "react";
import {DialogNodeDetail} from "./DialogNodeDetail";
import * as TimeService from "./common/TimeService"
import { GraphNodeData} from "./model/GraphNodeData";

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
}