
import * as React from "react";
import {GraphNodeElement} from "../model/GraphNodeData";
import {DialogNewNodeProps, DialogNewNodeState} from "./DialogNewNodeInterfaces";
import {DialogNodeSearchProps, DialogNodeSearchState} from "./DialogNodeSearchInterfaces";
import {DialogNewNodeDetailToConnectProps, DialogNewNodeDetailToConnectState} from "./DialogNewNodeToConnectInterfaces";
import {DialogNodeSearchToConnectProps, DialogNodeSearchToConnectState} from "./DialogNodeSearchToConnectInterfaces";
import {GraphNodeType} from "../model/GraphNodeType";
import {GraphLinkElement} from "../model/GraphLinkData";

export interface DialogFactory{
    getDialogNodeNewNode(open: boolean, onSave: Function, onRequestClose:Function, node:GraphNodeElement, type: GraphNodeType): React.Component<DialogNewNodeProps,DialogNewNodeState>
    getDialogNodeNewNodeToConnect(open: boolean, onSave: Function, onRequestClose:Function, node:GraphLinkElement, type: GraphNodeType): React.Component<DialogNewNodeDetailToConnectProps,DialogNewNodeDetailToConnectState>
    getDialogNodeSearch(open: boolean, onSelect: Function, onRequestClose:Function): React.Component<DialogNodeSearchProps,DialogNodeSearchState>
    getDialogNodeSearchToConnect(open: boolean, onSelect: Function, onRequestClose:Function): React.Component<DialogNodeSearchToConnectProps,DialogNodeSearchToConnectState>
}