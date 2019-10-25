import React, { useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';

import gql from 'graphql-tag'

//Lodash!
import debounce from 'lodash/debounce';

import {
    QUERY_FILTERED_EVENT,
    QUERY_LOCAL_EVENT,
    QUERY_FEED_LOCAL_EVENT,
    QUERY_FEED_LOCAL_OLD_EVENT,
    SUBSCRIPTION_EVENT_LOCAL_LIST
} from "../../EventQueries/EventQueries";
import { Button } from '@material-ui/core';
import { array } from 'prop-types';

export default function EventCardList(props) {

  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false)


  const [values, setValues] = useState({
      type: props.type,
      filter: props.filter,
      showNew: false,
      loadedAllEvents: false,
      showOlder: true,
      eventsLength: 0,
      showNew: false,
      limit: props.filter.limit,
      events: [],
  });

  const grabEvents = () => {
    const { client } = props;
    const { filter } = props;


    if(!values.showNew) {

      setIsSearch(true)


      let cat = filter.category;
      if(filter.category == "Any") {
        cat = ""
      }
        // query for public events
        client
          .query({
            query: QUERY_FILTERED_EVENT,
            variables: {
              eventLimit: values.limit,
              eventOffset: 0,
              search: `%${filter.searchText}%`,
              category: `%${cat}%`,
              city: `%${filter.city}%`,
              state: `%${filter.state}%`,
              type: filter.type,
              date: filter.date
            }
          })
          .then(data => {
            console.log(data)
            setValues({ 
              ...values, 
              events: data.data.events, 
              eventsLength: data.data.events.length
            });

            // When done grabbing events, set seraching to false
            setIsSearch(false)


            // Commented out because subscriptions cause loading problems
            
            // const latestEventId = data.data.events.length
            //   ? data.data.events[0].id
            //   : null;
            // start a subscription
            // client
            //   .subscribe({
            //     query: SUBSCRIPTION_EVENT_LOCAL_LIST,
            //     variables: { eventId: latestEventId } // update subscription when eventId changes
            //   })
            //   .subscribe({
            //     next(data) {
            //       if (data.data.events.length) {
            //         setValues({
            //             ...values,
            //             showNew: true,
            //             newEventsLength:
            //             newEventsLength + data.data.events.length,
            //         });
            //       }
            //     },
            //     error(err) {
            //       console.error("err", err);
            //     }
            //   });
          });
      }
    }

    // Update Query When new Events are added
    const loadMoreClicked = () => {
      console.log("Loading more Events")
      const { client } = props;
      const { filter } = props;

      const totalEventsPrevious = values.eventsLength;

      let cat = filter.category;
      if(filter.category == "Any") {
        cat = ""
      }
      console.log(values.eventsLength)
      client
        .query({
          query: QUERY_FILTERED_EVENT,
          variables: {
            eventLimit: values.limit,
            eventOffset: values.eventsLength,
            search: `%${filter.searchText}%`,
            category: `%${cat}%`,
            city: `%${filter.city}%`,
            state: `%${filter.state}%`,
            type: filter.type,
            date: filter.date
          }
        })
        .then(data => {
          if (data.data.events.length) {
            console.log(data)
            const mergedEvents = values.events.concat(data.data.events);

            // update state with new events
            setValues({ 
              ...values,
              events: mergedEvents,
              showNew: true,
              eventsLength: values.events.length + data.data.events.length
             });
          }
        });

      if(totalEventsPrevious === values.eventsLength) {
        setValues({
          ...values,
          loadedAllEvents: true
        })
      }
    }

    // Replaces ComponentDidMount() in a Functional Component

    useEffect(() => {
      grabEvents();
    }, [props.filter, values.events])

    /*
    const insertAd = (index) => {
      if((index % 6) === 5) {
        return (
          <GridItem xs={12} sm={6} md={6} key={event.id}>
            <div id="258077193">
                <script type="text/javascript">
                  {
                    tryAd()
                  }
                </script>
            </div>
          </GridItem>
        )
      }
      else {
        return
      }
    }

    const tryAd = () => {
      try {
          window._mNHandle.queue.push(function () {
            window._mNDetails.loadTag("258077193", "180x150", "258077193");
          });
      }
      catch (error) {}
    }
    */

    // Start Filtering Responses here. Since it's so fucking hard in GraphQL
    let finalEvents = values.events
    
    if(isSearch) {
      return (
        <div style={{textAlign: 'center', margin: 20}} >
          <CircularProgress color="primary" />
        </div>
      )
    }

    // Components to Render

    if(values.events.length === 0 && !isSearch)
    {
      return(
        <div>
          <h5 style={{marginTop: 20, textAlign: 'center'}}>No events found. <span role="img" aria-label="sad">😔</span></h5>
        </div>
      )
    }

    return (
      <GridContainer>
        {
            finalEvents.map((event, index) => {
                return (
                  <GridItem xs={12} sm={6} md={6} key={event.id}>
                      <EventCard 
                          event={event} 
                          client={props.client}
                          userId={props.userId}
                      />
                      {
                        //insertAd(index)   //Add later when Skedge.com can get ads
                      }
                  </GridItem>
                )
            })
        }
        {
          !values.loadedAllEvents ? 
          (
          <GridItem xs={12} sm={6} md={6} style={{margin: 'auto'}}>
            <div style={{margin: 'auto'}}>
              <Button variant="outlined" onClick={loadMoreClicked}>Load More</Button>
            </div>
          </GridItem>
          ) : 
          ""

        }
      </GridContainer>
    )
}