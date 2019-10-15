import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
// @material-ui/icons
import FormatAlignLeft from "@material-ui/icons/FormatAlignLeft";
import FavoriteIcon from '@material-ui/icons/Favorite'
import RenewIcon from '@material-ui/icons/Autorenew'
import IconButton from '@material-ui/core/IconButton';

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
import Fab from '@material-ui/core/Fab';
import { ThemeProvider } from '@material-ui/styles';
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';




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

    const [values, setValues] = useState({

      usersLiked: [],
      usersReposted: [],

      ifLiked: "inherit",
      likeAmount: event.event_like_aggregate.aggregate.count,
      
      ifReposted: "inherit",
      repostAmount: event.shared_event_aggregate.aggregate.count,
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

    console.log("Liked users: ",event.event_like);
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
    let holdName = "";
    if(!event.name) {
      holdName = <i>Unnamed</i>
    }
    else {
      holdName = event.name;
    }

    // Edit Description Display
    const bioMaxLength = 70;
    let eventBio = event.description;
  
    if(eventBio === "" || !eventBio) {
      eventBio = <i>There is no bio.</i>
    }
    else if(eventBio.length > bioMaxLength) {
        eventBio = eventBio.substring(0, bioMaxLength);
        eventBio += "..."
    }

    // Check Event Category
    let holdCategory = "";
    if(!event.category) {
      holdCategory = "Unknown"
    }
    else {
      holdCategory = event.category;
    }

    //Change image URL if it doesn't exists
    let holdURL = "";
    if(!event.image.url) {
      holdURL = "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3900&q=80"
    }
    else {
      holdURL = event.image.url;
    }

    // Error Check if event user exists ()
    let holdUserName = ""
    let holdProfilePic = ""
    console.log("eveeeent : ", event)
    if(!event.user) {
      holdUserName = "Unknown User";
      holdProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }
    else {
      holdUserName = event.user.name;
      holdProfilePic = event.user.picture
    }

    const addImpression = () => {
      client.mutate({
        mutation: MUTATION_EVENT_IMPRESSION,
        variables: {
          eventId: event.id
        }
      })
    }
    const getLikesReposts = () => {
      client.query({
        query: FETCH_EVENT_LIKES_REPOSTS,
        variables: {
          eventId: event.id
        }
      }).then((data) => {
        console.log("like stuff: ", data.data.events[0].event_like.some(user  => user.user_id === userId))
        setValues({
          ...values,
          likeAmount: data.data.events[0].event_like_aggregate.aggregate.count,
          usersLiked: data.data.events[0].event_like,
          ifLiked: data.data.events[0].event_like.some(user  => user.user_id === userId) ? "secondary" : "inherit",

          repostAmount: data.data.events[0].shared_event_aggregate.aggregate.count,
          usersReposted: data.data.events[0].shared_event,
          ifReposted: data.data.events[0].shared_event.some(user  => user.user_id === userId) ? "primary" : "inherit",
        })
      })
    }

    useEffect(() => {
      addImpression();
      getLikesReposts();
      console.log(values)
    }, [])
    
    return(
      <ThemeProvider theme={theme}>
        <Card blog>  
          <CardHeader image>
            <Link to={`/events/${event.id}`}>
              <img
                className={classes.imgCard}
                src={holdURL}
                alt={holdName}
              />
              <div className={classes.imgCardOverlay}>
                <h5
                  className={classes.cardTitle}
                  style={{
                    color: "#02C39A",
                    position: "absolute",
                    bottom: "10px",
                    left: "15px",
                  }}
                >
                  <Avatar style={{float:'left'}} alt={holdUserName} src={holdProfilePic}/>
                  <div style={usernameStyle}>
                    {holdUserName}
                  </div>
                </h5>
              </div>
            </Link>
          </CardHeader>

            <CardBody>
              <h3><strong>{holdName}</strong></h3>
              <p>
                {eventBio}
              </p>
              
            </CardBody>
            <CardFooter>
              <Info style={{textAlign: 'left'}}>
                <h6 className={classes.cardCategory}>{holdCategory.toUpperCase()}</h6>
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