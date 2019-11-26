import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";

import ProfileListFuture from './ProfileListFuture.js';
import FutureContainer from './FutureContainer.js';

import {
    QUERY_FILTERED_EVENT,
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

// Functional Component
export default function EventCardListProfile(props) {
  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false);
  let isMounted = true;
  let currentKey;
  let futureEvents = "";
  const moment = require("moment")

  const [values, setValues] = useState({
      type: props.type,
      filter: {
        date: new Date(),
        weekday: new Date().getDay(),
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
      const { filter } = props;

      const totalEventsPrevious = values.eventsLength;
      setValues({
        ...values,
        loadedAllEvents: false
      })

      client
        .query({
          query: QUERY_PROFILE_EVENTS,
          variables: {
            eventLimit: values.limit,
            eventOffset: values.eventsLength,
            profileId: props.profileId,
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
            }
          }
          else {
            setValues({
              ...values,
              loadedAllEvents: true
            })
          }
        }).catch(error => {
          console.log(error)
        });

      
    }

    // Replaces ComponentDidMount() in a Functional Component
    if (values.loadedAllEvents) {
      futureEvents = (
        <ProfileListFuture
          client={props.client}
          filter={values.filter}
          profileId={props.profileId}
          userId={props.userId}
        />
      )
    }

    useEffect(() => {
      //Restart the get events
      setValues({
        type: props.type,
        filter: {
          date: new Date(),
          weekday: new Date().getDay(),
          limit: 10
        },
        loadedAllEvents: false,
        showOlder: true,
        eventsLength: 0,
        showNew: false,
        limit: 10,
        events: [],
      });

      const filter = {
        date: new Date(),
        weekday: new Date().getDay(),
        limit: 10
      }

      currentKey = Math.floor(Math.random() * Math.floor(1000))
      //setIsMounted(true)

      //grabEvents();
      // ----------------------------GRABBING EVENTS IF MOUNTED--------------------------------
      isMounted = true;
      const { client } = props;

      //Sets Search to True
      setIsSearch(true);

      client
        .query({
          query: QUERY_PROFILE_EVENTS,
          variables: {
            eventLimit: values.limit,
            eventOffset: 0,
            profileId: props.profileId,
            date: filter.date.formatDate(),
            weekday: `%${filter.date.getDay()}%`
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
                loadedAllEvents: data.data.events.length < 10
              });
              setIsSearch(false);

            }
          }
          else {
            if(isMounted) {
              console.log("there are no events")
              setValues({
                ...values,
                events: data.data.events,
                eventsLength: data.data.events.length,
                loadedAllEvents: true
              })
              setIsSearch(false)
            }
          }
        }).catch(error => {
          console.log(error);
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
    
    if(isSearch) {
      return (
        <div style={{textAlign: 'center', margin: 20}} >
          <CircularProgress color="primary"/>
        </div>
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


    const noEvents = () => {
      if(values.events.length === 0 && !isSearch)
      {
        return(
          <div>
            <h5 style={{marginTop: 20, textAlign: 'center'}}>There are no events today.</h5>
          </div>
        )
      }
    }


    return (
      <div id="scrollableDiv" className='EventCardListProfileContainer' key={currentKey}>
        <InfiniteScroll
            dataLength={values.eventsLength}
            next={loadMoreClicked}
            hasMore={!values.loadedAllEvents}
            scrollThreshold={0.95}
            loader={<div style={{textAlign: 'center'}}><CircularProgress size={20} color='primary'/></div>}
            style={{overflow: 'none'}}
        >
          <h3 style={{textAlign: 'center'}}>{moment(values.filter.date).format("MMMM D, YYYY")}</h3>
          {noEvents()}
          <GridContainer style={{minHeight: '8em'}}>
              {
                values.events.map((event, index) => {
                    return (
                      <Fragment key={event.id}> 
                        <GridItem xs={12} sm={6} md={6} >
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
        {futureEvents}
      </div>
    )
}