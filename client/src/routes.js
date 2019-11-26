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
import gql from 'graphql-tag';

import "assets/scss/material-kit-pro-react.scss?v=1.8.0";

import { ApolloProvider } from "react-apollo";
import makeApolloClient from "./apollo";

// pages for this product
import LandingPage from "views/LandingPage/LandingPage.js";
import EventPage from "views/EventPage/EventPage.js";
import Home from "views/HomePage/HomePage.js";
import CreatePage from "views/CreatePage/CreatePage.js";  //Create Event

import AboutUsPage from "views/AboutUsPage/AboutUsPage.js";


//Pages I need to either remove, change, or use later
import ContactUsPage from "views/ContactUsPage/ContactUsPage.js";
import EcommercePage from "views/EcommercePage/EcommercePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import ProductPage from "views/ProductPage/ProductPage.js";
import SectionsPage from "views/SectionsPage/SectionsPage.js";
import ShoppingCartPage from "views/ShoppingCartPage/ShoppingCartPage.js";
import SignupPage from "views/SignupPage/SignupPage.js";
import ErrorPage from "views/ErrorPage/ErrorPage.js";
import LoadingPage from "views/LoadingPage/LoadingPage.js";
import TodoPage from "todotest.js"

import CallbackPage from "views/CallbackPage/CallbackPage.js";
import BottomNav from "components/BottomNav/BottomNav.js";


//For Google Analytics
import ReactGA from 'react-ga';


var hist = createBrowserHistory();

export const MakeMainRoutes = () => {
  

  // Variables/Imports from auth0-spa
  const {loading, getIdTokenClaims, isAuthenticated, user } = useAuth0();
  const [values, setValues] = useState({
    client: null,
    showBottomBar: false,
    currentPage: window.location.pathname
  })

  let newToken = "";

  //Create navigation bar
  const bottomBar = () => {
    if(values.showBottomBar && !loading && isAuthenticated) {
      return (
        <ApolloProvider client={values.client}>
          <BottomNav client={values.client} userId={user.sub}/>
        </ApolloProvider>
      )
    }
    else {
      return ""
    }
  }

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
    // For Apollo Provider on Auth load
    // if(!loading) {
    //   getIdTokenClaims().then(function(result) {
    //     if(isAuthenticated) {
    //       newToken = result.__raw;
    //     }
    //     else {
    //       newToken = "";
    //     }
    //     setValues({
    //       ...values,
    //       client: makeApolloClient(newToken)
    //     })
    //   });
    // }

    console.log("Routes.js Rendered, loading status: ", loading)


    // For Bottom Navbar
    if(window.location.pathname !== "/" && window.location.pathname !== "/shopping-cart-page") {
      setValues({
        ...values,
        showBottomBar: true
      })
    }    
  
  },[loading]);

  if (loading) {
    return(
      <div>
        <LoadingPage reason="Loading" />
      </div>
    )
  }
  // Wait for token to return and client to be made.
  if(!values.client) {
    console.log("Getting Client")
    if(!loading) {
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
    }
    else {
      newToken = "";
      setValues({
        ...values,
        client: makeApolloClient(newToken)
      })
    }

    return(
      <div>
        <LoadingPage reason="Getting Client" />
      </div>
    )
  }
  // Finally load Website
  else {
  // Finally load Website
    return(
      <Router history={hist}>
        <div>
        <Switch>
          <Route exact path="/about-us" render={props => provideClient(AboutUsPage, props)} />
          <PrivateRoute path="/event" render={props => provideClient(EventPage, props)} />
          <PrivateRoute path="/home" render={props => provideClient(Home, props)} />
          <PrivateRoute path="/create" render={props => provideClient(CreatePage, props)} />
          {/*<Route exact path="/components" render={props => provideClient(ComponentsPage, props)} />*/}
          <Route exact path="/contact-us" render={props => provideClient(ContactUsPage, props)} />
          <Route exact path="/subscriptions" render={props => provideClient(EcommercePage, props)} />
          <Route exact path="/landing-page" render={props => provideClient(LandingPage, props)} />
          <Route exact path="/login-page" render={props => provideClient(LoginPage, props)} />
          <Route exact path="/user" render={props => provideClient(ProfilePage, props)} />
          <Route exact path="/product-page" render={props => provideClient(ProductPage, props)} />
          <Route exact path="/sections" render={props => provideClient(SectionsPage, props)} />
          <Route exact path="/notifications" render={props => provideClient(ShoppingCartPage, props)} />
          <Route exact path="/signup-page" render={props => provideClient(TodoPage, props)} />
          <Route exact path="/error-page" render={props => provideClient(ErrorPage, props)} />

          <PrivateRoute path="/events/:id" render={props => provideClient(EventPage, props)} />
          <PrivateRoute path="/users/:id" render={props => provideClient(ProfilePage, props)} />
          <Route path="/callback" 
                render={props => {
                  return <CallbackPage {...props} />;
                }} />
          <Route exact path="/" render={props => provideClient(LandingPage, props)}/>
        </Switch>

        {bottomBar()}
        </div>
      </Router>
    );
  }
}