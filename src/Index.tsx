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
        '{"data":{"id":"9dda8db9-debe-45ab-89da-4a359c206d48","label":"home"},"position":{"x":70.35840707964601,"y":103.06637168141593}},' +
        '{"data":{"id":"2a37dde7-3023-4a04-b51a-4c4481d53143","label":"ikc"},"position":{"x":100,"y":200}},' +
        '{"data":{"id":"a458fbbc-706d-4e4d-8863-f6facc797a7f","label":"pawi"},"position":{"x":200,"y":100}},' +
        '{"data":{"id":"aa08b83d-7e03-4b11-ac12-8b37cb2cd4d2","label":"bda"},"position":{"x":200,"y":200}}' +
    '],"links":[' +
        '{"data":{"id":"6475c7e9-5a05-4ad2-82af-22bed8876f92","source":"9dda8db9-debe-45ab-89da-4a359c206d48","target":"2a37dde7-3023-4a04-b51a-4c4481d53143","label":"project"}},' +
        '{"data":{"id":"5863e328-a6e1-4de0-a62e-1d634903f76f","source":"2a37dde7-3023-4a04-b51a-4c4481d53143","target":"9dda8db9-debe-45ab-89da-4a359c206d48","label":"backlink"}},' +
        '{"data":{"id":"2a32d02a-db38-4746-a933-3009707e58ed","source":"9dda8db9-debe-45ab-89da-4a359c206d48","target":"a458fbbc-706d-4e4d-8863-f6facc797a7f","label":"project"}}' +
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

