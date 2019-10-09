import React, { useEffect } from 'react'

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





import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

import {
  MUTATION_EVENT_IMPRESSION,
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

export default function EventCard({event, client}) {
    const classes = useStyles();

    /*
    *   Error checking the returned values before using them
    *
    *           Values:
    * id
    * name
    * description
    * event_type
    * event_date
    * start_time
    * end_time
    * category
    * city
    * state
    * image {
    *   url
    * }
    * user {
    *   name
    * }
    * event_like_aggregate {
      aggregate {
        count
      }
    }
    */
   console.log("Likes: ", event.event_like_aggregate.aggregate.count)

    const ifRepost = true ? "primary" : "";
    const ifLiked = true ? "secondary" : "";

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
    }, [])
    
    return(
      <ThemeProvider theme={theme}>
        <Card blog>  
          <CardHeader image>
            <Link to={`/event#${holdName}_${event.id}`}>
              <img
                className={classes.imgCard}
                src={holdURL}
                alt={holdName}
              />
              <div className={classes.imgCardOverlay}>
                <h4
                  className={classes.cardTitle}
                  style={{
                    color: "white",
                    position: "absolute",
                    bottom: "10px",
                    left: "15px"
                  }}
                >
                </h4>
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
                <IconButton aria-label="Share" style={{float: 'left', margin: 0}}>
                  <RenewIcon color={ifRepost}/> 
                </IconButton>
                <IconButton aria-label="Like" style={{float: 'right'}}>
                  <FavoriteIcon color={ifLiked}/>
                </IconButton>
              </div>
            </CardFooter>

        </Card>
        </ThemeProvider>
    )
}