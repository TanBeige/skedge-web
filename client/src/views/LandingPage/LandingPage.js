/*eslint-disable*/ import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom'
// nodejs library to set properties for components
// import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/styles';
import { Helmet } from 'react-helmet';

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// core components
//import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
//import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
// import PlayForWorkIcon from '@material-ui/icons/PlayForWork';

import landingPageStyle from "assets/jss/material-kit-pro-react/views/landingPageStyle.js";

// Sections for this page
// import SectionProduct from "./Sections/SectionProduct.js";
import SectionTeam from "./Sections/SectionTeam.js";
// import SectionWork from "./Sections/SectionWork.js";
import SectionTitle from "./Sections/SectionTitle.js"

import InformationPopover from 'components/InformationPopover.js'
import AppearOnScroll from 'components/AppearOnScroll.js'

//Authorization
import { useAuth0 } from '../../Authorization/react-auth0-wrapper';
//import history from "../../utils/history";

// For Smooth Scrolling to top
import { animateScroll as scroll} from 'react-scroll'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';


//Google Analytics
import ReactGA from 'react-ga';

const useStyles = makeStyles(landingPageStyle);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    }
  },
});


export default function LandingPage(props) {

  const { isAuthenticated, loginWithRedirect, loginWithPopup, loading } = useAuth0();
  // const [showButton, setShowButton] = useState(false)

  // Button Showing on Scroll
//   const handleShowButton = () => {
//     console.log(window.scrollY);
//     window.scrollY > 400 ? setShowButton(true) : setShowButton(false);
//  }

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  React.useEffect(() => {

    if (isAuthenticated) {
      // Redirect to path they left off at
      const redirectPagePath = localStorage.getItem('originPath') || '/home'
  
      props.history.push(redirectPagePath);
      // window.location.reload();
    }
    else {
      //If user is not signed in, and they sign in through the homepage,
      //  After logged in redirect to home
      if(!loading) {

        localStorage.setItem('originPath', '/home');
      }
    }
  }, [isAuthenticated]);

  const classes = useStyles();

  

  //Scroll To Top of the page
  const scrollToTop = () => {
    scroll.scrollToTop();
  }

  const handleLogin = () => {
    //Google Analytics Record when someone Clicks this
    ReactGA.initialize('UA-151937222-1');
    ReactGA.event({
      category: 'User',
      action: 'Login/Sign Up: Landing Page'
    });
    //Then Login/Sign up
    loginWithRedirect({})
    // loginWithPopup({})
  }

  const handleAppPress = () => {
    ReactGA.initialize('UA-151937222-1');
    ReactGA.event({
      category: 'User',
      action: 'Login/Sign Up: Landing Page'
    });
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
    <ThemeProvider theme={theme}>
      <Helmet>
            <title>App Store | Skedge</title>
            <meta name="description" content="Skedge on the App Store." />
            <meta name="apple-itunes-app" content="app-id=1506618749, app-argument=myURL" />

            <meta property="og:title" content={`App Store | Skedge`} />
            <meta property="og:image" content={require('assets/img/logoheader.png')} />

            <meta name="theme-color" content="#02C39A" />
            <meta name="geo.region" content="US-FL" />
            <meta name="geo.placename" content={"Tallahassee"} />
        </Helmet>
    <div>
      <img style={{position: 'absolute', zIndex: 10, top: 15, left: 15}} height={40} width={40} src={require('assets/img/logoheader.png')} />
      <div style={{position: 'absolute', zIndex: 10, top: 15, right: 25}} >
        <InformationPopover/>
      </div>
      
      <Parallax style={{height: '60vh'}} image={paraImage} filter="dark">
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <SectionTitle className={classes.title} />
              <h4>
                Where you go to find, share, and create your favorite things to do. Sign up to see all events & deals.
              </h4>
              <br />
              <div style={{position: 'absolute', right: 0}}>
                <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1" onClick={() => clickedDownload()}>
                    <img style={{maxHeight: '22vh'}} src={require("assets/img/app_advert_3.png")} />
                </a>
              </div>
              <Button
                color="primary"
                onClick={handleLogin}
                // style={{position: 'fixed', top: 300}}
                className='signup'
              >
                Login or Sign Up
              </Button>
              <br />
              <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1">
                <Button
                  color="secondary"
                  onClick={handleAppPress}
                  // style={{position: 'fixed', top: 300}}
                  className='signup'
                >
                  Skedge on the App Store
                </Button>
              </a>
              
              
            </GridItem>
          </GridContainer>

        {/* <div style={{position: 'absolute', color: "#02C39A", zIndex: 10, left: '50%', marginLeft: -35, bottom: 60}}>
          <PlayForWorkIcon onClick={executeScroll} fontSize='large' style={{fontSize: 70}}/>
        </div> */}

        </div>
      </Parallax>
      {/* <div className={classNames(classes.main, classes.mainRaised)}> */}
        <Button style={{position: 'fixed', bottom: 55, right: 10, zIndex: 5}} round justIcon color="primary" onClick={scrollToTop}>
              <ArrowUpwardIcon style={{color: "white"}} />
        </Button>
        <div style={{paddingBottom: 0, minHeight: '200vh'}}>
          
          <AppearOnScroll scrollInHeight={500}>
            <Button
              color="primary"
              onClick={handleLogin}
              style={{margin: 'auto', width: '100%',height: '6vh', textTransform: 'none', fontSize: '14px'}}
            >
              Sign up for more events and happy hours
            </Button>
          </AppearOnScroll>
          
          <SectionTeam client={props.client} setLastTab={props.setLastTab} lastTab={props.lastTab}/>
          {/* <SectionWork /> */}
        </div>
      {/* </div> */}
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
    </ThemeProvider>
  );
}
