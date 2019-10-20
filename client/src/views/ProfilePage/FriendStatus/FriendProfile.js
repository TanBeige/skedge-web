/*eslint-disable*/
import React, {useState, useEffect} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";   //Tab icons
import People from "@material-ui/icons/People";
import EventIcon from '@material-ui/icons/Event';
import EventBusyIcon from '@material-ui/icons/EventBusy';

import Add from "@material-ui/icons/Add";
import Favorite from "@material-ui/icons/Favorite";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PersonIcon from '@material-ui/icons/Person';
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import Badge from "components/Badge/Badge.js";
import Muted from "components/Typography/Muted.js";
import EventCardList from "components/EventCards/EventCardList"

import cardProfile2Square from "assets/img/faces/card-profile2-square.jpg";

import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";

import { useAuth0 } from 'Authorization/react-auth0-wrapper'
import {
  QUERY_USER_PROFILE,
  MUTATION_FRIEND_REQUEST
} from 'EventQueries/EventQueries.js'

const useStyles = makeStyles(profilePageStyle);

export default function FriendProfile(props) {

    const classes = useStyles();
    const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

    const filter = {
        searchText: "", //Search Text can look for Event Names, Tags, or Event Creators!
        type: "private",
        category: "",
        city: "",
        state: "",
        limit: 10   // This is how many events will show up in the eventList
      };

    return (
        <div className={classes.profileTabs} style={{marginTop: 10}}>
            <NavPills
                alignCenter
                color="primary"
                tabs={[
                {
                    tabButton: "Future Events",
                    tabIcon: EventIcon,
                    tabContent: (
                        <EventCardList 
                            client={props.client}
                            userId={props.userId}
                            filter={filter}
                            listType='home'
                        /> 
                    )
                },
                {
                    tabButton: "Past Events",
                    tabIcon: EventBusyIcon,
                    tabContent: (
                        <EventCardList 
                            client={props.client}
                            userId={props.userId}
                            filter={filter}
                            listType='home'
                        />
                    )
                }
                ]}
            />
        </div>
  );
}
