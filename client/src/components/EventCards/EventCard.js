import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
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

//Event Moments
import EventMomentsWrapper from 'components/EventMoments/EventMomentsWrapper.js';

//Style
import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

//Images
// import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import LoadImage from 'material-ui-image'

//import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';



//Queries
import {
  MUTATION_EVENT_IMPRESSION,
  MUTATION_LIKE_EVENT,
  MUTATION_UNLIKE_EVENT,
  FETCH_EVENT_LIKES_REPOSTS,
  REFETCH_EVENT_LIKES,
  MUTATION_REPOST_EVENT,
  MUTATION_UNPOST_EVENT,
  REFETCH_EVENT_REPOSTS,
  QUERY_FILTERED_EVENT,
  FETCH_FOLLOWING_FEED,
  MUTATION_EVENT_SAVE,
  MUTATION_EVENT_UNDO_SAVE
} from "../../EventQueries/EventQueries";

require("./EventCard.css")

// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

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

// Reload the blogs and likes every time an event card gets loaded, this is to update the amount
//  whenever the user goes between tabs since apollo doesn't update until page i refreshed.



export default function EventCard({event, client, userId, filter, currentDate, listType}) {
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

      likeAmount: event.event_like_aggregate.aggregate.count,
      usersLiked: event.event_like,
      ifLiked: event.event_like.some(user  => user.user_id === userId) ? "secondary" : "inherit",

      repostAmount: event.shared_event_aggregate.aggregate.count,
      usersReposted: event.shared_event,
      ifReposted: event.shared_event.some(user  => user.user_id === userId) ? "primary" : "inherit",

      ifSaved: event.user_saved_events.some(user  => user.user_id === userId) ? true : false,

      name: event.name ? event.name : "",
      description: event.description ? event.description : "",
      category: event.category ? event.category : "No Category",
      image_id: event.image ? event.image.image_uuid : "cover_images/uzhvjyuletkpvrz5itxv",
      image_url: cloudinary.url(event.image.image_uuid, {secure: true, width: 800, height: 533, crop: "fill" ,fetch_format: "auto", quality: "auto"}),
      
      price: event.price,

      start_date:  event.event_date ? moment(event.event_date.start_date, "YYYY-MM-DD") : "No Date",
      end_date: event.event_date ? moment(event.event_date.end_date, "YYYY-MM-DD") : "No Date",
      start_time: moment(event.start_time, "HH:mm:ss"),
      end_time: event.end_time ? moment(event.end_time, "HH:mm:ss") : null,

      isRecurring: event.event_date ? event.event_date.is_recurring : false,
      weekday: event.event_date ? event.event_date.weekday : "",
      
      username: event.user ? event.user.name : "",


      //Get Profile Picture UUID and call image with cloudinary
      userProfilePic: event.user ? cloudinary.url(event.user.picture, {secure: true, width: 32, height: 32, crop: "fill"}) : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      userId: event.user ? event.user.id : 0,
      user_auth0: event.user ? event.user.auth0_id : null
    })


    
    // Handling event likes + reposts + saves
    const handleRepost = () => {
      console.log('Repost!')

      if(values.ifReposted !== "inherit") {
        client.mutate({
          mutation: MUTATION_UNPOST_EVENT,
          refetchQueries: [{
            query: listType === "following" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT
          }],
          variables: {
            eventId: event.id,
            userId: userId
          }
        }).then((data) => {
          console.log('UnPost!: ', data)
          setValues({
            ...values,
            ifReposted: "inherit",
            repostAmount: (values.repostAmount - 1)
          })
        })
      }
      else {
        client.mutate({
          mutation: MUTATION_REPOST_EVENT,
          refetchQueries: [{
            query: listType === "following" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT
          }],
          variables: {
            eventId: event.id,
            userId: userId,
            objects: {
              user_id: values.user_auth0,
              activity_type: 1,
              source_id: event.id,
              other_user_id: userId
            }
          }
        }).then((data) => {
          console.log('Repost!: ', data)
          setValues({
            ...values,
            ifReposted: "primary",
            repostAmount: (values.repostAmount + 1)
          })
        })
      }
    }

    const handleLike = () => {

      if(values.ifLiked !== "inherit") {
        client.mutate({
          mutation: MUTATION_UNLIKE_EVENT,
          refetchQueries: [{
            query: listType === "following" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT
          }],
          variables: {
            eventId: event.id,
            userId: userId
          }
        }).then((data) => {
          console.log('UnLike!: ', data)
          setValues({
            ...values,
            ifLiked: "inherit",
            likeAmount: (values.likeAmount - 1)
          })
        })
      }
      else {
        client.mutate({
          mutation: MUTATION_LIKE_EVENT,
          refetchQueries: [{
            query: listType === "following" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT
          }],
          variables: {
            eventId: event.id,
            userId: userId,
            objects: {
              user_id: values.user_auth0,
              activity_type: 0,
              source_id: event.id,
              other_user_id: userId
            }
          }
        }).then((data) => {
          console.log('Like!: ', data)
          setValues({
            ...values,
            ifLiked: "secondary",
            likeAmount: (values.likeAmount + 1)
          })
        })
      }
    }

    const handleSave = () => {
      if(values.ifSaved === true) {
        client.mutate({
          mutation: MUTATION_EVENT_UNDO_SAVE,
          refetchQueries: [{
            query: listType === "following" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT
          }],
          variables: {
            eventId: event.id,
            userId: userId
          }
        }).then((data) => {
          console.log('Unsave!: ', data)
          setValues({
            ...values,
            ifSaved: false,
          })
        })
      }
      else {
        client.mutate({
          mutation: MUTATION_EVENT_SAVE,
          refetchQueries: [{
            query: QUERY_FILTERED_EVENT
          }],
          variables: {
            eventId: event.id,
            userId: userId
          }
        }).then((data) => {
          console.log('Save!: ', data)
          setValues({
            ...values,
            ifSaved: true,
          })
        })
      }
    }


    // Adding Impress
    const addImpression = () => {
      client.mutate({
        mutation: MUTATION_EVENT_IMPRESSION,
        variables: {
          eventId: event.id
        }
      })
    }

    useEffect(() => {
      addImpression();

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
      setValues({
        ...values,
        description: eventBio
      })
    }, [])

    // Setting Display Variables    
    //let displayDate = "";
    // if(values.isRecurring) {
    //   if(values.weekday.includes("1")) {
    //     displayDate += "Mon";
    //   }
    //   if(values.weekday.includes("2")) {
    //     if(displayDate.length > 0) {
    //       displayDate += " "
    //     }
    //     displayDate += "Tue";
    //   }
    //   if(values.weekday.includes("3")) {
    //     if(displayDate.length > 0) {
    //       displayDate += " "
    //     }
    //     displayDate += "Wed";
    //   }
    //   if(values.weekday.includes("4")) {
    //     if(displayDate.length > 0) {
    //       displayDate += " "
    //     }
    //     displayDate += "Thur";
    //   }
    //   if(values.weekday.includes("5")) {
    //     if(displayDate.length > 0) {
    //       displayDate += " "
    //     }
    //     displayDate += "Fri";
    //   }
    //   if(values.weekday.includes("6")) {
    //     if(displayDate.length > 0) {
    //       displayDate += " "
    //     }
    //     displayDate += "Sat";
    //   }
    //   if(values.weekday.includes("0")) {
    //     if(displayDate.length > 0) {
    //       displayDate += " "
    //     }
    //     displayDate += "Sun";
    //   }
    // }
    //else {
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
    //}


    // While on the following feed, we display information about
    //  who posted, shared, or is going to the event.
    let followFeedInfo = ""
    if(listType === "following") {
      followFeedInfo = (
        <h4>
          {event.shared_event.length >= 1 ? event.shared_event[0].user.name : ""} Created an event
        </h4>
      )
    }

    // Rendering Card
    return(
      <ThemeProvider theme={theme}>

      <Grow in={true}>
        <Card blog style={{border: "2px solid darkgrey"}} raised>  
          <CardHeader image style={{marginBottom: -30}}>
            <Link to={`/events/${event.id}`}>
              <LoadImage color='white' src={values.image_url} aspectRatio={3/2}/>
            </Link>

              <div className={classes.imgCardOverlay} style={{display: 'inline-block',width: '100%'}}>
                {displayCornerDate}
                <div className='saveButton' onClick={handleSave}>
                  {
                    values.ifSaved === true ? <TurnedInIcon fontSize='small'/>
                      :
                      <TurnedInNotIcon fontSize='small'/>
                  }
                </div>

                <Link to={`/users/${values.userId}`}>
                  <div
                    className={classes.cardTitle}
                    style={{
                      color: "#02C39A",
                      position: "absolute",
                      bottom: "15px",
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
          </CardHeader>

            <CardBody style={{paddingBottom: 0}}>
            
              {/* {followFeedInfo} */}

              <Link to={`/events/${event.id}`}>
                <h3 style={{margin: '5px 0px 0px 0px', textAlign: "center"}}>{values.name}</h3>
              </Link>
              {/* <EventMomentsWrapper 
                eventId={event.id}
                cover={values.image_url}
                client={client}
                type={type}
                //ifGoing={values.ifGoing}
              /> */}
              <hr style={{margin: 2}}/>

              <div style={{width: '100%', textAlign: 'left'}}>
                <div style={{fontSize: 16}}>
                  <div style={{position: 'absolute', right: 40,  textShadow: "-1px 1px #02C39A"}}>
                    {values.price === "$0.00" ? "Free" : values.price}
                  </div>
                  
                  <AccessAlarmIcon fontSize='small' style={{verticalAlign: 'top'}}/>
                  {` ${values.start_time.format("h:mma")}`}
                  {values.end_time ? ` - ${values.end_time.format("h:mma")}` : ""}
                </div>
                
              </div>

              <div style={{textAlign: 'left'}}>
                <p style={{display: 'inline', width: '100%', fontSize: 16}}>
                  <PlaceIcon color="secondary" fontSize='small' style={{verticalAlign: 'top'}} />
                  {` ${event.location_name}`}
                </p>
              </div>

              <p style={{textAlign: 'left', fontSize: '12px', lineHeight: 1.2, marginTop: 5}}>
                {values.description}
              </p>
            </CardBody>

            <CardFooter style={{paddingBottom: 5}}>
              <Info style={{textAlign: 'left'}}>
                <h6 color='rose' className={classes.cardCategory}>{values.category.toUpperCase()}</h6>
              </Info>
              <div style={{position: 'absolute',right: 15}}>
                <IconButton onClick={handleRepost} aria-label="Share" style={{float: 'left', margin: 0}}>
                  <RenewIcon color={values.ifReposted}/> 
                  <div style={{fontSize: 14}}>
                    {values.repostAmount}
                  </div>
                </IconButton>
                <IconButton onClick={handleLike} aria-label="Like" style={{float: 'right'}}>
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