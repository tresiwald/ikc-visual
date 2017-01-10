import {NodeInformationProvider} from "./interfaces/NodeInformationProvider";
import {GraphNodeData} from "./model/GraphNodeData";

export class TestNodeInformationProvider implements NodeInformationProvider {

    getNodeTitle(ids: number[]): string[] {
        return undefined;
    }

    getNodeEdgesIds(id: number[]): number[] {
        return undefined;
    }


    getChildsOfNode(id: string): GraphNodeData[] {
        let returnArr = []
        let rand = Math.random()*8
        for(var i = 0; i<rand; i++ ){
            returnArr.push(
                new GraphNodeData(
                    i.toString(), i.toString()
                )
            )
        }
        return returnArr
    }
}