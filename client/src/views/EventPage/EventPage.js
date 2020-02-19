import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
// nodejs library to set properties for components
import gql from "graphql-tag";
import { Helmet } from 'react-helmet';


import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';

import EventLoading from 'components/EventLoading.js'
import GoingSaveButtons from './Sections/EventPageComponents/GoingSaveButtons.js';

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';


// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
// sections for this page
import SectionText from "./Sections/SectionText.js";
import SkedgeDisclosure from "components/Footer/SkedgeDisclosure.js";
import RelatedEventsWrapper from './Sections/RelatedEvents/RelatedEventsWrapper.js';
import SectionComments from "./Sections/SectionComments.js";
import SectionSimilarStories from "./Sections/SectionSimilarStories.js";
import LoadingPage from '../LoadingPage/LoadingPage.js';
import EditEventButton from './Sections/EventPageComponents/EditEventButton.js';
import DeleteEventButton from './Sections/EventPageComponents/DeleteEventButton.js';
import EditInvites from './Sections/EventPageComponents/Invites/EditInvites.js';
import EditCohosts from './Sections/EventPageComponents/Cohosts/EditCohosts.js';

import { createWeekdayString } from 'components/CommonFunctions.js'




import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import {
  FETCH_EVENT_INFO,
  MUTATION_EVENT_VIEW,
  MUTATION_EVENT_UPDATE,
  MUTATION_EVENT_DELETE,
  QUERY_FILTERED_EVENT
} from 'EventQueries/EventQueries.js'
import ErrorPage from "views/ErrorPage/ErrorPage.js";

//Google analytics import
import ReactGA from 'react-ga';

var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(blogPostPageStyle);

require('views/EventPage/EventPage.css');


export default function EventPage(props) {
  const eventId = props.match.params.id;
  let isMounted = true;

  const { loading, user, isAuthenticated, loginWithRedirect, loginWithPopup} = useAuth0();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false)

  const [values, setValues] = useState({
    event_id: eventId,
    event_date_id: null,
    event_exists: true,

    invite_only: true,

    name: "",
    description: "",
    event_type: "",
    start_date: "",
    start_time: "",
    end_time: "",
    category: "",
    location_name: "",
    city: "",
    state: "",
    street: "",
    price: "",
    web_url: "",
    allow_invites: false,
    host_approval: true,
    updated_at: "",

    cover_uuid: "",
    cover_url: "",
    cover_pic: 0,

    user_id: 0,
    user_pic: "",
    user_name: "",
    user_full_name: "",

    views: 0,
    impressions: 0,
    
    event_cohosts: [],
    event_tags: [],
    liked_users: [],
    like_amount: 0,

    ifSaved: false,
    ifGoing: false,
    going_count: 0,

    ifLiked: false,
    ifReposted: false,

    going_users: []
  })

  const goBack = () => {
    if(!user) {
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

  const getEvent = () => {
    // Says we're loading the event
    setIsLoading(true);

    //Get Event Info from Database
    props.client.query({
      query: FETCH_EVENT_INFO,
      variables: {
        eventId: eventId
      }
    }).then((data) => {
      if(isMounted) {
        if(data.data.events === undefined || data.data.events.length === 0) {
          setValues({
            ...values,
            event_exists: false
          })
        }
        else {
          setValues({
            ...values,

            event_exists: true,
            event_date_id: data.data.events[0].event_date_id,

            invite_only: data.data.events[0].invite_only,

            name: data.data.events[0].name,
            description: data.data.events[0].description,
            event_type: data.data.events[0].event_type,

            start_date: data.data.events[0].event_date.start_date,
            end_date: data.data.events[0].event_date.end_date,

            is_recurring: data.data.events[0].event_date.is_recurring,
            weekday: data.data.events[0].event_date.weekday,

            start_time: data.data.events[0].start_time,
            end_time: data.data.events[0].end_time,
            
            category: data.data.events[0].category,
            location_name: data.data.events[0].location_name,
            city: data.data.events[0].city,
            state: data.data.events[0].state,
            street: data.data.events[0].street,
            price: data.data.events[0].price,
            web_url: data.data.events[0].web_url,
            allow_invites: data.data.events[0].allow_invites,
            host_approval: data.data.events[0].host_approval,
            updated_at: data.data.events[0].updated_at,
            latitude: data.data.events[0].latitude,
            longitude: data.data.events[0].longitude,
        
            cover_uuid: data.data.events[0].image.image_uuid,
            cover_url: cloudinary.url(data.data.events[0].image.image_uuid, {secure: true, height: Math.floor(window.innerHeight * 0.6), crop: "scale", fetch_format: "auto", quality: "auto"}),
            cover_pic: data.data.events[0].cover_pic,

            user_id: data.data.events[0].user.id,
            user_pic: cloudinary.url(data.data.events[0].user.picture, {secure: true, width: 32, height: 32, crop: "fill"}),
            
            user_name: data.data.events[0].user.name,
            user_full_name: data.data.events[0].user.full_name,
            user_biography: data.data.events[0].user.biography,

            // Creator of event:
            user_auth0_id: data.data.events[0].user.auth0_id,

            views: data.data.events[0].views,
            impressions: data.data.events[0].impressions,
            
            event_cohosts: data.data.events[0].event_cohosts,
            event_tags: data.data.events[0].event_tags,

            ifSaved: user ? data.data.events[0].user_saved_events.some(users => users.user_id === user.sub) : false,
            ifGoing: user ? data.data.events[0].event_invites.some(users => users.invited_id === user.sub) : false,

            ifLiked: user ? data.data.events[0].event_like.some(users => users.user_id === user.sub) : false,
            ifReposted: user ? data.data.events[0].shared_event.some(users => users.user_id === user.sub) : false,
        
            going_count: data.data.events[0].event_invites_aggregate.aggregate.count,

            going_users: data.data.events[0].event_invites.filter(function (invites) {return invites.response === 1}),
            invited_users: data.data.events[0].event_invites,
            liked_users: data.data.events[0].event_like,
            like_amount: data.data.events[0].event_like_aggregate.aggregate.count,

            shared_users: data.data.events[0].shared_event,
            share_amount: data.data.events[0].shared_event_aggregate.aggregate.count
          })
          //Say that we're not loading the event anymore.
          setIsLoading(false);
        }
      }
    }).catch(error => {
      console.log(error)
    })
  }

  //Submit Changes
  const handleEventChange = async (newInfo, weekday, endTimeExist) => {
    setImageUploading(true)


    //Upload Image to Cloudinary, Delete Old picture Afterwards
    let errorOccurred = false;
    let coverPicId = values.cover_pic;
    let response = "";

    if(newInfo.picFile) {
      const form_data = new FormData();

      form_data.append('file', newInfo.picFile)

      // Upload file to Cloudinary
      response = await axios.post(
        `/storage/update`, 
        form_data, 
        {
        params: {
          picId: values.cover_uuid
        }}
      ).catch((error => {
        alert("Error occurred while uploading picture, try uploading a smaller image size or try again later.")
        errorOccurred = true;
        return;
      }))


      //After submitting image, save it in database
      await props.client.mutate({
        mutation: gql`
          mutation insert_image($objects: [images_insert_input!]!){
            insert_images(objects: $objects){
              returning{
                id
              }
            }
          }
        `,
        variables: {
          objects: {
            image_name: newInfo.name,
            image_uuid: response.data.id,
            url: response.data.url
          }
        },
      }).then((data) => {
        coverPicId = data.data.insert_images.returning[0].id

      }).catch(error => {
        console.log(error);
        errorOccurred = true;
      })
    }

    if (errorOccurred) {
      return
    }


    //Make Changes to Database
    props.client.mutate({
      mutation: MUTATION_EVENT_UPDATE,
      refetchQueries: [{
        query: FETCH_EVENT_INFO,
        variables: {
          eventId: eventId
        }
      }],
      variables: {
        eventId: values.event_id,
        eventDateId: values.event_date_id,
        name: newInfo.name,
        locationName: newInfo.location_name,
        street: newInfo.street,
        city: newInfo.city,
        state: newInfo.state,
        coverPic: coverPicId,

        startDate: newInfo.start_date,
        endDate: newInfo.is_recurring ? newInfo.end_date : newInfo.start_date,
        startTime: moment(newInfo.start_time).format("HH:mm:ss"),
        endTime: endTimeExist ? moment(newInfo.end_time).format("HH:mm:ss") : null,
        isRecurring: newInfo.is_recurring,
        weekday: newInfo.is_recurring ? weekday : "",

        description: newInfo.description,
        category: newInfo.category,
      }
    }).then((data)=> {
      console.log("Success!")
      setImageUploading(false)
    }).catch(error => {
      console.error(error);
    });
    if(isMounted) {
      setValues({
        ...values,
        name: newInfo.name,
        location_name: newInfo.location_name,
        street: newInfo.street,
        city: newInfo.city,
        state: newInfo.state,
        start_date: newInfo.start_date,
        end_date: newInfo.is_recurring ? newInfo.end_date : null,
        is_recurring: newInfo.is_recurring,
        start_time: newInfo.start_time,
        end_time: endTimeExist ? newInfo.end_time : null,
        description: newInfo.description,
        category: newInfo.category,
      
        cover_uuid: response ? response.data.id : values.cover_uuid,
        cover_url: response ? cloudinary.url(response.data.id, {secure: true, height: window.innerHeight, crop: "scale", fetch_format: "auto", quality: "auto"}) : values.cover_url,

        webUrl: newInfo.web_url,
        savings: newInfo.savings
      })
    }
  }

  //DELETE EVENT
  const handleDeleteEvent = () => {
    props.client.mutate({
      mutation: MUTATION_EVENT_DELETE,
      refetchQueries: [{
        query: QUERY_FILTERED_EVENT,
        variables: {
          userId: user.sub
        }
      }],
      variables: {
        eventId: values.event_id
      }
    }).then(()=> {
      console.log("Success!");
      props.history.push("/home")
    }).catch(error => {
      console.error(error);
      alert("Error Deleted Event Occurred")
    });
  }

  // Add a View to the event
  const addView = () => {
    props.client.mutate({
      mutation: MUTATION_EVENT_VIEW,
      variables: {
        eventId: eventId
      }
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });


  useEffect(() => {
    isMounted = true;

    localStorage.setItem('originPath', window.location.pathname);
    getEvent();
    addView();
    
    //For Google Analytics 
    console.log("ReactGA Called: ", window.location.pathname)
    ReactGA.initialize('UA-151937222-1');
    ReactGA.pageview(window.location.pathname)

    return () => {
      isMounted = false;
    }
  }, [eventId])

  let titleSize = '10vw'

  if (window.innerWidth > 1000) {
    titleSize = '5vw'
  }

  const classes = useStyles();

  //For popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const editingEvent = () => {
      if(isAuthenticated) {
        if(user.sub === values.user_auth0_id || values.event_cohosts.some(u => (u.cohost.auth0_id === user.sub && u.accepted === true))) {
          return (
            <div>
              <Button size='sm' style={{position: 'absolute', top: 20, right: 20}} round justIcon onClick={handleClick}>
                <SettingsIcon />
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div style={{display: 'grid'}}>
                    <EditInvites
                      userList={values.invited_users}
                      client={props.client}
                      eventId={values.event_id}
                    />
                    <EditCohosts
                      userList={values.event_cohosts}
                      client={props.client}
                      userId={user.sub}
                      disabled={!(user.sub === values.user_auth0_id)}
                      eventId={values.event_id}
                    />
                    <EditEventButton 
                        client={props.client}
                        userId={user.sub}
                        creatorId={values.user_auth0_id}
                        handleEventChange={handleEventChange}
                        oldEvent={values}
                        handleDeleteEvent={handleDeleteEvent}
                    />
                  </div>
                </Popover>
              </div>
          )
        }
      }
  }

  //If Event info is loadng
  if(isLoading) {
    return (
      <div>
        <Header
          brand="Skedge"
          links={<HeaderLinks dropdownHoverColor="info" />}
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 300,
            color: "primary"
          }}
        />
        <LoadingPage reason="Loading Events"/>
      </div>
    )
  }
  else if(values.event_exists === false) {
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
        {
          //If user is changing events
          imageUploading ? 
          <EventLoading text="Saving Changes" /> : ""
        }

        <Button onClick={goBack} justIcon round style={{position: 'fixed', top: 20,  left: 20, zIndex: 5}} color="primary">
          {
            user ?
            <ChevronLeftIcon /> : <HomeIcon />
          }
        </Button>
        <Parallax image={values.cover_url}>
          {editingEvent()}
          {
            !user ? 
            <div style={{margin: 'auto', textAlign: 'center', marginBottom: '1em',paddingBottom: '12', maxWidth: '300px'}}>
              {/* <h4 style={{color:'white'}}>Sign up to see more events like this happening soon.</h4> */}
              <Button
                color="white"
                style={{color: 'black'}}
                onClick={handleLogin}
              >
                Login or Sign Up
              </Button>
            </div> : ""
          }     
          {
            user ?
            <div style={{position: 'absolute', bottom: '0px', zIndex: 2, width: '100%', marginBottom: '-10px', textAlign: 'center'}}>
              <GoingSaveButtons
                ifGoing={values.ifGoing}
                ifSaved={values.ifSaved}
                ifLiked={values.ifLiked}
                ifReposted={values.ifReposted}
                likeAmount={values.like_amount}
                repostAmount={values.share_amount}
                goingAmount={values.going_count}

                client={props.client}
                eventId={values.event_id}
                eventHost={values.user_auth0_id}
              />
            </div> : ""
          }
        </Parallax>
          <div className={classes.container} style={{padding: 0, marginBottom: '7vh'}}>
            <SectionText 
              eventInfo={values}
              client={props.client}
            />

            {
              values.start_date !== "" ?
              <RelatedEventsWrapper 
                currentEventId={eventId}
                client={props.client} 

                start_date={values.start_date}
                weekday={values.weekday}
                city={values.city}
                state={values.state}
                is_recurring={values.is_recurring}
              /> : ""
            }
          </div>
      </div>
    );
  } 
}
