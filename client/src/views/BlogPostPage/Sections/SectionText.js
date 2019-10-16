import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Quote from "components/Typography/Quote.js";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TodayIcon from '@material-ui/icons/Today';
import PlaceIcon from '@material-ui/icons/Place';
import LocationCityIcon from '@material-ui/icons/LocationCity';
// core components

import blog4 from "assets/img/examples/blog4.jpg";
import blog3 from "assets/img/examples/blog3.jpg";
import blog1 from "assets/img/examples/blog1.jpg";

import sectionTextStyle from "assets/jss/material-kit-pro-react/views/blogPostSections/sectionTextStyle.js";
import { textAlign } from "@material-ui/system";

const useStyles = makeStyles(sectionTextStyle);

export default function SectionText({ eventInfo }) {
  const classes = useStyles();
  const imgClasses = classNames(
    classes.imgRaised,
    classes.imgRounded,
    classes.imgFluid
  );

  var moment = require('moment');
  let formattedStartTime = ""
  if(eventInfo.start_time) {
    formattedStartTime = moment(eventInfo.start_time, "HH:mm:ss+-HH");
  }
  let formattedEndTime = ""
  if(eventInfo.end_time) {
    const tempEndTime = moment(eventInfo.start_time, "HH:mm:ss+-HH")
    formattedEndTime = (
      <h3 style={{marginTop: 0}}>
        Until: 
        <div style={{borderRadius: 5, backgroundColor: "#02C39A", color: 'white'}}>
          {moment(tempEndTime).format("h:mm A")}
        </div>
      </h3>
    )
  }
  let formattedDate = ""
  if(eventInfo.event_date) {
    console.log("Event Date: ", eventInfo.event_date);
    formattedDate = moment(eventInfo.event_date, "YYYY-MM-DD")
    console.log("formatted date: ", formattedDate)
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
            <h3 style={{marginTop: 0}}>
              Starts at: 
              <div style={{borderRadius: 5, backgroundColor: "#02C39A", color: 'white'}}>
                {moment(formattedStartTime).format("h:mm A")}
              </div>
            </h3>
            {formattedEndTime}
          </div>
          <hr />
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
