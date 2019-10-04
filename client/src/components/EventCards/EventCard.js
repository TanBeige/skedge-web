import React from 'react';
import { Link } from 'react-router-dom'
// @material-ui/icons
import FormatAlignLeft from "@material-ui/icons/FormatAlignLeft";
// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core/styles";

import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

const useStyles = makeStyles(sectionPillsStyle);

export default function EventCard({event}) {
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
    
    return(
        <Card
            raised
            background
            style={{ backgroundImage: "url(" + holdURL + ")" }}
        >  
          <Link to={`/event#${holdName}_${event.id}`}>
            <CardBody background>
              <h6 className={classes.category}>{holdCategory.toUpperCase()}</h6>
                <h3 className={classes.cardTitle}>
                  {holdName}
                </h3>
              <p className={classes.category}>
                {eventBio}
              </p>
            </CardBody>
          </Link>

        </Card>
    )
}