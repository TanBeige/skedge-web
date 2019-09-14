import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


class Spinner extends Component {
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
    
        return (
          <div style={style}>
            <CircularProgress color='secondary'/>
          </div>
        );
      }
}

export default Spinner;