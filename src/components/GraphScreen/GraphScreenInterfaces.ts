import {View} from "../../model/View";
import {NodeInformationProvider} from "../../interfaces/NodeInformationProvider";
import {OperationService} from "../../interfaces/OperationService";
import {GraphElement} from "../../model/GraphElement";
import {GraphNodeElement} from "../../model/GraphNodeData";
import {GraphArrowElement} from "../../model/GraphArrowData";

export interface  GraphScreenProps {
    viewToLoad: View;
    onViewSave: Function;
    onViewDelete: Function;
    nodeInformationProvider: NodeInformationProvider;
    operationService: OperationService;
    timestamp: string
}

export interface  GraphScreenStats {
    nodes?: GraphNodeElement[];
    arrows?: GraphArrowElement[];
    timestamp?: string
}