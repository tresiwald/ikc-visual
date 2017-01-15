import {View} from "../../model/View";
import {NodeInformationProvider} from "../../interfaces/NodeInformationProvider";
import {OperationService} from "../../interfaces/OperationService";
import {GraphNodeElement, GraphNodeData} from "../../model/GraphNodeData";
import {GraphLinkElement} from "../../model/GraphLinkData";
import {DialogFactory} from "../../interfaces/DialogFactory";
import {GraphPosition} from "../../model/GraphPosition";

export interface  GraphScreenProps {
    viewToLoad: View;
    onViewSave: Function;
    onViewDelete: Function;
    nodeInformationProvider: NodeInformationProvider;
    operationService: OperationService;
    timestamp: string;
    dialogFactory: DialogFactory;
    onNodeDetailRequest: Function;
    nodeTypesCreateFunctions?: Map<string, Function>
}

export interface  GraphScreenStats {
    nodes?: Map<string, GraphNodeElement>;
    links?: Map<string, GraphLinkElement>;
    timestamp?: string;
    dialogEditNodeOpen?: boolean;
    dialogNewNodeOpen?: boolean;
    dialogSearchNodeOpen?: boolean;
    dialogNewNodeToConnectOpen?: boolean;
    dialogSearchNodeToConnectOpen?: boolean;
    tappedNode?: GraphNodeData;
    tappedPosition?: GraphPosition;
    filterWindowOpen?: boolean;
    filterWindowNode?:GraphNodeElement;
}