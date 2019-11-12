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
// core components
import NavPills from "components/NavPills/NavPills.js";
import EventCardList from "components/EventCards/EventCardList"
import ProfileFriendList from './ProfileFriendList.js'

import cardProfile2Square from "assets/img/faces/card-profile2-square.jpg";

import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";

import { useAuth0 } from 'Authorization/react-auth0-wrapper'
import {
  QUERY_USER_PROFILE,
  MUTATION_FRIEND_REQUEST,
  QUERY_ACCEPTED_FRIENDS
} from 'EventQueries/EventQueries.js'
import { Button } from "@material-ui/core";

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
        //date: new Date(),
        limit: 10   // This is how many events will show up in the eventList
    };

      const userFriendsEvents = () => {
          //if(props.currentUserProfile) {
              return (
                  <div  style={{textAlign: 'center'}}>
                    {/* <Button variant='outlined' style={{width: '8em', marginRight: 5}}>Events</Button> */}
                    <ProfileFriendList 
                        client={props.client}
                        userId={props.userId}
                        profileId={props.profileId}
                    />
                  </div>
              )
          //}
      }

    return (
        <div className={classes.profileTabs} style={{marginTop: 10}}>
            {userFriendsEvents()}
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
