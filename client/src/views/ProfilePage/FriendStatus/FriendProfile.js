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
import TurnedInIcon from '@material-ui/icons/TurnedIn';

// core components
import NavPillsProfile from "components/NavPills/NavPillsProfile.js";
import EventCardList from "components/EventCards/EventCardList";
import ProfileFollowerList from './ProfileFollowerList.js';
import ProfileFollowingList from './ProfileFollowingList.js';

import cardProfile2Square from "assets/img/faces/card-profile2-square.jpg";

import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";

import { useAuth0 } from 'Authorization/react-auth0-wrapper'
import {
  QUERY_USER_PROFILE,
  MUTATION_FRIEND_REQUEST,
  QUERY_ACCEPTED_FRIENDS
} from 'EventQueries/EventQueries.js'
import { Button } from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

const useStyles = makeStyles(profilePageStyle);

export default function FriendProfile(props) {

    const classes = useStyles();
    const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);


    const userFriendsEvents = () => {
        //if(props.currentUserProfile) {
            return (
                <GridContainer justify='center' style={{textAlign: 'center'}}>
                    {/* <GridItem xs={4}> */}
                        <ProfileFollowerList 
                            client={props.client}
                            userId={props.userId}
                            profileId={props.profileId}
                            followerCount={props.followerCount}
                        />
                    {/* </GridItem>
                    <GridItem xs={4}> */}
                        <ProfileFollowingList 
                            client={props.client}
                            userId={props.userId}
                            profileId={props.profileId}
                            followingCount={props.followingCount}
                        />
                    {/* </GridItem> */}
                </GridContainer>
            )
        //}
    }

    let displayPills = "";
    if(props.profileId === props.userId) {
        displayPills = (
            <NavPillsProfile
                alignCenter
                color="primary"
                includeSave
                tabs={[
                {
                    tabButton: "My Events",
                    tabIcon: EventIcon,
                    tabContent: (
                        <EventCardList 
                            client={props.client}
                            userId={props.userId}
                            profileId={props.profileId}
                            listType='profile'
                        /> 
                    )
                },
                {
                    tabButton: "Saved Events",
                    tabIcon: TurnedInIcon,
                    tabContent: (
                        <EventCardList 
                            client={props.client}
                            userId={props.userId}
                            listType='saved'
                        />
                    )
                }
                ]}
            />
        )
    }
    else {
        displayPills = (
            <NavPillsProfile
                alignCenter
                color="primary"
                tabs={[
                {
                    tabButton: "Events",
                    tabIcon: EventIcon,
                    tabContent: (
                        <EventCardList 
                            client={props.client}
                            userId={props.userId}
                            profileId={props.profileId}
                            listType='profile'
                        /> 
                    )
                }]
                }
            />
        )
    }

    return (
        <div className={classes.profileTabs} style={{marginTop: 10}}>
            {userFriendsEvents()}
            {displayPills}
        </div>
  );
}
