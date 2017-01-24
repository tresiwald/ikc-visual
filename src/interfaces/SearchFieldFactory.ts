import * as React from 'react'

/**
 * Specification for the search field factory which has to implement to use this package
 */
export interface SearchFieldFactory {

    /**
     * Create a new search field to search a node, returns a react component
     * @param onNodeSelected
     */
    getNodeSearchField(onNodeSelected: Function): React.Component<any,any>

    /**
     * Create a new search field to search a link, returns a react component
     * @param onNodeSelected
     */
    getLinkSearchField(onLinkSelected: Function, links: string[]): React.Component<any,any>
}
