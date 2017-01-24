/**
 * Provides Information for visualization => connection to specific data structure. This has to be implemented to use this package.
 */
export interface NodeInformationProvider {

    /**
     * Return the title of a node with a certain id
     * @param id
     * @return {string}
     */
    getNodeTitle(id: string): string;

    /**
     * Return the label of a link with a certain id outgoing from a certain node
     * @param sourceId
     * @param linkId
     */
    getLinkLabel(sourceId: string, linkId: string): string;
}