import {GraphPosition} from "../model/GraphPosition";
export module DOMHelperService {
    export function isDescendant(parent: any, child: any) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    export function calcNodePosition(source: GraphPosition): GraphPosition{
        let randomAngle = Math.random() * 180
        let randomRadius = Math.random() * 40

        return new GraphPosition(
            Math.round(source.x + ((80 + randomRadius) * Math.cos((Math.PI / 180) *  randomAngle))),
            Math.round(source.y + ((80 + randomRadius) * Math.sin((Math.PI / 180) *  randomAngle)))
        )
    }
}