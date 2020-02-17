import React, { useEffect, useState } from 'react'
import RelatedItem from 'components/Related/RelatedItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import lodash from 'lodash'

import {
    QUERY_RELATED_EVENTS
} from 'EventQueries/EventQueries.js'

// Formatting Date Filter
Date.prototype.formatDate = function() {
    var d = new Date(this.valueOf()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-');
}

export default function RelatedEventsWrapper(props) {
    let isMounted = true;
    const [events, setEvents] = useState([])
    
    useEffect(()=>{
        console.log("date sent", props.is_recurring ? new Date().formatDate() : props.start_date);

        // if recurring get day of the week for that week
        // Got this from: https://stackoverflow.com/questions/25492523/javascript-get-date-of-next-tuesday-or-friday-closest
        let varDate = props.start_date;
        if(props.is_recurring) {
            const today = new Date();
            let day = today.getDay();

            let nextDate = today.getDate() - day + (day === 0 ? -6 : parseInt(props.weekday, 10));
            console.log(nextDate);
            varDate = nextDate
        }
        
        props.client.query({
            query: QUERY_RELATED_EVENTS,
            variables: {
                eventId: props.event_id,
                city: props.city,
                state: props.state,
                date: props.is_recurring ? new Date().formatDate() : props.start_date,
                weekday: `%${props.weekday}%`
            }
        }).then((data)=>{
            let tempEvents = data.data.events;
            console.log(props);
            console.log(tempEvents)

            tempEvents.splice(lodash.indexOf(tempEvents, lodash.find(tempEvents, function (item) { return item.id == props.currentEventId; })), 1);

            if(isMounted){
                setEvents(tempEvents);
            }
        }).catch((error)=>{
            console.error(error);
        })
        
    }, [])

    return(
        <div className="RelatedWrapper">
            <GridContainer>
                {
                    events.map(event => {
                        return(
                            <GridItem key={event.id} xs={12} md={6}>
                                <RelatedItem item={event} type="event"/>
                            </GridItem>
                        )
                    })
                }
            </GridContainer>
        </div>
    )
}