import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";

import EventCardListFuture from './EventCardListFuture.js';
import FutureContainer from './FutureContainer.js';

import {
    QUERY_FILTERED_EVENT
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
export default function EventCardListHome(props) {
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
    console.log("loaded all: ", values.loadedAllEvents)
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
            type: filter.type,
            date: filter.date !== null ? filter.date.formatDate() : null,
            weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
          }
        })
        .then(data => {
          console.log(props.filter.type)
          if (data.data.events.length > 0) {
            //const mergedEvents = values.events.concat(data.data.events);
            // update state with new events
            if(isMounted) {
              console.log("Home Data Events:", data.data.events)
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
              console.log("there are no events")
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
        <div style={{textAlign: 'center', margin: 20}} >
          <CircularProgress color="primary" />
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


    if(values.events.length === 0 && !isSearch)
    {
      return(
        <div>
          <h5 style={{marginTop: 20, textAlign: 'center'}}>There are no events today.</h5>
        </div>
      )
    }


    return (
      <div className='EventCardListHomeContainer' key={currentKey}>
        <InfiniteScroll
            dataLength={values.eventsLength}
            next={loadMoreClicked}
            hasMore={!values.loadedAllEvents}
            scrollThreshold={0.95}
            loader={<div style={{textAlign: 'center'}}><CircularProgress size={20} color='primary'/></div>}
            style={{overflow: 'none'}}
        >
          <GridContainer style={{minHeight: '8em'}}>
              {
                finalEvents.map((event, index) => {
                    return (
                      <Fragment key={event.id}> 
                        <GridItem xs={12} sm={6} md={6} >
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
        {futureEvents}
      </div>
    )
}