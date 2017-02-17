/// <reference types="react" />
import * as React from "react";
import { GraphNodeElement } from "../model/GraphNodeData";
import { DialogNewNodeProps, DialogNewNodeState } from "./DialogNewNodeInterfaces";
import { DialogNewNodeToConnectProps, DialogNewNodeToConnectState } from "./DialogNewNodeToConnectInterfaces";
import { DialogNodeSearchToConnectProps, DialogNodeSearchToConnectState } from "./DialogNodeSearchToConnectInterfaces";
import { GraphNodeType } from "../model/GraphNodeType";
import { GraphLinkElement } from "../model/GraphLinkData";
/**
 * Specification for the dialog factory which has to implement to use this package
 */
export interface DialogFactory {
    /**
     * Create a "new node" dialog and return it as a react component
     * @param open - Boolean represent if the dialog is visible or not
     * @param onSave - Function when the new node will be saved
     * @param onRequestClose - Function to close the dialog
     * @param node - Empty node element
     * @param type - Type of the new node
     * @return dialog
     */
    getDialogNodeNewNode(open: boolean, onSave: Function, onRequestClose: Function, node: GraphNodeElement, type: GraphNodeType): React.Component<DialogNewNodeProps, DialogNewNodeState>;
    /**
     * Create a "new node and connect to it" dialog and return it as a react component
     * @param open - Boolean represent if the dialog is visible or not
     * @param onSave - Function when the new node will be saved
     * @param onRequestClose - Function to close the dialog
     * @param link - Empty link element
     * @param type - Type of the new node
     * @return dialog
     */
    getDialogNodeNewNodeToConnect(open: boolean, onSave: Function, onRequestClose: Function, link: GraphLinkElement, type: GraphNodeType): React.Component<DialogNewNodeToConnectProps, DialogNewNodeToConnectState>;
    /**
     * Create a dialog to search and select an existing node and connect it directly to another node
     * @param open - Boolean represent if the dialog is visible or not
     * @param onSelect - Function on node is selected
     * @param onRequestClose - Function to close the dialog
     */
    getDialogNodeSearchToConnect(open: boolean, onSelect: Function, onRequestClose: Function): React.Component<DialogNodeSearchToConnectProps, DialogNodeSearchToConnectState>;
}
