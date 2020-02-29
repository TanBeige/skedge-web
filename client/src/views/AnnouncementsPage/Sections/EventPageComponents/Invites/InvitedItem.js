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
    MUTATION_REMOVE_INVITE,
    MUTATION_EVENT_RESPONSE
  } from 'EventQueries/EventQueries.js'
//import "../../styles/App.css";

// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});


const InvitedItem = ({
    account,
    response,
    profileId,
    eventId,
    client
    }) => {

    // if accountButton = 1, account; if = 0, Invited, if = -1, not added; if = -2 then current user; 
    const [responseShown, setResponseShown] = useState(response);
    const { user } = useAuth0();

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

    const removeInvite = () => {
        client.mutate({
            mutation: MUTATION_REMOVE_INVITE,
            // refetch
            variables: {
                userId: profileId,
                eventId: eventId
            }
        }).then(() =>{
            setResponseShown(-1);
        });
    }
    const addInvite = () => {
        client.mutate({
            mutation: MUTATION_EVENT_RESPONSE,
            // refetch
            variables: {
                invitedId: profileId,
                inviterId: user.sub,
                eventId: eventId, 
                response: 0
            }
        }).then(() =>{
            setResponseShown(0);
        });
    }


    const placeAccountButton = () => {
        if(responseShown === 1) {
            return (
                <Button size="sm" onClick={removeInvite}>
                    Uninvite
                </Button>
            )
        }
        else if (responseShown === -1){
            return (
                <Button color='primary' size="sm" onClick={addInvite}>
                    Invite
                </Button>
            )
        }
        else {
            return (
                <Button size="sm" onClick={removeInvite}>
                    Invited
                </Button>
            )
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
  
InvitedItem.propTypes = {
    account: PropTypes.object.isRequired,
};
  
  export default InvitedItem;