/* eslint-disable */
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import styles from "assets/jss/material-kit-pro-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const { children, content, theme, big, className } = props;
  const classes = useStyles();
  const themeType =
    theme === "transparent" || theme == undefined ? false : true;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes[theme]]: themeType,
    [classes.big]: big || children !== undefined,
    [className]: className !== undefined
  });
  const aClasses = classNames({
    [classes.a]: true
  });

  return (
    <footer className={footerClasses} style={{width: '100%', borderTop: '0.5px solid grey'}}>
      <div className={classes.container}>
        {/* <div style={{textAlign: 'center', marginTop: 8}}>
          <GridContainer>
            <GridItem xs={12} md={6} style={{alignSelf: 'center'}}>
              <p style={{fontWeight: 400}}>Follow us to never miss a good deal again</p>
            </GridItem>
            <GridItem xs={12} md={6}>
                <div style={{margin: '6px'}}>
                <TextField
                      id="email"
                      label="Email"
                      variant="outlined"
                      required
                      fullWidth
                    //   className={classes.textField}
                      // value={values.email}
                      // onChange={handleChange('email')}
                      margin="normal"
                      InputProps={{
                        endAdornment: 
                          <InputAdornment position="end">
                            <p onClick={()=>{console.log("Submit Email")}}>Submit</p>
                          </InputAdornment>
                      }}
                      
                  > </TextField>
                </div>
            </GridItem>

          </GridContainer>
        </div> */}
        {children !== undefined ? (
          <div>
            <div className={classes.content}>{children}</div>
            <hr />
          </div>
        ) : (
          " "
        )}
        {content}
        <div className={classes.clearFix} />
      </div>
    </footer>
  );
}

Footer.propTypes = {
  theme: PropTypes.oneOf(["dark", "white", "transparent"]),
  big: PropTypes.bool,
  content: PropTypes.node.isRequired
};
