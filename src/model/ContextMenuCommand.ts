export class ContextMenuCommand{
    content: string
    select: Function

    constructor(content:string, select:Function){
        this.content = content
        this.select = select
    }
}