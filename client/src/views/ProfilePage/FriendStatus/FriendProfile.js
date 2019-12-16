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
import EventCardList from "components/EventCards/EventCardList"
import ProfileFollowerList from './ProfileFollowerList.js'

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


    const userFriendsEvents = () => {
        //if(props.currentUserProfile) {
            return (
                <div  style={{textAlign: 'center'}}>
                <ProfileFollowerList 
                    client={props.client}
                    userId={props.userId}
                    profileId={props.profileId}
                    followerCount={props.followerCount}
                />
                {/* <Button variant='outlined' style={{width: '8em', marginRight: 5}}>Following</Button> */}

                </div>
            )
        //}
    }

    let displayPills = "";
    if(props.profileId === props.userId) {
        console.log(props.profileId);
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
