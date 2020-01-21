/*eslint-disable*/
import React, { useState, useEffect } from "react";
import SwipeableViews from 'react-swipeable-views';

import NotificationList from './Sections/NotificationList.js';
import RequestList from './Sections/RequestList.js';
import EventInviteList from './Sections/EventInvitesList.js';

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
import EventSeatIcon from '@material-ui/icons/EventSeat';


// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { ThemeProvider } from '@material-ui/styles';

import shoppingCartStyle from "assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";

import { Subscription } from "react-apollo";
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'


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

  const { user, isAuthenticated, loading } = useAuth0()

  // const [renderPage, setRenderPage] = useState(isAuthenticated)

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
  const [inviteNums, setInviteNums] = useState(0)
  const changeInviteNums = (num) => {
    setInviteNums(num)
  }
  console.log("notifs auth : ", isAuthenticated)

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  useEffect(() => {
    // If user is going to this link, save the link before 
    // Signing In so we can redirect here later
    // setRenderPage(!props.anonymous);

    localStorage.setItem('originPath', window.location.pathname);
  }, [])


  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div style={{backgroundColor: "#02C39A", paddingTop: '1px', paddingBottom: '5vh'}}>
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
              {
                isAuthenticated && user ? 
                  <CardBody plain>
                    {/* <h3 className={classes.cardTitle}>Notifications</h3> */}
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
                      <Tab
                        label={'Invites'}
                        icon={<Badge badgeContent={inviteNums} max={999} overlap="circle" color="secondary"><EventSeatIcon /></Badge>}
                      />
                    </Tabs>
                    <SwipeableViews
                      index={active}
                      onChangeIndex={handleChangeIndex}
                    >
                      <NotificationList 
                        client={props.client}
                        changeNotifNums={changeNotifNums}
                      />

                      <RequestList 
                        client={props.client}
                        changeRequestNums={changeRequestNums}
                      />

                      <EventInviteList 
                        client={props.client}
                        changeInviteNums={changeInviteNums}
                      
                      />
                    </SwipeableViews>
                  </CardBody> : ""
              }
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
