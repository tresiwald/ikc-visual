import {View} from "./View";

export function initViewFromJson(json: string):View {
    return (JSON.parse(json) as View)
}