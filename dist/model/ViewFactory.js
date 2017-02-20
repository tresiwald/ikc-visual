"use strict";
const View_1 = require("./View");
var ViewFactory;
(function (ViewFactory) {
    function initViewFromJson(json) {
        return JSON.parse(json);
    }
    ViewFactory.initViewFromJson = initViewFromJson;
    function viewFromNodesAndLinks(nodes, links) {
        return new View_1.View("", nodes, links);
    }
    ViewFactory.viewFromNodesAndLinks = viewFromNodesAndLinks;
    function titledViewFromNodesAndLinksWith(title, nodes, links) {
        return new View_1.View(title, nodes, links);
    }
    ViewFactory.titledViewFromNodesAndLinksWith = titledViewFromNodesAndLinksWith;
    function defaultViewFromNodesAndLinksWith(title, nodes, links) {
        let view = new View_1.View(title, nodes, links);
        view.id = '1';
        return view;
    }
    ViewFactory.defaultViewFromNodesAndLinksWith = defaultViewFromNodesAndLinksWith;
    function viewFromMaps(nodes, links, title) {
        let resultingNodes = [];
        nodes.forEach((node) => {
            resultingNodes.push(node);
        });
        let resultingLinks = [];
        links.forEach((link) => {
            resultingLinks.push(link);
        });
        return new View_1.View(title, resultingNodes, resultingLinks);
    }
    ViewFactory.viewFromMaps = viewFromMaps;
})(ViewFactory = exports.ViewFactory || (exports.ViewFactory = {}));
//# sourceMappingURL=ViewFactory.js.map