import { useQuery } from '@apollo/react-hooks';


import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import DealCard from "components/Deals/DealCard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import * as Scroll from 'react-scroll';

import {
    QUERY_LANDING_FEED
  } from "EventQueries/EventQueries";

const LIMIT = 3;
  
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

export default function LandingListNew(props) {
    const { filter } = props;

    const { loading, error, data } = useQuery(QUERY_LANDING_FEED, {
        variables: {
          limit: LIMIT,
          city: `${filter.city}`,
          state: `${filter.state}`,
          date: filter.date !== null ? filter.date.formatDate() : null,
          weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
        },
    });
    // if (loading) return <p>Loading ...</p>;
    console.log(data)

    let finalEvents = []
    let finalDeals = []
    if(!loading) {
        finalEvents = data.events
        finalDeals = data.deals
    }
    return (
        <div id='scrollableDiv'>
            <div style={{width: '100%'}}>
                <h3 style={{margin: 'auto', maxWidth: 350, backgroundColor: 'white', borderRadius: 2, marginTop: '2em',zIndex: 0, fontWeight: '300', fontFamily: `'Helvetica', 'Arial'`,fontSize: '1.5em'}}  >Deals in Tallahassee, FL.</h3>
            </div>
            
            <hr />
            
            <GridContainer justify='center' style={{minHeight: '8em', margin: '10px 0px 0px 0px'}}>
                {
                    !loading ? 
                    finalDeals.map((deal, index) => {
                        return (
                        <Fragment key={deal.id}>
                            <GridItem xs={12} sm={3} md={3}>
                                <DealCard 
                                    itemInfo={deal} 
                                    listType={"landing"}
                                    client={props.client}
                                    userId={props.userId}
                                    currentDate={props.filter.date}
                                />
                            </GridItem>
                        </Fragment>
                        )
                    })
                    : ""
                }
            </GridContainer>

            <div style={{width: '100%'}}>
                <h3 style={{margin: 'auto', maxWidth: 350, backgroundColor: 'white', borderRadius: 2, marginTop: '2em',zIndex: 0, fontWeight: '300', fontFamily: `'Helvetica', 'Arial'`,fontSize: '1.5em'}}  >Events in Tallahassee, FL.</h3>
            </div>

            <hr />
            
            <GridContainer justify='center' style={{minHeight: '8em', margin: '10px 0px 0px 0px'}}>
                {
                    !loading ? 
                    finalEvents.map((event, index) => {
                        return (
                        <Fragment key={event.id}>
                            <GridItem xs={12} sm={3} md={3}>
                            <EventCard 
                                event={event} 
                                listType={"landing"}
                                client={props.client}
                                userId={props.userId}
                                filter={props.filter}
                                currentDate={props.filter.date}
                            />
                            </GridItem>
                        </Fragment>
                        )
                    })
                    : ""
                }
            </GridContainer>
        </div>
    )
}
