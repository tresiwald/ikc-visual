import * as React from "react";


export interface TestDragProps{}
export interface TestDragState{}

export default class TestDrag extends React.Component<TestDragProps, TestDragState>{
    constructor(props: any) {
        super(props);
    }

    onDrag(e:any){
        let random = Math.round(Math.random() * 100)
        e.dataTransfer.setData("id", random.toString())
        e.dataTransfer.setData("label", "Node " + random.toString())
    }
    render() {
        return (
                <div draggable={true} onDragStart={this.onDrag.bind(this)}>New Node</div>
        )
    }
}