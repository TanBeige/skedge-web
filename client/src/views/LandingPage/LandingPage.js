/*eslint-disable*/ import React, { useState } from "react";
import { Redirect } from 'react-router-dom'
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
// core components
//import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
//import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";


import landingPageStyle from "assets/jss/material-kit-pro-react/views/landingPageStyle.js";

// Sections for this page
import SectionProduct from "./Sections/SectionProduct.js";
import SectionTeam from "./Sections/SectionTeam.js";
import SectionWork from "./Sections/SectionWork.js";
import SectionTitle from "./Sections/SectionTitle.js"

//Authorization
import { useAuth0 } from '../../Authorization/react-auth0-wrapper';
//import history from "../../utils/history";


const useStyles = makeStyles(landingPageStyle);

// TODO: Adding local events to homepage to make a more dynamic look

export default function LandingPage(props) {

  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();

  if (isAuthenticated) {
    console.log("landingpage auth: ", isAuthenticated)
    props.history.push("/home");
    //return(<Redirect to="/home"/>)
    window.location.reload();
  }
  console.log(props)

  //Mobile Image
  let paraImage = ""
  if(window.innerWidth < 768) {
    paraImage = require("assets/img/cover1.jpg")
  }
  else {
    paraImage = require("assets/img/cover2.jpg")
  }

  return (
    <div>
      <Parallax image={paraImage} filter="dark">
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <SectionTitle className={classes.title} />
              <h4>
                Find, share, and create your favorite events all in one place. 
                The social event app.
              </h4>
              <br />
              <Button
                color="primary"
                onClick={() => loginWithRedirect({})}
              >
                Log In or Sign Up
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <SectionTeam client={props.client}/>
          <hr />
          {/* <SectionWork /> */}
        </div>
      </div>
      <Footer
        content={
          <div>
            <div className={classes.left}>
              <List className={classes.list}>
                <ListItem className={classes.inlineBlock}>
                  <a
                    href="theskedge.com"
                    target="_blank"
                    className={classes.block}
                  >
                    Skedge
                  </a>
                </ListItem>
                <ListItem className={classes.inlineBlock}>
                  <a
                    href="https://www.creative-tim.com/presentation?ref=mkpr-landing"
                    target="_blank"
                    className={classes.block}
                  >
                    About us
                  </a>
                </ListItem>
              </List>
            </div>
            <div className={classes.right}>
              &copy; {1900 + new Date().getYear()} , made with{" "}
              <Favorite className={classes.icon} /> by{" "}
              <a
                href="/about-us"
                target="_blank"
              >
                Creative Tim
              </a>{" "}
              for a better web.
            </div>
          </div>
        }
      />
    </div>
  );
}
