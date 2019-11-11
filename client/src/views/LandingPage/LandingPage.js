/*eslint-disable*/ import React, { useState, useRef } from "react";
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

import PlayForWorkIcon from '@material-ui/icons/PlayForWork';



import landingPageStyle from "assets/jss/material-kit-pro-react/views/landingPageStyle.js";

// Sections for this page
import SectionProduct from "./Sections/SectionProduct.js";
import SectionTeam from "./Sections/SectionTeam.js";
import SectionWork from "./Sections/SectionWork.js";
import SectionTitle from "./Sections/SectionTitle.js"

//Authorization
import { useAuth0 } from '../../Authorization/react-auth0-wrapper';
//import history from "../../utils/history";

//Google Analytics
import ReactGA from 'react-ga';

const useStyles = makeStyles(landingPageStyle);

//Scrolling down when arrow is clicked
const scrollToRef = (ref) => ref.current.scrollIntoView({behavior: 'smooth'})   


export default function LandingPage(props) {

  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const myRef = useRef(null)
  const executeScroll = () => scrollToRef(myRef)


  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();

  if (isAuthenticated) {
    props.history.push("/home");
    window.location.reload();
  }

  const handleLogin = () => {
    //Google Analytics Record when someone Clicks this
    ReactGA.initialize('UA-151937222-1');
    ReactGA.event({
      category: 'User',
      action: 'Created an Account/Logged In'
    });
    console.log("recorded event")
    //Then Login/Sign up
    loginWithRedirect({})
  }

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
      <img style={{position: 'absolute', zIndex: 10, top: 15, left: 15}} height={50} width={50} src={require('assets/img/logoheader.png')} />
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
                onClick={handleLogin}
              >
                Login or Sign Up
              </Button>
            </GridItem>
          </GridContainer>

        <div ref={myRef} style={{position: 'absolute', color: "#02C39A", zIndex: 10, left: '50%', marginLeft: -35, bottom: 60}}><PlayForWorkIcon onClick={executeScroll} fontSize='large' style={{fontSize: 70}}/></div>

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
                    href="/about-us"
                    target="_blank"
                    className={classes.block}
                  >
                    About us
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
