import {OperationService} from "./interfaces/OperationService";

export class TestOperationService implements OperationService {

    createNodes(ids: number[], labels: string[]): void {
    }

    createEdges(ids: number[], sources: number[], targets: number[], labels: string[]): void {
    }

    updateNodes(ids: number[], labels: string[]): void {
    }

    updateEdges(ids: number[], sources: number[], targets: number[], labels: string[]): void {
    }

    deleteNodes(ids: number[]): void {
    }

    deleteEdges(ids: number[]): void {
    }

}