import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route} from "react-router";
import * as injectTapEventPlugin from "react-tap-event-plugin";

import {MuiThemeProvider} from "material-ui/styles";
import getMuiTheme = __MaterialUI.Styles.getMuiTheme;
import {Paper} from "material-ui";

init();

function init() {
    /** Init need tap eventplug of material-ui */
    injectTapEventPlugin();

    ReactDOM.render((
        <div id="wrapper">
            <MuiThemeProvider>
                <Paper zDepth={1}>
                    <h1>Empty Template</h1>
                </Paper>
            </MuiThemeProvider>
        </div>
    ), document.getElementById("content"))

}