import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";
import EventActivity from 'views/EventPage/Sections/EventPageComponents/EventActivity.js';





// @material-ui/icons
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import LockIcon from '@material-ui/icons/Lock';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RenewIcon from '@material-ui/icons/Autorenew'


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

export default function DealInfoSection({ dealInfo, client }) {

  let _isMounted = true;

  const { user, loginWithRedirect, loginWithPopup } = useAuth0();

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
      action: 'Login/Sign Up: Event Page'
    });
    //Then Login/Sign up
    // loginWithRedirect({});
    loginWithPopup({});
  }


  // Getting new queries so we can refetch
  const getUserGoingSave = () => {
    client.query({
      query: FETCH_EVENT_GOING_SAVE,
      variables: {
        eventId: dealInfo.event_id,
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
  console.log(dealInfo)
  let formattedStartTime = ""
  if(dealInfo.start_time) {
    formattedStartTime = moment(dealInfo.start_time, "HH:mm:ss");
  }
  
  //style={{borderRadius: 5, backgroundColor: "#02C39A", color: 'white'}}
  let formattedEndTime = ""
  if(dealInfo.end_time) {
    const tempEndTime = moment(dealInfo.end_time, "HH:mm:ss")
    formattedEndTime = (
      <h3 style={{marginTop: 0}}>
        Until: {moment(tempEndTime).format("h:mm A")}
      </h3>
    )
  }
  let formattedDate = ""
  if(dealInfo.is_recurring) {
    // Setting Display Variables    
    let displayDate = "Every ";
    if(dealInfo.weekday.includes("1")) {
      displayDate += "Monday";
    }
    if(dealInfo.weekday.includes("2")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Tuesday";
    }
    if(dealInfo.weekday.includes("3")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Wednesday";
    }
    if(dealInfo.weekday.includes("4")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Thursday";
    }
    if(dealInfo.weekday.includes("5")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Friday";
    }
    if(dealInfo.weekday.includes("6")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Saturday";
    }
    if(dealInfo.weekday.includes("0")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Sunday";
    }

    //displayDate += `until ${dealInfo.end_date}`
    formattedDate = displayDate;
    
  }
  else {
    formattedDate = moment(dealInfo.start_date, "YYYY-MM-DD").format("MMMM Do, YYYY")
  }

  // if(dealInfo.invite_only) {
  //   return(
  //     <div>
  //       <LockIcon />
  //     </div>
  //   )
  // }


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
          
            {/* user ? 
            <div style={{display: 'inline-block', width: "100%", textAlign: 'center'}}>
            </div> : "" */}

          <h3 className={classes.title}>
            Details
          </h3>
          <p style={{wordWrap: 'break-word', whiteSpace: "pre-line"}}>
            {dealInfo.description}
          </p>
          <h4>
            <PlaceIcon style={{verticalAlign: 'top'}}/>
            {`${dealInfo.location_name}`} <br />
            <HomeWorkIcon style={{verticalAlign: 'top'}}/>
            { dealInfo.street ? `${dealInfo.street} ` : ""} <br />
            <MapIcon style={{verticalAlign: 'top'}}/>
            {`${dealInfo.city}, ${dealInfo.state}`}
          </h4>
          {
            user ? 
            <div>
              <MapsApi 
                street={dealInfo.street}
                city={dealInfo.city}
                state={dealInfo.state}
                longitude={dealInfo.longitude}
                latitude={dealInfo.latitude}
                itemId={dealInfo.deal_id}
                page='deals'
                client={client}
                pageLoaded={true}
              />
              {
                user.sub === dealInfo.user_auth0_id ? 
                <EventActivity info={dealInfo}/>
                :
                ""
              }
            </div> : ""
          }
          {
            !user ? 
            <div style={{margin: 'auto', textAlign: 'center', marginBottom: '1em', maxWidth: '260px'}}>
              <Button
                color="primary"
                onClick={handleLogin}
              >
                Login or Sign Up
              </Button>
            </div> : ""
          }
        </GridItem>
      </GridContainer>
    </div>
  );
  
  // else {
  //   return (
  //     <div className={classes.section} style={{padding: '0px 15px 15px 15px', textAlign: 'center'}}>
  //       <GridContainer justify="center">
  //         <GridItem xs={12} sm={12} md={12}>
  //           <h3>To view more events, sign up on Skedge!</h3>
  //           <Button
  //             color="primary"
  //             onClick={handleLogin}
  //           >
  //             Login or Sign Up
  //           </Button>
  //         </GridItem>
  //       </GridContainer>
  //     </div>
  //   );
  // }
}
