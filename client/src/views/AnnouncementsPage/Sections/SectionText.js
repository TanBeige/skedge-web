import React, { useState, useEffect, Fragment } from "react";
import { Link } from 'react-router-dom';

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// style components
import sectionTextStyle from "assets/jss/material-kit-pro-react/views/blogPostSections/sectionTextStyle.js";
//Auth0 Wrapper
import Button from "components/CustomButtons/Button.js";
import AppleIcon from '@material-ui/icons/Apple';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
import RedeemButton from 'components/RedeemButton.js';

import ItemCard from './ItemCard.js';
//Google Analytics
import ReactGA from 'react-ga';
import DealCard from "components/Deals/DealCard.js";

const useStyles = makeStyles(sectionTextStyle);

export default function SectionText({ announcementInfo, client }) {

  let _isMounted = true;

  const { user, loginWithRedirect, isAuthenticated} = useAuth0();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  const clickedDownload = () => {
    ReactGA.event({
        category: 'User',
        action: 'CLICKED_DOWNLOAD_APP'
    });
  }
  const handleClose = () => {
    setAnchorEl(null);
};

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const clickRedeem = (event, url) => {
    if(isAuthenticated) {
      window.location.href = url
    }
    else {
      setAnchorEl(event.currentTarget);
      console.log("Not Logged In");
    }
  }


  useEffect(() => {
    _isMounted = true;

    return () => {
      _isMounted = false;
    }
  },[announcementInfo])

  var moment = require('moment');


  return(
    <div style={{maxWidth: 500, margin: 'auto'}}>
      <div className='AnnouncementTitle'>
          <h2 style={{fontSize: '24px',textAlign: 'center'}} className='AnnouncementName'>{announcementInfo.name}</h2>
      </div>
      <div className='AnnouncementDescription'>
        <h4 style={{fontSize: '0.9em', margin: '0 1em 0 1em'}}>
          By Skedge <span style={{float: 'right', color: 'gray'}}> {moment(announcementInfo.date, "YYYY-MM-DD").format("MMMM Do, YYYY")} </span>
          {/* <br /> */}
          {/* {announcementInfo.city}, {announcementInfo.state} */}
        </h4>
        {
          announcementInfo.description && (
          <h4 style={{wordWrap: 'break-word', whiteSpace: "pre-line", margin: '1em 0 2em 0'}}>
            {announcementInfo.description}
          </h4>
          )
        }
      </div>
      <div style={{margin: 'auto', maxWidth: 500, marginTop: '1em'}}>
        {
          announcementInfo.attached_deals.map((deal, index) => {
            return (
              <div key={deal.deal.id} style={{}}>
                  <ItemCard
                    itemType="deal"
                    itemId={deal.deal.id}
                    name={deal.deal.name}
                    picId={deal.deal.cover_pic}
                    location_name={deal.deal.location_name}
                  />
                  <div style={{display: 'inline-flex'}}>

                    <h3 style={{fontSize: 32,fontWeight: '400', marginTop: 8, margin: '6px 0.2em 6px 0.3em', float: 'left'}}>{announcementInfo.attached_deals.length - index}</h3>

                    <div style={{margin: '6px 0.5em 0px 0.5em', fontWeight: 400}}>
                      <p style={{fontSize: 18}}>{deal.deal.name}</p>
                      <p style={{fontSize: 14, color: 'grey'}}>{deal.deal.location_name}</p>
                    </div>
                  </div>


                  <div  style={{textAlign: 'center', width: '100%'}}>
                    <div style={{marginBottom: 6}}>
                      <RedeemButton 
                        client={client}
                        phone_number={deal.deal.phone_number} 
                        web_url={deal.deal.web_url} 
                        city={deal.deal.city} 
                        state={deal.deal.state} 
                        street={deal.deal.street}

                        deal_name={deal.deal.name}
                        description={deal.deal.description}
                        location_name={deal.deal.location_name}
                        picId={deal.deal.cover_pic}
        
                      />
                    </div>
                  </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}