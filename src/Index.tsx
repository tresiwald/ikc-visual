import * as React from "react";
import * as ReactDOM from "react-dom";
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;
import GraphScreen from "./components/GraphScreen/GraphScreen";
import {TestNodeInformationProvider} from "./TestNodeInformationProvider";
import {TestOperationService} from "./TestOperationService";
import injectTapEventPlugin = require("react-tap-event-plugin");
import {TimeService} from "./common/TimeService"
import {TestDialogFactory} from "./TestDialogFactory";
import {MuiThemeProvider} from "material-ui/styles";
import {ViewFactory} from "./model/ViewFactory";
import TestDrag from "./TestDrag";

let viewToLoadJson = '{' +
    '"nodes":[' +
    '{"data":{"id":"home","label":"home"},"position":{"x":70.35840707964601,"y":103.06637168141593},"visibility":{"value":"VISIBLE"}, "nodeClasses":[]},' +
    '{"data":{"id":"ikc","label":"ikc"},"position":{"x":100,"y":200},"visibility":{"value":"VISIBLE"}, "nodeClasses":[]},' +
    '{"data":{"id":"pawi","label":"pawi"},"position":{"x":200,"y":100},"visibility":{"value":"VISIBLE"}, "nodeClasses":[]},' +
    '{"data":{"id":"bda","label":"bda"},"position":{"x":200,"y":200},"visibility":{"value":"VISIBLE"}, "nodeClasses":[]}' +
    '],"links":[' +
    '{"data":{"id":"home-ikc","source":"home","target":"ikc","label":"project"},"visibility":{"value":"VISIBLE"}, "linkClasses":[]},' +
    '{"data":{"id":"ikc-home","source":"ikc","target":"home","label":"backlink"},"visibility":{"value":"VISIBLE"}, "linkClasses":[]},' +
    '{"data":{"id":"home-pawi","source":"home","target":"pawi","label":"project"},"visibility":{"value":"VISIBLE"}, "linkClasses":[]}' +
    ']}'

let viewToLoad = ViewFactory.initViewFromJson(viewToLoadJson)

init();

let testNodeInformationProvider = new TestNodeInformationProvider();
let testOperationService = new TestOperationService();
let testDialogFactory = new TestDialogFactory();


function init() {

}
/** Init need tap eventplug of material-ui */
injectTapEventPlugin();



ReactDOM.render((
    <div id="wrapper">
        <MuiThemeProvider>
            <div>
                <GraphScreen nodeInformationProvider={testNodeInformationProvider}
                             onViewDelete={()=>{console.log("implement a function to delete the view.")}}
                             onViewSave={()=>{console.log("implement a function to save the view.")}}
                             operationService={testOperationService} viewToLoad={viewToLoad} timestamp={TimeService.getTimestamp()} dialogFactory={testDialogFactory} />
                <TestDrag/>
            </div>
        </MuiThemeProvider>
    </div>
), document.getElementById("container"));

