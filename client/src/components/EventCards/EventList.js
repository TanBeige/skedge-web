
/*
    the tanmeister: this is a demo of the unified file for the Event Lists. - 
        There will be one of these for the future lists as well.
*/

import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";

import EventCardListFuture from './EventCardListFuture.js';
import FutureContainer from './FutureContainer.js';
import { Instagram } from 'react-content-loader'

import LoadCardList from '../LoadCardList.js';

import * as Scroll from 'react-scroll';

import { throttle } from 'lodash';


//const MyInstagramLoader = () => <Instagram />

import {
    QUERY_FILTERED_EVENT
} from "EventQueries/EventQueries";

const dateHeaderStyle = {
  textAlign: 'center',
  color: "black",
  backgroundColor: "#F0F3BD",
  border: "1px solid grey",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
}

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

// Functional Component
export default function EventCardListHome(props) {
  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false);
  let isMounted = true;
  let currentKey;
  let futureEvents = "";

  let ScrollLink = Scroll.Link;
  let Element = Scroll.Element;


  const [values, setValues] = useState({
      type: props.type,
      filter: props.filter,
      loadedAllEvents: false,
      showOlder: true,
      eventsLength: 0,
      showNew: false,
      limit: props.filter.limit,
      events: [],
  });


    // Update Query When new Events are added
    const loadMoreClicked = () => {
      const { client } = props;
      const { filter } = props;

      let cat = filter.category;
      if(filter.category == "Any") {
        cat = ""
      }
      client.query({
          query: QUERY_FILTERED_EVENT,
          variables: {
            eventLimit: values.limit,
            eventOffset: values.eventsLength,
            search: `%${filter.searchText}%`,
            category: `%${cat}%`,
            city: `%${filter.city}%`,
            state: `%${filter.state}%`,
            lowerPrice: filter.lowerPrice === "" ? null : filter.lowerPrice,
            upperPrice: filter.upperPrice === "" ? null : filter.upperPrice,
            type: filter.type,
            date: filter.date ? filter.date.formatDate() : null,
            weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
          }
        })
        .then(data => {
          if (data.data.events.length) {
            let mergedEvents = values.events.concat(data.data.events);

            //Remove Duplicates from array
            mergedEvents = mergedEvents.filter((thing, index, self) => self.findIndex(t => t.id === thing.id) === index)


            // update state with new events
            if(isMounted) {
              setValues({
                ...values,
                events: mergedEvents,
                showNew: true,
                eventsLength: values.events.length + data.data.events.length
              });
              setIsSearch(false)
            }
          }
          else {
            if(isMounted) {
                setValues({
                    ...values,
                    loadedAllEvents: true
                })
                setIsSearch(false)
            }
          }
        }).catch(error => {
          console.log(error)
        });
    }

    //Throttle LoadMore so we don't load too much at once
    const loadMoreThrottled = throttle(loadMoreClicked, 100);


    // Replaces ComponentDidMount() in a Functional Component
    if (values.loadedAllEvents) {
      futureEvents = (
        <FutureContainer
          client={props.client}
          filter={props.filter}
          userId={props.userId}
        />
      )
    }

    useEffect(() => {
      //Restart the get events
      setValues({
        type: props.type,
        filter: props.filter,
        loadedAllEvents: false,
        showOlder: true,
        eventsLength: 0,
        showNew: false,
        limit: props.filter.limit,
        events: [],
      });

      currentKey = Math.floor(Math.random() * Math.floor(1000))
      //setIsMounted(true)

      //grabEvents();
      // ----------------------------GRABBING EVENTS IF MOUNTED--------------------------------
      isMounted = true;
      const { client } = props;
      const { filter } = props;

      let cat = filter.category;
      if(filter.category == "Any") {
        cat = ""
      }
      setIsSearch(true)

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
            lowerPrice: filter.lowerPrice === "" ? null : filter.lowerPrice,
            upperPrice: filter.upperPrice === "" ? null : filter.upperPrice,
            type: filter.type,
            date: filter.date !== null ? filter.date.formatDate() : null,
            weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
          }
        })
        .then(data => {
          if (data.data.events.length > 0) {
            //const mergedEvents = values.events.concat(data.data.events);
            // update state with new events
            if(isMounted) {
              setValues({
                ...values,
                events: data.data.events,
                showNew: true,
                eventsLength: data.data.events.length,
                loadedAllEvents: data.data.events.length < props.filter.limit
              });
              setIsSearch(false);
            }
          }
          else {
            if(isMounted) {
              setValues({
                ...values,
                events: data.data.events,
                eventsLength: data.data.events.length,
                loadedAllEvents: true
              })
              setIsSearch(false);
            }
          }
        }).catch(error => {
          console.log(error)
          setIsSearch(false);
        });

        // tryAd()

      return () => {
        isMounted = false;
      }
    }, [props.filter])

    
    const insertAd = (index) => {
      if((index % 6) === 5) {
        return (
          <GridItem xs={12} sm={6} md={6} key={index}>
            <div id="663225813">
                {/* <script type="text/javascript"> */}
                  {
                    // tryAd()
                  }
                {/* </script> */}
            </div>
          </GridItem>
        )
      }
      else {
        return
      }
    }

    // const tryAd = () => {
    //   try {
    //     window._mNHandle.queue.push(function () {
    //         window._mNDetails.loadTag("663225813", "300x250", "663225813");
    //     });
    //     console.log("Assss")

    //   }
    //   catch (error) {
    //     console.log(error)
    //   }
    // }
    

    // Start Filtering Responses here. Since it's so fucking hard in GraphQL
    let finalEvents = values.events
    
    if(isSearch) {
      return (
        <LoadCardList />
      )
    }

    // // Components to Render
    // const futureEvents = () => {
    //   console.log("LoadedAll: ", values.loadedAllEvents)
    //   console.log("showNew: ", values.showNew)
    //   //if(values.loadedAllEvents) {
    //     return(
    //       <div>
    //         <FutureContainer
    //           client={props.client}
    //           filter={props.filter}
    //           userId={props.userId}
    //         />
    //       </div>
    //     )
    //   // }
    //   // else {
    //   //   return ""
    //   // }
    // }


    if(values.events.length === 0 && !isSearch)
    {
      return(
        <div id='scrollableDiv' style={{height: '65vh', overflowY: 'auto', overflowX: 'hidden'}} key={currentKey}>
          <Element name="listTop"></Element>
          <h5 style={{marginTop: 20, textAlign: 'center'}}>There are no events this day.</h5>
            <hr />
            {
                values.loadedAllEvents ? <h2 style={{textAlign: 'center'}}>Future Events</h2> : ""
            }
          {futureEvents}
        </div>
      )
    }


    return (
      <div id='scrollableDiv' style={{height: '65vh', overflowY: 'auto', overflowX: 'hidden'}} key={currentKey}>
        <Element name="listTop"></Element>
        <InfiniteScroll
            dataLength={values.eventsLength}
            next={loadMoreThrottled}
            hasMore={!values.loadedAllEvents}
            //loader={<div style={{textAlign: 'center'}}><CircularProgress size={20} color='primary'/></div>}
            loader={<LoadCardList />}
            style={{overflow: 'none'}}
        >
          <GridContainer justify='center' style={{minHeight: '8em', margin: '10px 0px 0px 0px'}}>
              {
                finalEvents.map((event, index) => {
                    return (
                      <Fragment key={event.id}>
                        <GridItem xs={12} sm={6} md={6}>
                          <EventCard 
                              event={event} 
                              listType={"home"}
                              client={props.client}
                              userId={props.userId}
                              filter={props.filter}
                              currentDate={props.filter.date}
                          />
                        </GridItem>
                        {
                          // insertAd(index)   //Add later when Skedge.com can get ads
                        }
                      </Fragment>
                    )
                })
            }
          </GridContainer>
        </InfiniteScroll>
        <hr />
        {
            values.loadedAllEvents ? <h2 style={{textAlign: 'center'}}>Future Events</h2> : ""
        }
        {futureEvents}
      </div>
    )
}

const localFeedQuery = {
    query: QUERY_FILTERED_EVENT,
    variables: {
      eventLimit: values.limit,
      eventOffset: values.eventsLength,
      search: `%${filter.searchText}%`,
      category: `%${cat}%`,
      city: `%${filter.city}%`,
      state: `%${filter.state}%`,
      lowerPrice: filter.lowerPrice === "" ? null : filter.lowerPrice,
      upperPrice: filter.upperPrice === "" ? null : filter.upperPrice,
      type: filter.type,
      date: filter.date ? filter.date.formatDate() : null,
      weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
    }
}

const followingFeedQuery = {
    query: FETCH_FOLLOWING_FEED,
    variables: {
        userId: props.userId,
        eventLimit: values.limit,
        eventOffset: 0,
        search: `%${filter.searchText}%`,
        category: `%${cat}%`,
        city: `%${filter.city}%`,
        state: `%${filter.state}%`,
        lowerPrice: filter.lowerPrice === "" ? null : filter.lowerPrice,
        upperPrice: filter.upperPrice === "" ? null : filter.upperPrice,
        date: filter.date !== null ? filter.date.formatDate() : null,
        weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
    }
}

const profileFeedQuery = {
    query: QUERY_PROFILE_EVENTS,
    variables: {
        eventLimit: values.limit,
        eventOffset: values.eventsLength,
        profileId: props.profileId,
        date:values.filter.date ? values.filter.date.formatDate() : null,
        weekday: values.filter.date !== null ? `%${values.filter.date.getDay()}%` : null
    }
}