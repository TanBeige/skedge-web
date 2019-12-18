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

//React-Apollo Graphql
import { Subscription } from "react-apollo";

import {
    FETCH_NOTIFICATIONS,
    QUERY_BOTTOM_NAV

} from 'EventQueries/EventQueries.js';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    //maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default function NotificationList(props) {
    const classes = useStyles();

    const { user } = useAuth0();

    const [values, setValues] = useState({
        notifications: []
    })

    return (
        <Subscription subscription={FETCH_NOTIFICATIONS} variables={{userId: user.sub}} >
          {({ loading, error, data }) => {
            if (loading) {
              return <TextDisplay text='Loading. Please wait...'/>
            }
            if (error) {
                console.log(error)
                return <TextDisplay text='Error loading notifications.'/>
            }
            console.log(data)
            return (
                <List className={classes.root}>
                    {data.notifications.map((notif, index) => {
                        return(
                            <NotificationListItem 
                                key={index}
                                notification={notif}
                                client={props.client}
                            />
                        )
                    })}
                </List>
            );
          }}
        </Subscription>
      );
}

function TextDisplay({text}) {
    return(
        <div style={{textAlign: 'center', fontSize: 20, marginTop: 25}}>
            {text}
        </div>
    )
}