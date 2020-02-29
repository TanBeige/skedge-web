import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
// nodejs library to set properties for components
import gql from "graphql-tag";
import { Helmet } from 'react-helmet';


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import EventLoading from 'components/EventLoading.js'

// @material-ui/icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';


// core components
import Parallax from "components/Parallax/Parallax.js";
import Button from "components/CustomButtons/Button.js";
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
// sections for this page
import SectionText from "./Sections/SectionText.js";

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
          let cover_id = data.data.announcements[0].announcement_events.length != 0 ? data.data.announcements[0].announcement_events[0].event.cover_pic : data.data.announcements[0].announcement_deals[0].deal.cover_pic;
          if(data.data.announcements[0].picture_id) {
            cover_id = data.data.announcements[0].picture_id;
          }
          setValues({
            ...values,
            announcement_exists: true,
            name: data.data.announcements[0].name,
            description: data.data.announcements[0].description,
            city: data.data.announcements[0].city,
            state: data.data.announcements[0].state,
            picture_id: data.data.announcements[0].picture_id,

            
            attached_events: data.data.announcements[0].announcement_events,
            attached_deals: data.data.announcements[0].announcement_deals,

            // Make first event cover_pic the cover of announcement
            picture_url: cloudinary.url(cover_id, {secure: true, width: Math.floor(window.innerWidth), crop: "scale", fetch_format: "auto", quality: "auto"})
          })
          //Say that we're not loading the event anymore.
          setIsLoading(false);
        }
      }
    }).catch(error => {
      console.log(error)
    })
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

  // //If Event info is loadng
  // if(isLoading || loading) {
  //   return (
  //     <div>
  //       <LoadingPage reason="Loading Events"/>
  //     </div>
  //   )
  // }
  if(values.announcement_exists === false) {
    return <ErrorPage />
  }

  else {
    return (
      <div>
        <Helmet>
          <title>{values.name} | Skedge</title>
          <meta name="description" content={values.description} />
          <meta name="theme-color" content="#02C39A" />

          <meta name="geo.region" content="US-FL" />
          <meta name="geo.placename" content={values.city} />
          <meta name="geo.position" content={`${values.latitude};${values.longitude}`}/>
          <meta name="ICBM" content={`${values.latitude},${values.longitude}`}/>
        </Helmet>

        <Button onClick={goBack} justIcon round style={{position: 'fixed', top: 20,  left: 20, zIndex: 5}} color="primary">
          {
            user ?
            <ChevronLeftIcon /> : <HomeIcon />
          }
        </Button>
        <Parallax image={values.picture_url}> </Parallax>
        <div className={classes.container} style={{padding: 0, marginBottom: '7vh'}}>
          <SectionText 
            announcementInfo={values}
            client={props.client}
          />
          {/* <h1>{values.name}</h1> */}
        </div>
      </div>
    );
  } 
}
