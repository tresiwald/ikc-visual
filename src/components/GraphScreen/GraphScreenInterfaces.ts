import {View} from "../../model/View";
import {NodeInformationProvider} from "../../interfaces/NodeInformationProvider";
import {OperationService} from "../../interfaces/OperationService";
import {GraphNodeElement, GraphNodeData} from "../../model/GraphNodeData";
import {GraphLinkElement} from "../../model/GraphLinkData";
import {DialogFactory} from "../../interfaces/DialogFactory";

export interface  GraphScreenProps {
    viewToLoad: View;
    onViewSave: Function;
    onViewDelete: Function;
    nodeInformationProvider: NodeInformationProvider;
    operationService: OperationService;
    timestamp: string;
    dialogFactory: DialogFactory
}

export interface  GraphScreenStats {
    nodes?: GraphNodeElement[];
    arrows?: GraphLinkElement[];
    timestamp?: string;
    dialogNodeEditOpen?: boolean;
    nodeToEdit?: GraphNodeData
}