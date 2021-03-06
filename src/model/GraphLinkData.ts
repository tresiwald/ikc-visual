import {GraphElement, GraphElementData} from "./GraphElement";
import {VISIBILITY} from "./VISIBILITY";

/**
 * Graph link element specify the graph element
 */
export class GraphLinkElement implements GraphElement {
    data: GraphLinkData
    visibility: VISIBILITY = VISIBILITY.HIDDEN
    linkClasses: any[] = []

    /**
     * Default constructor
     * @param data - data of the link
     * @param visibility - visibility of the link
     */
    constructor(data: GraphLinkData, visibility: VISIBILITY) {
        this.data = data
        this.visibility = visibility
    }
}

/**
 * Graph link data specify the graph element data
 */
export class GraphLinkData implements GraphElementData {
    id: string
    source: string
    target: string
    label: string = ""

    /**
     * Default constructor
     * @param id - id of the link
     * @param source - id of the source node
     * @param target - id of the target node
     */
    constructor(id: string, source: string, target: string) {
        this.id = id
        this.source = source
        this.target = target
    }
}