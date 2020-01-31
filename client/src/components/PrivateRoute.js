import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "../Authorization/react-auth0-wrapper";
import LoadingPage from "views/LoadingPage/LoadingPage.js"

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {

    if (loading || isAuthenticated) {
      return;
    }
    // if(!isAuthenticated) {
    //   console.log("pathname prviate", path)
    //   localStorage.setItem('originPath', window.location.pathname);
    // }

    // const fn = async () => {
    //   await loginWithRedirect();
    // };
    
    // fn();
  }, [loading, isAuthenticated, path]);

  const render = props => isAuthenticated === true ? <Component {...props} /> : <LoadingPage />;

  return <Route exact path={path} render={render} {...rest} />;
};

export default PrivateRoute;