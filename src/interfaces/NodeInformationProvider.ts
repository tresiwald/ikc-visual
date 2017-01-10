import {GraphNodeData} from "../model/GraphNodeData";
/**
 * Provides Information for visualization => connection to specific data structure
 */
export interface NodeInformationProvider {
    getNodeTitle(ids: number[]): string[];
    getNodeEdgesIds(id: number[]): number[];
    getChildsOfNode(id: string): GraphNodeData[];
}