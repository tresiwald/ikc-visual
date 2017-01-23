export class VISIBILITY {
    // boilerplate
    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }

    // values
    static VISIBLE = new VISIBILITY("VISIBLE");
    static HIDDEN = new VISIBILITY("HIDDEN");
}
