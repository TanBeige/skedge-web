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
//Google Analytics
import ReactGA from 'react-ga';


import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";

require('dotenv');
var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(blogPostPageStyle);

require('./AppStore.css');


export default function EventPage(props) {

  useEffect(() => {
    ReactGA.initialize('UA-151937222-1');
    
  }, []);

  const classes = useStyles();

  const clickedDownload = () => {

    ReactGA.event({
        category: 'User',
        action: 'CLICKED_DOWNLOAD_APP'
    });
  }


    return (
        <div style={{minHeight: '90vh'}}>
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
            <GridContainer justify='center' style={{marginTop: 60, marginBottom: 20}}>
                <GridItem xs={12}  style={{textAlign: 'center'}}>
                    <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1" onClick={() => {clickedDownload()}}>
                    <div style={{margin: '10px 20px 0px 20px'}} >

                        <img width={'100%'} style={{maxWidth: 600}}  src={require('assets/img/dealsbanner.png')} />
                        </div>
                    </a>
                </GridItem>
                <GridItem xs={12}  style={{textAlign: 'center'}}>
                    {/* <h1 style={{margin: 8, fontSize: 42}}>The Best Deals in Tallahassee.</h1> */}
                    <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1" onClick={() => clickedDownload()}>
                        <img height={80} style={{margin: 10}} src={require('assets/img/DownloadAppStore.png')} />
                    </a>
                </GridItem>
                {/* <GridItem xs={12}  style={{textAlign: 'center'}}>
                    <a href="https://apps.apple.com/us/app/skedge/id1506618749?mt=8" style={{width: 200, height: 400}} className="AppBanner" >

                    </a>
                </GridItem> */}
                {/* <GridItem xs={12} style={{textAlign: 'center'}}>
                    <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1">
                        <h2 style={{margin: 10, color: 'black'}}>Hey Tallahassee, <br />Find Skedge on the </h2>
                        <img width='100%' src="https://developer.apple.com/news/images/og/app-store-og.png" />
                    </a>
                </GridItem> */}
                <GridContainer style={{margin: 18}}>
                    <GridItem style={{textAlign: 'center', padding: 0}} xs={6} md={6} >
                        <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1" onClick={() => clickedDownload()}>
                            <img style={{maxWidth: 300}} width='100%' src={require("assets/img/app_advert_2.png")} />
                        </a>
                    </GridItem>
                    <GridItem style={{textAlign: 'center', padding: 0}} xs={6} md={6}>
                        {/* <h3 style={{margin: 18}}>Favorite events to view them later</h3> */}
                        <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1" onClick={() => clickedDownload()}>
                            <img style={{maxWidth: 300}}  width='100%' src={require("assets/img/app_advert_3.png")} />
                        </a>
                    </GridItem>
                </GridContainer>
                {/* <GridItem  xs={12} md={12} style={{margin: 12, maxWidth: 600}} >
                    <h4 style={{marginTop: 0}}>With Skedge you can:</h4>
                    <ul style={{ margin: 'auto'}} >
                        <li>Find FREE & deeply discounted meals near you instantly. The price you want.</li>
                        <li>Takeout & Delivery included.</li>
                        <li>Save deals to find them faster.</li>
                        <li>Post reviews on your deal experiences!</li>
                        <li>Great for singles, couples, & parents in Tallahassee! (screenshots above)</li>
                        <li>Avoid grocery stores that are packed with people.</li>
                    </ul>
                </GridItem> */}
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
