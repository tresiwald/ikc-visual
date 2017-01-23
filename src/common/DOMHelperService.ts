import {GraphPosition} from "../model/GraphPosition";

/**
 Provide methods to get information about the DOM Model or calculate UI operation
 */
export module DOMHelperService {

    /**
     * Check if the child element actually is a descendant of the given parent
     * @param parent - parent element
     * @param child - child element
     */
    export function isDescendant(parent: any, child: any) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    /**
     * Calculate a random position for a child node. The calculation is based on the position of the
     * parent node, a random angel between 0 and 180 and a random radius. The radius will have at least
     * the length of 80.
     * @param source
     * @returns {GraphPosition}
     */
    export function calcNodePosition(source: GraphPosition): GraphPosition {
        let randomAngle = Math.random() * 180
        let randomRadius = 80 + Math.random() * 40

        return new GraphPosition(
            Math.round(source.x + ((randomRadius) * Math.cos((Math.PI / 180) * randomAngle))),
            Math.round(source.y + ((randomRadius) * Math.sin((Math.PI / 180) * randomAngle)))
        )
    }

    /**
     * Calculate if two nodes are close to each other. Is used to check if the node positioning ends on a existing node
     * @param free, source node
     * @param target, target node
     * @returns {boolean}
     */
    export function close(free: any, target: any) {
    let dx = Math.abs(free.x - target.x);
    let dy = Math.abs(free.y - target.y);
    let d = 10;
    if (dx < d && dy < d) return true;
    return false;
}
}