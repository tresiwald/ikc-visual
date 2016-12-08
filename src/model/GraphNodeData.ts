import {GraphPosition} from "./GraphPosition";
import {GraphElement, GraphElementData} from "./GraphElement";

export class GraphNodeElement implements GraphElement{
    data: GraphNodeData
    position: GraphPosition

    constructor(data: GraphNodeData, position: GraphPosition) {
        this.data = data
        this.position = position
    }
}

export class GraphNodeData implements GraphElementData{
    id: string
    label: string

    constructor(id: string, label: string){
        this.id = id
        this.label = label
    }
}

