/**
 * Provides Information for visualization => connection to specific data structure
 */
export interface NodeInformationProvider {
    getNodeTitle(id: string): string;
    getLinkLabel(sourceId: string, linkId: string): string;
}