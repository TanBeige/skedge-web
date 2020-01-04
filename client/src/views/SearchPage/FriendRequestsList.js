import React, { useEffect, useState} from 'react';
import FollowRequestItem from './FollowRequestItem.js';

import List from '@material-ui/core/List';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';

import {
    FETCH_FOLLOW_REQUESTS
} from 'EventQueries/EventQueries.js';

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';


export default function FriendRequestsList(props) {

    let isMounted = true;

    const { user } = useAuth0();

    const [values, setValues] = useState({
        usersLength: 0,
        hasMoreUsers: true,
        limit: 15
    })

    const [usersList, setUsersList] = useState([])
    const [isSearch, setIsSearch] = useState(false)
    const [initialLoad, setInitialLoad] = useState(false)

    // GraphQL fetch users
    const getUsers = () => {
        setIsSearch(true);
        setInitialLoad(true);
        props.client.query({
            query: FETCH_FOLLOW_REQUESTS,
            variables: {
                userId: user.sub,
                limit: values.limit,
                offset: values.usersLength
            }
        }).then((data) => {
            console.log("datatatata", data)

            if(isMounted) {
                setUsersList(data.data.follower);
                setValues({
                    ...values,
                    hasMoreUsers: data.data.follower.length < values.limit ? false : true,
                    usersLength: data.data.follower.length
                })
            }
            setIsSearch(false);
            setInitialLoad(false);
        }).catch(error => {
            console.log(error)
            if(isMounted) {
                setIsSearch(false);
                setInitialLoad(false);
            }
        })
    }

    const loadMoreUsers = () => {
        setIsSearch(true);
        props.client.query({
            query: FETCH_FOLLOW_REQUESTS,
            variables: {
                userId: user.sub,
                limit: values.limit,
                offset: values.usersLength
            }
        }).then((data) => {
            if(isMounted && data.data.follower.length > 0) {

                //const tempUsers = data.data.follower.filter(val => !users.includes(val));
                //let mergedUsers = users.concat(tempUsers);
                //mergedUsers = mergedUsers.filter(val => !users.includes(val));
                const mergedUsers = usersList.concat(data.data.follower);


                setUsersList(mergedUsers);
                setValues({
                    ...values,
                    hasMoreUsers: data.data.follower.length < values.limit ? false : true,
                    usersLength: mergedUsers.length
                })
                setIsSearch(false);
            }
        }).catch(error => {
            console.log(error)
            if(isMounted) {
                setIsSearch(false);
            }
        })
    }

    // Use Effect Function
    useEffect(() => {
        isMounted = true;

        
        getUsers();

        return () => {
            isMounted = false;
        }
    }, [props.searchText])

    if(initialLoad) {
        return <div style={{textAlign: 'center', marginTop: 20}}><CircularProgress size={20} color='primary'/></div>
    }
    else{
        return (
            <InfiniteScroll
            dataLength={values.usersLength}
            next={loadMoreUsers}
            hasMore={values.hasMoreUsers && !isSearch}
            scrollThreshold={0.95}
            loader={<div style={{textAlign: 'center'}}><CircularProgress size={20} color='primary'/></div>}
            style={{overflow: 'none'}}
            >   
                <List>
                    {
                        usersList.map((user, index) => {
                            return (
                                <FollowRequestItem
                                    key={index} 
                                    userItem={user.user}
                                    client={props.client}
                                />
                            )
                        })
                    }
                </List>
            </InfiniteScroll>
        )
    }
}