import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/styles';


const divStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'white'
}

const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#02C39A"
      }
    }
  });
  

class LoadingPage extends Component {
    constructor(props) {
        super(props);

    }
    render() { 
        return ( 
            <ThemeProvider theme={theme}>
                <div style={divStyle}>
                    <h1>
                        <img style={{marginTop: ((window.innerHeight / 2) - 100)}} src={require('assets/img/logoheader.png')} height={100} width={100}/>
                        <br />
                        {/* <LinearProgress color="primary"/> */}

                    </h1>
                </div>
            </ThemeProvider>
         );
    }
}
 
export default LoadingPage;