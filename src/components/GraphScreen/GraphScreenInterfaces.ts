import {View} from "../../model/View";
import {NodeInformationProvider} from "../../interfaces/NodeInformationProvider";
import {OperationService} from "../../interfaces/OperationService";
import {GraphNodeElement, GraphNodeData} from "../../model/GraphNodeData";
import {GraphArrowElement} from "../../model/GraphArrowData";
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
    arrows?: GraphArrowElement[];
    timestamp?: string;
    dialogNodeEditOpen?: boolean;
    nodeToEdit?: GraphNodeData
}