import React, { Fragment, useEffect, useState} from 'react';
import {
    USER_SEARCH
} from 'EventQueries/EventQueries.js';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';


import FavoriteIcon from '@material-ui/icons/Favorite';
import RenewIcon from '@material-ui/icons/Autorenew'
import { Button } from '@material-ui/core';


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

    let isMounted = false;
    const classes = useStyles();

    const [users, setUsers] = useState([])

    const { user } = props;



    // Use Effect Function
    useEffect(() => {
        isMounted = true;


        return () => {
            isMounted = false;
        }
    })
    console.log("Test")

    let displayName = user.name;

    if (displayName.length > 16) {
        displayName = user.name.substring(0, 16);
        displayName += "..."
    }


    return (
        <Fragment key={user.id}>
                <ListItem style={{paddingLeft: 10, paddingRight: 0, height: '5em'}}>
                    <ListItemAvatar>
                        <Avatar 
                            alt={user.name}
                            //src={cloudinary.url(user.source.image.image_uuid, {secure: true, width: 100, height: 100, crop: "fill" ,fetch_format: "auto", quality: "auto"})} 
                            //src={user.other_user.picture}
                        />
                    </ListItemAvatar>
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
                                {user.full_name}
                            </Typography>
                        </React.Fragment>
                        }
                    />
                    <ListItemSecondaryAction>
                        <Button variant='outlined'>
                            Follow
                        </Button>
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
            </Fragment>
    )
}