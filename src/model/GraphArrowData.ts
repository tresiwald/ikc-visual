import {GraphPosition} from "./GraphPosition";
import {GraphElement, GraphElementData} from "./GraphElement";

export class GraphArrowElement implements GraphElement{
    data: GraphArrowData

    constructor(data: GraphArrowData) {
        this.data = data
    }
}

export class GraphArrowData implements GraphElementData{
    source:string
    target:string
    label:string

    constructor(source:string, target:string, label:string){
        this.source = source
        this.target = target
        this.label = label
    }
}