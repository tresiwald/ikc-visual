"use strict";
/**
 * Enumerator for the visibility flag of nodes and links
 */
class VISIBILITY {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return this.value;
    }
}
VISIBILITY.VISIBLE = new VISIBILITY("VISIBLE");
VISIBILITY.HIDDEN = new VISIBILITY("HIDDEN");
exports.VISIBILITY = VISIBILITY;
//# sourceMappingURL=VISIBILITY.js.map