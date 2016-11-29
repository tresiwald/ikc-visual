import {NodeInformationProvider} from "ikc-visual-interfaces/src/common/interfaces/NodeInformationProvider";

export class TestNodeInformationProvider implements NodeInformationProvider {

    getNodeTitle(ids: number[]): string[] {
        return undefined;
    }

    getNodeEdgesIds(id: number[]): number[] {
        return undefined;
    }

}