import React from "react";
import {Fragment} from 'react'
import PropTypes from "prop-types";
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
//import "../../styles/App.css";

const FriendItem = ({
    index,
    friend,
    userId,
    selectedFriend,
    handleSelect
    }) => {

    let currentFriend = null;
    if (friend.friend_one.auth0_id === userId){
        currentFriend = friend.friend_two
    }
    else {
        currentFriend = friend.friend_one
    }

    return (
        <Fragment>
            <ListItem 
            button
            alignItems="flex-start" 
            selected={selectedFriend === index}
            onClick={event => handleSelect(event, index, currentFriend.auth0_id)}
            >
                <ListItemAvatar>
                    <Avatar alt={currentFriend.name} src={currentFriend.picture} />
                </ListItemAvatar>
                <ListItemText
                    primary={currentFriend.name}
                    secondary=''
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </Fragment>
    )
}
  
  FriendItem.propTypes = {
    friend: PropTypes.object.isRequired,
    userId: PropTypes.string
  };
  
  export default FriendItem;