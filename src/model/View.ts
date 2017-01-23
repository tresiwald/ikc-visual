import {GraphNodeElement} from "./GraphNodeData";
import {GraphLinkElement} from "./GraphLinkData";
import {TimeService} from "../common/TimeService";
export class View {
    id: string
    title: string
    changedAt: string
    createdAt: string
    nodes: GraphNodeElement[]
    links: GraphLinkElement[]

    constructor(title: string, nodes: GraphNodeElement[], links: GraphLinkElement[]) {
        this.id = TimeService.getTimestamp()
        this.changedAt = TimeService.getTimestamp()
        this.createdAt = TimeService.getTimestamp()
        this.title = title
        this.nodes = nodes
        this.links = links
    }

    toJson(): string {
        return JSON.stringify(this)
    }
}