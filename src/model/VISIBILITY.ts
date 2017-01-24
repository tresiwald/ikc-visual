/**
 * Enumerator for the visibility flag of nodes and links
 */
export class VISIBILITY {

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }

    static VISIBLE = new VISIBILITY("VISIBLE");
    static HIDDEN = new VISIBILITY("HIDDEN");
}
