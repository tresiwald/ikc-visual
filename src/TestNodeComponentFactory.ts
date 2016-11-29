import {NodeComponentFactory} from "ikc-visual-interfaces/src/common/interfaces/NodeComponentFactory";
import DiagramNode from "./common/diagram/DiagramNode";
import DiagramEdge from "./common/diagram/DiagramEdge";

export class TestNodeComponentFactory implements NodeComponentFactory {

    getNodesDetails(ids: number[]): DiagramNode {
        return undefined;
    }

    getNodesEdges(nodeIds: number[], edgeIds: number[]): DiagramEdge {
        return undefined;
    }

}