/** This module provides Time related methods */
"use strict";
var TimeService;
(function (TimeService) {
    /**
     * Return the actual time as millisecond timestamp
     * @returns {string}
     */
    function getTimestamp() {
        return (new Date).getTime().toString();
    }
    TimeService.getTimestamp = getTimestamp;
})(TimeService = exports.TimeService || (exports.TimeService = {}));
//# sourceMappingURL=TimeService.js.map