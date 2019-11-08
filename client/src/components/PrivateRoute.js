import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "../Authorization/react-auth0-wrapper";
import LoadingPage from "views/LoadingPage/LoadingPage.js"

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();
  console.log("Loadning? : ", loading)

  useEffect(() => {
    console.log("not logged innnn: " )

    if (isAuthenticated) {
      console.log("Loading on private page")
      return;
    }
    console.log("not logged innnn: " )

    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path }
      });
    };
    console.log("not logged in: ", fn)
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = props => isAuthenticated === true ? <Component {...props} /> : <LoadingPage />;

  return <Route exact path={path} render={render} {...rest} />;
};

export default PrivateRoute;