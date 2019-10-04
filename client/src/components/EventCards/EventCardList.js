import React, { useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

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
      limit: 10,
      events: []
  });

  const grabEvents = () => {
    const { client } = props;
    const { filter } = props;

    if(filter.category == "Any") {
      //Do something
    }
      // query for public events
      client
        .query({
          query: QUERY_FILTERED_EVENT,
          variables: {
            eventLimit: values.limit,
            search: `%${filter.searchText}%`,
            category: filter.category,
            city: filter.city,
            state: filter.state,
            type: filter.type
          }
        })
        .then(data => {
          setValues({ ...values, events: data.data.events });
          const latestEventId = data.data.events.length
            ? data.data.events[0].id
            : null;
          // start a subscription
          client
            .subscribe({
              query: SUBSCRIPTION_EVENT_LOCAL_LIST,
              variables: { eventId: latestEventId } // update subscription when eventId changes
            })
            .subscribe({
              next(data) {
                if (data.data.events.length) {
                  setValues({
                      ...values,
                      showNew: true,
                      newEventsLength:
                      values.newEventsLength + data.data.events.length
                  });
                }
              },
              error(err) {
                console.error("err", err);
              }
            });
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
      console.log("EventCardList UseEffect()")
      grabEvents();
      console.log(values.events)
      console.log(props.filter)
    }, [props.filter])

    // Start Filtering Responses here. Since it's so fucking hard in GraphQL
    let finalEvents = values.events //[{name: "wtf", description: "aaah", category: "rap", image: {url: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Mallard2.jpg"}}]
    
    //console.log("Show New: ", values.showNew)

    // Components to Render
    return (
      <GridContainer>
        {
            finalEvents.map((event, index) => {
                return (
                <GridItem xs={12} sm={6} md={6} key={event.id}>
                    <EventCard 
                        event={event} 
                        //client={this.props.client}
                    />
                </GridItem>
                )
            })
        }
      </GridContainer>
    )
}