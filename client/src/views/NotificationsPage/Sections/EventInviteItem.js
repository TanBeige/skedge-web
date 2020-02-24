/*!

=========================================================
* Material Kit PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/



// import React, { Fragment } from "react";
// // @material-ui/core components
// import { makeStyles } from "@material-ui/core/styles";
// // @material-ui icons
// import DeleteIcon from '@material-ui/icons/Delete';
// import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import IconButton from '@material-ui/core/IconButton';

// // core components
// import Card from "components/Card/Card.js";
// import CardBody from "components/Card/CardBody.js";
// import Button from "components/CustomButtons/Button.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import GridItem from "components/Grid/GridItem.js";

// import imagesStyles from "assets/jss/material-kit-pro-react/imagesStyles.js";

// import { cardTitle } from "assets/jss/material-kit-pro-react.js";

// // Fade in image when loads
// import LoadImage from 'material-ui-image'

// const style = {
//   ...imagesStyles,
//   cardTitle
// };

// const useStyles = makeStyles(style);

// export default function EventInviteItem(props) {
//     const classes = useStyles();

//     return(
//         <Fragment>
//             <GridItem xs={12} md={6} lg={4}>
//                 <Card>
//                     {/* <img
//                         style={{ height: "180px", width: "100%", display: "block" }}
//                         className={classes.imgCardTop}
//                         src={cloudinary.url(props.eventItem.event.image.image_uuid, {secure: true, height: 180, crop: "fill" ,fetch_format: "auto", quality: "auto"})}
//                     /> */}
//                     <LoadImage 
//                         color='white' 
//                         style={{ height: "100px", width: "100%", display: "block" }}
//                         className={classes.imgCardTop}
//                         src={cloudinary.url(props.eventItem.event.image.image_uuid, {secure: true, height: 180, crop: "fill" ,fetch_format: "auto", quality: "auto"})}
//                         aspectRatio={3/2}
//                         alt='event cover'
//                     />

//                     <CardBody>
//                         <h4 className={classes.cardTitle}>{props.eventItem.event.name}</h4>
//                         <IconButton color="primary" edge="end" aria-label="accept">
//                             <CheckCircleOutlineIcon fontSize='large'/>
//                         </IconButton>
//                         <IconButton edge="end" aria-label="delete" >
//                             <DeleteIcon fontSize='large'/>
//                         </IconButton>
//                     </CardBody>
//                 </Card>
//             </GridItem>
//         </Fragment>
//     )
// }

import React from "react";
// @material-ui/core components
import { Link } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles";
// @material-ui icons
import Subject from "@material-ui/icons/Subject";
import WatchLater from "@material-ui/icons/WatchLater";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Avatar from '@material-ui/core/Avatar';

import cardsStyle from "assets/jss/material-kit-pro-react/views/componentsSections/sectionCards.js";

import {
    MUTATION_EVENT_RESPONSE
} from 'EventQueries/EventQueries.js'
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';


const style = {
  ...cardsStyle
};

// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(style);

export default function EventInviteItem(props) {
    const classes = useStyles();
    const bioMaxLength = 100;
    const { user } = useAuth0();


    const handleEventResponse = (response) => {
        //If response is 2 it means declined, 1 means going
        props.client.mutate({
            mutation: MUTATION_EVENT_RESPONSE,
            variables: { 
                invitedId: user.sub,
                eventId: props.eventItem.event.id,
                inviterId: props.eventItem.inviter.auth0_id,
                response: response
            }
        }).then(() => {
            //IDK yet, maybe notification?
        })
    }


    //Edit Bio
    let eventBio = ""
    if(props.eventItem.event.description === "" || !props.eventItem.event.description) {
        eventBio = ""
    }
    else if(props.eventItem.event.description.length > bioMaxLength) {
        eventBio += props.eventItem.event.description.substring(0, bioMaxLength);
        eventBio += "..."
    }
    else {
        eventBio = props.eventItem.event.description;
    }

    // Event Date:

    //Event Type (Local? Private? Invite Only? etc...)
    //cont type = props.eventItem.event.event_type

    const inviterPicture = cloudinary.url(props.eventItem.inviter.picture, {secure: true, height: 32, width: 32, crop: "fill" ,fetch_format: "auto", quality: "auto"})

    const eventUrl = `/events/${props.eventItem.event.id}-${encodeURI(props.eventItem.event.name)}`;

    if(!props.eventItem.event) {
        return "";
    }
    else {
        return (
                <Card
                background
                style={{
                    margin: 20,
                    backgroundImage: `url(${cloudinary.url(props.eventItem.event.image.image_uuid, {secure: true, height: 180, crop: "fill" ,fetch_format: "auto", quality: "auto"})})`,
                }}
                >
                    <CardBody background style={{paddingTop: '10px', paddingBottom: '10px', minHeight: '100px'}}>
                        <Link to={eventUrl}>
                            <h3 className={classes.cardTitleWhite}>
                                {props.eventItem.event.name}
                            </h3>
                            <p className={classes.cardDescriptionWhite}>
                                {eventBio}
                            </p>
                        </Link>
                        <Link to={`/${props.eventItem.inviter.name}`}>
                            <Button simple color="white">
                                <Avatar src={inviterPicture} style={{float:'left', border: '1px solid #02C39A', height: 24, width: 24, marginRight: 3}} width={24} alt={props.eventItem.inviter.name} />
                                Invited by: {props.eventItem.inviter.name}
                            </Button>
                        </Link>
                        <div>
                            <IconButton onClick={() => handleEventResponse(1)} color="primary" edge="end" aria-label="accept">
                                Going? <CheckCircleOutlineIcon fontSize='large'/>
                            </IconButton>
                            <IconButton onClick={() => handleEventResponse(2)} color='secondary' edge="end" aria-label="delete" >
                                <HighlightOffIcon fontSize='large'/>
                            </IconButton>
                        </div>
                    </CardBody>
                </Card>
        );
    }
}