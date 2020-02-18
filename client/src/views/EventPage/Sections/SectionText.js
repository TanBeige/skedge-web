import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import Button from "components/CustomButtons/Button.js";
import EventActivity from 'views/EventPage/Sections/EventPageComponents/EventActivity.js';
import SkedgeDisclosure from "components/Footer/SkedgeDisclosure.js";
import CategoryFragment from './CategoryFragment.js';

//import Quote from "components/Typography/Quote.js";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TodayIcon from '@material-ui/icons/Today';
import PlaceIcon from '@material-ui/icons/Place';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

// style components
import sectionTextStyle from "assets/jss/material-kit-pro-react/views/blogPostSections/sectionTextStyle.js";
// Google Maps API
import MapsApi from 'components/GoogleMaps/MapsApi.js';
//Auth0 Wrapper
import { useAuth0 } from 'Authorization/react-auth0-wrapper';
//Google Analytics
import ReactGA from 'react-ga';

const useStyles = makeStyles(sectionTextStyle);

export default function SectionText({ eventInfo, client }) {

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
  });

  const [expandDetails, setExpandDetails] = useState(false)
  
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


  useEffect(() => {

    _isMounted = true;

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
    formattedEndTime = moment(eventInfo.end_time, "HH:mm:ss")
  }
  let formattedDate = ""
  if(eventInfo.is_recurring) {
    // Setting Display Variables    
    let displayDate = "Every ";
    if(eventInfo.weekday.includes("1")) {
      displayDate += "Mon.";
    }
    if(eventInfo.weekday.includes("2")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Tues.";
    }
    if(eventInfo.weekday.includes("3")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Wed.";
    }
    if(eventInfo.weekday.includes("4")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Thur.";
    }
    if(eventInfo.weekday.includes("5")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Fri.";
    }
    if(eventInfo.weekday.includes("6")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Sat.";
    }
    if(eventInfo.weekday.includes("0")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Sun.";
    }

    //displayDate += `until ${eventInfo.end_date}`
    formattedDate = displayDate;
    
  }
  else {
    formattedDate = moment(eventInfo.start_date, "YYYY-MM-DD").format("MMMM Do, YYYY")
  }

  const userLink = `/${eventInfo.user_name}`

  const timePaper= {
    margin: '0 0.4em'
  }


  return (
    <div >
      {/* <GridContainer justify="center"> */}
        {/* <GridItem xs={12} sm={10} md={10}> */}
            <div className='EventTitle'>
              <h3 className='EventName'>{eventInfo.name}</h3>
              
              <h4 className='EventCreator'>
                By: 
                <Link to={userLink}>
                  {/* <Avatar style={{float: 'left', border: '0.5px solid #02C39A', height: 20, width: 20, margin: '0px 5px'}} width={24} alt={values.username} src={eventInfo.user_pic}/>                     */}
                  {` ${eventInfo.user_name}`}
                </Link>
              </h4>
              
            </div>
            <div className='EventDateTime'>
              <Paper style={timePaper} elevation={0} className='EventDate'>
                <TodayIcon style={{height: '100%'}}/>
                <h4 style={{margin: '0 5px', fontSize: '1em', alignSelf: 'center', fontWeight: '400'}}>
                  {formattedDate}
                </h4>
              </Paper>
              <Paper style={timePaper} elevation={0} className='EventDate'>
                <AccessAlarmIcon style={{height: '100%'}}/>
                <h4 style={{margin: 5, fontSize: '1em', alignSelf: 'center', fontWeight: '400'}}>
                  {moment(formattedStartTime).format("h:mmA")}
                  {eventInfo.end_time ? ` - ${moment(formattedEndTime).format("h:mmA")}` : ""}
                </h4>
              </Paper>
            </div>
            <div className='EventDescription'>
              <Paper  elevation={0} square>
                <Collapse in={expandDetails} collapsedHeight='14vh' timeout="auto">
                  <div style={{margin: '0px 0.5em'}}>
                    
                    <p className={expandDetails ?  "NotFadingOut": "FadingOut"} style={{wordWrap: 'break-word', whiteSpace: "pre-line"}}>
                      <b>Details: </b>{eventInfo.description}
                    </p>
                    <div style={{display:'inline-flex', width: '100%'}}>
                      {
                        eventInfo.web_url && eventInfo.web_url !== "" ?
                        <div><a href={ eventInfo.web_url.includes("https://") || eventInfo.web_url.includes("http://") ? eventInfo.web_url : `//${eventInfo.web_url}`} target='_blank'><Button color='primary'  size='sm'>Link to tickets</Button></a></div> : ""
                      }
                      <div style={{margin: '0.5em', width: '100%', textAlign: 'right'}}>
                        <CategoryFragment category={eventInfo.category}/>
                      </div>
                    </div>
                    
                    
                  </div>
                  <div style={{margin: '0px 10px 0px 10px'}}>
                    <SkedgeDisclosure/>
                  </div>
                </Collapse> 
                <div style={{width: '100%', textAlign: 'center'}}>
                  <IconButton style={{width: '100%', borderRadius: 4}} disableRipple onClick={()=>setExpandDetails(!expandDetails)}>
                    {expandDetails ? <ExpandLessIcon /> : <ExpandMoreIcon/>}
                  </IconButton>
                </div>
              </Paper>
            </div>

          <div className='EventPlace'>
            <div style={{width: '50%', display: 'flex'}}>
              <PlaceIcon style={{height: '100%', paddingBottom: '12px', marginRight: 5}}/>
              <h4 style={{ fontSize: '14px', margin: 0}}>
                {`${eventInfo.location_name}`} <br />
                {/* <HomeWorkIcon style={{verticalAlign: 'top'}}/> */}
                { eventInfo.street ? `${eventInfo.street} ` : ""} <br />
                {/* <MapIcon style={{verticalAlign: 'top'}}/> */}
                {`${eventInfo.city}, ${eventInfo.state}`}
              </h4>
            </div>
            <div style={{width: '50%'}}>
              <MapsApi 
                street={eventInfo.street}
                city={eventInfo.city}
                state={eventInfo.state}
                longitude={eventInfo.longitude}
                latitude={eventInfo.latitude}
                itemId={eventInfo.event_id}
                page='events'
                client={client}
                pageLoaded={true}
              />
            </div>
          </div>
          {/* {
            user && user.sub === eventInfo.user_auth0_id ? 
            <EventActivity info={eventInfo}/>
            :
            ""
          } */}
      <hr />

    </div>
  );
}
