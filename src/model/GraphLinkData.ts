import {GraphPosition} from "./GraphPosition";
import {GraphElement, GraphElementData} from "./GraphElement";

export class GraphLinkElement implements GraphElement{
    data: GraphLinkData

    constructor(data: GraphLinkData) {
        this.data = data
    }
}

export class GraphLinkData implements GraphElementData{
    id:string
    source:string
    target:string
    label:string

    constructor(id:string, source:string, target:string, label:string){
        this.id = id
        this.source = source
        this.target = target
        this.label = label
    }
}