import * as React from "react";
export interface TestDragProps{}
export interface TestDragState{}

declare function registerDragZone(id:String):any

export default class TestDrag extends React.Component<TestDragProps, TestDragState>{
    constructor(props: any) {
        super(props);
    }

    onDrag(e:any){
        let random = Math.round(Math.random() * 100)
        registerDragZone(random.toString())
    }

    render() {
        return (
                <div draggable={true} onMouseDown={this.onDrag.bind(this)} className={"mobileDraggable id-" + (Math.round(Math.random() * 100))} >New Node</div>
        )
    }
}