import {ContextMenuCommand} from "./ContextMenuCommand";
export class ContextMenu{
    selector: string
    commands:ContextMenuCommand[]
    itemTextShadowColor:string = 'none'
    atMouse: boolean = true

    constructor(selector:string, commands:ContextMenuCommand[]){
        this.selector = selector
        this.commands = commands
    }
}