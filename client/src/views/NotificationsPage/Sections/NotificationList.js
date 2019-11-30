import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import NotificationListItem from './NotificationListItem.js';
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';

import {
    FETCH_NOTIFICATIONS
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

export default function NotificationList(props) {
    const classes = useStyles();

    const { user } = useAuth0();
    console.log("running")

    const [values, setValues] = useState({
        notifications: []
    })

    useEffect(() => {
        props.client.query({
            query: FETCH_NOTIFICATIONS,
            variables: {
                userId: user.sub
            }
        }).then((data) => {
            setValues({
                ...values,
                notifications: data.data.notifications
            })
        }).catch(error => {
            alert("Could not retrieve your notifications currently, try again later or report this to info@theskedge.come");
            console.log(error);
        })
    }, [])

    return (
        <List className={classes.root}>
            {
                values.notifications.map((notif, index) => {
                    return(
                        <NotificationListItem 
                            key={index}
                            notification={notif}
                            client={props.client}
                        />
                    )
                })
            }
        </List>
    );
}