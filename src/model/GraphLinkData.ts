import {GraphElement, GraphElementData} from "./GraphElement";
import {VISIBILITY} from "./VISIBILITY";

export class GraphLinkElement implements GraphElement {
    data: GraphLinkData
    visibility: VISIBILITY = VISIBILITY.HIDDEN
    linkClasses: any[] = []

    constructor(data: GraphLinkData, visibility: VISIBILITY) {
        this.data = data
        this.visibility = visibility
    }
}

export class GraphLinkData implements GraphElementData {
    id: string
    source: string
    target: string
    label: string = ""

    constructor(id: string, source: string, target: string) {
        this.id = id
        this.source = source
        this.target = target
    }
}