import React, {Fragment, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";

import PageTitle from 'components/PageItems/PageTitle.js';
import PageDateTime from 'components/PageItems/PageDateTime.js';
import PageDescription from 'components/PageItems/PageDescription.js';
import PageLocation from 'components/PageItems/PageLocation.js';

import RedeemButton from 'components/RedeemButton.js';
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
    loginWithRedirect({});
    // loginWithPopup({});
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

  return(
    <div>
      <PageTitle 
        name={dealInfo.name}
        user_name={dealInfo.user_name}
        location={dealInfo.location_name}
      />
      <PageDateTime 
        start_date={dealInfo.start_date} 
        start_time={dealInfo.start_time}
        end_time={dealInfo.end_time}
        is_recurring={dealInfo.is_recurring}
        weekday={dealInfo.weekday}
      />
      <PageDescription 
        pageType="deals"
        description={dealInfo.description}
        web_url={dealInfo.web_url}
        category={dealInfo.category}
        point_1={dealInfo.point_1}
        point_2={dealInfo.point_2}
        phone_number={dealInfo.phone_number}
      />
      {/* <PageLocation 
        location_name={dealInfo.location_name}
        street={dealInfo.street} 
        city={dealInfo.city} 
        state={dealInfo.state} 
        longitude={dealInfo.longitude} 
        latitude={dealInfo.latitude}
        event_id={dealInfo.deal_id} 
        client={client} 
        pageType="deals"
      /> */}
      <div style={{textAlign: 'right', margin: '0 0.5em'}}>
        <RedeemButton client={client} phone_number={dealInfo.phone_number} web_url={dealInfo.web_url} />
      </div>

    </div>
  );
}
