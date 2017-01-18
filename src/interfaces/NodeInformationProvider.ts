import {GraphNodeData} from "../model/GraphNodeData";
/**
 * Provides Information for visualization => connection to specific data structure
 */
export interface NodeInformationProvider {
    getNodeTitle(id: string): string;
    getLinkLabel(targetId: string, linkId: string): string;
    getNodeTitles(ids: string[]): string[];
    getNodeLinkIds(id: string[]): string[];
}