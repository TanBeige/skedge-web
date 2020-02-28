import React, { Fragment, useEffect, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { Link } from "react-router-dom"

import FavoriteIcon from '@material-ui/icons/Favorite';
import RenewIcon from '@material-ui/icons/Autorenew'
import { Button } from '@material-ui/core';
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';


import {
    MUTATION_FOLLOW_DELETE,
    FETCH_FOLLOW_REQUESTS,
    MUTATION_FOLLOW_REQUEST,
    USER_SEARCH
} from 'EventQueries/EventQueries.js';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    //maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: 'inline',
  },
}));

// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

export default function UserSearchList(props) {

    let isMounted = true;
    const classes = useStyles();

    const [users, setUsers] = useState([])
    const [followStatus, setFollowStatus] = useState(0);

    const { userItem } = props;
    const { user } = useAuth0();



      //// Handling Friend Invites
  const handleFollowInvite = () => {
    
    props.client.mutate({
      mutation: MUTATION_FOLLOW_REQUEST,
      refetchQueries: [{
        query: USER_SEARCH,
        variables: {
          userId: user.sub,
        }
      }],
      variables: {
        objects: {
          user_id: user.sub,
          is_following_id: userItem.auth0_id,
          status: userItem.entity ? 1 : 0
        }
      }
    }).then(() => {
      //Change relationship type for button to change
      if(isMounted) {
        setFollowStatus(userItem.entity ? 1 : 0)
      }
    })
  }

  // If already friends, remove friend
  const handleFollowRemove = () => {
    
    props.client.mutate({
      mutation: MUTATION_FOLLOW_DELETE,
      refetchQueries: [{
        query: USER_SEARCH,
        variables: {
          userId: user.sub,
        }
      }],
      variables: {
          userId: user.sub,
          followingId: userItem.auth0_id,
      }
    }).then((data) => {
      //Change relationship type for button to change
      if(isMounted) {
        setFollowStatus(-1);
      }
    })
  }


    // Use Effect Function
    useEffect(() => {
        isMounted = true;

        //Find the relationship between Current User and Profile User
        let followType = 0

        //if user has followers
        if(userItem.followers.length === 1) {
          const followValues = userItem.followers.find(users => users.user_id === user.sub) 
          //If current user is following profile confirmed
          if(followValues) {
            followType = followValues.status;
            setFollowStatus(followType)
          }
          else{
            // If user is not following profile confirmed
            followType = -1;
            setFollowStatus(followType)
          }
        }
        //User has no followers
        else {
            setFollowStatus(-1)
        }
        

        return () => {
            isMounted = false;
        }
    }, [])
    let displayName = userItem.name;

    if (displayName.length > 16) {
        displayName = userItem.name.substring(0, 16);
        displayName += "..."
    }

    let followButton = "";
    if(followStatus === 0){ 
        followButton = (
        <Button variant='outlined' onClick={handleFollowRemove}>
            Requested
        </Button>
        )
    }
    else if(followStatus === 1){
        followButton = (
            <Button variant='outlined' onClick={handleFollowRemove}>
                Unfollow
            </Button>
            )
    }
    else if(followStatus === -1) {
        followButton = (
        <Button variant='outlined' onClick={handleFollowInvite}>
            Follow
        </Button>
        )
    }


    return (
        <Fragment key={userItem.id}>
                <ListItem style={{paddingLeft: 10, paddingRight: 0, height: '5em'}}>
                    <Link to={`/${userItem.name}`}>
                        <ListItemAvatar>
                            <Avatar 
                                alt={userItem.name}
                                src={cloudinary.url(userItem.picture, {secure: true, width: 100, height: 100, crop: "fill" ,fetch_format: "auto", quality: "auto"})} 
                                //src={userItem.other_user.picture}
                            />
                        </ListItemAvatar>
                    </Link>
                    <Link style={{color: '#008064'}} to={`/${userItem.name}`}>
                        <ListItemText
                            primary={`${displayName}`}
                            secondary={
                            <React.Fragment>
                                <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                                >
                                    {userItem.full_name}
                                </Typography>
                                <br />
                                {` — ${userItem.followers_aggregate.aggregate.count} followers`}
                            </React.Fragment>
                            }
                        />
                    </Link>
                    <ListItemSecondaryAction>
                        {followButton}
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
            </Fragment>
    )
}