import ReactDOM from "react-dom";
import React from "react";
import { Auth0Provider } from "./Authorization/react-auth0-wrapper";
import { AUTH_CONFIG } from "./Authorization/auth0-variables";
import { makeMainRoutes } from "./routes";

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

// eslint-disable-next-line
const loc = location.pathname.replace(/^\/?|\/$/g, "")

const routes = makeMainRoutes();
// ReactDOM.render(routes, document.getElementById("root"));

// console.log("Origin: ", window.location.origin)
console.log("Location: ", loc)


ReactDOM.render(
    <Auth0Provider
      domain={AUTH_CONFIG.domain}
      client_id={AUTH_CONFIG.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
  >
      {routes}
    </Auth0Provider>,
    document.getElementById("root")
  );