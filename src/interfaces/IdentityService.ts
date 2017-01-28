/**
 * Provides methods to create ids for new nodes and links. This has to be implemented to use this package.
 */
export interface IdentityService {

    /**
     * Create new node id
     */
    createNewNodeId(): string


    /**
     * Create new link id
     */
    createNewLinkId(): string
}
