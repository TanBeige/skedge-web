import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";

// import EventCardListFuture from './EventCardListFuture.js';
// import FutureContainer from './FutureContainer.js';
import LoadCardList from '../LoadCardList.js';
import * as Scroll from 'react-scroll';
import { throttle } from 'lodash';

const dateHeaderStyle = {
  textAlign: 'center',
  color: "black",
  backgroundColor: "#F0F3BD",
  border: "1px solid grey",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
}

var moment = require("moment")


const limitValue = 10;

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
export default function EventList({ listType, filter, client, CardComponent, userId, query}) {
  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false);
  let isMounted = true;
  let currentKey;
  let futureEvents = "";

  let ScrollLink = Scroll.Link;
  let Element = Scroll.Element;

  // Variables Sent To The Query:
  let usedVariables = {};


  const [values, setValues] = useState({
      type: listType,
      filter: filter,
      loadedAllEvents: false,
      showOlder: true,
      eventsLength: 0,
      showNew: false,
      limit: limitValue,
      events: [],
  });

  let table = listType === 'deals' ? 'deals' : 'events';



    // Update Query When new Events are added
    const loadMoreClicked = () => {

        const queryVariables = getVariables(listType, userId, values.eventsLength, filter)

        client.query({
          query: query,
          variables: queryVariables
        })
        .then(data => {
          if (data.data[table].length) {
            let mergedEvents = values.events.concat(data.data[table]);

            //Remove Duplicates from array
            mergedEvents = mergedEvents.filter((thing, index, self) => self.findIndex(t => t.id === thing.id) === index)

            // update state with new events
            if(isMounted) {
              setValues({
                ...values,
                events: mergedEvents,
                showNew: true,
                eventsLength: values.events.length + data.data[table].length
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

    // if (values.loadedAllEvents) {
    //   futureEvents = (
    //     <FutureContainer
    //       client={client}
    //       filter={filter}
    //       userId={userId}
    //     />
    //   )
    // }

    useEffect(() => {
      //Restart the get events
      setValues({
        type: listType,
        filter: filter,
        loadedAllEvents: false,
        showOlder: true,
        eventsLength: 0,
        showNew: false,
        limit: limitValue,
        events: [],
      });

      currentKey = Math.floor(Math.random() * Math.floor(1000))
      // ----------------------------GRABBING EVENTS IF MOUNTED--------------------------------
      isMounted = true;

      let cat = filter.category;
      if(filter.category == "Any") {
        cat = ""
      }
      setIsSearch(true)

      const queryVariables = getVariables(listType, userId, 0, filter)
      console.log("q variables: ", queryVariables)

      client
        .query({
          query: query,
          variables: queryVariables
        })
        .then(data => {
          console.log(data)
          if (data.data[table].length > 0) {
            //const mergedEvents = values.events.concat(data.data[table]);
            // update state with new events
            if(isMounted) {
              setValues({
                ...values,
                events: data.data[table],
                showNew: true,
                eventsLength: data.data[table].length,
                loadedAllEvents: data.data[table].length < limitValue
              });
              setIsSearch(false);
            }
          }
          else {
            if(isMounted) {
              setValues({
                ...values,
                events: data.data[table],
                eventsLength: data.data[table].length,
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
    }, [filter])

    
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
          <h5 style={{marginTop: 20, textAlign: 'center'}}>There are no deals for today.</h5>
            <hr />
            {
                values.loadedAllEvents ? <h4 style={{textAlign: 'center'}}>Try tomorrow!</h4> : ""
            }
          {/* {futureEvents} */}
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
                finalEvents.map((item, index) => {
                    return (
                      <Fragment key={item.id}>
                        <GridItem xs={12} sm={6} md={6} >
                          <CardComponent
                              itemInfo={item} 
                              listType={listType}
                              client={client}
                              userId={userId}
                              filter={filter}
                              currentDate={filter.date}
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
          values.loadedAllEvents ? <h4 style={{textAlign: 'center'}}>That's all for today.<br/>Try tomorrow! -></h4> : ""
        }
        {/* {futureEvents} */}
      </div>
    )
}


const getVariables = (listType, userId, eventsLength, filter) => {
  // usedVariables holds the variabels that'll be sent into the query
  const limitValue = 10;
  let usedVariables = {};

  console.log("listtype: ", listType)
  if(listType === 'local') {
    let cat = filter.category === "Any" ? "" : filter.category;

    usedVariables = {
      eventLimit: limitValue,
      eventOffset: eventsLength,
      userId: userId,
      search: `%${filter.searchText}%`,
      category: `%${cat}%`,
      city: `%${filter.city}%`,
      state: `%${filter.state}%`,
      lowerPrice: filter.lowerPrice === "" ? null : filter.lowerPrice,
      upperPrice: filter.upperPrice === "" ? null : filter.upperPrice,
      type: 'local',
      date: filter.date ? filter.date.formatDate() : null,
      weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
    }
  }
  else if(listType === 'following') {
    let cat = filter.category === "Any" ? "" : filter.category;

    usedVariables = {
      eventLimit: limitValue,
      eventOffset: eventsLength,
      userId: userId,
      search: `%${filter.searchText}%`,
      category: `%${cat}%`,
      city: `%${filter.city}%`,
      state: `%${filter.state}%`,
      lowerPrice: filter.lowerPrice === "" ? null : filter.lowerPrice,
      upperPrice: filter.upperPrice === "" ? null : filter.upperPrice,
      date: filter.date ? filter.date.formatDate() : null,
      weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
    }
  }
  else if(listType === 'deals') {
    usedVariables = {
      limit: limitValue,
      offset: eventsLength,
      city: `%${filter.city}%`,
      state: `%${filter.state}%`,
      userId: userId,
      date: filter.date ? filter.date.formatDate() : null,
      weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
    }
  }

  return usedVariables;
}