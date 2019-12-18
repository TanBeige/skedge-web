import React, { useEffect, useState} from 'react';
import FollowRequestItem from './FollowRequestItem.js';

import List from '@material-ui/core/List';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';

//React-Apollo Graphql
import { Subscription } from "react-apollo";

import {
    FETCH_FOLLOW_REQUESTS
} from 'EventQueries/EventQueries.js';

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';


export default function FriendRequestsList(props) {

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

    // if(initialLoad) {
    //     return <div style={{textAlign: 'center', marginTop: 20}}><CircularProgress size={20} color='primary'/></div>
    // }

        return (
            // <InfiniteScroll
            // dataLength={values.usersLength}
            // next={loadMoreUsers}
            // hasMore={values.hasMoreUsers && !isSearch}
            // scrollThreshold={0.95}
            // loader={<div style={{textAlign: 'center'}}><CircularProgress size={20} color='primary'/></div>}
            // style={{overflow: 'none'}}
            // >   
            //     <List>
            //         {
            //             data.follower.map((user, index) => {
            //                 return (
            //                     <FollowRequestItem
            //                         key={index} 
            //                         userItem={user.user}
            //                         client={props.client}
            //                     />
            //                 )
            //             })
            //         }
            //     </List>
            // </InfiniteScroll>

            <Subscription subscription={FETCH_FOLLOW_REQUESTS} variables={{userId: user.sub}} >
                {({ loading, error, data }) => {
                    if (loading) {
                        return <TextDisplay text='Loading. Please wait...'/>
                    }
                    if (error) {
                        console.log(error)
                        return <TextDisplay text='Error loading requests.'/>
                    }
                    console.log(data)
                    if(data.follower.length === 0) {
                        return <TextDisplay text='No requests at this time.'/>
                    }
                    else {
                        return (
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
        )
    
}

function TextDisplay({text}) {
    return(
        <div style={{textAlign: 'center', fontSize: 20, marginTop: 25}}>
            {text}
        </div>
    )
}