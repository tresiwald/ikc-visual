import { GraphPosition } from "../model/GraphPosition";
/**
 Provide methods to get information about the DOM Model or calculate UI operation
 */
export declare module DOMHelperService {
    /**
     * Check if the child element actually is a descendant of the given parent
     * @param parent - parent element
     * @param child - child element
     */
    function isDescendant(parent: any, child: any): boolean;
    /**
     * Calculate a random position for a child node. The calculation is based on the position of the
     * parent node, a random angel between 0 and 180 and a random radius. The radius will have at least
     * the length of 80.
     * @param source
     * @returns {GraphPosition}
     */
    function calcNodePosition(source: GraphPosition): GraphPosition;
    /**
     * Calculate if two nodes are close to each other. Is used to check if the node positioning ends on a existing node
     * @param free, source node
     * @param target, target node
     * @returns {boolean}
     */
    function close(free: any, target: any): boolean;
}
