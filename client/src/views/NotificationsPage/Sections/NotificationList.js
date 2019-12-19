import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import InfiniteScroll from 'react-infinite-scroll-component'

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

    let _isMounted = true;

    const classes = useStyles();

    const { user } = useAuth0();

    const [notifs, setNotifs] = useState({
      limit: 10,

      notifications: [],
      hasMore: true
    })

    //Change notification badge number in Tab
    const handleNumberChange = (num) => {
      props.changeNotifNums(num);
    }

    useEffect(() => {
      _isMounted = true;
      props.client.query({
          query: FETCH_NOTIFICATIONS,
          variables: {
              userId: user.sub,
              limit: notifs.limit,
              offset: 0
          }
      }).then((data) => {
        if(_isMounted) {
            setNotifs({
                ...notifs,
                notifications: data.data.notifications
            })
        }
      }).catch(error => {
          alert("Could not retrieve your notifications currently, try again later or report this to info@theskedge.come");
          console.log(error);
      })

      return () => {
        _isMounted = false;
      }
    }, [])

    const loadMore = () => {
      console.log("lets wrangl")
      props.client.query({
        query: FETCH_NOTIFICATIONS,
        variables: {
          userId: user.sub,
          limit: notifs.limit,
          offset: notifs.notifications.length
      }
      }).then(data => {
        if(_isMounted) {
          const mergedNotifs = notifs.notifications.concat(data.data.notifications)

          setNotifs({
            ...notifs,
            notifications: mergedNotifs,
            hasMore: data.data.notifications.length <= notifs.limit ? false : true
          })
        }
      }).catch(error => {
        console.log(error)
        if(_isMounted) {
          setNotifs({
            ...notifs,
            hasMore: false
          })
        }
      })
    }

    return (
      <InfiniteScroll 
        dataLength={notifs.notifications.length}
        next={loadMore}
        hasMore={true}
        loading={<p>loading...</p>}
      >
        <List className={classes.root}>
            {notifs.notifications.map((notif, index) => {
                return(
                    <NotificationListItem 
                        key={index}
                        notification={notif}
                        client={props.client}
                    />
                )
            })}
        </List>
      </InfiniteScroll>
    );
}

function TextDisplay({text}) {
    return(
        <div style={{textAlign: 'center', fontSize: 20, marginTop: 25}}>
            {text}
        </div>
    )
}