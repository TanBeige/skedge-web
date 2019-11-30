import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';

import {
    SEE_NOTIFICATION
} from 'EventQueries/EventQueries.js';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default function NotificationListItem(props) {
    const classes = useStyles();
    const { user } = useAuth0();
    const { notification } = props;

    useEffect(() => {
        props.client.mutate({
            mutation:SEE_NOTIFICATION,
            variables: {
                id: notification.id
            }
        })
    })
    console.log(notification);

    const likeNotif = () => {
        return (
            <Fragment key={notification.id}>
                <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                    primary="Brunch this weekend?"
                    style={{backgroundColor: notification.seen ? 'white' : 'lightblue'}}
                    secondary={
                    <React.Fragment>
                        <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                        >
                        {notification.activity_type}
                        </Typography>
                        {" — I'll be in your neighborhood doing errands this…"}
                    </React.Fragment>
                    }
                />
                </ListItem>
                <Divider component="li" />
            </Fragment>
        )
    }

    const repostNotif = () => {
        return (
            <h3>{notification.activity_type}</h3>
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
            return repostNotif();
            break;    
        default: 
            return repostNotif();
            break;
    }
}