import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import _ from 'lodash';
// @material-ui/icons
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import StarIcon from '@material-ui/icons/Star';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RenewIcon from '@material-ui/icons/Autorenew'
import IconButton from '@material-ui/core/IconButton';
import PlaceIcon from '@material-ui/icons/Place';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import TurnedInTwoToneIcon from '@material-ui/icons/TurnedInTwoTone';
import CreateIcon from '@material-ui/icons/Create';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from 'components/Card/CardFooter';
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import Info from "components/Typography/Info.js";
import { ThemeProvider } from '@material-ui/styles';
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';
// import Badge from 'components/Badge/Badge.js';

//Notification Popups
import { store } from 'react-notifications-component';


//Event Moments
import EventMomentsWrapper from 'components/EventMoments/EventMomentsWrapper.js';

//Style
import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

//Images
// import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import LoadImage from 'material-ui-image'

//import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';



export default function DealCard({ dealInfo, client, date }) {

    return(
        <ThemeProvider theme={theme}>
          <Grow in={true}>
            <Card style={{border: "2px solid darkgrey", marginTop: 5}} raised>  
              {/* <CardHeader image style={{marginBottom: -30}}> */}
              <div style={{margin: 'auto'}}>
                {shareInfo}
              </div>
  
              <div style={coverImgStyle}>
                <Link to={`/events/${event.id}`}>
                  <LoadImage className={classes.imgCardTop} color='white' src={values.image_url} aspectRatio={2/1}/>
                </Link>
  
                  <div className={classes.imgCardOverlay} style={{width: '100%'}}>
                    {displayCornerDate}
                    <div className='saveButton' onClick={handleSave}>
                      {
                        values.ifSaved === true ? <TurnedInIcon fontSize='small'/>
                          :
                          <TurnedInNotIcon fontSize='small'/>
                      }
                    </div>
  
                    <Link to={`/${values.username}`}>
                      <div
                        // className={classes.cardTitle}
                        style={{
                          color: "#02C39A",
                          position: "absolute",
                          bottom: "0px",
                          left: "6px",
                        }}
                      >
                        <Avatar style={{float:'left', border: '1px solid #02C39A', height: 32, width: 32}} width={32} alt={values.username} src={values.userProfilePic}/>
                        <h5 style={usernameStyle}>
                          @{values.username}
                        </h5>
                      </div>
                    </Link>
                  </div>
              </div>
              {/* </CardHeader> */}
  
                <CardBody style={{padding: '0px 15px'}}>
                
                  {/* {followFeedInfo} */}
  
                  <Link to={`/events/${event.id}`}>
                    <h3 style={{margin: '5px 0px 0px 0px', textAlign: "center", fontSize: '1.5em'}}>{values.name}</h3>
                  </Link>
                  {/* <EventMomentsWrapper 
                    eventId={event.id}
                    cover={values.image_url}
                    client={client}
                    type={type}
                    //ifGoing={values.ifGoing}
                  /> */}
                  <hr style={{margin: 2}}/>
  
                  <div style={{fontSize: 14}}>
                    <div style={{width: '100%', textAlign: 'left'}}>
                      <div style={{position: 'absolute', right: 20,  textShadow: "-1px 1px #02C39A"}}>
                        {values.price === "$0.00" ? "Free" : values.price}
                      </div>
                      
                      <AccessAlarmIcon fontSize='small' style={{verticalAlign: 'top'}}/>
                      {` ${values.start_time.format("h:mma")}`}
                      {values.end_time ? ` - ${values.end_time.format("h:mma")}` : ""}
                    </div>
                    
                    <div style={{textAlign: 'left'}}>
                      <p style={{display: 'inline', width: '100%'}}>
                        <PlaceIcon color="secondary" fontSize='small' style={{verticalAlign: 'top'}} />
                        {` ${event.location_name}`}
                      </p>
                    </div>
                  </div>
  
  
                  <p style={{textAlign: 'left', fontSize: '12px', lineHeight: 1.2, marginTop: 5}}>
                    {values.description}
                  </p>
                </CardBody>
  
                <CardFooter style={{padding: '0rem 1rem'}}>
                  <Info style={{textAlign: 'left'}}>
                    <h6 color='rose' className={classes.cardCategory}>{values.category.toUpperCase()}</h6>
                  </Info>
                  <div style={{position: 'absolute',right: 15}}>
                    <IconButton onClick={handleRepost} aria-label="Share" style={{padding: 6}}>
                      <RenewIcon color={values.ifReposted}/> 
                      <div style={{fontSize: 14}}>
                        {values.repostAmount}
                      </div>
                    </IconButton>
                    <IconButton onClick={handleLike} aria-label="Like" style={{padding: 6}}>
                      <FavoriteIcon color={values.ifLiked}/>
                      <div style={{fontSize: 14}}>
                        {values.likeAmount}
                      </div> 
                    </IconButton>
                  </div>
                </CardFooter>
            </Card>
          </Grow>
        </ThemeProvider>
      )
}