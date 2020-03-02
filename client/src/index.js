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
import { Helmet } from 'react-helmet';



require('dotenv').config();


// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  history.push(
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
      <Helmet>
        <title>Skedge</title>
        <meta name="description" content="Where you go to find, share, and create your favorite things to do." />
        <meta name="theme-color" content="#02C39A" />
        <meta property="og:title" content={`Skedge`} />
      </Helmet>
      <ReactNotification />
      <MakeMainRoutes />
    </Auth0Provider>,
    document.getElementById("root")
  );