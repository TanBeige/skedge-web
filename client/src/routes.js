/*!

=========================================================
* Material Kit PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from  './components/Debug/ErrorBoundary'
import { useAuth0 } from './Authorization/react-auth0-wrapper';


import "assets/scss/material-kit-pro-react.scss?v=1.8.0";


/////// From Old Skedge
//Styling
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
//import theme from './styles/theme';

//import auth from "./Authorization/Auth";
//import LandingPage from "./components/LandingPage/LandingPage";
import history from "./utils/history";

import { ApolloProvider } from "react-apollo";
import makeApolloClient from "./apollo";
//import BottomBar from "./components/BottomBar/BottomBar";
///////

// pages for this product
import AboutUsPage from "views/AboutUsPage/AboutUsPage.js";
import BlogPostPage from "views/BlogPostPage/BlogPostPage.js";
import BlogPostsPage from "views/BlogPostsPage/BlogPostsPage.js";
import ComponentsPage from "views/ComponentsPage/ComponentsPage.js";
import ContactUsPage from "views/ContactUsPage/ContactUsPage.js";
import EcommercePage from "views/EcommercePage/EcommercePage.js";
import LandingPage from "views/LandingPage/LandingPage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
//import PresentationPage from "views/PresentationPage/PresentationPage.js";
import PricingPage from "views/PricingPage/PricingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import ProductPage from "views/ProductPage/ProductPage.js";
import SectionsPage from "views/SectionsPage/SectionsPage.js";
import ShoppingCartPage from "views/ShoppingCartPage/ShoppingCartPage.js";
import SignupPage from "views/SignupPage/SignupPage.js";
import ErrorPage from "views/ErrorPage/ErrorPage.js";
import LoadingPage from "views/LoadingPage/LoadingPage.js";

import CallbackPage from "views/CallbackPage/CallbackPage.js";


// Creating Apollo Client When Entering Website
let client;

var hist = createBrowserHistory();

// ******BlogPostsPage is our /home for now******

export const MakeMainRoutes = () => {
  

  // Variables/Imports from auth0-spa
  const {loading, getTokenSilently, getIdTokenClaims, isAuthenticated } = useAuth0();
  const [values, setValues] = useState({
    client
  })

  let newToken = "";

  // Supporting Functions
  const provideClient = (Component, renderProps) => { 
    return (
      <ApolloProvider client={values.client}>
        <Component {...renderProps} client={values.client} /> 
      </ApolloProvider>
    );
  };

  // useEffect substitutes componentDidMount() and rerenders after loading value changes
  useEffect(() => {
    if(window.location.pathname === "/") {
      console.log("Home")
    }
    if(!loading) {
      console.log("Loaded");
    }
    else {
      console.log("Currently Loading");
    }
  },[loading, values.client]);


  //Wait for Auth0 to load
  if (loading) {
    return(
      <div>
        <LoadingPage reason="Loading" />
      </div>
    )
  }
  // Wait for token to return and client to be made.
  else if(!values.client) {
    getIdTokenClaims().then(function(result) {
      if(isAuthenticated) {
        newToken = result.__raw;
      }
      else {
        newToken = "";
      }
      setValues({
        ...values,
        client: makeApolloClient(newToken)
      })
    });

    return(
      <div>
        <LoadingPage reason="Getting Client" />
      </div>
    )
  }

  // Finally load Website
  else {
    return(
      <Router history={hist}>
        <Switch>exact 
          <Route exact path="/about-us" render={props => provideClient(AboutUsPage, props)} />
          <Route exact path="/event" render={props => provideClient(BlogPostPage, props)} />
          <PrivateRoute path="/home" render={props => provideClient(BlogPostsPage, props)} />
          {/*<Route exact path="/components" render={props => provideClient(ComponentsPage, props)} />*/}
          <Route exact path="/contact-us" render={props => provideClient(ContactUsPage, props)} />
          <Route exact path="/ecommerce-page" render={props => provideClient(EcommercePage, props)} />
          <Route exact path="/landing-page" render={props => provideClient(LandingPage, props)} />
          <Route exact path="/login-page" render={props => provideClient(LoginPage, props)} />
          <Route exact path="/create" render={props => provideClient(PricingPage, props)} />
          <Route exact path="/profile-page" render={props => provideClient(ProfilePage, props)} />
          <Route exact path="/product-page" render={props => provideClient(ProductPage, props)} />
          <Route exact path="/sections" render={props => provideClient(SectionsPage, props)} />
          <Route exact path="/shopping-cart-page" render={props => provideClient(ShoppingCartPage, props)} />
          <Route exact path="/signup-page" render={props => provideClient(SignupPage, props)} />
          <Route exact path="/error-page" render={props => provideClient(ErrorPage, props)} />
          <Route path="/callback" 
                render={props => {
                  return <CallbackPage {...props} />;
                }} />
          <Route exact path="/" render={props => provideClient(LandingPage, props)}/>
        </Switch>
      </Router>
    );
  }
}