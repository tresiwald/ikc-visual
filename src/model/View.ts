import {GraphElement} from "./GraphElement";
import {GraphNodeElement} from "./GraphNodeData";
import {GraphLinkElement} from "./GraphLinkData";
export class View{
    nodes: GraphNodeElement[]
    links: GraphLinkElement[]

    constructor(nodes: GraphNodeElement[], links: GraphLinkElement[]){
        this.nodes = nodes
        this.links = links
    }

    toJson():string {
        return JSON.stringify(this)
    }
}