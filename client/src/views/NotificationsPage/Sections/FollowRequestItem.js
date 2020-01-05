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

import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Button } from '@material-ui/core';

import gql from 'graphql-tag';

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';

import {
    MUTATION_FOLLOW_DELETE,
    FETCH_FOLLOW_REQUESTS,
    MUTATION_FOLLOW_REQUEST
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

export default function FollowRequestItem(props) {

    let isMounted = false;
    const classes = useStyles();

    const [users, setUsers] = useState([])
    const [following, setFollowing] = useState(false);
    const [followAccepted, setFollowAccepted] = useState(false);

    const { userItem } = props;
    const { user } = useAuth0();


  //// Handling Friend Invites
  const handleFollowAccept = () => {
      //  Handling relationship. column 1 must be > column 2 for errors. 
      //    For more info check relationship table docs.
      console.log("Follow Accept")
      
      props.client.mutate({
        mutation: gql`
        mutation accept_follow($userId: String!, $otherUser: String!, $objects: [notifications_insert_input!]!){
          update_follower(
            where: {
              _and: [
                {user_id: {_eq: $otherUser}}
                {is_following_id: {_eq: $userId}}
              ]
            }
            _set: {
              status: 1
            }
          ){
            affected_rows
            returning {
              status
              user_id
              is_following_id
            }
          }
          
          insert_notifications(
            objects: $objects 
            on_conflict: {
              update_columns: time_created, 
              constraint: notifications_user_id_activity_type_source_id_other_user_id_key
            }
          ){
            affected_rows
          }
        }
        `,
        variables: {
          userId: user.sub,
          otherUser: userItem.auth0_id,
          objects: {
            user_id: userItem.auth0_id,
            activity_type: 3,
            source_id: null,
            other_user_id: user.sub
          }
        }
      }).then(() => {
        //Change relationship type for button to change
        setFollowAccepted(true)
      }).catch(error => {
        console.log(error)
      })
    }

  const handleFollowInvite = () => {
    //  Handling relationship. column 1 must be > column 2 for errors. 
    //    For more info check relationship table docs.
    console.log("Follow Request")
    
    props.client.mutate({
      mutation: MUTATION_FOLLOW_REQUEST,
      refetchQueries: [{
        query: FETCH_FOLLOW_REQUESTS,
        // variables: {
        //   userId: user.sub,
        // }
      }],
      variables: {
        objects: {
          user_id: user.sub,
          is_following_id: userItem.auth0_id,
          status: 0
        }
      }
    }).then(() => {
      //Change relationship type for button to change
      setFollowing(0)
    })
  }

  // If already friends, remove friend
  const handleFollowRemove = () => {
    console.log("Removing Friend");

    props.client.mutate({
      mutation: MUTATION_FOLLOW_DELETE,
      variables: {
          userId: userItem.auth0_id,
          followingId: user.sub,
      }
    }).then((data) => {
      //Change relationship type for button to change
      setFollowing(-1);
    })
  }


    // Use Effect Function
    useEffect(() => {
        isMounted = true;
        const isFollowing = userItem.followers.some(u => u.user_id === user.sub);
        if(userItem.followers) {
            setFollowing(isFollowing)
        }

        return () => {
            isMounted = false;
        }
    })
    let displayName = userItem.name;

    if (displayName.length > 16) {
        displayName = userItem.name.substring(0, 16);
        displayName += "..."
    }

    let followButton = "";
    if(!followAccepted) {
      followButton = (
        <Fragment>
          <IconButton edge="end" aria-label="accept" onClick={handleFollowAccept}>
            <CheckCircleOutlineIcon fontSize='large'/>
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={handleFollowRemove}>
            <DeleteIcon fontSize='large'/>
          </IconButton>
        </Fragment>
        )
    }
    else {
      followButton = (
        <IconButton edge="end" aria-label="accepted" onClick={handleFollowAccept}>
          <CheckCircleIcon fontSize='large'/>
        </IconButton>
        )
    }
    // else if(!following){ 
    //     followButton = (
    //     <Button variant='outlined' onClick={handleFollowInvite}>
    //         Follow Back
    //     </Button>
    //     )
    // }
    // else {
    //     followButton = (
    //     <Button variant='outlined' onClick={handleFollowRemove}>
    //         Unfollow
    //     </Button>
    //     )
    // }


    return (
        <Fragment key={userItem.id}>
                <ListItem className='notificationList' style={{paddingLeft: 10, paddingRight: 0, height: '5em'}}>
                  <Link to={`/users/${userItem.id}`}>
                    <ListItemAvatar>
                        <Avatar 
                            alt={userItem.name}
                            src={cloudinary.url(userItem.picture, {secure: true, width: 100, height: 100, crop: "fill" ,fetch_format: "auto", quality: "auto"})} 
                            //src={userItem.other_userItem.picture}
                        />
                    </ListItemAvatar>
                  </Link> 
                  <Link to={`/users/${userItem.id}`}>
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