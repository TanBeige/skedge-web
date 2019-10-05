import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// import  from "@material-ui/icons/";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import EventCardList from "components/EventCards/EventCardList.js"

import teamsStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/teamsStyle.js";
import teamStyle from "assets/jss/material-kit-pro-react/views/landingPageSections/teamStyle.js";

const style = {
  ...teamsStyle,
  ...teamStyle,
  justifyContentCenter: {
    justifyContent: "center"
  }
};

const useStyles = makeStyles(style);

export default function SectionTeam({client}) {
  const classes = useStyles();
  const filter = {
    searchText: "", //Search Text can look for Event Names, Tags, or Event Creators!
    type: "local",
    category: "",
    city: "",
    state: "",
    limit: 3
  }
  
  return (
    <div className={classes.section}>
      <h2 className={classes.title}>Find Local Events</h2>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6}>
            <Card profile plain className={classes.card3}>
              <EventCardList 
                client={client}
                filter={filter}
              />
            </Card>
          </GridItem>
          </GridContainer>
      </div>
    </div>
  );
}
