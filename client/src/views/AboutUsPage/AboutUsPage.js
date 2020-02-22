/*eslint-disable*/
import React from "react";
import { Helmet } from 'react-helmet'
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
// sections for this page
import SectionTeam from "views/AboutUsPage/Sections/SectionTeam.js";

import aboutUsStyle from "assets/jss/material-kit-pro-react/views/aboutUsStyle.js";

const useStyles = makeStyles(aboutUsStyle);

export default function AboutUsPage(props) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  return (
    <div>
      <Helmet>
          <title>About Us | Skedge</title>
          <meta name="description" 
            content="Skedge is a social event website with one simple goal: so that you all are able to find, share, and create your favorite events all in one place."
          />
          <meta name="theme-color" content="#02C39A" />
        </Helmet>
      <img onClick={() => {props.history.push("/")}} style={{position: 'fixed', zIndex: 10, top: 15, left: 15}} height={40} width={40} src={require('assets/img/logoheader.png')} />
      <Parallax image={require("assets/img/bg9.jpg")} filter="dark" small>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem
              md={8}
              sm={8}
              className={classNames(
                classes.mlAuto,
                classes.mrAuto,
                classes.textCenter
              )}
            >
              <h1 className={classes.title}>About Us</h1>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)} style={{marginTop: '-20px', marginBottom: '8vh'}}>
        <div className={classes.container}>
          {/* <SectionDescription /> */}
          <SectionTeam />
          {/* <SectionServices />
          <SectionOffice /> */}
        </div>
      </div>
    </div>
  );
}
