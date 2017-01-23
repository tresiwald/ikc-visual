import {GraphPosition} from "./GraphPosition";
import {GraphElement, GraphElementData} from "./GraphElement";
import {VISIBILITY} from "./VISIBILITY";

export class GraphNodeElement implements GraphElement {
    data: GraphNodeData
    position: GraphPosition
    visibility: VISIBILITY = VISIBILITY.HIDDEN
    nodeClasses: any[] = []

    constructor(data: GraphNodeData, position: GraphPosition, visibility: VISIBILITY) {
        this.data = data
        this.position = position
        this.visibility = visibility
    }
}

export class GraphNodeData implements GraphElementData {
    id: string
    label: string = ""

    constructor(id: string) {
        this.id = id
    }
}

