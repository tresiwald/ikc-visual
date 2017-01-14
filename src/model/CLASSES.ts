export class CLASSES {
    // boilerplate
    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }

    // values
    static PARENT = new CLASSES("parent");
}
