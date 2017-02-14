import {View} from "./View";
import {GraphNodeElement} from "./GraphNodeData";
import {GraphLinkElement} from "./GraphLinkData";

export module ViewFactory {
    export function initViewFromJson(json: string): View {
        return (JSON.parse(json) as View)
    }

    export function viewFromNodesAndLinks(nodes: GraphNodeElement[], links: GraphLinkElement[]): View {
        return new View("", nodes, links)
    }

    export function titledViewFromNodesAndLinksWith(title: string, nodes: GraphNodeElement[], links: GraphLinkElement[]): View {
        return new View(title, nodes, links)
    }

    export function defaultViewFromNodesAndLinksWith(title: string, nodes: GraphNodeElement[], links: GraphLinkElement[]): View {
        let view = new View(title, nodes, links)
        view.id = '1'
        return view
    }

    export function viewFromMaps(nodes: Map<string,GraphNodeElement>, links: Map<string,GraphLinkElement>, title: string): View {
        let resultingNodes: GraphNodeElement[] = []
        nodes.forEach((node) => {
            resultingNodes.push(node)
        })

        let resultingLinks: GraphLinkElement[] = []
        links.forEach((link) => {
            resultingLinks.push(link)
        })
        return new View(title, resultingNodes, resultingLinks)
    }
}