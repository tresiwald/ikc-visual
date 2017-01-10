import {GraphElement} from "./GraphElement";
export class View{
    nodes: GraphElement[]
    links: GraphElement[]

    constructor(nodes:GraphElement[], links:GraphElement[]){
        this.nodes = nodes
        this.links = links
    }

    toJson():string {
        return JSON.stringify(this)
    }
}