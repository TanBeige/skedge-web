import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import FormatAlignLeft from "@material-ui/icons/FormatAlignLeft";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import EventCardList from "components/EventCards/EventCardList.js"

import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

const useStyles = makeStyles(sectionPillsStyle);

export default function SectionPills(props) {
  const classes = useStyles();

  // 0 is local, 1 is exclusive
  const [values, setValues] = useState({
    event_type: 0
  })

  const handleEventType = (index) => {
    console.log(values.event_type)
    setValues({
      ...values,
      event_type: index
    });
  }

  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8} className={classes.textCenter}>
          <NavPills
            alignCenter
            active={values.event_type}
            onChange={handleEventType}
            tabs={[
              {
                tabButton: "Local",
                tabContent: "Events For The Public."
              },
              {
                tabButton: "Exclusive",
                tabContent: "Events By Friends, Invites, or You."
              },
            ]}
          />
          <div className={classes.tabSpace} />
        </GridItem>
      </GridContainer>

      <EventCardList 
        client={props.client}
      />
    </div>
  );
}
