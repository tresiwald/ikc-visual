import {View} from "./View";
import {GraphNodeElement} from "./GraphNodeData";
import {GraphLinkElement} from "./GraphLinkData";

export module ViewFactory {
    export function initViewFromJson(json: string):View {
        return (JSON.parse(json) as View)
    }
    export function viewFromNodesAndLinks(nodes: GraphNodeElement[], links: GraphLinkElement[]): View{
        return new View("",nodes, links)
    }
    export function titledViewFromNodesAndLinksWith(title:string,nodes: GraphNodeElement[], links: GraphLinkElement[]): View{
        return new View(title,nodes, links)
    }
    export function defaultViewFromNodesAndLinksWith(title:string,nodes: GraphNodeElement[], links: GraphLinkElement[]): View{
        let view = new View(title,nodes, links)
        view.id = '0'
        return view
    }
}