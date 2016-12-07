import {ContextMenuCommand} from "./ContextMenuCommand";
export class ContextMenu{
    selector: string
    commands:ContextMenuCommand[]

    constructor(selector:string, commands:ContextMenuCommand[]){
        this.selector = selector
        this.commands = commands
    }
}