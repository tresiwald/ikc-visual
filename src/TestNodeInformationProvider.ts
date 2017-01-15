import {NodeInformationProvider} from "./interfaces/NodeInformationProvider";
import {GraphNodeData} from "./model/GraphNodeData";

export class TestNodeInformationProvider implements NodeInformationProvider {

    getNodeTitle(id: string): string {
        let random = Math.round(Math.random()*100)
        return "Node-" + random
    }

    getLinkLabel(id: string): string {
        let random = Math.random()
        return "Link-" + random
    }

    getNodeTitles(ids: string[]): string[] {
        return undefined
    }


    getNodeEdgesIds(id: string[]): string[] {
        return undefined;
    }
}