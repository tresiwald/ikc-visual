import {GraphElement} from "./GraphElement";
export class View{
    nodes: GraphElement[]
    arrows: GraphElement[]

    constructor(nodes:GraphElement[], arrows:GraphElement[]){
        this.nodes = nodes
        this.arrows = arrows
    }

    toJson():string {
        return JSON.stringify(this)
    }
}