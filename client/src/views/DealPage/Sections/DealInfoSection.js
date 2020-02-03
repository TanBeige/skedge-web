import React, {Fragment, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";
import EventActivity from 'views/EventPage/Sections/EventPageComponents/EventActivity.js';





// @material-ui/icons
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FlareIcon from '@material-ui/icons/Flare';
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
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

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
      action: 'Login/Sign Up: Deal Page'
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
  let formattedStartTime = ""
  if(dealInfo.start_time) {
    formattedStartTime = moment(dealInfo.start_time, "HH:mm:ss");
  }

  let formattedEndTime = "";
  if(dealInfo.end_time) {
    formattedEndTime = moment(dealInfo.end_time, "HH:mm:ss");
  }
  
  
  let formattedDate = ""
  if(dealInfo.is_recurring) {
    // Setting Display Variables    
    let displayDate = "Every ";
    if(dealInfo.weekday.includes("1")) {
      displayDate += "Mon";
    }
    if(dealInfo.weekday.includes("2")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Tues";
    }
    if(dealInfo.weekday.includes("3")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Wed";
    }
    if(dealInfo.weekday.includes("4")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Thur";
    }
    if(dealInfo.weekday.includes("5")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Fri";
    }
    if(dealInfo.weekday.includes("6")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Sat";
    }
    if(dealInfo.weekday.includes("0")) {
      if(displayDate.length > 6) {
        displayDate += ", "
      }
      displayDate += "Sun";
    }

    if(dealInfo.weekday === '1 2 3 4 5 6 0') {
      displayDate = "Everyday";
    }
    else if(dealInfo.weekday === '1 2 3 4 5') {
      displayDate = "Every weekday";
    }
    else if(dealInfo.weekday === '5 6 0') {
      displayDate = "Every weekend";
    }

    //displayDate += `until ${dealInfo.end_date}`
    formattedDate = displayDate;
    
  }
  else {
    formattedDate = moment(dealInfo.start_date, "YYYY-MM-DD").format("MMMM Do, YYYY")
  }


  return (
    <div className={classes.section} style={{paddingTop: 0}}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={10} md={10}>
          <div style={{marginTop: 8, textAlign: 'center'}}>
            
            <h2 style={{marginTop: 0}}>
              {formattedDate}
            </h2>
            
          </div>
          <hr />
          
            {/* user ? 
            <div style={{display: 'inline-block', width: "100%", textAlign: 'center'}}>
            </div> : "" */}
            <div style={{position: 'absolute', right: 24}}>
              <h4 style={{marginTop: 0, float: 'right', textAlign: 'right'}}>
                From {moment(formattedStartTime).format("h:mm A")}
                {
                dealInfo.end_time ? 
                    <Fragment>
                      <br />until {formattedEndTime.format("h:mm A")}
                    </Fragment>
                   : ""
                }
              </h4>
            </div>

          <h3 className={classes.title} style={{margin: '0px 0px 2em 0px'}}>
            Details
          </h3>
          <p style={{wordWrap: 'break-word', whiteSpace: "pre-line", marginBottom: 10}}>
            {dealInfo.description}
          </p>
          {
            dealInfo.point_1 ? 
              <div style={{display: 'flex'}}> 
                <FlareIcon size='small' style={{fontSize: 12, margin: 'auto 4px', color: 'gold'}}/>
                <p >{dealInfo.point_1}</p>
              </div>
              : ""
          }
          {
            dealInfo.point_2 ? 
              <div style={{display: 'flex'}}> 
                <FlareIcon size='small' style={{fontSize: 12, margin: 'auto 4px', color: 'gold'}}/>
                <p >{dealInfo.point_2}</p>
              </div>
              : ""
          }

          {
             dealInfo.web_url && dealInfo.web_url.length !== ""  ?
            <div style={{width: '100%'}}><a href={ dealInfo.web_url.includes("https://") || dealInfo.web_url.includes("http://") ? dealInfo.web_url : `//${dealInfo.web_url}`} target='_blank'><Button color='primary' style={{width: '100%'}}  size='sm'>Link to deal.</Button></a></div> : ""
          }
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
