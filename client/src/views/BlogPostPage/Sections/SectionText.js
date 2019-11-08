import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useAuth0 } from 'Authorization/react-auth0-wrapper';

import GoingSaveButtons from './EventPageComponents/GoingSaveButtons.js'
// @material-ui/icons
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Quote from "components/Typography/Quote.js";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TodayIcon from '@material-ui/icons/Today';
import PlaceIcon from '@material-ui/icons/Place';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import Button from 'components/CustomButtons/Button.js'
// style components
import sectionTextStyle from "assets/jss/material-kit-pro-react/views/blogPostSections/sectionTextStyle.js";

// Queries
import {
  MUTATION_EVENT_SAVE,
  MUTATION_EVENT_UNDO_SAVE,
  REFETCH_EVENT_SAVES,
  MUTATION_EVENT_GOING,
  MUTATION_EVENT_UNDO_GOING,
  REFETCH_EVENT_GOING,
  FETCH_EVENT_INFO,
  FETCH_EVENT_GOING_SAVE,
} from 'EventQueries/EventQueries.js'


const useStyles = makeStyles(sectionTextStyle);

export default function SectionText({ eventInfo, client }) {

  const { user } = useAuth0();

  const classes = useStyles();
  const imgClasses = classNames(
    classes.imgRaised,
    classes.imgRounded,
    classes.imgFluid
  );

  // Mutate Events Buttons
  const [values, setValues] = useState({
    ifGoing: false,
    ifSaved: false
  })


  // Getting new queries so we can refetch
  const getUserGoingSave = () => {
    client.query({
      query: FETCH_EVENT_GOING_SAVE,
      variables: {
        eventId: eventInfo.event_id,
        userId: user.sub
      }
    }).then((data) => {
      console.log("going save data:", data)
      const isGoing = data.data.users[0].event_goings.length === 1
      const isSaved = data.data.users[0].user_saved_events.length === 1
      setValues({
        ...values,
        ifGoing: isGoing,
        ifSaved: isSaved
      })
    })
  }

  useEffect(() => {
    getUserGoingSave();
  },[])
  console.log("going or not,", values)

  

  // Fix date formatting
  var moment = require('moment');
  let formattedStartTime = ""
  if(eventInfo.start_time) {
    formattedStartTime = moment(eventInfo.start_time, "HH:mm:ss");
  }
  
  //style={{borderRadius: 5, backgroundColor: "#02C39A", color: 'white'}}
  let formattedEndTime = ""
  if(eventInfo.end_time) {
    const tempEndTime = moment(eventInfo.end_time, "HH:mm:ss")
    formattedEndTime = (
      <h3 style={{marginTop: 0}}>
        Until: {moment(tempEndTime).format("h:mm A")}
      </h3>
    )
  }
  let formattedDate = ""
  if(eventInfo.start_date) {
    formattedDate = moment(eventInfo.start_date, "YYYY-MM-DD").format("MMMM D, YYYY")
  }

  return (
    <div className={classes.section} style={{paddingTop: 15}}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={8} md={8}>
          <div style={{textAlign: 'center'}}>
            <h2>
              <TodayIcon fontSize='large' style={{verticalAlign: 'middle'}}/>
              {formattedDate}
            </h2>
            <div>
              <h3 style={{marginTop: 0}}>
                Starts at: {moment(formattedStartTime).format("h:mm A")}
              </h3>
              {formattedEndTime}
            </div>
          </div>
          <hr />
          <div style={{display: 'inline-block', width: "100%", textAlign: 'center'}}>
            <GoingSaveButtons 
              ifGoing={values.ifGoing}
              ifSaved={values.ifSaved}
              client={client}
              eventId={eventInfo.event_id}
            />
          </div>
          <h3 className={classes.title}>
            Details
          </h3>
          <p>
            {eventInfo.description}
          </p>
          <h4>
            <PlaceIcon style={{verticalAlign: 'top'}}/>
            {`${eventInfo.location_name}`} <br />
            <HomeWorkIcon style={{verticalAlign: 'top'}}/>
            {`${eventInfo.street} `} <br />
            <LocationCityIcon style={{verticalAlign: 'top'}}/>
            {`${eventInfo.city}, ${eventInfo.state}`}
          </h4>
        </GridItem>
      </GridContainer>
    </div>
  );
}
