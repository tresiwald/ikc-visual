import {DialogEditNodeProps, DialogEditNodeState} from "./DialogEditNodeInterfaces";
import * as React from "react";
import { GraphNodeData} from "../model/GraphNodeData";

export interface DialogFactory{
    getDialogNodeEdit(open: boolean, onSave: Function, onRequestClose:Function, node:GraphNodeData): React.Component<DialogEditNodeProps,DialogEditNodeState>
}