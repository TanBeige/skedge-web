import React, { Component } from "react";
import loading from "./loading.svg";
import { useAuth0 } from '../../Authorization/react-auth0-wrapper'

class CallbackPage extends Component {
  render() {
    const style = {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      fontSize: 100,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white"
    };

  //const { handleRedirectCallback } = useAuth0();

  //handleRedirectCallback();

    
    return (
      <div style={style}>
        <img src={loading} alt="loading" />
      </div>
    );
  }
}

export default CallbackPage;
