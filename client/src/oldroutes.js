import React from "react";
import { Route, Router } from "react-router-dom";

//Styling
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from './styles/theme';

//import Home from "./components/Home/Home";
import Feed from './components/HomePage/HomeBody/Feed';
import Profile from './components/HomePage/Profile/Profile'
import Callback from "./components/Callback/Callback";
import CreateEvent from './components/HomePage/CreateEvent/CreateEvent'

import auth from "./components/Auth/Auth";
//import LandingPage from "./components/LandingPage/LandingPage";
import LandingPage from './components/LandingPage/LandingPage'
import history from "./utils/history";

import { ApolloProvider } from "react-apollo";
import makeApolloClient from "./apollo";
import BottomBar from "./components/BottomBar/BottomBar";

let client;

const provideClient = (Component, renderProps) => { 
  // check if logged in
  if (localStorage.getItem("isLoggedIn") === "true") {
    // check if client exists
    if (!client) {
      client = makeApolloClient();
    }
    return (
      <ApolloProvider client={client}>
        <Component {...renderProps} auth={auth} client={client} />
      </ApolloProvider>
    );
  } else {
    // not logged in already, hence redirect to login page
    if (renderProps.match.path !== "/") {
      window.location.href = "/";
    } else {
      return <Component auth={auth} {...renderProps} />;
    }
  }
};

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

export const makeMainRoutes = (loc) => {
  console.log("Location: ", loc)
  let bottomBar = ""
  if (loc === ""){
    bottomBar = ""
  }
  else {
    bottomBar = <BottomBar location={loc}/>

  }
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router history={history}>
        <div>
          <Route
            exact
            path="/"
            render={props => provideClient(LandingPage, props)}
          />
          <Route
            exact
            path="/home"
            render={props => provideClient(Feed, props)}
          />
          <Route
            exact
            path="/create"
            render={props => provideClient(CreateEvent, props)}
          />
          <Route
            exact
            path="/user"
            render={props => provideClient(Profile, props)}
          />
          <Route
            path="/callback"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
          {bottomBar}
        </div>
      </Router>
    </MuiThemeProvider>
  );
};
