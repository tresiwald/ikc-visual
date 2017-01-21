export interface SearchFieldFactory{
    getNodeSearchField(onNodeSelected: Function):any
    getLinkSearchField(onLinkSelected: Function):any
}
