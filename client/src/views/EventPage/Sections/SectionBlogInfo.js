import React from "react";
import { Link } from "react-router-dom"
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Badge from "components/Badge/Badge.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";

import profileImage from "assets/img/faces/card-profile1-square.jpg";

import sectionBlogInfoStyle from "assets/jss/material-kit-pro-react/views/blogPostSections/sectionBlogInfoStyle.js";

const useStyles = makeStyles(sectionBlogInfoStyle);

export default function SectionBlogInfo({eventInfo}) {
  const classes = useStyles();

  let insertCohosts = ""
  if(eventInfo.event_cohosts.length > 0) {
    insertCohosts = (
            <Card plain profile className={classes.card}>
              <GridContainer>
              {
                eventInfo.event_cohosts.map((cohost, index) => {
                  return(
                      <GridItem xs={6} sm={3} md={3} key={index}>
                        <CardAvatar plain profile style={{width: "60%"}}>
                          <Link to={`/users/${cohost.cohost.id}`}>
                            <img src={cohost.cohost.picture} alt={cohost.cohost.name} />
                          </Link>
                        </CardAvatar>
                        <Link to={`/users/${cohost.cohost.id}`}>
                          <h4 className={classes.cardTitle} style={{textAlign: 'center', color: "#02C39A"}}>{cohost.cohost.name}</h4>
                        </Link>
                      </GridItem>
                  )
                })
              }
            </GridContainer>
          </Card>
    )
  } 

  return (
    <div>
      <GridContainer justify="center" style={{paddingBottom: 10}}>
        <GridItem xs={12} sm={10} md={8}>
          {/* <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <div className={classes.blogTags}>
                Tags: {` `}
                {
                  eventInfo.event_tags.map((tag, index) => {
                    return <Badge key={index} color="primary">{tag.tag.name}</Badge>
                  })
                }
              </div>
            </GridItem>
          </GridContainer> */}
          <hr />
          {/* <h2 style={{textAlign: 'center'}}>Hosts</h2>
          <Card plain profile className={classes.card} >
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <CardAvatar plain profile>
                  <Link to={`/users/${eventInfo.user_id}`}>
                    <img src={eventInfo.user_pic} alt={eventInfo.user_name} />
                  </Link>
                </CardAvatar>
                <Link to={`/users/${eventInfo.user_id}`}>
                  <h3 className={classes.cardTitle} style={{textAlign: 'center', color: "#02C39A"}}>{eventInfo.user_name}</h3>
                </Link>
                <p className={classes.description}>
                  {eventInfo.user_biography}
                </p>
              </GridItem>
            </GridContainer>
          </Card> */}
            {/* {insertCohosts} */}
            <p>*Skedge is not responsible for the authenticity regarding this event as well as any sudden changes/cancelations.</p>
        </GridItem>
      </GridContainer>
    </div>
  );
}
