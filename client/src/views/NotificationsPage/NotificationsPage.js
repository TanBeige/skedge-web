/*eslint-disable*/
import React, { useState, useEffect } from "react";
import SwipeableViews from 'react-swipeable-views';

import NotificationList from './Sections/NotificationList.js';

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Footer from "components/Footer/Footer.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import shoppingCartStyle from "assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";

const useStyles = makeStyles(shoppingCartStyle);

export default function NotificationsPage(props) {

  const [active, setActive] = useState(0);
  const handleChange = (event, active) => {
    setActive(active);
  };
  const handleChangeIndex = index => {
    setActive(index);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  return (
    <div>
      <Header
        brand="Skedge"
        links={<HeaderLinks dropdownHoverColor="info"/>}
        fixed
        color="primary"//"transparent"
        changeColorOnScroll={{
          height: 100,
          color: "primary"
        }}
      />

      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <Card plain>
            <CardBody plain>
              {/* <h3 className={classes.cardTitle}>Notifications</h3> */}
              <Tabs
                // classes={{
                //   root: classes.root,
                //   fixed: classes.fixed,
                //   flexContainer: flexContainerClasses,
                //   indicator: classes.displayNone
                // }}
                value={active}
                onChange={handleChange}
                centered
              >
                <Tab
                  label={'Notifications'}
                  icon={<Favorite />}
                  // classes={{
                  //   root: pillsClasses,
                  //   label: classes.label,
                  //   selected: classes[color]
                  // }}
                />
                <Tab
                  label={'Requests'}
                  icon={<Add />}
                  // classes={{
                  //   root: pillsClasses,
                  //   label: classes.label,
                  //   selected: classes[color]
                  // }}
                />
              </Tabs>
              <SwipeableViews
                index={active}
                onChangeIndex={handleChangeIndex}
              >
                <NotificationList 
                  client={props.client}
                />
                <div>
                  No Requests Currently
                </div>
              </SwipeableViews>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
