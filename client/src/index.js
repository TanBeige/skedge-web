import ReactDOM from "react-dom";
import React from "react";
import { Auth0Provider } from "./Authorization/react-auth0-wrapper";
import { AUTH_CONFIG } from "./Authorization/auth0-variables";
import { MakeMainRoutes } from "./routes";
require('dotenv').config();


// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
    window.history.replaceState(
      {},
      document.title,
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  };

ReactDOM.render(
    <Auth0Provider
      domain={AUTH_CONFIG.domain}
      client_id={AUTH_CONFIG.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
  >
      <MakeMainRoutes />
    </Auth0Provider>,
    document.getElementById("root")
  );