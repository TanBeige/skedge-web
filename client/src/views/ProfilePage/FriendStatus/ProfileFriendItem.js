import React, {useState, useEffect} from "react";
import {Fragment} from 'react'
import PropTypes from "prop-types";
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox';
import Button from 'components/CustomButtons/Button.js'


import {
    MUTATION_FOLLOW_REQUEST,
    MUTATION_FOLLOW_DELETE,
    QUERY_CHECK_FRIEND
  } from 'EventQueries/EventQueries.js'
//import "../../styles/App.css";

const ProfileFriendItem = ({
    index,
    friend,
    profileId,
    userId,
    client
    }) => {

    // if friendButton = 1, friend; if = 0, Invited, if = -1, not added; if = -2 then current user; 
    const [friendButton, setFriendButton] = useState(-2)

    let currentFriend = null;
    console.log("Profile User Id: ", profileId)
    console.log("Current User Id: ", userId)
    if (friend.friend_one.auth0_id === profileId){
        currentFriend = friend.friend_two
    }
    else {
        currentFriend = friend.friend_one
    }

    let maxNameLength = 16
    console.log("width: ", window.innerWidth)
    if(window.innerWidth < 400) {
        maxNameLength = 10
    }

    let friendUserName = `@${currentFriend.name}`
    if(friendUserName.length > maxNameLength) {
        friendUserName = friendUserName.substring(0, maxNameLength);
        friendUserName += "...";
    }
    console.log(currentFriend)


    //Handling Friend Removing/Adding
    const handleFriend = () => {
        let user_one = "";
        let user_two = "";
        let action_user = userId;
    
        if(userId <= currentFriend.auth0_id) {
          user_one = userId;
          user_two = currentFriend.auth0_id;
        }
        else {
          user_one = currentFriend.auth0_id;
          user_two = userId;
        }
        console.log("friend auth: ", currentFriend.auth0_id)
        console.log("user 1: ", user_one)
        console.log("user 2: ", user_two)

        if(friendButton === 1) {
            client.mutate({
                mutation: MUTATION_FOLLOW_DELETE,
                variables: {
                    user_one_id: user_one,
                    user_two_id: user_two
                }
            }).then(() => {
                //Change relationship type for button to change
                setFriendButton(-1);
            })
        }
        else if(friendButton === -1) {
            client.mutate({
                mutation: MUTATION_FOLLOW_REQUEST,
                variables: {
                  objects: {
                    user_one_id: user_one,
                    user_two_id: user_two,
                    action_user_id: action_user,
                    status: 0
                  }
                }
              }).then(() => {
                    //Change relationship type for button to change
                    setFriendButton(0)
              })
        }
    }

    // Checks if the current user is friends with this user
    const getFriendStatus = () => {
        if(currentFriend.auth0_id !== userId) {
            client.query({
                query: QUERY_CHECK_FRIEND,
                variables: {
                    userId: userId,
                    profileId: currentFriend.auth0_id
                }
            }).then((data) =>{
                console.log("friend daata: ", data)
                if(data.data.relationship[0]) {
                    setFriendButton(data.data.relationship[0].status)
                }
                else {
                    setFriendButton(-1)
                }
            });
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
                    Unfriend
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
                    Add Friend
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
                <ListItemAvatar>
                <Avatar
                    alt={currentFriend.name}
                    src={currentFriend.picture}
                    style={{border: '1px solid #02C39A'}}
                />
                </ListItemAvatar>
                <ListItemText id={currentFriend.name} primary={friendUserName} />
                {placeFriendButton()}
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