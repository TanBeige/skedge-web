/*eslint-disable*/
import React, {useState} from "react";
import axios from 'axios'
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import PinDrop from "@material-ui/icons/PinDrop";
import Phone from "@material-ui/icons/Phone";
import BusinessCenter from "@material-ui/icons/BusinessCenter";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Footer from "components/Footer/Footer.js";

import contactUsStyle from "assets/jss/material-kit-pro-react/views/contactUsStyle.js";

//require('./privacy.css');
import mytext from './TermsAndConditions.js';



const useStyles = makeStyles(contactUsStyle);

export default function PrivacyPolicyPage() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  const classes = useStyles();
  return (
    <div>
      <Header
        brand="Skedge"
        links={<HeaderLinks dropdownHoverColor="dark" />}
        fixed
        color="dark"
      />

      <div className={classNames(classes.main)} style={{marginBottom: '1em', marginTop: '2em'}}>
        <div className={classes.contactContent} style={{textAlign: 'center'}}>
          <div className={classes.container}>
            <GridContainer style={{margin: '0em 1em'}}>
              <GridItem md={12} sm={12}>
                <h2>Terms and Conditions Agreement</h2>
                <p style={{whiteSpace: 'pre-line', textAlign: 'left'}}>
                    {mytext}
                </p>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer
        content={
          <div>
            <div className={classes.left}>
              <List className={classes.list}>
                <ListItem className={classes.inlineBlock}>
                  <a
                    href="/"
                    target="_blank"
                    className={classes.block}
                  >
                    Skedge
                  </a>
                </ListItem>
                <ListItem className={classes.inlineBlock}>
                        <a
                            href="/about-us"
                            target="_blank"
                            className={classes.block}
                        >
                            About us
                        </a>
                        </ListItem>
                        <ListItem className={classes.inlineBlock}>
                        <a
                            href="/contact-us"
                            target="_blank"
                            className={classes.block}
                        >
                            Contact us
                        </a>
                        </ListItem>
              </List>
            </div>
          </div>
        }
      />
    </div>
  );
}
