import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import PageTitle from 'components/PageItems/PageTitle.js';
import PageDateTime from 'components/PageItems/PageDateTime.js';
import PageDescription from 'components/PageItems/PageDescription.js';
import PageLocation from 'components/PageItems/PageLocation.js';

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";


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

  const { loginWithPopup } = useAuth0();

  const classes = useStyles();

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
  },[eventInfo])

  return(
    <div>
      <PageTitle 
        name={eventInfo.name}
        user_name={eventInfo.user_name}
      />
      <PageDateTime 
        start_date={eventInfo.start_date} 
        start_time={eventInfo.start_time}
        end_time={eventInfo.end_time}
        is_recurring={eventInfo.is_recurring}
        weekday={eventInfo.weekday}
      />
      <PageDescription 
        pageType="events"
        description={eventInfo.description}
        web_url={eventInfo.web_url}
        category={eventInfo.category}
      />
      <PageLocation 
        location_name={eventInfo.location_name}
        street={eventInfo.street} 
        city={eventInfo.city} 
        state={eventInfo.state} 
        longitude={eventInfo.longitude} 
        latitude={eventInfo.latitude}
        event_id={eventInfo.event_id} 
        client={client} 
        pageType="events"
      />
    </div>
  );
}