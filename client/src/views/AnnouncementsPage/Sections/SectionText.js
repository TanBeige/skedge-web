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

export default function SectionText({ announcementInfo, client }) {

  let _isMounted = true;

  const { loginWithRedirect } = useAuth0();

  const classes = useStyles();

  //Record if the user signs up/in
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


  useEffect(() => {
    _isMounted = true;

    return () => {
      _isMounted = false;
    }
  },[announcementInfo])

  return(
    <div>
      <div className='AnnouncementTitle'>
          <h2 className='AnnouncementName'>{announcementInfo.name}</h2>
      </div>
      <div className='AnnouncementDescription'>
        <h4 style={{wordWrap: 'break-word', whiteSpace: "pre-line"}}>
          {announcementInfo.description}
        </h4>
      </div>
      <div>
        {
          announcementInfo.attached_deals.map(deal => {
            return (
              <h2>{deal.deal.name}</h2>
            )
          })
        }
      </div>
    </div>
  );
}