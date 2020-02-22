import React, { useEffect, useState} from 'react';
import UserSearchItem from './UserSearchItem.js';
import List from '@material-ui/core/List';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
// import SearchIcon from '@material-ui/icons/Search';
import {
    USER_SEARCH
} from 'EventQueries/EventQueries.js';
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';

import { Facebook } from 'react-content-loader'


export default function UserSearchList(props) {

    let isMounted = true;

    const [values, setValues] = useState({
        usersLength: 0,
        hasMoreUsers: true,
        limit: 15
    })

    const [users, setUsers] = useState([])
    const [isSearch, setIsSearch] = useState(false)
    const [initialLoad, setInitialLoad] = useState(false)
    const { user } = useAuth0();


    // GraphQL fetch users
    const getUsers = () => {
        const text = `%${props.searchText}%`;
        setIsSearch(true);
        setInitialLoad(true);
        props.client.query({
            query: USER_SEARCH,
            variables: {
                search: text,
                limit: values.limit,
                offset: values.usersLength,
                userId: user.sub
            }
        }).then((data) => {
            if(isMounted) {
                setUsers(data.data.users);
                setValues({
                    ...values,
                    hasMoreUsers: data.data.users.length < values.limit ? false : true,
                    usersLength: data.data.users.length
                })
            }
            setIsSearch(false);
            setInitialLoad(false);
        }).catch(error => {
            if(isMounted) {
                setIsSearch(false);
                setInitialLoad(false);
            }
        })
    }

    const loadMoreUsers = () => {
        console.log("loading more users")
        const text = `%${props.searchText}%`;
        setIsSearch(true);
        props.client.query({
            query: USER_SEARCH,
            variables: {
                search: text,
                limit: values.limit,
                offset: values.usersLength,
                userId: user.sub

            }
        }).then((data) => {
            if(isMounted && data.data.users.length > 0) {

                //const tempUsers = data.data.users.filter(val => !users.includes(val));
                //let mergedUsers = users.concat(tempUsers);
                //mergedUsers = mergedUsers.filter(val => !users.includes(val));
                const mergedUsers = users.concat(data.data.users);


                setUsers(mergedUsers);
                setValues({
                    ...values,
                    hasMoreUsers: data.data.users.length < values.limit ? false : true,
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

    // const getSuggestedUsers = () => {
    //     setIsSearch(true);
    //     props.client.query({
    //         query: ,
    //         variables: {
    //             userId: 
    //         }
    //     }).then((data) => {
    //         if(isMounted) {
    //             setUsers(data.data.users);
    //         }
    //         setIsSearch(false);
    //         setInitialLoad(false);
    //     }).catch(error => {
    //         console.log(error)
    //         if(isMounted) {
    //             setIsSearch(false);
    //             setInitialLoad(false);
    //         }
    //     })
    // }

    // Use Effect Function
    useEffect(() => {
        isMounted = true;

        if(props.searchText !== "")
        {
            getUsers();
        }
        else {
            //getSuggestedUsers();
        }

        return () => {
            isMounted = false;
        }
    }, [props.searchText])

    if(props.searchText === "") {
        return (
            <div style={{textAlign: 'center', marginTop: 20}}>
                <PeopleAltIcon fontSize='large'/>
            </div>
        )
    }
    else if(initialLoad) {
        return (
            <GridContainer>
                <GridItem xs={12}>
                    <Facebook />
                </GridItem>
            </GridContainer>
        )
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
                        users.map((user, index) => {
                            return (
                                <UserSearchItem
                                    key={user.id} 
                                    userItem={user}
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