import {GraphPosition} from "../../model/GraphPosition";
import {GraphNodeElement} from "../../model/GraphNodeData";
import {GraphLinkElement} from "../../model/GraphLinkData";
import {IdentityService} from "../../interfaces/IdentityService";

export interface GraphProps {
    nodes: GraphNodeElement[]
    links: GraphLinkElement[]
    onNewNode: Function
    onNewLink: Function
    onNodePositionUpdate: Function
    onNodeDetailRequest?: Function
    onCoreContextMenuRequested?: Function
    onNodeContextMenuRequested?: Function
    onLinkSelected?: Function
    onPanChanged?: Function
    identityService: IdentityService
}

export interface GraphState {
    oldPosition?: Map<string, GraphPosition>
    pan?: GraphPosition
    toolbarVisible?: boolean
}
