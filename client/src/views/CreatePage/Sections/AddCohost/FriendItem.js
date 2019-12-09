import React, { useEffect, useState } from "react";
import {Fragment} from 'react'
import PropTypes from "prop-types";
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox';
//import "../../styles/App.css";

// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

//cloudinary.url(event.image.image_uuid, {secure: true, width: 800, height: 533, crop: "fill" ,fetch_format: "auto", quality: "auto"}),


const FriendItem = ({
    index,
    friend,
    userId,
    check,
    selectedFriend,
    handleChange
    }) => {

    // let currentFriend = null;
    // if (friend.friend_one.auth0_id === userId){
    //     currentFriend = friend.friend_two
    // }
    // else {
    //     currentFriend = friend.friend_one
    // }
    const [isChecked, setIsChecked] = useState(false)
    const follower = friend.user;

    useEffect(()=>{
        //Reload the page
        setIsChecked(check.indexOf(follower.auth0_id) !== -1)
    }, check)

    const checkBox = () => {
        setIsChecked(!isChecked);
        console.log(follower.auth0_id)
        handleChange(follower.auth0_id);
    }

    return (
        <Fragment>
            <ListItem key={follower.auth0_id} button onClick={checkBox}>
                <ListItemAvatar>
                <Avatar
                    alt={follower.name}
                    src={cloudinary.url(follower.picture, {secure: true, width: 200, height: 200, crop: "fill" ,fetch_format: "auto", quality: "auto"})}
                />
                </ListItemAvatar>
                <ListItemText id={follower.name} primary={follower.name} />
                <ListItemIcon>
                <Checkbox
                    edge="end"
                    checked={isChecked}
                />
                </ListItemIcon>
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