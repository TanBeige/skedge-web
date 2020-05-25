import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// style components
import sectionTextStyle from "assets/jss/material-kit-pro-react/views/blogPostSections/sectionTextStyle.js";
//Auth0 Wrapper
import { useAuth0 } from 'Authorization/react-auth0-wrapper';
import Button from "components/CustomButtons/Button.js";
import AppleIcon from '@material-ui/icons/Apple';
import IconButton from '@material-ui/core/IconButton';

import ItemCard from './ItemCard.js';
//Google Analytics
import ReactGA from 'react-ga';
import DealCard from "components/Deals/DealCard.js";

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

  const clickedDownload = () => {
    ReactGA.event({
        category: 'User',
        action: 'CLICKED_DOWNLOAD_APP'
    });
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
          <h2 style={{textAlign: 'center'}} className='AnnouncementName'>{announcementInfo.name}</h2>
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
      <div style={{margin: 'auto', maxWidth: 500}}>
        {
          announcementInfo.attached_events.map(event => {
            return (
              <div key={event.event.id} style={{margin: '0 2em 2em 2em'}}>
                <ItemCard
                  itemType="event"
                  itemId={event.event.id}
                  name={event.event.name}
                  picId={event.event.image.image_uuid}
                />
                <p style={{ fontSize: 16, wordWrap: 'break-word', whiteSpace: "pre-line"}}>{event.description}</p>
                <br />
                <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1" onClick={() => clickedDownload()}>
                  <p style={{fontSize: 16}}>*To save or redeem this deal, download our app.*</p>
                </a>
              </div>
            )
          })
        }
        {
          announcementInfo.attached_deals.map((deal, index) => {
            return (
              <div key={deal.deal.id} style={{margin: '0 2em 2em 2em'}}>
                  <ItemCard
                    itemType="deal"
                    itemId={deal.deal.id}
                    name={deal.deal.name}
                    picId={deal.deal.cover_pic}
                  />
                  <div style={{display: 'inline-flex'}}>
                    <p style={{fontSize: 16, marginRight: 5, marginTop: 0, marginBottom: 0}}>{announcementInfo.attached_deals.length - index}.</p>
                    <p style={{fontSize: 16}}>{deal.description}</p>                    
                  </div>

                  {/* <div style={{display: 'inline-flex'}}> */}
                  <a href="https://apps.apple.com/us/app/skedge/id1506618749?ls=1" onClick={() => clickedDownload()}>
                    <p style={{fontSize: 16, color:"#00A896", float: 'right'}}>*Redeem In App*</p>
                  </a>
                  {/* <IconButton color="primary" aria-label="add to shopping cart">
                    <AppleIcon />
                  </IconButton> */}
                  {/* </div> */}
                  {/* <Button round style={{float: 'right'}} color='primary' onClick={clickedDownload}></Button> */}
              </div>
            )
          })
        }
      </div>
      {
        announcementInfo.attached_events === "deal"
      }
    </div>
  );
}