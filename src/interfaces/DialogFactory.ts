
import * as React from "react";
import { GraphNodeData} from "../model/GraphNodeData";
import {DialogNodeDetailProps, DialogNodeDetailState} from "./DialogNodeDetailInterfaces";

export interface DialogFactory{
    getDialogNodeDetailAsEdit(open: boolean, onSave: Function, onRequestClose:Function, node:GraphNodeData): React.Component<DialogNodeDetailProps,DialogNodeDetailState>
    getDialogNodeDetailAsNew(open: boolean, onSave: Function, onRequestClose:Function): React.Component<DialogNodeDetailProps,DialogNodeDetailState>
}