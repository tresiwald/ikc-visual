/**
 * Class for the different GraphNodeTypes
 */
export class GraphNodeType {
    id: string
    name: string

    /**
     * Default constructor
     * @param id - unique id of the type
     * @param name - name of the type
     */
    constructor(id: string, name: string) {
        this.id = id
        this.name = name
    }
}