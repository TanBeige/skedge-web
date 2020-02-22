import React, { useEffect, useState} from 'react';
import FollowRequestItem from './FollowRequestItem.js';

import List from '@material-ui/core/List';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';

//React-Apollo Graphql
import { Subscription } from "react-apollo";

import {
    FETCH_FOLLOW_REQUESTS,
    SUBSCRIBE_USER_EVENT_INVITES
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
    }, [props.searchText, props.client])

    //Change notification badge number in Tab
    const handleNumberChange = (num) => {
        props.changeRequestNums(num);
    }


        return (
<div>
            <Subscription subscription={FETCH_FOLLOW_REQUESTS} variables={{userId: user.sub}} >
                {({ loading, error, data }) => {
                    if (loading) {
                        return <TextDisplay text='Loading. Please wait...'/>
                    }
                    if (error) {
                        console.log(error)
                        return <TextDisplay text='Error loading requests.'/>
                    }
                    if(data.follower.length === 0) {
                        return <TextDisplay text='You have no new friend requests.'/>
                    }
                    else {
                        handleNumberChange(data.follower.length)
                        return (
                            // User Follow Requests/ Event invite requests
                            <List>
                                {
                                    data.follower.map((user, index) => {
                                        return(
                                            <FollowRequestItem
                                                key={index} 
                                                userItem={user.user}
                                                client={props.client}
                                            />
                                        )
                                    })                                
                                }
                            </List>
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