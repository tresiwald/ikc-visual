import {GraphPosition} from "./GraphPosition";
import {GraphElement, GraphElementData} from "./GraphElement";
import {VISIBILITY} from "./VISIBILITY";


/**
 * Graph data element specify the graph element
 */
export class GraphNodeElement implements GraphElement {
    data: GraphNodeData
    position: GraphPosition
    visibility: VISIBILITY = VISIBILITY.HIDDEN
    nodeClasses: any[] = []

    /**
     * Default constructor
     * @param data - data of the node
     * @param position - position of the node
     * @param visibility - visibility of the node
     */
    constructor(data: GraphNodeData, position: GraphPosition, visibility: VISIBILITY) {
        this.data = data
        this.position = position
        this.visibility = visibility
    }
}

/**
 * Graph node data specify the graph element data
 */
export class GraphNodeData implements GraphElementData {
    id: string
    label: string = ""

    /**
     * Default constructor
     * @param id - id of the node
     */
    constructor(id: string) {
        this.id = id
    }
}

