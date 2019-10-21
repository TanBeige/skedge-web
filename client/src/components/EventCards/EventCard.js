import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
// @material-ui/icons
import FormatAlignLeft from "@material-ui/icons/FormatAlignLeft";
import FavoriteIcon from '@material-ui/icons/Favorite'
import RenewIcon from '@material-ui/icons/Autorenew'
import IconButton from '@material-ui/core/IconButton';
import PlaceIcon from '@material-ui/icons/Place';


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
import Badge from 'components/Badge/Badge.js'

import axios from 'axios'
import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react';



import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

import {
  MUTATION_EVENT_IMPRESSION,
  MUTATION_LIKE_EVENT,
  MUTATION_UNLIKE_EVENT,
  FETCH_EVENT_LIKES_REPOSTS,
  REFETCH_EVENT_LIKES,
  MUTATION_REPOST_EVENT,
  MUTATION_UNPOST_EVENT,
  REFETCH_EVENT_REPOSTS
} from "../../EventQueries/EventQueries";

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



export default function EventCard({event, client, userId}) {
    const classes = useStyles();

    const usernameStyle= {
      float: 'right',
      borderRadius: 5,  
      backgroundColor: "white", 
      color: "#02C39A",
      padding: '0px 10px', 
      // WebkitTextStroke: 0.5, 
      // WebkitTextStrokeColor: "black",
      border: '2px solid #02C39A',
      marginTop: 7,
      marginLeft: 5
    }

    
    const bioMaxLength = 70;


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
      username: event.user ? event.user.name : "", 
      userProfilePic: event.user ? event.user.picture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      userId: event.user ? event.user.id : 0
    })


    
    // Handling event likes + reposts
    const handleRepost = () => {
      console.log('Repost!')

      if(values.ifReposted !== "inherit") {
        client.mutate({
          mutation: MUTATION_UNPOST_EVENT,
          refetchQueries: [{
            query: REFETCH_EVENT_REPOSTS,
            variables: {
              eventId: event.id
            }
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
            query: REFETCH_EVENT_REPOSTS,
            variables: {
              eventId: event.id
            }
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
      if(values.ifLiked !== "inherit") {
        client.mutate({
          mutation: MUTATION_UNLIKE_EVENT,
          refetchQueries: [{
            query: REFETCH_EVENT_LIKES,
            variables: {
              eventId: event.id
            }
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
            query: REFETCH_EVENT_LIKES,
            variables: {
              eventId: event.id
            }
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


    /*
    *   Error checking the returned values before using them
    */
    // Check Event Name
    // let holdName = "";
    // if(!event.name) {
    //   holdName = <i>Unnamed</i>
    // }
    // else {
    //   holdName = event.name;
    // }
    // // Edit Description Display
    // let eventBio = event.description;
  
    // if(eventBio === "" || !eventBio) {
    //   eventBio = <i>There is no bio.</i>
    // }
    // else if(eventBio.length > bioMaxLength) {
    //     eventBio = eventBio.substring(0, bioMaxLength);
    //     eventBio += "..."
    // }

    // // Check Event Category
    // let holdCategory = "";
    // if(!event.category) {
    //   holdCategory = "Unknown"
    // }
    // else {
    //   holdCategory = event.category;
    // }

    // //Change image URL if it doesn't exists
    // let holdURL = "";
    // if(!event.image.image_uuid) {
    //   holdURL = "cover_images/vs7s8bqpf9bz2qdzfpo8.png"
    // }
    // else {
    //   holdURL = event.image.image_uuid;
    // }

    // // Error Check if event user exists ()
    // let holdUserName = ""
    // let holdProfilePic = ""
    // let holdUserId;
    // if(!event.user) {
    //   holdUserName = "Unknown User";
    //   holdProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    //   holdUserId = 0;
    
    // }
    // else {
    //   holdUserName = event.user.name;
    //   holdProfilePic = event.user.picture
    //   holdUserId = event.user.id;
  
    // }

    const addImpression = () => {
      client.mutate({
        mutation: MUTATION_EVENT_IMPRESSION,
        variables: {
          eventId: event.id
        }
      })
    }
    // const getLikesReposts = () => {
    //   client.query({
    //     query: FETCH_EVENT_LIKES_REPOSTS,
    //     variables: {
    //       eventId: event.id
    //     }
    //   }).then((data) => {
    //     setValues({
    //       ...values,
    //       likeAmount: data.data.events[0].event_like_aggregate.aggregate.count,
    //       usersLiked: data.data.events[0].event_like,
    //       ifLiked: data.data.events[0].event_like.some(user  => user.user_id === userId) ? "secondary" : "inherit",

    //       repostAmount: data.data.events[0].shared_event_aggregate.aggregate.count,
    //       usersReposted: data.data.events[0].shared_event,
    //       ifReposted: data.data.events[0].shared_event.some(user  => user.user_id === userId) ? "primary" : "inherit",
    //     })
    //   })
    // }

    useEffect(() => {
      addImpression();

      //Edit Bio
      let eventBio = ""
      if(values.description === "" || !values.description) {
          eventBio = <i>There is no bio.</i>
      }
      else if(values.description.length > bioMaxLength) {
          eventBio = values.description.substring(0, bioMaxLength);
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
    
    return(
      <ThemeProvider theme={theme}>
        <Card blog style={{border: "2px solid darkgrey"}} raised>  
          <CardHeader image>
            <Link to={`/events/${event.id}`}>
              {/* <img
                className={classes.imgCard}
                src={holdURL}
                alt={holdName}
              /> */}
              <Image cloudName="skedge" publicId={values.image_id} secure="true" alt={values.name}>
                <Transformation height="400" width="400" fetchFormat="jpg" crop='fill' quality="auto"/>
              </Image>
            </Link>

              <div className={classes.imgCardOverlay}>
                <Link to={`/users/${values.userId}`}>
                  <h5
                    className={classes.cardTitle}
                    style={{
                      color: "#02C39A",
                      position: "absolute",
                      bottom: "10px",
                      left: "15px",
                    }}
                  >
                    <Avatar style={{float:'left'}} alt={values.username} src={values.userProfilePic}/>
                    <div style={usernameStyle}>
                      @{values.username}
                    </div>
                  </h5>
                </Link>
              </div>
          </CardHeader>

            <CardBody>
              <h3><strong>{values.name}</strong></h3>
              <p>
                {values.description}
              </p>
              <h5>
                <PlaceIcon color="error" fontSize='small' style={{verticalAlign: 'top'}} />
                {`${event.location_name}`}
              </h5>
            </CardBody>
            <CardFooter>
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