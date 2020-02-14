import React, { useEffect, useState } from 'react'

import {
    QUERY_RELATED_EVENTS
} from 'EventQueries/EventQueries.js'

export default function RelatedEventsWrapper(props) {
    let isMounted = true;
    // const [values, setValues] = useState({
    //     start_date: props.start_date,
    //     weekday: "",
    //     is_recurring: true,
    // })
    const [events, setEvents] = useState([])
    
    useEffect(()=>{
        props.client.query({
            query: QUERY_RELATED_EVENTS,
            variables: {
                city: props.city,
                state: props.state,
                date: props.start_date,
                weekday: props.weekday
            }
        }).then((data)=>{
            console.log(data);
            if(isMounted){
                setEvents(data.data.events);
            }
        }).catch((error)=>{
            console.log(error)
        })
        
    })

    return("")
}