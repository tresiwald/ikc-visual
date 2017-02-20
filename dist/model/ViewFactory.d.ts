import { View } from "./View";
import { GraphNodeElement } from "./GraphNodeData";
import { GraphLinkElement } from "./GraphLinkData";
export declare module ViewFactory {
    function initViewFromJson(json: string): View;
    function viewFromNodesAndLinks(nodes: GraphNodeElement[], links: GraphLinkElement[]): View;
    function titledViewFromNodesAndLinksWith(title: string, nodes: GraphNodeElement[], links: GraphLinkElement[]): View;
    function defaultViewFromNodesAndLinksWith(title: string, nodes: GraphNodeElement[], links: GraphLinkElement[]): View;
    function viewFromMaps(nodes: Map<string, GraphNodeElement>, links: Map<string, GraphLinkElement>, title: string): View;
}
