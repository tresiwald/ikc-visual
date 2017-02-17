import { GraphNodeElement } from "./GraphNodeData";
import { GraphLinkElement } from "./GraphLinkData";
/**
 * Save a visualisation
 */
export declare class View {
    id: string;
    title: string;
    changedAt: string;
    createdAt: string;
    nodes: GraphNodeElement[];
    links: GraphLinkElement[];
    /**
     * Default constructor
     * @param title - title of the view
     * @param nodes - nodes of the view
     * @param links - links of the view
     */
    constructor(title: string, nodes: GraphNodeElement[], links: GraphLinkElement[]);
    /**
     * Return a json string of the view
     * @return {string}
     */
    toJson(): string;
}
