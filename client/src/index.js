import ReactDOM from "react-dom";
import React from "react";

//Notifications throughout application
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

//
import { Auth0Provider } from "./Authorization/react-auth0-wrapper";
import { AUTH_CONFIG } from "./Authorization/auth0-variables";
import { MakeMainRoutes } from "./routes";
import history from "./utils/history";


require('dotenv').config();


// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  console.log("appstat: ", appState);

  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};
console.log("window location origin", window.location.origin)
console.log("window location pathname", window.location.pathname)

ReactDOM.render(
    <Auth0Provider
      domain={AUTH_CONFIG.domain}
      client_id={AUTH_CONFIG.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
  >
      <ReactNotification />
      <MakeMainRoutes />
    </Auth0Provider>,
    document.getElementById("root")
  );