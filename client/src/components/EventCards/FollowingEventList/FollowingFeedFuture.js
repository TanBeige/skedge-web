import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";
import FutureContainer from './FollowFeedFutureContainer';
import { throttle } from 'lodash';


import {
  FETCH_FOLLOWING_FEED
} from "../../../EventQueries/EventQueries";

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

const moment = require("moment")


// Functional Component
export default function EventCardListFuture(props) {
  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false);

  //Check if mounted
  let isMounted = true;

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
    console.log("loading more")
    const { client } = props;
    const { filter } = props;

    const totalEventsPrevious = values.eventsLength;

    let cat = filter.category;
    if(filter.category == "Any") {
      cat = ""
    }
    client
      .query({
        query: FETCH_FOLLOWING_FEED,
        variables: {
          userId: props.userId,
          eventLimit: values.limit,
          eventOffset: values.eventsLength,
          search: `%${filter.searchText}%`,
          category: `%${cat}%`,
          city: `%${filter.city}%`,
          state: `%${filter.state}%`,
          lowerPrice: filter.lowerPrice === "" ? null : filter.lowerPrice,
          upperPrice: filter.upperPrice === "" ? null : filter.upperPrice,
          date: filter.date ? filter.date.formatDate() : null,
          weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
        }
      })
      .then(data => {
        console.log("LoadMore: ", props.filter.date.formatDate(), ": ", data.data.events.length)

        if (data.data.events.length ) {
          if(isMounted) {
            const mergedEvents = values.events.concat(data.data.events);
            // update state with new events
            setValues({
              ...values,
              events: mergedEvents,
              showNew: true,
              eventsLength: mergedEvents.length,//values.events.length + data.data.events.length,
              loadedAllEvents: data.data.events.length < values.limit
            });
          }
        }
        else {
          if(isMounted) {
            setValues({
              ...values,
              loadedAllEvents: true
            })
          }
        }
      }).catch(error => {
        console.log(error);
      });
  }

  //Throttle LoadMore so we don't load too much at once
  const loadMoreThrottled = throttle(loadMoreClicked, 100);


  // Replaces ComponentDidMount() in a Functional Component

  useEffect(() => {
    //Restart the get events

    setValues({
      type: props.type,
      filter: props.filter,
      loadedAllEvents: false,
      showOlder: true,
      eventsLength: 0,
      limit: props.filter.limit,
      events: [],
    });

    // ----------------------------TESTING UNMOUNTING--------------------------------
    isMounted = true;
    const { client } = props;
    const { filter } = props;

    setIsSearch(true);

    let cat = filter.category;
    if(filter.category == "Any") {
      cat = ""
    }
    client
      .query({
        query: FETCH_FOLLOWING_FEED,
        variables: {
          userId: props.userId,
          eventLimit: values.limit,
          eventOffset: values.eventsLength,
          search: `%${filter.searchText}%`,
          category: `%${cat}%`,
          city: `%${filter.city}%`,
          state: `%${filter.state}%`,
          lowerPrice: filter.lowerPrice === "" ? null : filter.lowerPrice,
          upperPrice: filter.upperPrice === "" ? null : filter.upperPrice,
          date: filter.date ? filter.date.formatDate() : null,
          weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
        }
      })
      .then(data => {
        if (data.data.events.length) {
          // const mergedEvents = values.events.concat(data.data.events);
          console.log("Initial: ",props.filter.date.formatDate(), ": ", data.data.events.length)

          // update state with new events
          if(isMounted) {
            setValues({
              ...values,
              events: data.data.events,
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
            // TURN THIS ON TO MAKE IT WORK, BUT FIX BUG WHERE IT QUEUES INFINITELY
            setIsSearch(false);
          }
        }
      });

    return () => {
      //setIsMounted(false);
      isMounted = false;        
    }
  }, [props.filter])

  // useEffect(()=>{
  //   console.log(props.filter.date.formatDate()," Loaded All: ", values.loadedAllEvents)
  // })

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


    // if(isSearch && values.loadedAllEvents) {
    //   return ""
    // }
    if(isSearch) {
      return (
        <div style={{textAlign: 'center'}}>
          <CircularProgress size={20} color='primary'/>
        </div>
      )
    }
   

    // Components to Render
    const futureEvents = () => {
      if(values.loadedAllEvents) {
        return(
          <FutureContainer
            client={props.client}
            filter={props.filter}
            userId={props.userId}
          />
        )
      }
      else {
        return ""
      }
    }

    const noEvents = () => {
      if(values.events.length === 0 && !isSearch)
      {
        return(
          <Fragment>
            <h5 style={{marginTop: 20, textAlign: 'center', width: '100%'}}>There are no events this day.</h5>
          </Fragment>
        )
      }
    }

    // Final Event list sent to the component
    let finalEvents = values.events
    return (
      <Fragment>
        <h3 style={{textAlign: 'center'}}>{moment(props.filter.date).format("dddd, MMM D")}</h3>
        <InfiniteScroll
            dataLength={values.eventsLength}
            next={loadMoreThrottled}
            hasMore={!values.loadedAllEvents}
            scrollThreshold={1}
            loader={<div style={{textAlign: 'center'}}><CircularProgress size={20} color='primary'/></div>}
            style={{overflow: 'none'}}
        >
          <GridContainer style={{minHeight: '8em'}}>
            {noEvents()}
              {
                finalEvents.map((event, index) => {
                    return (
                      <Fragment key={event.id}> 
                        <GridItem xs={12} sm={6} md={4} >
                          <EventCard 
                              event={event} 
                              client={props.client}
                              userId={props.userId}
                              filter={props.filter}
                              currentDate={props.filter.date}
                          />
                        </GridItem>
                        {
                          //insertAd(index)   //Add later when Skedge.com can get ads
                        }
                      </Fragment>
                    )
                })
            }
          </GridContainer>
        </InfiniteScroll>
        {futureEvents()}
      </Fragment>
    )
}