import React, {useState, useEffect} from "react";
import {Fragment} from 'react'
import PropTypes from "prop-types";
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox';
import Button from 'components/CustomButtons/Button.js';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';


import {
    MUTATION_FOLLOW_REQUEST,
    MUTATION_FOLLOW_DELETE,
    QUERY_CHECK_FRIEND,
    QUERY_ACCEPTED_FRIENDS
  } from 'EventQueries/EventQueries.js'
//import "../../styles/App.css";

// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});


const ProfileFriendItem = ({
    index,
    friend,
    profileId,
    userId,
    client
    }) => {

    // if friendButton = 1, friend; if = 0, Invited, if = -1, not added; if = -2 then current user; 
    const [friendButton, setFriendButton] = useState(-2)

    const currentFriend = friend

    let maxNameLength = 32
    if(window.innerWidth < 400) {
        maxNameLength = 26
    }

    let friendUserName = `${currentFriend.name}`
    if(friendUserName.length > maxNameLength) {
        friendUserName = friendUserName.substring(0, maxNameLength);
        friendUserName += "...";
    }
    let friendFullName = currentFriend.full_name;
    if(friendFullName.length > maxNameLength) {
        friendFullName = friendFullName.substring(0, maxNameLength);
        friendFullName += "...";
    }

    //Handling Friend Removing/Adding
    const handleFriend = () => {
        //If user is Already Following, unfollow
        console.log("unfollowing")
        if(friendButton === 1 || friendButton === 0) {
            client.mutate({
                mutation: MUTATION_FOLLOW_DELETE,
                refetchQueries: {
                    query: QUERY_ACCEPTED_FRIENDS,
                    variables: {
                        userId: profileId
                    }
                },
                variables: {
                    userId: userId,
                    followingId: profileId
                }
            }).then(() => {
                //Change relationship type for button to change
                setFriendButton(-1);
            })
        }
        //If user is  not Following, Follow/Send Request
        else if(friendButton === -1) {
            client.mutate({
                mutation: MUTATION_FOLLOW_REQUEST,
                refetchQueries: {
                    query: QUERY_ACCEPTED_FRIENDS,
                    variables: {
                        userId: profileId
                    }
                },
                variables: {
                  objects: {
                      user_id: userId,
                      is_following_id: profileId,
                      status: currentFriend.entity ? 1 : 0
                  }
                }
              }).then(() => {
                    //Change relationship type for button to change
                    setFriendButton(currentFriend.entity ? 1 : 0)
              })
        }
    }

    // Checks if the current user is friends with this user
    const getFriendStatus = () => {
        if(currentFriend.auth0_id !== userId) {
            // client.query({
            //     query: QUERY_CHECK_FRIEND,
            //     variables: {
            //         userId: userId,
            //         profileId: currentFriend.auth0_id
            //     }
            // }).then((data) =>{
            //     console.log("friend daata: ", data)
            //     if(data.data.relationship[0]) {
            //         setFriendButton(data.data.relationship[0].status)
            //     }
            //     else {
            //         setFriendButton(-1)
            //     }
            // });
            const followStatus = currentFriend.followers.find(u => u.user_id === userId)
            if(followStatus) {
                if(followStatus.status === 1) {
                    setFriendButton(1)
                }
                else if(followStatus.status === 0) {
                    setFriendButton(0)
                }
            }
            else {
                setFriendButton(-1)
            }
        }
        else {
            //If current user
            setFriendButton(-2)
        }
    }

    useEffect(() => {
        getFriendStatus();
    }, [])

    const placeFriendButton = () => {
        if(friendButton === 1) {
            return (
                <Button size="sm" onClick={handleFriend}>
                    Unfollow
                </Button>
            )
        }
        else if(friendButton === 0) {
            return (
                <Button size="sm" onClick={handleFriend}>
                    Request Sent
                </Button>
            )
        }
        else if(friendButton === -1) {
            return (
                <Button size="sm"  color="info" onClick={handleFriend}>
                    Follow
                </Button>
            )
        }
        else if(friendButton === -2) {
            return;
        }
        
    }

    return (
        <Fragment>
            <ListItem key={currentFriend.auth0_id} button style={{width: '100%'}}>
                <Link to={`/${currentFriend.name}`}>
                    <ListItemAvatar>
                        <Avatar
                            alt={currentFriend.name}
                            src={cloudinary.url(currentFriend.picture, {secure: true, width: 32, height: 32, crop: "fill"})}
                            style={{border: '1px solid #02C39A'}}
                        />
                        </ListItemAvatar>
                    </Link>

                    <Link to={`/${currentFriend.name}`} style={{color: 'black'}}>
                        <ListItemText
                            primary={friendUserName}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                    >
                                        {friendFullName}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </Link>
                <ListItemSecondaryAction>
                    {placeFriendButton()}
                </ListItemSecondaryAction>
            </ListItem>
            {/* <Divider variant="inset" component="li" /> */}
        </Fragment>
    )
}
  
  ProfileFriendItem.propTypes = {
    friend: PropTypes.object.isRequired,
    userId: PropTypes.string
  };
  
  export default ProfileFriendItem;