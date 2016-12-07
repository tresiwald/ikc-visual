import {NodeInformationProvider} from "./interfaces/NodeInformationProvider";

export class TestNodeInformationProvider implements NodeInformationProvider {

    getNodeTitle(ids: number[]): string[] {
        return undefined;
    }

    getNodeEdgesIds(id: number[]): number[] {
        return undefined;
    }

}