import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";

// import EventCardListFuture from './EventCardListFuture.js';
import FollowFeedFutureContainer from './FollowFeedFutureContainer.js';
import { Instagram } from 'react-content-loader'

import LoadCardList from '../LoadCardList.js';

import { throttle } from 'lodash';

import { Element , animateScroll as scroll,} from 'react-scroll'



//const MyInstagramLoader = () => <Instagram />

import {
  FETCH_FOLLOWING_FEED,
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
export default function FollowingFeedList(props) {
  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false);
  let isMounted = true;
  let currentKey;
  let futureEvents = "";

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

      // setValues({
      //   ...values,
      //   loadedAllEvents: false
      // })

      let cat = filter.category;
      if(filter.category == "Any") {
        cat = ""
      }
      client.query({
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
            const mergedEvents = values.events.concat(data.data.events);

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
        <FollowFeedFutureContainer
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

      return () => {
        isMounted = false;
      }
    }, [props.filter])

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
        <div id='scrollableDiv' style={{height: '85vh', overflowY: 'auto', overflowX: 'hidden'}} key={currentKey} >
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
      <div id='scrollableDiv' key={currentKey} >
        <InfiniteScroll
            dataLength={values.eventsLength}
            next={loadMoreThrottled}
            hasMore={!values.loadedAllEvents}
            //loader={<div style={{textAlign: 'center'}}><CircularProgress size={20} color='primary'/></div>}
            loader={<LoadCardList />}
            style={{overflow: 'none'}}
            //scrollableTarget="root"
        >
          <GridContainer justify='center' style={{minHeight: '8em', margin: '10px 0px 0px 0px'}}>
              {
                finalEvents.map((event, index) => {
                    return (
                      <Fragment key={event.id}>
                        <GridItem xs={12} sm={6} md={6} >
                          <EventCard 
                              event={event} 
                              listType={"following"}
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
        <hr />
        {
            values.loadedAllEvents ? <h2 style={{textAlign: 'center'}}>Future Events</h2> : ""
        }
        {futureEvents}
      </div>
    )
}