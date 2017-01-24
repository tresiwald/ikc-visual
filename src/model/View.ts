import {GraphNodeElement} from "./GraphNodeData";
import {GraphLinkElement} from "./GraphLinkData";
import {TimeService} from "../common/TimeService";

/**
 * Save a visualisation
 */
export class View {
    id: string
    title: string
    changedAt: string
    createdAt: string
    nodes: GraphNodeElement[]
    links: GraphLinkElement[]

    /**
     * Default constructor
     * @param title - title of the view
     * @param nodes - nodes of the view
     * @param links - links of the view
     */
    constructor(title: string, nodes: GraphNodeElement[], links: GraphLinkElement[]) {
        this.id = TimeService.getTimestamp()
        this.changedAt = TimeService.getTimestamp()
        this.createdAt = TimeService.getTimestamp()
        this.title = title
        this.nodes = nodes
        this.links = links
    }

    /**
     * Return a json string of the view
     * @return {string}
     */
    toJson(): string {
        return JSON.stringify(this)
    }
}