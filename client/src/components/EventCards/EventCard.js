import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
// @material-ui/icons
import FormatAlignLeft from "@material-ui/icons/FormatAlignLeft";
import FavoriteIcon from '@material-ui/icons/Favorite'
import RenewIcon from '@material-ui/icons/Autorenew'
import IconButton from '@material-ui/core/IconButton';
import PlaceIcon from '@material-ui/icons/Place';
import TodayIcon from '@material-ui/icons/Today';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from 'components/Card/CardFooter';
import CardActions from '@material-ui/core/CardActions';
import Button from "components/CustomButtons/Button.js";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import Info from "components/Typography/Info.js";
import Warning from "components/Typography/Warning.js";
import Success from 'components/Typography/Success.js'
import Rose from 'components/Typography/Rose.js'
import Fab from '@material-ui/core/Fab';
import { ThemeProvider } from '@material-ui/styles';
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';
import Badge from 'components/Badge/Badge.js';

//Style
import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

//Images
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import LoadImage from 'material-ui-image'


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
  QUERY_FILTERED_EVENT
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
    }
  },
});

// Reload the blogs and likes every time an event card gets loaded, this is to update the amount
//  whenever the user goes between tabs since apollo doesn't update until page i refreshed.



export default function EventCard({event, client, userId, filter, currentDate}) {
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

    

    // Setting Event Info
    const [values, setValues] = useState({

      likeAmount: event.event_like_aggregate.aggregate.count,
      usersLiked: event.event_like,
      ifLiked: event.event_like.some(user  => user.user_id === userId) ? "secondary" : "inherit",

      repostAmount: event.shared_event_aggregate.aggregate.count,
      usersReposted: event.shared_event,
      ifReposted: event.shared_event.some(user  => user.user_id === userId) ? "primary" : "inherit",


      name: event.name ? event.name : "",
      description: event.description ? event.description : "",
      category: event.category ? event.category : "No Category",
      image_id: event.image ? event.image.image_uuid : "cover_images/uzhvjyuletkpvrz5itxv",
      image_url: cloudinary.url(event.image.image_uuid, {secure: true, width: 600, height: 400, crop: "fill" ,fetch_format: "auto", quality: "auto"}),
      start_date: moment(event.event_date[0].start_date, "YYYY-MM-DD"),
      end_date: moment(event.event_date[0].end_date, "YYYY-MM-DD"),
      start_time: moment(event.start_time, "HH:mm:ss"),
      end_time: event.end_time ? moment(event.end_time, "HH:mm:ss") : null,

      isRecurring: event.event_date[0].is_recurring,
      weekday: event.event_date[0].weekday,
      
      username: event.user ? event.user.name : "", 
      userProfilePic: event.user ? event.user.picture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      userId: event.user ? event.user.id : 0
    })

    
    // Handling event likes + reposts
    const handleRepost = () => {
      console.log('Repost!')

      let cat = filter.category;
      if(filter.category == "Any") {
        cat = ""
      }

      if(values.ifReposted !== "inherit") {
        client.mutate({
          mutation: MUTATION_UNPOST_EVENT,
          refetchQueries: [{
            query: QUERY_FILTERED_EVENT
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
            query: QUERY_FILTERED_EVENT
          }],
          variables: {
            eventId: event.id,
            userId: userId
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

      let cat = filter.category;
      if(filter.category == "Any") {
        cat = ""
      }

      if(values.ifLiked !== "inherit") {
        client.mutate({
          mutation: MUTATION_UNLIKE_EVENT,
          refetchQueries: [{
            query: QUERY_FILTERED_EVENT
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
            query: QUERY_FILTERED_EVENT
          }],
          variables: {
            eventId: event.id,
            userId: userId
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
      const displayMonth = moment(currentDate).format("MMM")
      const displayDay = moment(currentDate).format("D")
    //}

    // Rendering Card
    return(
      <ThemeProvider theme={theme}>
        <Card blog style={{border: "2px solid darkgrey"}} raised>  
          <CardHeader image style={{marginBottom: -30}}>
            <Link to={`/events/${event.id}`}>
              {/* <img
                className={classes.imgCard}
                src={holdURL}
                alt={holdName}
              /> */}
              <LoadImage src={values.image_url} aspectRatio={3/2}/>
                {/* <Image cloudName="skedge" publicId={values.image_id} secure="true" alt={values.name}>
                  <Transformation height="400" width="600" fetchFormat="jpg" crop='fill' quality="auto"/>
                </Image> */}
            </Link>

              <div className={classes.imgCardOverlay} style={{display: 'inline-block',width: '100%'}}>
                <div
                  style={{
                    color: "#02C39A",
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
                    
                  }}
                >
                  {/* <TodayIcon /> < br /> */}
                  <h5 style={{margin: 0, padding: 0, fontSize: 12, fontWeight: "600"}}>{displayMonth}</h5>
                  <h5 style={{margin: '-5px 0px -2px 0px', fontSize: 12, fontWeight: "600"}}>{displayDay}</h5>
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
              <Link to={`/events/${event.id}`}>
                <h3 style={{margin: '5px 0px 0px 0px', textAlign: "center"}}>{values.name}</h3>
              </Link>
              
              <hr style={{margin: 2}}/>

              <div style={{width: '100%', textAlign: 'left'}}>
                <p style={{fontSize: 16}}>
                  <AccessAlarmIcon fontSize='small' style={{verticalAlign: 'top'}}/>
                  {` ${values.start_time.format("h:mma")}`}
                  {values.end_time ? ` - ${values.end_time.format("h:mma")}` : ""}
                </p>
              </div>

              <div style={{textAlign: 'left'}}>
                <p style={{display: 'inline', width: '100%', fontSize: 16}}>
                  <PlaceIcon color="error" fontSize='small' style={{verticalAlign: 'top'}} />
                  {`${event.location_name}`}
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
        </ThemeProvider>
    )
}