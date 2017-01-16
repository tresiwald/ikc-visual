import {GraphElement} from "./GraphElement";
import {GraphNodeElement} from "./GraphNodeData";
import {GraphLinkElement} from "./GraphLinkData";
import {TimeService} from "../common/TimeService";
export class View{
    id:string
    nodes: GraphNodeElement[]
    links: GraphLinkElement[]

    constructor(nodes: GraphNodeElement[], links: GraphLinkElement[]){
        this.id = TimeService.getTimestamp()
        this.nodes = nodes
        this.links = links
    }

    toJson():string {
        return JSON.stringify(this)
    }
}