import React, { useEffect, useState} from 'react';
import UserSearchItem from './UserSearchItem.js';
import List from '@material-ui/core/List';

import {
    USER_SEARCH
} from 'EventQueries/EventQueries.js';

export default function UserSearchList(props) {

    let isMounted = false;

    const [users, setUsers] = useState([])

    const getUsers = () => {
        const text = `%${props.searchText}%`;
        props.client.query({
            query: USER_SEARCH,
            variables: {
                search: text
            }
        }).then((data) => {
            if(isMounted) {
                setUsers(data.data.users)
            }
        }).catch(error => {
            console.log(error)
        })
    }


    // Use Effect Function
    useEffect(() => {
        isMounted = true;

        getUsers();

        return () => {
            isMounted = false;
        }
    })

    return (
        <List>
            {
                users.map((user, index) => {
                    return (
                        <UserSearchItem
                            key={user.id} 
                            user={user}
                        />
                    )
                })
            }
        </List>
    )
}