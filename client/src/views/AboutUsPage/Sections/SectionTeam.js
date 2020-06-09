import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import teamStyle from "assets/jss/material-kit-pro-react/views/aboutUsSections/teamStyle.js";

const useStyles = makeStyles(teamStyle);

export default function SectionTeam() {
  const classes = useStyles();
  return (
    <div style={{paddingTop: '1em'}}>
      <GridContainer>
        <GridItem
          md={8}
          sm={8}
          className={classNames(
            classes.mrAuto,
            classes.mlAuto,
            classes.textCenter
          )}
        >
          <img width={100} height={100} src={require('assets/img/logoheader.png')}/>
          <h2 className={classes.title}>What is Skedge?</h2>
          <h5 className={classes.description}>
            Skedge is a social event website with one simple goal: so that you all are able to find, 
            share, and create your favorite events all in one place. 
          </h5>

          <hr />

          <h2 className={classes.title}>Why was Skedge built?</h2>
          <h5 className={classes.description} >
            Skedge was created to fill a few needs. These needs include: 
            <ul style={{textAlign: 'left'}}>
              <li>The fact that it is very difficult to find the perfect event for you in an instant. </li>
              <li>There is no specialized social event platform where you can freely create and find events.</li>
              <li>There is no way for you to see what an event looks like before deciding to go.</li>
              <li>It’s hard to keep track of what your friends are doing and where they will be going in the future.</li>
            </ul>
          </h5>

          <hr />

          <h2 className={classes.title}>How does Skedge work?</h2>
          <h5 className={classes.description}>
            You can either be a User or an Entity.
            <ul style={{textAlign: 'left'}}>
              <li>User: a person who uses the website to find, create, and share events with their friends.</li>
              <li>If you fall under the “User” category, you can:
                <ul>
                  <li>Browse through your Local Event/Following Feeds to find your perfect event.</li>
                  <li>Engage with (like/comment) on posts (events).</li>
                  <li>Save events to your profile page as a reminder.</li>
                  <li>Share events with your friends & personally invite them.</li>
                  <li>You can post/watch Moments (pictures/videos at an event).</li>
                  <li>Create events and either share them publicly to all of your followers or just share them privately with some of your friends.</li>
                </ul>
              </li>

              <li>Entity: anybody who hosts events and wants them potentially seen by every user in their city. Think businesses, venues, restaurants, performers, etc.</li>
              <li>If you fall under the “Entity” category, you can:
                <ul>
                  <li>Create events and post them onto your Local Event Feed where every user in your city can see it.</li>
                  <li>Advertise your events so many more users will see and attend them.</li>
                  <li>Respond to comments from users to give them accurate information about the event. </li>
                  <li>Post Moments at the event for users to see visuals.</li>
                </ul>
              </li>
            </ul>
          </h5>

          <hr />

          <h2 className={classes.title}>Skedge Founders</h2>
          <h5 className={classes.description}>Skedge was founded in 2019 by FSU Marketing Alumnus Kyle Picha, Education Alumnus Estefania Rios, and Computer Science Student Tan Arin.</h5>
        </GridItem>
      </GridContainer>
      <GridContainer>
      <GridItem md={4} sm={4}>
          <Card profile plain>
            <CardAvatar profile plain>
              <a href="#pablo">
                <img src={require('assets/img/stefpic.jpg')} alt="picture of Estefania" className={classes.img} />
              </a>
            </CardAvatar>
            <CardBody plain>
              <h4 className={classes.cardTitle}>Estefania Rios</h4>
              <h6 className={classes.textMuted}>Co-Founder</h6>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={4} sm={4}>
          <Card profile plain>
            <CardAvatar profile plain>
              <a href="#pablo">
                <img src={require('assets/img/kylepic.jpg')} alt="picture of Kyle" className={classes.img} />
              </a>
            </CardAvatar>
            <CardBody plain>
              <h4 className={classes.cardTitle}>Kyle Picha</h4>
              <h6 className={classes.textMuted}>CEO / Co-Founder</h6>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={4} sm={4}>
          <Card profile plain>
            <CardAvatar profile plain>
              <a href="#pablo">
                <img
                  src={require('assets/img/tanpic.jpg')}
                  alt="picture of tan :)"
                  className={classes.img}
                />
              </a>
            </CardAvatar>
            <CardBody plain>
              <h4 className={classes.cardTitle}>Tan Arin</h4>
              <h6 className={classes.textMuted}>CTO / Co-Founder</h6>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
