"use strict";
const TimeService_1 = require("../common/TimeService");
/**
 * Save a visualisation
 */
class View {
    /**
     * Default constructor
     * @param title - title of the view
     * @param nodes - nodes of the view
     * @param links - links of the view
     */
    constructor(title, nodes, links) {
        this.id = TimeService_1.TimeService.getTimestamp();
        this.changedAt = TimeService_1.TimeService.getTimestamp();
        this.createdAt = TimeService_1.TimeService.getTimestamp();
        this.title = title;
        this.nodes = nodes;
        this.links = links;
    }
    /**
     * Return a json string of the view
     * @return {string}
     */
    toJson() {
        return JSON.stringify(this);
    }
}
exports.View = View;
//# sourceMappingURL=View.js.map