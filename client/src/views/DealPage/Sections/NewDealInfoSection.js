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

export default function DealInfoSection({ dealInfo, client }) {

  let _isMounted = true;

  const { user, loginWithRedirect, loginWithPopup } = useAuth0();

  const classes = useStyles();
  const imgClasses = classNames(
    classes.imgRaised,
    classes.imgRounded,
    classes.imgFluid
  );

  // Mutate Deals Buttons
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
      action: 'Login/Sign Up: Deal Page'
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
  if(dealInfo.start_time) {
    formattedStartTime = moment(dealInfo.start_time, "HH:mm:ss");
  }
  
  //style={{borderRadius: 5, backgroundColor: "#02C39A", color: 'white'}}
  let formattedEndTime = ""
  if(dealInfo.end_time) {
    formattedEndTime = moment(dealInfo.end_time, "HH:mm:ss")
  }
  let formattedDate = ""
  if(dealInfo.is_recurring) {
    // Setting Display Variables    
    let displayDate = "Every ";
    if(dealInfo.weekday.includes("1")) {
      displayDate += "Mon.";
    }
    if(dealInfo.weekday.includes("2")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Tues.";
    }
    if(dealInfo.weekday.includes("3")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Wed.";
    }
    if(dealInfo.weekday.includes("4")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Thur.";
    }
    if(dealInfo.weekday.includes("5")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Fri.";
    }
    if(dealInfo.weekday.includes("6")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Sat.";
    }
    if(dealInfo.weekday.includes("0")) {
      if(displayDate.length > 6) {
        displayDate += " "
      }
      displayDate += "Sun.";
    }

    //displayDate += `until ${dealInfo.end_date}`
    formattedDate = displayDate;
    
  }
  else {
    formattedDate = moment(dealInfo.start_date, "YYYY-MM-DD").format("MMMM Do, YYYY")
  }

  const userLink = `/${dealInfo.user_name}`

  const timePaper= {
    margin: '0 0.4em'
  }


  return (
    <div >
      {/* <GridContainer justify="center"> */}
        {/* <GridItem xs={12} sm={10} md={10}> */}
            <div className='DealTitle'>
              <h3 className='DealName'>{dealInfo.name}</h3>
              
              <h4 className='DealCreator'>
                By: 
              </h4>

                {' '}
                <Link to={userLink}>
                  {/* <Avatar style={{float: 'left', border: '0.5px solid #02C39A', height: 20, width: 20, margin: '0px 5px'}} width={24} alt={values.username} src={dealInfo.user_pic}/>                     */}
                  {` ${dealInfo.user_name}`}
                </Link>
              
            </div>
            <div className='DealDateTime'>
              <Paper style={timePaper} elevation={0} className='DealDate'>
                <TodayIcon style={{height: '100%'}}/>
                <h4 style={{margin: '0 5px', fontSize: '1em', alignSelf: 'center', fontWeight: '400'}}>
                  {formattedDate}
                </h4>
              </Paper>
              <Paper style={timePaper} elevation={0} className='DealDate'>
                <AccessAlarmIcon style={{height: '100%'}}/>
                <h4 style={{margin: 5, fontSize: '1em', alignSelf: 'center', fontWeight: '400'}}>
                  {moment(formattedStartTime).format("h:mmA")}
                  {dealInfo.end_time ? ` - ${moment(formattedEndTime).format("h:mmA")}` : ""}
                </h4>
              </Paper>
            </div>
            {/* <div>
                    HOW MUCH TIME IS LEFT UNTIL THE DEAL ENDS/ CURRENT ONGOING DEALS
            </div> */}
            <div className='DealDescription'>
              <Paper  elevation={0} square>
                <Collapse in={expandDetails} collapsedHeight='14vh' timeout="auto">
                  <div style={{margin: '0px 0.5em'}}>
                    
                    <p className={expandDetails ?  "NotFadingOut": "FadingOut"} style={{wordWrap: 'break-word', whiteSpace: "pre-line"}}>
                      <b>Details: </b>{dealInfo.description}
                    </p>
                    <div style={{display:'inline-flex', width: '100%'}}>
                      {
                        dealInfo.web_url && dealInfo.web_url !== "" ?
                        <div><a href={ dealInfo.web_url.includes("https://") || dealInfo.web_url.includes("http://") ? dealInfo.web_url : `//${dealInfo.web_url}`} target='_blank'><Button color='primary'  size='sm'>Link to deal</Button></a></div> : ""
                      }
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

          <div className='DealPlace'>
            <div style={{width: '50%', display: 'flex'}}>
              <PlaceIcon style={{height: '100%', paddingBottom: '12px', marginRight: 5}}/>
              <h4 style={{ fontSize: '14px', margin: 0}}>
                {`${dealInfo.location_name}`} <br />
                {/* <HomeWorkIcon style={{verticalAlign: 'top'}}/> */}
                { dealInfo.street ? `${dealInfo.street} ` : ""} <br />
                {/* <MapIcon style={{verticalAlign: 'top'}}/> */}
                {`${dealInfo.city}, ${dealInfo.state}`}
              </h4>
            </div>
            <div style={{width: '50%'}}>
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
            </div>
          </div>
          {/* {
            user && user.sub === dealInfo.user_auth0_id ? 
            <EventActivity info={dealInfo}/>
            :
            ""
          } */}
      <hr />

    </div>
  );
}
