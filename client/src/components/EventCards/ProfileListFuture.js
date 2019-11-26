import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";
import FutureContainer from './FutureContainer.js';
import ProfileListFuture from "./ProfileListFuture.js"

import {
    QUERY_PROFILE_EVENTS
} from "../../EventQueries/EventQueries";

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
export default function EventCardListHome(props) {
  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false);

  //Check if mounted
  let isMounted = true;

  const [values, setValues] = useState({
    filter: {
        date: props.filter.date.addDays(1),
        weekday: props.filter.date.addDays(1).getDay(),
        limit: 10
    },
    loadedAllEvents: false,
    showOlder: true,
    eventsLength: 0,
    showNew: false,
    limit: 10,
    events: [],
  });

  // Update Query When new Events are added
  const loadMoreClicked = () => {
    const { client } = props;
    const { filter } = values;

    const totalEventsPrevious = values.eventsLength;

    let cat = filter.category;
    if(filter.category == "Any") {
      cat = ""
    }
    client
      .query({
        query: QUERY_PROFILE_EVENTS,
        variables: {
          eventLimit: values.limit,
          eventOffset: values.eventsLength,
          profileId: props.profileId,
          date:values.filter.date ? values.filter.date.formatDate() : null,
          weekday: values.filter.date !== null ? `%${values.filter.date.getDay()}%` : null
        }
      })
      .then(data => {
        if (data.data.events.length ) {

          if(isMounted) {
            const mergedEvents = values.events.concat(data.data.events);
            // update state with new events
            setValues({
              ...values,
              events: mergedEvents,
              showNew: true,
              eventsLength: values.events.length + data.data.events.length
              });
              if(totalEventsPrevious === (values.events.length + data.data.events.length)) {
                setValues({
                  ...values,
                  loadedAllEvents: true
                })
              }
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

    // Replaces ComponentDidMount() in a Functional Component

    useEffect(() => {
      //Restart the get events
      setValues({
        type: props.type,
        filter: {
          date: props.filter.date.addDays(1),
          weekday: props.filter.date.addDays(1).getDay(),
          limit: 10
        },
        loadedAllEvents: false,
        showOlder: true,
        eventsLength: 0,
        showNew: false,
        limit: props.filter.limit,
        events: [],
      });

      // ----------------------------TESTING UNMOUNTING--------------------------------
      isMounted = true;
      const { client } = props;
      const { filter } = values;

      setIsSearch(true);

      let cat = filter.category;
      if(filter.category == "Any") {
        cat = ""
      }
      client
        .query({
          query: QUERY_PROFILE_EVENTS,
          variables: {
            eventLimit: values.limit,
            eventOffset: 0,
            profileId: props.profileId,
            date: values.filter.date ? values.filter.date.formatDate() : null,
            weekday: values.filter.date !== null ? `%${values.filter.date.getDay()}%` : null
          }
        })
        .then(data => {
          if (data.data.events.length) {
           // const mergedEvents = values.events.concat(data.data.events);

            // update state with new events
            if(isMounted) {
              setValues({
                ...values,
                events: data.data.events,
                showNew: true,
                eventsLength: data.data.events.length,
                //loadedAllEvents: data.data.events.length < values.filter.limit
              });
              setIsSearch(false)
            }
          }
          else {
            setValues({
              ...values,
              events: data.data.events,
              eventsLength: data.data.events.length,
              //loadedAllEvents: true
            })
            // TURN THIS ON TO MAKE IT WORK, BUT FIX BUG WHERE IT QUEUES INFINITELY
            setIsSearch(false);
          }
        }).catch(error => {
          console.log(error);
          setIsSearch(false);
        });

      return () => {
        //setIsMounted(false);
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
        <div style={{textAlign: 'center'}}>
          <CircularProgress size={20} color='primary'/>
        </div>
      )
    }

    // Components to Render
    const futureEvents = () => {
      if(values.loadedAllEvents) {
//        <h1>Future Events</h1>
        return(
          <ProfileListFuture
            client={props.client}
            filter={{
              date: values.filter.date,
              weekday: values.filter.date,
              limit: 10
            }}
            profileId={props.profileId}
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
          <div style={{margin: 'auto', textAlign: 'center'}}>
            <h5 style={{marginTop: 5}}>There are no events today.</h5>
          </div>
        )
      }
    }

    return (
      <Fragment>
        <h3 style={{textAlign: 'center'}}>{moment(values.filter.date).format("MMMM D, YYYY")}</h3>
        <InfiniteScroll
            dataLength={values.eventsLength}
            next={loadMoreClicked}
            hasMore={!values.loadedAllEvents}
            scrollThreshold={0.95}
            //scrollableTarget="scrollableDiv"
            //pullDownToRefresh
            //pullDownToRefreshContent={<h3>Pull down to refresh.</h3>}
            //refreshFunction={loadMoreClicked}
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
                              filter={values.filter}
                              currentDate={values.filter.date}
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

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }