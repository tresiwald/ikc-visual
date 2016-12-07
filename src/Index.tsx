import * as React from "react";
import * as ReactDOM from "react-dom";
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;
import GraphScreen from "./components/GraphScreen/GraphScreen";
import {TestNodeInformationProvider} from "./TestNodeInformationProvider";
import {TestOperationService} from "./TestOperationService";
import injectTapEventPlugin = require("react-tap-event-plugin");
import {View} from "./model/View";
import * as TimeService from "./common/TimeService"

init();

let testNodeInformationProvider = new TestNodeInformationProvider();
let testOperationService = new TestOperationService();

function init() {

}
/** Init need tap eventplug of material-ui */
injectTapEventPlugin();

ReactDOM.render((
    <div id="wrapper">
        <GraphScreen nodeInformationProvider={testNodeInformationProvider}
                     onViewDelete={()=>{console.log("implement a function to delete the view.")}}
                     onViewSave={()=>{console.log("implement a function to save the view.")}}
                     operationService={testOperationService} viewToLoad={null} timestamp={TimeService.getTimestamp()} />
    </div>
), document.getElementById("container"));

