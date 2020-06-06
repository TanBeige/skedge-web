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
import EventIcon from '@material-ui/icons/Event';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';


// core components
import NavPillsProfile from "components/NavPills/NavPillsProfile.js";
import EventCardList from "components/EventCards/EventCardList";
import ProfileFollowerList from './ProfileFollowerList.js';
import ProfileFollowingList from './ProfileFollowingList.js';
import SavedDealsList from 'components/EventCards/SavedDealsList.js'

import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";

import { useAuth0 } from 'Authorization/react-auth0-wrapper'
import {
  QUERY_USER_PROFILE,
  MUTATION_FRIEND_REQUEST,
  QUERY_ACCEPTED_FRIENDS
} from 'EventQueries/EventQueries.js'
import { Button } from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer.js";
// import GridItem from "components/Grid/GridItem.js";

const useStyles = makeStyles(profilePageStyle);

export default function FriendProfile(props) {

    const classes = useStyles();
    const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

    const [date, setDate] = useState(new Date())

    //Change current day
    const handleDayBack = () => {
        const newDate = date.addDays(-1)
        const day = newDate.getDay()

        setDate(newDate)
    }
    
    const handleDayForward = () => {
        const newDate = date.addDays(1)
        const day = newDate.getDay();

        setDate(newDate)

    }
    

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
                tabs={[
                // {
                //     tabButton: "My Events",
                //     tabIcon: EventIcon,
                //     tabContent: (
                //         <EventCardList 
                //             client={props.client}
                //             userId={props.userId}
                //             profileId={props.profileId}
                //             date={date}
                //             listType='profile'
                //         /> 
                //     )
                // },
                {
                    tabButton: "Saved",
                    tabIcon: TurnedInIcon,
                    tabContent: (
                        <EventCardList 
                            client={props.client}
                            userId={props.userId}
                            listType='saved'
                        />
                    )
                },
                // {
                //     tabButton: "Created Events",
                //     tabIcon: PermContactCalendarIcon,
                //     tabContent: (
                //         <EventCardList 
                //             client={props.client}
                //             userId={props.userId}
                //             listType='created'
                //         />
                //     )
                // }
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
                            date={date}
                            listType='profile'
                        /> 
                    )
                }]
                }
            />
        )
    }

    //Changes day to a moment.js object so I can format easier
    const moment = require('moment')
    const formatDate = moment(date);

    return (
        <div className={classes.profileTabs} style={{marginTop: 10}}>
            {userFriendsEvents()}
            {props.currentUserProfile &&
            <div>
                <div style={{display: "block", margin: '10px 0px'}}>
                    <IconButton 
                        onClick={handleDayBack}
                        style={{position: 'absolute', left: 5, marginTop: '-12px', padding: '12px 18px'}}
                    >
                        <ChevronLeftIcon fontSize='large' />
                    </IconButton>
                    <IconButton 
                        onClick={handleDayForward}
                        style={{position: 'absolute', right: 5, marginTop: '-12px', padding: '12px 18px'}}
                    >
                        <ChevronRightIcon fontSize='large'  />
                    </IconButton>
                    <h3 style={{textAlign: 'center', verticalAlign: 'middle'}}>{formatDate.format("dddd, MMM D")}</h3>
                </div>

                {/* {displayPills} */}
                    <SavedDealsList 
                        client={props.client}
                        userId={props.userId}
                        profileId={props.profileId}
                        date={formatDate}            
                    />
                </div>
            }
        </div>
  );
}
