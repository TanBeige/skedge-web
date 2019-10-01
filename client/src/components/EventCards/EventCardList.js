import React, { useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

//Lodash!
import debounce from 'lodash/debounce';

import {
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
      limit: 5,
      events: []
  });

  const grabEvents = () => {
    const { client } = props;
      // query for public events
      client
        .query({
          query: QUERY_LOCAL_EVENT,
          variables: { eventLimit: values.limit }
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

    useEffect(() => {
      console.log("useffect")
      grabEvents();
    }, [props.type, props.filter])

    let finalEvents = values.events //[{name: "wtf", description: "aaah", category: "rap", image: {url: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Mallard2.jpg"}}]

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