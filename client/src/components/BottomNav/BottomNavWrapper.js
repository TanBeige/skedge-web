import React, {useEffect} from 'react';
import BottomNav from './BottomNav.js';
import { useAuth0 } from "../../Authorization/react-auth0-wrapper";

import { useQuery } from '@apollo/react-hooks'
import {
    QUERY_BOTTOM_NAV
  } from 'EventQueries/EventQueries.js';
  

export default function BottomNavWrapper(props) {
    const { user } = useAuth0();
    const { loading, error, data } = useQuery(QUERY_BOTTOM_NAV, {variables: {userId: user.sub}});
    console.log(loading, error, data)
    useEffect(()=>{

    }, user)
    if (loading) return <div style={{marginTop: '30vh'}}>loading...</div>;
    if (error) return `Error! ${error.message}`;

    if(!loading){
        console.log(data)
        props.setNames(data.users[0].name, data.users[0].full_name);
    }

    
    

    return(
        <BottomNav notifs={data}/>
    )
}