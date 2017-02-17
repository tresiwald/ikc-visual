import { GraphPosition } from "./GraphPosition";
import { GraphElement, GraphElementData } from "./GraphElement";
import { VISIBILITY } from "./VISIBILITY";
/**
 * Graph data element specify the graph element
 */
export declare class GraphNodeElement implements GraphElement {
    data: GraphNodeData;
    position: GraphPosition;
    visibility: VISIBILITY;
    nodeClasses: any[];
    /**
     * Default constructor
     * @param data - data of the node
     * @param position - position of the node
     * @param visibility - visibility of the node
     */
    constructor(data: GraphNodeData, position: GraphPosition, visibility: VISIBILITY);
}
/**
 * Graph node data specify the graph element data
 */
export declare class GraphNodeData implements GraphElementData {
    id: string;
    label: string;
    /**
     * Default constructor
     * @param id - id of the node
     */
    constructor(id: string);
}
