/*eslint-disable*/
import React, { useState, useEffect } from "react";
import SwipeableViews from 'react-swipeable-views';

import NotificationList from './Sections/NotificationList.js';
import FriendRequestsList from './Sections/FriendRequestsList.js';

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Badge from '@material-ui/core/Badge';


// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import NotificationsIcon from '@material-ui/icons/Notifications';


// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { ThemeProvider } from '@material-ui/styles';

import shoppingCartStyle from "assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";

import { Subscription } from "react-apollo";

import {
  FETCH_FOLLOW_REQUESTS,
  SUBSCRIBE_USER_EVENT_INVITES,
  SUBSCRIBE_ALL_NOTIFICATIONS
} from 'EventQueries/EventQueries.js';


const useStyles = makeStyles(shoppingCartStyle);
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    }
  },
});

import './Sections/NotificationStyle.css';

export default function NotificationsPage(props) {

  const [active, setActive] = useState(0);
  const handleChange = (event, active) => {
    setActive(active);
  };
  const handleChangeIndex = index => {
    setActive(index);
  };

  //For icon badge that displays how many notifications/requests you have
  const [notifNums, setNotifNums] = useState(0)
  const changeNotifNums = (num) => {
    setNotifNums(num)
  }
  const [requestNums, setRequestNums] = useState(0)
  const changeRequestNums = (num) => {
    setRequestNums(num)
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
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
            <Card plain >
              <CardBody plain>
                {/* <h3 className={classes.cardTitle}>Notifications</h3> */}
                <Subscription subscription={FETCH_FOLLOW_REQUESTS} variables={{userId: user.sub}} >
                <Tabs
                  value={active}
                  onChange={handleChange}
                  centered
                >
                  <Tab
                    label={'Notifications'}
                    icon={<Badge badgeContent={notifNums} max={999} overlap="circle" color="secondary"><NotificationsIcon /></Badge>}
                  />
                  <Tab
                    label={'Requests'}
                    icon={<Badge badgeContent={requestNums} max={999} overlap="circle" color="secondary"><Add /></Badge>}
                  />
                </Tabs>
                <SwipeableViews
                  index={active}
                  onChangeIndex={handleChangeIndex}
                  style={{height: '65vh'}}
                >
                  <NotificationList 
                    client={props.client}
                    changeNotifNums={changeNotifNums}
                  />

                  <FriendRequestsList 
                    client={props.client}
                    changeRequestNums={changeRequestNums}
                  />
                </SwipeableViews>
                </Subscription>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
