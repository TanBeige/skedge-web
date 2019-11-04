import React, { useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useAuth0 } from 'Authorization/react-auth0-wrapper';
// @material-ui/icons
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Quote from "components/Typography/Quote.js";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TodayIcon from '@material-ui/icons/Today';
import PlaceIcon from '@material-ui/icons/Place';
import LocationCityIcon from '@material-ui/icons/LocationCity';
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
    ifGoing: eventInfo.ifGoing,
    ifSaved: eventInfo.ifSaved
  })

  //Handle Event Going
  const goingToEvent = () => {
    // Change to Not Going To Event
    if(values.ifGoing) {
      client.mutate({
        mutation: MUTATION_EVENT_UNDO_GOING,
        refetchQueries: [{
          query: REFETCH_EVENT_GOING,
          variables: {
            eventId: eventInfo.event_id,
          }
        }],
        variables: {
          eventId: eventInfo.event_id,
          userId: user.sub
        }
      }).then(() => {
        setValues({
          ...values,
          ifGoing: false,
        })
      })
    }
    // Change to Going To Event
    else {
      client.mutate({
        mutation: MUTATION_EVENT_GOING,
        refetchQueries: [{
          query: REFETCH_EVENT_GOING,
          variables: {
            eventId: eventInfo.event_id
          }
        }],
        variables: {
          eventId: eventInfo.event_id,
          userId: user.sub
        }
      }).then(() => {
        setValues({
          ...values,
          ifGoing: true
        })
      })
    }
  }
  // Handle Event Saving
  const saveEvent = () => {
    // Change to Not Saving To Event
    if(values.ifSaved) {
      client.mutate({
        mutation: MUTATION_EVENT_UNDO_SAVE,
        refetchQueries: [{
          query: REFETCH_EVENT_SAVES,
          variables: {
            eventId: eventInfo.event_id,
          }
        }],
        variables: {
          eventId: eventInfo.event_id,
          userId: user.sub
        }
      }).then(() => {
        setValues({
          ...values,
          ifSaved: false,
        })
      })
    }
    else {
    // Change to Saving To Event
      client.mutate({
        mutation: MUTATION_EVENT_SAVE,
        refetchQueries: [{
          query: REFETCH_EVENT_SAVES,
          variables: {
            eventId: eventInfo.event_id
          }
        }],
        variables: {
          eventId: eventInfo.event_id,
          userId: user.sub
        }
      }).then(() => {
        setValues({
          ...values,
          ifSaved: true
        })
      })
    }
  }

  let goingButton = "";
  if(!values.ifGoing){ //going to event) {
    goingButton = <Button color="primary" onClick={goingToEvent} style={{margin: '0px 10px', width: '40%'}}>Go!</Button>
  }
  else {
    goingButton = <Button color="info" onClick={goingToEvent} style={{margin: '0px 10px', width: '40%'}}>Don't Go!</Button>
  }

  let saveButton = "";
  if(!values.ifSaved) {
    saveButton = <Button color="rose" onClick={saveEvent} style={{margin: '0px 10px', width: '40%'}}>Save</Button>
  }
  else {
    saveButton = <Button color="info" onClick={saveEvent} style={{margin: '0px 10px', width: '40%'}}>Unsave</Button>
  }

  // Fix date formatting
  var moment = require('moment');
  let formattedStartTime = ""
  if(eventInfo.start_time) {
    formattedStartTime = moment(eventInfo.start_time, "HH:mm:ss");
  }
  
  //style={{borderRadius: 5, backgroundColor: "#02C39A", color: 'white'}}
  let formattedEndTime = ""
  if(eventInfo.end_time) {
    const tempEndTime = moment(eventInfo.start_time, "HH:mm:ss")
    formattedEndTime = (
      <h3 style={{marginTop: 0}}>
        Until: {moment(tempEndTime).format("h:mm A")}
      </h3>
    )
  }
  let formattedDate = ""
  if(eventInfo.event_date) {
    formattedDate = moment(eventInfo.event_date, "YYYY-MM-DD")
  }

  return (
    <div className={classes.section} style={{paddingTop: 15}}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={8} md={8}>
          <div style={{textAlign: 'center'}}>
            <h2>
              <TodayIcon fontSize='large' style={{verticalAlign: 'middle'}}/>
              {moment(formattedDate).format("MMMM D, YYYY")}
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
            {goingButton}
            {saveButton}
          </div>
          <h3 className={classes.title}>
            Details
          </h3>
          <p>
            {eventInfo.description}
          </p>
          <h4>
            <PlaceIcon style={{verticalAlign: 'top'}}/>
            {`${eventInfo.street}`} <br />
            <LocationCityIcon style={{verticalAlign: 'top'}}/>
            {`${eventInfo.city}, ${eventInfo.state}`}
          </h4>
        </GridItem>
      </GridContainer>
    </div>
  );
}
