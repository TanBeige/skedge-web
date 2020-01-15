import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import history from "utils/history";


import gql from 'graphql-tag';

import FavoriteIcon from '@material-ui/icons/Favorite';
import RenewIcon from '@material-ui/icons/Autorenew';
import PersonAddIcon from '@material-ui/icons/PersonAdd';


import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';

import {
    SEE_NOTIFICATION,
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

// Implement How long ago the notification was made




export default function NotificationListItem(props) {
    const classes = useStyles();
    const { user } = useAuth0();
    const { notification } = props;

    const unseenColor = 'lightblue';
    const linkColor = 'black'

    const notifStyle= {
        paddingLeft: 10, 
        paddingRight: 0, 
        backgroundColor: notification.seen ? 'white' : unseenColor,
        minHeight: 72
    }

    const redirectFunction = () => {
        history.push(`/users/${notification.other_user.name}`)
    }

    useEffect(() => {
        props.client.mutate({
            mutation:SEE_NOTIFICATION,
            variables: {
                id: notification.id
            }
        })
    })

    const likeNotif = () => {
        return (
            <Fragment key={notification.id}>
                <Link to={`/events/${notification.source.id}`} className='ListLink'>
                    <ListItem style={notifStyle}>
                        <FavoriteIcon color='secondary' style={{position: "absolute", left: 0, top: 5, zIndex: 10}} />
                        <ListItemAvatar onClick={redirectFunction}>
                            <Avatar 
                                alt={notification.other_user.name}
                                //src={cloudinary.url(notification.source.image.image_uuid, {secure: true, width: 100, height: 100, crop: "fill" ,fetch_format: "auto", quality: "auto"})} 
                                src={cloudinary.url(notification.other_user.picture, {secure: true, width: 200, height: 200, crop: "fill"})}

                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${notification.other_user.name} liked your event`}
                            onClick={redirectFunction}
                            secondary={
                            <React.Fragment>
                                <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                                >
                                    {notification.source.name}
                                </Typography>
                                {` — now at ${notification.source.event_like_aggregate.aggregate.count} likes.`}
                            </React.Fragment>
                            }
                        />
                    </ListItem>
                </Link>
                <Divider component="li" />
            </Fragment>
        )
    }

    const repostNotif = () => {
        return (
            <Fragment key={notification.id}>
                <Link to={`/events/${notification.source.id}`} className='ListLink'>
                    <ListItem style={notifStyle}>
                        <RenewIcon color='primary' style={{position: "absolute", left: 0, top: 5, zIndex: 10}} />
                        <ListItemAvatar onClick={redirectFunction}>
                            <Avatar 
                                alt={notification.other_user.name}
                                //src={cloudinary.url(notification.source.image.image_uuid, {secure: true, width: 100, height: 100, crop: "fill" ,fetch_format: "auto", quality: "auto"})} 
                                src={cloudinary.url(notification.other_user.picture, {secure: true, width: 200, height: 200, crop: "fill"})}
                            />
                        </ListItemAvatar>
                            <ListItemText
                                onClick={redirectFunction}
                                primary={`${notification.other_user.name} shared your event`}
                                secondary={
                                <React.Fragment>
                                    <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                    >
                                            {notification.source.name}
                                    </Typography>
                                    {` — now at ${notification.source.shared_event_aggregate.aggregate.count} shares.`}
                                </React.Fragment>
                                }
                            />
                    </ListItem>
                </Link>
            <Divider component="li" />
            </Fragment>
        )
    }

    const followAcceptNotif = () => {
        return (
            <Fragment key={notification.id}>
                <Link to={`/users/${notification.other_user.name}`} className='ListLink'>
                    <ListItem style={notifStyle}>
                        <PersonAddIcon style={{position: "absolute", left: 0, top: 5, zIndex: 10}} />
                        <ListItemAvatar>
                            <Avatar 
                                alt={notification.other_user.name}
                                src={cloudinary.url(notification.other_user.picture, {secure: true, width: 200, height: 200, crop: "fill"})}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`You are now following ${notification.other_user.name}!`}
                            // secondary={
                            // <React.Fragment>
                            //     <Typography
                            //     component="span"
                            //     variant="body2"
                            //     className={classes.inline}
                            //     color="textPrimary"
                            //     >
                            //         {notification.source.name}
                            //     </Typography>
                            //     {` — now at ${notification.source.shared_event_aggregate.aggregate.count} shares.`}
                            // </React.Fragment>
                            // }
                        />
                    </ListItem>
                </Link>
                <Divider component="li" />
            </Fragment>
        )
    }

    switch(notification.activity_type) {
        case 0:
            return likeNotif();
            break;
        case 1: 
            return repostNotif();
            break;
        case 2: 
            return repostNotif();   
            break;
        case 3: 
            return followAcceptNotif();
            break;    
        default: 
            return repostNotif();
            break;
    }
}