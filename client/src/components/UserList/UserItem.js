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
import {useAuth0} from 'Authorization/react-auth0-wrapper.js';


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


const UserItem = ({
    account,
    profileId,
    client
    }) => {

    // if accountButton = 1, account; if = 0, Invited, if = -1, not added; if = -2 then current user; 
    const [accountButton, setAccountButton] = useState(-1)
    const { user } = useAuth0()

    const currentAccount = account


    let maxNameLength = 28
    if(window.innerWidth < 400) {
        maxNameLength = 12
    }

    let accountUserName = `${currentAccount.name}`

    if(accountUserName.length > maxNameLength) {
        accountUserName = accountUserName.substring(0, maxNameLength);
        accountUserName += "...";
    }
    let accountFullName =""
    if(currentAccount.full_name) {
        accountFullName = currentAccount.full_name;
    }

    if(accountFullName.length > maxNameLength) {
        accountFullName = accountFullName.substring(0, maxNameLength);
        accountFullName += "...";
    }

    //Handling Account Removing/Adding
    const handleAccount = () => {
        //If user is Already Following, unfollow
        console.log("unfollowing")
        if(accountButton === 1 || accountButton === 0) {
            client.mutate({
                mutation: MUTATION_FOLLOW_DELETE,
                refetchQueries: {
                    query: QUERY_ACCEPTED_FRIENDS,
                    variables: {
                        userId: profileId
                    }
                },
                variables: {
                    userId: user.sub,
                    followingId: profileId
                }
            }).then(() => {
                //Change relationship type for button to change
                setAccountButton(-1);
            })
        }
        //If user is  not Following, Follow/Send Request
        else if(accountButton === -1) {
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
                      user_id: user.sub,
                      is_following_id: profileId,
                      status: currentAccount.entity ? 1 : 0
                  }
                }
              }).then(() => {
                    //Change relationship type for button to change
                    setAccountButton(currentAccount.entity ? 1 : 0)
              })
        }
    }

    // Checks if the current user is friends with this user
    const getAccountStatus = () => {
        if(currentAccount.auth0_id !== user.sub) {
            // client.query({
            //     query: QUERY_CHECK_FRIEND,
            //     variables: {
            //         userId: userId,
            //         profileId: currentAccount.auth0_id
            //     }
            // }).then((data) =>{
            //     console.log("friend daata: ", data)
            //     if(data.data.relationship[0]) {
            //         setAccountButton(data.data.relationship[0].status)
            //     }
            //     else {
            //         setAccountButton(-1)
            //     }
            // });
            const followStatus = currentAccount.followers.find(u => u.user_id === user.sub)
            if(followStatus) {
                if(followStatus.status === 1) {
                    setAccountButton(1)
                }
                else if(followStatus.status === 0) {
                    setAccountButton(0)
                }
            }
            else {
                setAccountButton(-1)
            }
        }
        else {
            //If current user
            setAccountButton(-2)
        }
    }

    useEffect(() => {
        getAccountStatus();
    }, [])

    const placeAccountButton = () => {
        if(accountButton === 1) {
            return (
                <Button size="sm" onClick={handleAccount}>
                    Unfollow
                </Button>
            )
        }
        else if(accountButton === 0) {
            return (
                <Button size="sm" onClick={handleAccount}>
                    Request Sent
                </Button>
            )
        }
        else if(accountButton === -1) {
            return (
                <Button size="sm"  color="info" onClick={handleAccount}>
                    Follow
                </Button>
            )
        }
        else if(accountButton === -2) {
            return;
        }
        
    }

    return (
        <Fragment>
            <ListItem key={currentAccount.auth0_id} button style={{width: '100%'}}>
                <Link to={`/${currentAccount.name}`}>
                    <ListItemAvatar>
                        <Avatar
                            alt={currentAccount.name}
                            src={cloudinary.url(currentAccount.picture, {secure: true, width: 32, height: 32, crop: "fill"})}
                            style={{border: '1px solid #02C39A'}}
                        />
                        </ListItemAvatar>
                    </Link>

                    <Link to={`/${currentAccount.name}`} style={{color: 'black'}}>
                        <ListItemText
                            primary={accountUserName}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                    >
                                        {accountFullName}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </Link>
                <ListItemSecondaryAction>
                    {placeAccountButton()}
                </ListItemSecondaryAction>
            </ListItem>
            {/* <Divider variant="inset" component="li" /> */}
        </Fragment>
    )
}
  
UserItem.propTypes = {
    account: PropTypes.object.isRequired,
};
  
  export default UserItem;