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

// Date/Time
var moment = require('moment');

const useStyles = makeStyles(sectionPillsStyle);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    },
    secondary: {
      main: pink[600]
    },
    error: {
      main: "#F5DA5F"
    }
  },
});

// Reload the shares and likes every time an event card gets loaded, this is to update the amount
//  whenever the user goes between tabs since apollo doesn't update until page i refreshed.

export default function EventCard({event, client, userId, currentDate, listType, username}) {
    const classes = useStyles();
    const bioMaxLength = 100;

    //Styling Card
    const usernameStyle= {
      float: 'right',
      borderRadius: 8,  
      backgroundColor: "rgba(255,255,255,1.0)", 
      color: "#02C39A",
      padding: '0px 5px', 
      fontSize: 12,
      // WebkitTextStroke: 0.5, 
      // WebkitTextStrokeColor: "black",
      border: '1px solid #02C39A',
      marginLeft: 3,
      //marginTop: "10px",
    }

    const timeStyle = {
      display: "inline",
      textAlign: 'center',
      borderRadius: 3,  
      backgroundColor: "#02C39A", 
      color: "white",
      padding: '0px 5px', 
      //fontSize: 12,
      // WebkitTextStroke: 0.5, 
      // WebkitTextStrokeColor: "black",
      border: '1px solid #02C39A',
      marginLeft: 3,
      //marginTop: "10px",
    }

    const dateStyle = {
      //color: "#02C39A",
      textAlign: 'center',
      position: "absolute",
      //display: 'inline',
      top: "3px",
      left: "0px",
      borderRadius: 3,  
      backgroundColor: "#02C39A", 
      color: "white",
      padding: '0px 8px 0px 8px', 
      border: '1px solid #02C39A',
      marginLeft: 3,
      lineHeight: 0,
    }


    

    // Setting Event Info
    const [values, setValues] = useState({

      likeAmount: 0,
      usersLiked: [],
      ifLiked: "secondary",

      repostAmount: 0,
      usersReposted: [],
      ifReposted: "primary",

      ifSaved: false,

      name: event.name ? event.name : "",
      description: event.description ? event.description : "",
      category: event.categories[0],
      image_id: event.image ? event.image.image_uuid : "cover_images/uzhvjyuletkpvrz5itxv",
      image_url: "",
      
      price: event.price,

      start_time: moment(event.start_time, "HH:mm:ss"),
      end_time: event.end_time ? moment(event.end_time, "HH:mm:ss") : null,

      isRecurring: event.event_date ? event.event_date.is_recurring : false,
      weekday: event.event_date ? event.event_date.weekday : "",
      
      username: event.user ? event.user.name : "",


      //Get Profile Picture UUID and call image with cloudinary
      userProfilePic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      userId: event.user ? event.user.id : 0,
      user_auth0: event.user ? event.user.auth0_id : null
    })

    useEffect(() => {
      //Edit Bio
      let eventBio = ""
      if(values.description === "" || !values.description) {
          eventBio = <i>There is no bio.</i>
      }
      else if(values.description.length > bioMaxLength) {
        eventBio += values.description.substring(0, bioMaxLength);
        eventBio += "..."
      }
      else {
        eventBio = values.description;
      }

      let reader = new FileReader();
      let tempUrl = "";
      reader.onloadend = () => {
        tempUrl = reader.result;
        setValues({
            ...values,
            image_url: tempUrl,
            description: eventBio,

        })

      };
      reader.readAsDataURL(event.image_file);

    }, [])

    // Date displayed on the top-left corner of the date
    let displayCornerDate = ""
    if(currentDate) {
      const displayMonth = moment(currentDate).format("MMM")
      const displayDay = moment(currentDate).format("D")

      displayCornerDate = (
        <div style={dateStyle}>
          <h5 style={{margin: 0, padding: 0, fontSize: 12, fontWeight: "600"}}>{displayMonth}</h5>
          <h5 style={{margin: '-5px 0px -2px 0px', fontSize: 12, fontWeight: "600"}}>{displayDay}</h5>
        </div>
      )
    }


    // While on the following feed, we display information about
    //  who posted, shared, or is going to the event.
    let imgMargin = '0.5em 0.5em 0em 0.5em'
    let shareInfo = ""

  
    // Style of the cover image div
    let coverImgStyle= {
      position: 'relative', 
      margin: imgMargin, 
      borderRadius: 3, 
      overflow: 'hidden',
      border: '1px solid lightgray'
    }

    // Rendering Card
    return(
      <ThemeProvider theme={theme}>
        <Grow in={true}>
          <Card style={{border: "2px solid darkgrey", marginTop: 5}} raised>  
            {/* <CardHeader image style={{marginBottom: -30}}> */}
            <div style={{margin: 'auto'}}>
              {shareInfo}
            </div>

            <div style={coverImgStyle}>
                <LoadImage className={classes.imgCardTop} color='white' imageStyle={{objectFit: 'cover'}} src={values.image_url} aspectRatio={2/1}/>

                <div className={classes.imgCardOverlay} style={{width: '100%'}}>
                  {displayCornerDate}
                  <div className='saveButton' >
                    {
                      values.ifSaved === true ? <TurnedInIcon fontSize='small'/>
                        :
                        <TurnedInNotIcon fontSize='small'/>
                    }
                  </div>

                    <div
                      // className={classes.cardTitle}
                      style={{
                        color: "#02C39A",
                        position: "absolute",
                        bottom: "0px",
                        left: "6px",
                      }}
                    >
                      <Avatar style={{float:'left', border: '1px solid #02C39A', height: 32, width: 32}} width={32} alt={username} src={values.userProfilePic}/>
                      <h5 style={usernameStyle}>
                        @{username}
                      </h5>
                    </div>
                </div>
            </div>
            {/* </CardHeader> */}

              <CardBody style={{padding: '0px 15px'}}>
                {/* <Link to={`/events/${event.id}`}> */}
                  <h3 style={{margin: '5px 0px 0px 0px', textAlign: "center", fontSize: '1.5em'}}>{values.name}</h3>
                {/* </Link> */}
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
                      {values.price === "$0.00" ? "Free" : `$${values.price}`}
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
                  <IconButton  aria-label="Share" style={{padding: 6}}>
                    <RenewIcon color={values.ifReposted}/> 
                    <div style={{fontSize: 14}}>
                      {values.repostAmount}
                    </div>
                  </IconButton>
                  <IconButton  aria-label="Like" style={{padding: 6}}>
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