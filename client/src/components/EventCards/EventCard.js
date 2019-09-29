import React from 'react';
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
    
    return(
        <Card
            raised
            background
            style={{ backgroundImage: "url(" + event.image.url + ")" }}
        >  
            <CardBody background>
              <h6 className={classes.category}>{event.category.toUpperCase()}</h6>
              <a href="#pablo">
                <h3 className={classes.cardTitle}>
                  {event.name}
                </h3>
              </a>
              <p className={classes.category}>
                {eventBio}
              </p>
              <Button round href="#pablo" color="danger">
                <FormatAlignLeft className={classes.icons} /> Read article
              </Button>
            </CardBody>
        </Card>
    )
}