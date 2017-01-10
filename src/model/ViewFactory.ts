import {View} from "./View";

export module ViewFactory {
    export function initViewFromJson(json: string):View {
        return (JSON.parse(json) as View)
    }
}