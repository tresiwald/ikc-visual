import {DialogFactory} from "./interfaces/DialogFactory";
import * as React from "react";
import {DialogEditNode} from "./DialogEditNode";
import * as TimeService from "./common/TimeService"
import { GraphNodeData} from "./model/GraphNodeData";

export class TestDialogFactory implements DialogFactory{
    getDialogNodeEdit(open: boolean, onSave: Function, onRequestClose: Function, node: GraphNodeData): any {
        return (
            <DialogEditNode open={open} timestamp={TimeService.getTimestamp()} node={node} onSave={onSave} onRequestClose={onRequestClose}/>
        )
    }
}