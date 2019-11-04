import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// import  from "@material-ui/icons/";
import PlayForWorkIcon from '@material-ui/icons/PlayForWork';

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
    limit: 4
  }
  
  return (
    <div className={classes.section} style={{padding: 10, marginTop: -100}}>
      <h2 className={classes.title} style={{margin:  0, padding: 0, color: "#02C39A"}}><PlayForWorkIcon fontSize='large' style={{fontSize: 50}}/></h2>
      
      <GridContainer style={{padding: 0, marginTop: -50}}>
        <GridItem xs={12} sm={12} md={12} >
          <Card profile plain className={classes.card3} style={{marginBottom: 0}}>
            <EventCardList 
              client={client}
              filter={filter}
              listType="home"
            />
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
