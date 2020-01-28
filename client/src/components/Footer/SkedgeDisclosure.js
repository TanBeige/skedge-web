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

export default function SectionBlogInfo() {
  const classes = useStyles();

  return (
    <div>
      <GridContainer justify="center" style={{paddingBottom: 10}}>
        <GridItem xs={12} sm={10} md={8}>
            <hr />
            <p>*Skedge is not responsible for the authenticity regarding this event as well as any sudden changes/cancelations.</p>
        </GridItem>
      </GridContainer>
    </div>
  );
}
