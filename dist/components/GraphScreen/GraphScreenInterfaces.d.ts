import { View } from "../../model/View";
import { NodeInformationProvider } from "../../interfaces/NodeInformationProvider";
import { OperationService } from "../../interfaces/OperationService";
import { GraphNodeElement, GraphNodeData } from "../../model/GraphNodeData";
import { GraphLinkElement } from "../../model/GraphLinkData";
import { DialogFactory } from "../../interfaces/DialogFactory";
import { GraphPosition } from "../../model/GraphPosition";
import { GraphNodeType } from "../../model/GraphNodeType";
import { SearchFieldFactory } from "../../interfaces/SearchFieldFactory";
import { IdentityService } from "../../interfaces/IdentityService";
export interface GraphScreenProps {
    viewToLoad: View;
    nodeInformationProvider: NodeInformationProvider;
    operationService: OperationService;
    dialogFactory: DialogFactory;
    searchFieldFactory: SearchFieldFactory;
    onNodeDetailRequest: Function;
    nodeTypes: GraphNodeType[];
    identityService: IdentityService;
}
export interface GraphScreenStats {
    nodes?: Map<string, GraphNodeElement>;
    links?: Map<string, GraphLinkElement>;
    dialogNewNodeOpen?: boolean;
    dialogSearchNodeOpen?: boolean;
    dialogNewNodeToConnectOpen?: boolean;
    dialogSearchNodeToConnectOpen?: boolean;
    tappedNode?: GraphNodeData;
    tappedPosition?: GraphPosition;
    coreContextMenuOpen?: boolean;
    nodeContextMenuOpen?: boolean;
    newNodeType?: GraphNodeType;
    collapseToolbarNeeded?: boolean;
    showLabels?: boolean;
}
