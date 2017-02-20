"use strict";
const GraphPosition_1 = require("../model/GraphPosition");
/**
 Provide methods to get information about the DOM Model or calculate UI operation
 */
var DOMHelperService;
(function (DOMHelperService) {
    /**
     * Check if the child element actually is a descendant of the given parent
     * @param parent - parent element
     * @param child - child element
     */
    function isDescendant(parent, child) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    DOMHelperService.isDescendant = isDescendant;
    /**
     * Calculate a random position for a child node. The calculation is based on the position of the
     * parent node, a random angel between 0 and 180 and a random radius. The radius will have at least
     * the length of 80.
     * @param source
     * @returns {GraphPosition}
     */
    function calcNodePosition(source) {
        let randomAngle = Math.random() * 180;
        let randomRadius = 80 + Math.random() * 40;
        return new GraphPosition_1.GraphPosition(Math.round(source.x + ((randomRadius) * Math.cos((Math.PI / 180) * randomAngle))), Math.round(source.y + ((randomRadius) * Math.sin((Math.PI / 180) * randomAngle))));
    }
    DOMHelperService.calcNodePosition = calcNodePosition;
    /**
     * Calculate if two nodes are close to each other. Is used to check if the node positioning ends on a existing node
     * @param free, source node
     * @param target, target node
     * @returns {boolean}
     */
    function close(free, target) {
        let dx = Math.abs(free.x - target.x);
        let dy = Math.abs(free.y - target.y);
        let d = 10;
        if (dx < d && dy < d)
            return true;
        return false;
    }
    DOMHelperService.close = close;
})(DOMHelperService = exports.DOMHelperService || (exports.DOMHelperService = {}));
//# sourceMappingURL=DOMHelperService.js.map