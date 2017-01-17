
import * as React from "react";
import {GraphNodeData} from "../model/GraphNodeData";
import {NewDialogNodeDetailProps, NewDialogNodeDetailState} from "./NewDialogNodeDetailInterfaces";
import {DialogNodeSearchProps, DialogNodeSearchState} from "./DialogNodeSearchInterfaces";
import {DialogNodeDetailToConnectProps, DialogNodeDetailToConnectState} from "./NewDialogNodeDetailInterfacesToConnect";
import {DialogNodeSearchToConnectProps, DialogNodeSearchToConnectState} from "./DialogNodeSearchToConnectInterfaces";
import {GraphNodeType} from "../model/GraphNodeType";

export interface DialogFactory{
    getDialogNodeDetailAsEdit(open: boolean, onSave: Function, onRequestClose:Function, node:GraphNodeData): React.Component<NewDialogNodeDetailProps,NewDialogNodeDetailState>
    getDialogNodeDetailAsNew(open: boolean, onSave: Function, onRequestClose:Function, type: GraphNodeType): React.Component<NewDialogNodeDetailProps,NewDialogNodeDetailState>
    getDialogNodeSearch(open: boolean, onSelect: Function, onRequestClose:Function): React.Component<DialogNodeSearchProps,DialogNodeSearchState>
    getDialogNodeDetailAsNewToConnect(open: boolean, onSave: Function, onRequestClose:Function, type: GraphNodeType): React.Component<DialogNodeDetailToConnectProps,DialogNodeDetailToConnectState>
    getDialogNodeSearchToConnect(open: boolean, onSelect: Function, onRequestClose:Function): React.Component<DialogNodeSearchToConnectProps,DialogNodeSearchToConnectState>
}