import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route} from "react-router";
import * as injectTapEventPlugin from "react-tap-event-plugin";

import {MuiThemeProvider} from "material-ui/styles";
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;
import {Paper} from "material-ui";
import GraphScreen from "./components/GraphScreen";
import {TestNodeComponentFactory} from "./TestNodeComponentFactory";
import {TestNodeInformationProvider} from "./TestNodeInformationProvider";
import {TestOperationService} from "./TestOperationService";
import {TestView} from "./TestView";

init();

let testNodeComponentFactory = new TestNodeComponentFactory();
let testNodeInformationProvider = new TestNodeInformationProvider();
let testOperationService = new TestOperationService();
let testView = new TestView();

function init() {

}
/** Init need tap eventplug of material-ui */
//injectTapEventPlugin();

ReactDOM.render((
    <div id="wrapper">
        <GraphScreen nodeComponentFactory={testNodeComponentFactory} nodeInformationProvider={testNodeInformationProvider}
                     onViewDelete={()=>{console.log("implement a function to delete the view.")}}
                     onViewSave={()=>{console.log("implement a function to save the view.")}}
                     operationService={testOperationService} viewToLoad={testView} />
    </div>
), document.getElementById("ikc-visual"));


/*
 <MuiThemeProvider>
 <Paper zDepth={1}>
 <h1>Empty Template</h1>
 </Paper>
 </MuiThemeProvider>
 */