import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
// nodejs library to set properties for components
import gql from "graphql-tag";
import { Helmet } from 'react-helmet';

import Footer from "components/Footer/Footer.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import AppearOnScroll from 'components/AppearOnScroll.js'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Parallax from "components/Parallax/Parallax.js";
import Button from "components/CustomButtons/Button.js";
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
// sections for this page
import SectionText from "./Sections/SectionText.js";
import LoadingPage from '../LoadingPage/LoadingPage.js';
// import RelatedEventsWrapper from 'views/EventPage/Sections/RelatedEvents/RelatedEventsWrapper.js';
// import RelatedDealsWrapper from 'views/DealPage/Sections/RelatedDeals/RelatedDealsWrapper.js';

import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import {
  GET_ANNOUNCEMENT
} from 'EventQueries/EventQueries.js'
import ErrorPage from "views/ErrorPage/ErrorPage.js";

//Google analytics import
import ReactGA from 'react-ga';

var moment = require("moment");

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(blogPostPageStyle);

require('./AnnouncementsPage.css');


export default function AnnouncementsPage(props) {
  const announcementName = props.match.params.name;
  const announcementId = parseInt(announcementName.split("-")[0]);
  console.log(announcementId)
  let isMounted = true;

  const { user, loginWithRedirect} = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    announcement_id: announcementId,
    announcement_exists: true,

    name: "",
    description: "",
    date: "",
    city: "",
    state: "",
    picture_id: "",
    picture_url: "",
    
    attached_events: [],
    attached_deals: [],
  })

  const goBack = () => {
    if(!user || !props.history) {
      props.history.push("/")
    }
    else{
      props.history.goBack()
    }
  }
  const handleLogin = () => {
    //Google Analytics Record when someone Clicks this
    ReactGA.initialize('UA-151937222-1');
    ReactGA.event({
      category: 'User',
      action: 'Login/Sign Up: Event Page'
    });
    //Then Login/Sign up
    loginWithRedirect({});
    // loginWithPopup({});
  }

  const getAnnouncement = () => {
    // Says we're loading the event
    setIsLoading(true);

    //Get Event Info from Database
    props.client.query({
      query: GET_ANNOUNCEMENT,
      variables: {
        announcementId: announcementId
      }
    }).then((data) => {
      console.log(data)
      if(isMounted) {
        if(!data.data.announcements) {
          setValues({
            ...values,
            announcement_exists: false
          })
        }
        else {
          let cover_id = data.data.announcements[0].announcement_events.length != 0 ? data.data.announcements[0].announcement_events[0].event.image.image_uuid : data.data.announcements[0].announcement_deals[0].deal.cover_pic;
          if(data.data.announcements[0].picture_id) {
            cover_id = data.data.announcements[0].picture_id;
          }
          setValues({
            ...values,
            announcement_exists: true,
            name: data.data.announcements[0].name,
            date: data.data.announcements[0].date,
            description: data.data.announcements[0].description,
            city: data.data.announcements[0].city,
            state: data.data.announcements[0].state,
            picture_id: data.data.announcements[0].picture_id,

            
            attached_events: data.data.announcements[0].announcement_events,
            attached_deals: data.data.announcements[0].announcement_deals,

            // Make first event cover_pic the cover of announcement
            picture_url: cloudinary.url(cover_id, {secure: true, width: Math.floor(window.innerWidth < 700 ? window.innerWidth * 2 : window.innerWidth), crop: "scale", fetch_format: "auto", quality: "auto"})
          })
          //Say that we're not loading the event anymore.
          setIsLoading(false);
        }
      }
    }).catch(error => {
      console.log(error)
    })
  }

  const handleGoHomepage = () => {
    props.history.push("/")
  }

  const clickedDownload = () => {
    ReactGA.event({
        category: 'User',
        action: 'CLICKED_DOWNLOAD_APP'
    });
  }


  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });


  useEffect(() => {
    isMounted = true;

    localStorage.setItem('originPath', window.location.pathname);
    getAnnouncement();
    
    //For Google Analytics 
    console.log("ReactGA Called: ", window.location.pathname)
    ReactGA.initialize('UA-151937222-1');
    ReactGA.pageview(window.location.pathname)

    return () => {
      isMounted = false;
    }
  }, [announcementId, props.client])

  const classes = useStyles();

  //If Event info is loadng
  if(isLoading) {
    return (
      <div>
        <LoadingPage reason="Loading Events"/>
      </div>
    )
  }
  if(values.announcement_exists === false) {
    return <ErrorPage />
  }

  else {
    const today = new Date();
    return (
      <div>
        <Helmet>
          <title>{values.name} | Skedge</title>
          <meta name="description" content={values.name} />
          <meta name="theme-color" content="#02C39A" />
          <meta name="apple-itunes-app" content="app-id=1506618749, app-argument=myURL" />

          <meta name="geo.region" content="US-FL" />
          <meta name="geo.placename" content={values.city} />
          
          <meta property="og:title" content={`${values.name} | Skedge`} />
          <meta property="og:image" content={values.picture_url} />

        </Helmet>

        {/* <img style={{position: 'absolute', zIndex: 10, top: 15, left: 15}} height={40} width={40} src={require('assets/img/logoheader.png')} onClick={handleGoHomepage}/> */}
        <Parallax image={values.picture_url}> 
          {/* <div style={{position: 'absolute', right: 0}}> */}
              {/* <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1" onClick={() => clickedDownload()}>
                  <img style={{maxHeight: '22vh'}} src={require("assets/img/app_advert_3.png")} />
              </a> */}
          {/* </div> */}
        
        </Parallax>
          
        {/* <AppearOnScroll scrollInHeight={10}>
            <Button
              color="primary"
              onClick={handleGoHomepage}
              style={{margin: 'auto', width: '100%',height: '6vh', textTransform: 'none', fontSize: '14px'}}
            >
              {values.attached_events.length ? "For happy hours/deals near you, click here." : "For events near you, click here."}
            </Button>
        </AppearOnScroll> */}

        <div className={classes.container} style={{padding: 0, marginBottom: '7vh'}}>
          <SectionText 
            announcementInfo={values}
            client={props.client}
          />
          
          <div style={{maxWidth: 600, margin: 'auto', textAlign: 'center'}}>
            <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1" onClick={() => clickedDownload()}>
              <div style={{width: '100%',margin: 'auto', textAlign: 'center', marginTop: 10}}>            
                <img style={{maxHeight: '22vh'}} src={require("assets/img/app_advert_2.png")} />
                <img style={{maxHeight: '22vh'}} src={require("assets/img/app_advert_3.png")} />
              </div>
            </a>
            <img height={50} src={require('assets/img/DownloadAppStore.png')} />

          </div>

          {/* {
            values.attached_events.length ? 
            <RelatedEventsWrapper 
              currentDealId={0}
              client={props.client} 

              start_date={today.formatDate()}
              weekday={today.getDay().toString()}
              city={values.city}
              state={values.state}
              is_recurring={false}
            />
            :
            <RelatedDealsWrapper 
              currentDealId={0}
              client={props.client} 

              start_date={today.formatDate()}
              weekday={today.getDay().toString()}
              city={values.city}
              state={values.state}
              is_recurring={false}
            />
          } */}
          
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
          {/* <h1>{values.name}</h1> */}
        </div>
      </div>
    );
  } 
}


Date.prototype.formatDate = function() {
  var d = new Date(this.valueOf()),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}