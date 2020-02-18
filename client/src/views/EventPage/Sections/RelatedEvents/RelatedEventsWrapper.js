import React, { useEffect, useState } from 'react'
import RelatedItem from 'components/Related/RelatedItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Button from 'components/CustomButtons/Button.js';

import history from "utils/history";

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
    const [events, setEvents] = useState([]);
    var dateString = props.start_date.match(/^(\d{4})\-(\d{2})\-(\d{2})$/);
    var eventDate = new Date( dateString[1], dateString[2]-1, dateString[3] );

    
    const goHome = () => {
        history.push('/home')
    }
    
    useEffect(()=>{
        // if recurring get day of the week for that week
        // Got this from: https://stackoverflow.com/questions/25492523/javascript-get-date-of-next-tuesday-or-friday-closest
        let varDate = getNextDate(props.weekday);
        
        props.client.query({
            query: QUERY_RELATED_EVENTS,
            variables: {
                eventId: props.currentEventId,
                city: props.city,
                state: props.state,
                date: props.is_recurring ? varDate : props.start_date,
                weekday: props.is_recurring ? `%${new Date(varDate).getDay()}%` : `%${eventDate.getDay()}%`
            }
        }).then((data)=>{
            let tempEvents = data.data.events;
            console.log(tempEvents)
            if(isMounted){
                setEvents(tempEvents);
            }
        }).catch((error)=>{
            console.error(error);
        })
        
    }, [])

    // Formatting the top date
    const moment = require('moment');
    let formatDate = props.is_recurring ? moment(getNextDate(props.weekday)) : moment(eventDate);
    console.log(props.start_date)
    formatDate = formatDate.format("dddd")

    return(
        <div className="RelatedWrapper">
            <h4 style={{textAlign: 'center'}}>Events for this {formatDate}</h4>
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
            <div style={{width: '100%', textAlign: 'center', padding: '1em'}}>
                <Button onClick={goHome} size='sm' round color='primary' style={{margin: 'auto'}}>Check other days</Button>
            </div>
        </div>
    )
}

function getNextDate(weekday) {
    // Set Variables
    console.log(weekday);
    if(weekday == ""){
        return new Date()
    }
    var numbers = weekday.match(/\d+/g).map(Number);    //Get numbers from string
    var today = new Date(), tuesday, friday, day, closest;

    // Check if today is any of the recurring days
    let i;
    for (i = 0; i < numbers.length; i++) {
        if(today.getDay() == numbers[i]){
            // if(today.getHours() < 23){
                // console.log(today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate())
                return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
            // }
        }
    }
    // Below code runs if above isn't returned
    day = today.getDay();
    console.log(day);

    // let dayDistance = day < numbers[0] ? numbers[0] - day : ((7 - day) + numbers[0]);
    let closestDay = new Date();
    closestDay.setDate(closestDay.getDate() + (numbers[0] - closestDay.getDay() + 7) % 7);

    for (i = 1; i < numbers.length; i++) {
        //Get how far the next of this weekday is
        let tempDate = new Date();
        tempDate.setDate(tempDate.getDate() + (numbers[i] - tempDate.getDay() + 7) % 7);

        if(tempDate < closestDay){
            closestDay = tempDate;
        }
    }

    // console.log(closestDay)
    return closestDay
}