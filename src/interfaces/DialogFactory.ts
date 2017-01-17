
import * as React from "react";
import {GraphNodeElement} from "../model/GraphNodeData";
import {DialogNewNodeProps, DialogNewNodeState} from "./DialogNewNodeInterfaces";
import {DialogNodeSearchProps, DialogNodeSearchState} from "./DialogNodeSearchInterfaces";
import {DialogNewNodeToConnectProps, DialogNewNodeToConnectState} from "./DialogNewNodeToConnectInterfaces";
import {DialogNodeSearchToConnectProps, DialogNodeSearchToConnectState} from "./DialogNodeSearchToConnectInterfaces";
import {GraphNodeType} from "../model/GraphNodeType";
import {GraphLinkElement} from "../model/GraphLinkData";

export interface DialogFactory{
    getDialogNodeNewNode(open: boolean, onSave: Function, onRequestClose:Function, node:GraphNodeElement, type: GraphNodeType): React.Component<DialogNewNodeProps,DialogNewNodeState>
    getDialogNodeNewNodeToConnect(open: boolean, onSave: Function, onRequestClose:Function, link:GraphLinkElement, type: GraphNodeType): React.Component<DialogNewNodeToConnectProps,DialogNewNodeToConnectState>
    getDialogNodeSearch(open: boolean, onSelect: Function, onRequestClose:Function): React.Component<DialogNodeSearchProps,DialogNodeSearchState>
    getDialogNodeSearchToConnect(open: boolean, onSelect: Function, onRequestClose:Function): React.Component<DialogNodeSearchToConnectProps,DialogNodeSearchToConnectState>
}