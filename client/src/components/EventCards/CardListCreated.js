import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import LoadCardList from 'components/EventCards/LoadCardList.js'

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";

import { Instagram } from 'react-content-loader'

import * as Scroll from 'react-scroll';


import { throttle } from 'lodash';


//const MyInstagramLoader = () => <Instagram />

import {
    FETCH_CREATED_EVENTS
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
export default function CardListCreated(props) {
  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false);

  const eventLimit = 10

  let isMounted = true;
  let currentKey;

  let ScrollLink = Scroll.Link;
  let Element = Scroll.Element;


  const [values, setValues] = useState({
      loadedAllEvents: false,
      showOlder: true,
      eventsLength: 0,
      showNew: false,
      limit: eventLimit,
      events: [],
  });


    // Update Query When new Events are added
    const loadMoreClicked = () => {
      const { client } = props;

      client.query({
          query: FETCH_CREATED_EVENTS,
          variables: {
            eventLimit: values.limit,
            eventOffset: values.eventsLength,
            userId: props.userId,

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




    useEffect(() => {
      //Restart the get events
      // console.log("Created Events")
      setValues({
        type: props.type,
        loadedAllEvents: false,
        showOlder: true,
        eventsLength: 0,
        showNew: false,
        limit: eventLimit,
        events: [],
      });

      currentKey = Math.floor(Math.random() * Math.floor(1000))
      //setIsMounted(true)

      //grabEvents();
      // ----------------------------GRABBING EVENTS IF MOUNTED--------------------------------
      isMounted = true;
      const { client } = props;
      setIsSearch(true)

      client
        .query({
          query: FETCH_CREATED_EVENTS,
          variables: {
            eventLimit: values.limit,
            eventOffset: 0,
            userId: props.userId,
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
                loadedAllEvents: data.data.events.length < eventLimit
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
    }, [])

    
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



    if(values.events.length === 0 && !isSearch)
    {
      return(
        <div id='scrollableDiv' style={{height: '65vh', overflowY: 'auto', overflowX: 'hidden'}} key={currentKey}>
          <Element name="listTop"></Element>
          <h5 style={{marginTop: 20, textAlign: 'center'}}>You have not made any events.</h5>
        </div>
      )
    }


    return (
      <div id='scrollableDiv' key={currentKey}>
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
                              listType={"home"}
                              client={props.client}
                              userId={props.userId}
                              //currentDate={props.filter.date}
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
      </div>
    )
}