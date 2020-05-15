import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";


import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";

//Google analytics import
import ReactGA from 'react-ga';
require('dotenv');
var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(blogPostPageStyle);

require('views/EventPage/EventPage.css');


export default function EventPage(props) {

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  const classes = useStyles();


    return (
        <div>
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
        {/* <Parallax image={require('assets/img/logoheader.png')}>
            
        </Parallax> */}
        <Header
            brand="Skedge"
            //links={<HeaderLinks dropdownHoverColor="info"/>}
            fixed
            color="primary"//"transparent"
            changeColorOnScroll={{
            height: 100,
            color: "primary"
            }}
        />        
            <GridContainer justify='center' style={{marginTop: 60}}>
                <GridItem xs={12}  style={{textAlign: 'center'}}>
                    <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1">
                        <img width={100} height={100} style={{margin: 10}} src={require('assets/img/logoheader.png')} />
                    </a>
                </GridItem>
                <GridItem xs={12} style={{textAlign: 'center'}}>
                    <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1">
                        <h2 style={{margin: 10}}>We're on the App Store!</h2>
                    </a>
                </GridItem>
                <GridItem  xs={12} md={12} >
                    <ul style={{maxWidth: 600, margin: 'auto'}}>
                        <li>Find FREE & deeply discounted meals near you instantly. The price you want.</li>
                        <li>Avoid grocery stores that are packed with people that risk your health and safety.</li>
                        <li>Great for singles, couples, & parents in Tallahassee! (screenshots above)</li>
                        <li>Takeout & Delivery included.</li>
                        <li>Save deals to find them faster.</li>
                    </ul>
                </GridItem>
                <GridContainer style={{marginTop: 18}}>
                    <GridItem style={{textAlign: 'center'}} xs={12} md={6}>
                        <img style={{maxWidth: 300}} width='100%' src={require("assets/img/app_image_1.png")} />
                    </GridItem>
                    <GridItem style={{textAlign: 'center'}} xs={12} md={6}>
                        <img style={{maxWidth: 300}}  width='100%' src={require("assets/img/app_image_2.png")} />
                    </GridItem>
                </GridContainer>
            </GridContainer>
            
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
            } />
        </div>
    );
  
}
