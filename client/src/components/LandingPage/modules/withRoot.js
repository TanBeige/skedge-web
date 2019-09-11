import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme';

function withRoot(Component) {
  function WithRoot(props) {
    return (
      <div>
        <CssBaseline />
        <Component {...props} />
      </div>
    );
  }

  return WithRoot;
}

export default withRoot;
