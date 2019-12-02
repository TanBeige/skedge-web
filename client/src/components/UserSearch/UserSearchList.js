import React, { useEffect, useState} from 'react';

export default function UserSearchList(props) {

    let isMounted = false;

    const getUsers = () => {
        // props.client.query({
        //     query: ,
        //     variables: {
        //         search: props.searchText
        //     }
        // })
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
        <div>
            <h4>@tanarin</h4>
            <h4>@tanarin</h4>
            <h4>@tanarin</h4>
            <h4>@tanarin</h4>
            <h4>@tanarin</h4>
            <h4>@tanarin</h4>
            <h4>@tanarin</h4>
        </div>
    )
}