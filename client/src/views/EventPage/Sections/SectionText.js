import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";
import GoingSaveButtons from './EventPageComponents/GoingSaveButtons.js';
import EventMomentsWrapper from 'components/EventMoments/EventMomentsWrapper.js';
import MomentPopover from 'components/EventMoments/MomentPopover.js';



// @material-ui/icons
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
//import Quote from "components/Typography/Quote.js";
//import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TodayIcon from '@material-ui/icons/Today';
import PlaceIcon from '@material-ui/icons/Place';
//import LocationCityIcon from '@material-ui/icons/LocationCity';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
//import Button from 'components/CustomButtons/Button.js'
import MapIcon from '@material-ui/icons/Map';
// style components
import sectionTextStyle from "assets/jss/material-kit-pro-react/views/blogPostSections/sectionTextStyle.js";

// Google Maps API
import MapsApi from 'components/GoogleMaps/MapsApi.js';

//Auth0 Wrapper
import { useAuth0 } from 'Authorization/react-auth0-wrapper';

//Google Analytics
import ReactGA from 'react-ga';

// Queries
import {
  // MUTATION_EVENT_SAVE,
  // MUTATION_EVENT_UNDO_SAVE,
  // REFETCH_EVENT_SAVES,
  // MUTATION_EVENT_GOING,
  // MUTATION_EVENT_UNDO_GOING,
  // REFETCH_EVENT_GOING,
  // FETCH_EVENT_INFO,
  FETCH_EVENT_GOING_SAVE
} from 'EventQueries/EventQueries.js'


const useStyles = makeStyles(sectionTextStyle);

export default function SectionText({ eventInfo, client }) {

  let _isMounted = true;

  const { user, loginWithRedirect } = useAuth0();

  const classes = useStyles();
  const imgClasses = classNames(
    classes.imgRaised,
    classes.imgRounded,
    classes.imgFluid
  );

  // Mutate Events Buttons
  const [values, setValues] = useState({
    ifGoing: false,
    ifSaved: false
  })
  
  //Record if the user signs up/in
  const handleLogin = () => {
    //Google Analytics Record when someone Clicks this
    ReactGA.initialize('UA-151937222-1');
    ReactGA.event({
      category: 'User',
      action: 'Created an Account/Logged In'
    });
    //Then Login/Sign up
    loginWithRedirect({})
  }


  // Getting new queries so we can refetch
  const getUserGoingSave = () => {
    client.query({
      query: FETCH_EVENT_GOING_SAVE,
      variables: {
        eventId: eventInfo.event_id,
        userId: user.sub
      }
    }).then((data) => {
      let isGoing = false;
      if(data.data.users[0].event_invites.length === 1) {
        isGoing = data.data.users[0].event_invites[0].response === 1;
      }
      const isSaved = data.data.users[0].user_saved_events.length === 1;
      if(_isMounted) {
        setValues({
          ...values,
          ifGoing: isGoing,
          ifSaved: isSaved
        })
      }
    })
  }

  useEffect(() => {

    _isMounted = true;
    if(user) {
      getUserGoingSave();
    }
    return () => {
      _isMounted = false;
    }
  },[])

  
  // Fix date formatting
  var moment = require('moment');
  let formattedStartTime = ""
  if(eventInfo.start_time) {
    formattedStartTime = moment(eventInfo.start_time, "HH:mm:ss");
  }
  
  //style={{borderRadius: 5, backgroundColor: "#02C39A", color: 'white'}}
  let formattedEndTime = ""
  if(eventInfo.end_time) {
    const tempEndTime = moment(eventInfo.end_time, "HH:mm:ss")
    formattedEndTime = (
      <h3 style={{marginTop: 0}}>
        Until: {moment(tempEndTime).format("h:mm A")}
      </h3>
    )
  }
  let formattedDate = ""
  if(eventInfo.is_recurring) {
    // Setting Display Variables    
    let displayDate = "Every ";
    if(eventInfo.weekday.includes("1")) {
      displayDate += "Monday";
    }
    if(eventInfo.weekday.includes("2")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Tuesday";
    }
    if(eventInfo.weekday.includes("3")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Wednesday";
    }
    if(eventInfo.weekday.includes("4")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Thursday";
    }
    if(eventInfo.weekday.includes("5")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Friday";
    }
    if(eventInfo.weekday.includes("6")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Saturday";
    }
    if(eventInfo.weekday.includes("0")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Sunday";
    }

    //displayDate += `until ${eventInfo.end_date}`
    formattedDate = displayDate;
    
  }
  else {
    formattedDate = moment(eventInfo.start_date, "YYYY-MM-DD").format("MMMM Do, YYYY")
  }

  if(user) {
    return (
      <div className={classes.section} style={{paddingTop: 15}}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={8} md={8}>
            <div style={{textAlign: 'center'}}>
              <h2>
                <TodayIcon fontSize='large' style={{verticalAlign: 'middle'}}/>
                {formattedDate}
              </h2>
              <div>
                <h3 style={{marginTop: 0}}>
                  Starts at: {moment(formattedStartTime).format("h:mm A")}
                </h3>
                {formattedEndTime}
              </div>
            </div>
            <hr />
            <div style={{display: 'inline-block', width: "100%", textAlign: 'center'}}>
              <GoingSaveButtons 
                ifGoing={values.ifGoing}
                ifSaved={values.ifSaved}
                client={client}
                eventId={eventInfo.event_id}
                eventHost={eventInfo.user_auth0_id}
              />
            </div>

            {/* <h4></h4> //Event Moments turned off for now
            <MomentPopover/>
            <EventMomentsWrapper
              eventId={eventInfo.event_id}
              cover={eventInfo.cover_url}
              client={client}
              ifGoing={values.ifGoing}
            /> */}
            <h3 className={classes.title}>
              Details
            </h3>
            <p style={{wordWrap: 'break-word', whiteSpace: "pre-line"}}>
              {eventInfo.description}
            </p>
            
            <h4>
              <PlaceIcon style={{verticalAlign: 'top'}}/>
              {`${eventInfo.location_name}`} <br />
              <HomeWorkIcon style={{verticalAlign: 'top'}}/>
              { eventInfo.street ? `${eventInfo.street} ` : ""} <br />
              <MapIcon style={{verticalAlign: 'top'}}/>
              {`${eventInfo.city}, ${eventInfo.state}`}
            </h4>
            <MapsApi 
              street={eventInfo.street}
              city={eventInfo.city}
              state={eventInfo.state}
              pageLoaded={true}
            />
            
          </GridItem>
        </GridContainer>
      </div>
    );
  }
  else {
    return (
      <div className={classes.section} style={{padding: '0px 15px 15px 15px', textAlign: 'center'}}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12}>
            <h3>Sign up for more info!</h3>
            <Button
              color="primary"
              onClick={handleLogin}
            >
              Login or Sign Up
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
