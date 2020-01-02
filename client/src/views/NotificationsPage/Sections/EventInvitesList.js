import React, { useEffect, useState} from 'react';
import EventInviteItem from './EventInviteItem.js';

import List from '@material-ui/core/List';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";


//React-Apollo Graphql
import { Subscription } from "react-apollo";

import {
    FETCH_EVENT_INVITES
} from 'EventQueries/EventQueries.js';

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';


// SHOWS REQUESTS FOR EVENTS TOO

export default function RequestList(props) {

    let isMounted = true;

    const { user } = useAuth0();

    // Use Effect Function
    useEffect(() => {
        isMounted = true;
        // getUsers();
        return () => {
            isMounted = false;
        }
    }, [props.searchText])

    //Change notification badge number in Tab
    const handleNumberChange = (num) => {
        props.changeInviteNums(num);
    }


        return (
<div>
            <Subscription subscription={FETCH_EVENT_INVITES} variables={{userId: user.sub}} >
                {({ loading, error, data }) => {
                    if (loading) {
                        return <TextDisplay text='Loading. Please wait...'/>
                    }
                    console.log(data)
                    if (error) {
                        console.log(error)
                        return <TextDisplay text='Error loading requests.'/>
                    }
                    if(data.users[0].event_invites.length === 0) {
                        return <TextDisplay text='No event invites at this time.'/>
                    }
                    else {
                        handleNumberChange(data.users[0].event_invites.length)
                        return (
                            // User Follow Requests/ Event invite requests
                            <GridContainer>
                                {
                                    data.users[0].event_invites.map((event, index) => {
                                        return(
                                            <EventInviteItem
                                                key={index} 
                                                eventItem={event}
                                                client={props.client}
                                            />
                                        )
                                    })                                
                                }
                            </GridContainer>
                        );
                    }
                }}
            </Subscription>
</div>
        )
    
}

function TextDisplay({text}) {
    return(
        <div style={{textAlign: 'center', fontSize: 20, marginTop: 25}}>
            {text}
        </div>
    )
}