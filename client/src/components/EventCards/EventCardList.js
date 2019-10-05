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

export default function EventCardList(props) {

  const [values, setValues] = useState({
      type: props.type,
      filter: props.filter,
      showNew: false,
      showOlder: true,
      newEventsLength: 0,
      limit: props.filter.limit,
      events: [],

      loadingEvents: false
  });

  const grabEvents = () => {
    const { client } = props;
    const { filter } = props;

    let cat = filter.category;
    if(filter.category == "Any") {
      cat = ""
    }
    // TODO: private events don't show up when "Any" category is chosen
      // query for public events
      client
        .query({
          query: QUERY_FILTERED_EVENT,
          variables: {
            eventLimit: values.limit,
            search: `%${filter.searchText}%`,
            category: `%${cat}%`,
            city: `%${filter.city}%`,
            state: `%${filter.state}%`,
            type: filter.type
          }
        })
        .then(data => {
          setValues({ 
            ...values, 
            events: data.data.events, 
            loadingEvents: data.loading
          });

          //Commented out because subscriptions break it
          
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

    // Update Query When new Events are added
    const loadMoreClicked = () => {
      const { client } = this.props;
      this.setState({ showNew: false, newEventsLength: 0 });
      client
        .query({
          query: QUERY_FEED_LOCAL_EVENT,
          variables: {
            eventId: this.state.events.length ? this.state.events[0].id : null
          }
        })
        .then(data => {
          if (data.data.events.length) {
            const mergedEvents = data.data.events.concat(this.state.events);
            // update state with new events
            this.setState({ events: mergedEvents });
          }
        });
    }

    // Replaces ComponentDidMount() in a Functional Component
    useEffect(() => {
      grabEvents();
    }, [props.filter])

    // Start Filtering Responses here. Since it's so fucking hard in GraphQL
    let finalEvents = values.events
    console.log("Events: ", values.events)
    console.log("eventlist props: ", props)
    
    if(values.loadingEvents) {
      return (
        <div>
          <CircularProgress color="primary" />
        </div>
      )
    }

    // Components to Render

    if(values.events.length === 0)
    {
      return(
        <div>
          <h5 style={{marginTop: 20}}>No events found.</h5>
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
                    />
                </GridItem>
                )
            })
        }
      </GridContainer>
    )
}