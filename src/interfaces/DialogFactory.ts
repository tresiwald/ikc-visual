
import * as React from "react";
import {GraphNodeData} from "../model/GraphNodeData";
import {DialogNodeDetailProps, DialogNodeDetailState} from "./DialogNodeDetailInterfaces";
import {DialogNodeSearchProps, DialogNodeSearchState} from "./DialogNodeSearchInterfaces";
import {DialogNodeDetailToConnectProps, DialogNodeDetailToConnectState} from "./DialogNodeDetailInterfacesToConnect";
import {DialogNodeSearchToConnectProps, DialogNodeSearchToConnectState} from "./DialogNodeSearchToConnectInterfaces";

export interface DialogFactory{
    getDialogNodeDetailAsEdit(open: boolean, onSave: Function, onRequestClose:Function, node:GraphNodeData): React.Component<DialogNodeDetailProps,DialogNodeDetailState>
    getDialogNodeDetailAsNew(open: boolean, onSave: Function, onRequestClose:Function): React.Component<DialogNodeDetailProps,DialogNodeDetailState>
    getDialogNodeSearch(open: boolean, onSelect: Function, onRequestClose:Function): React.Component<DialogNodeSearchProps,DialogNodeSearchState>
    getDialogNodeDetailAsNewToConnect(open: boolean, onSave: Function, onRequestClose:Function): React.Component<DialogNodeDetailToConnectProps,DialogNodeDetailToConnectState>
    getDialogNodeSearchToConnect(open: boolean, onSelect: Function, onRequestClose:Function): React.Component<DialogNodeSearchToConnectProps,DialogNodeSearchToConnectState>
}