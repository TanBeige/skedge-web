import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import DealCard from "components/Deals/DealCard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";

import LandingFutureContainer from './LandingFutureContainer.js';
import { Instagram } from 'react-content-loader'
import LoadCardList from '../LoadCardList.js';
import * as Scroll from 'react-scroll';
import { throttle } from 'lodash';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Chat from "@material-ui/icons/Chat";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import DateRangeIcon from '@material-ui/icons/DateRange';
// core components
import CustomTabs from "components/CustomTabs/CustomTabs.js";

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
//const MyInstagramLoader = () => <Instagram />

import {
  QUERY_LANDING_FEED
} from "EventQueries/EventQueries";
import { Button } from '@material-ui/core';

const dateHeaderStyle = {
  textAlign: 'center',
  color: "black",
  backgroundColor: "#F0F3BD",
  border: "1px solid grey",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
}

const styles = {
  textCenter: {
    textAlign: "center"
  }
};

const useStyles = makeStyles(styles);

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
export default function EventCardListLand(props) {
  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false);
  let isMounted = true;
  let currentKey;
  let futureEvents = "";

  let ScrollLink = Scroll.Link;
  let Element = Scroll.Element;

  const classes = useStyles();

  const { loginWithRedirect } = useAuth0();


  const [values, setValues] = useState({
      type: props.type,
      filter: props.filter,
      loadedAllEvents: false,
      showOlder: true,
      eventsLength: 0,
      limit: props.filter.limit,
      events: [],
      offset: props.filter.limit,

      deals: [],
      dealsLength: 0
  });

    useEffect(() => {
      //Restart the get events
      setValues({
        type: props.type,
        filter: props.filter,
        loadedAllEvents: false,
        showOlder: true,
        eventsLength: 0,
        limit: props.filter.limit,
        offset: props.filter.limit,
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
          query: QUERY_LANDING_FEED,
          variables: {
            limit: values.limit,
            city: `${filter.city}`,
            state: `${filter.state}`,
            date: filter.date !== null ? filter.date.formatDate() : null,
            weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
          }
        })
        .then(data => {
            if(isMounted) {
              setValues({
                ...values,
                events: data.data.events,
                eventsLength: data.data.events.length,

                deals: data.data.deals,
                dealsLength: data.data.deals.length

                
              });
              setIsSearch(false);
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

    useEffect(() => {
      console.log(values.deals)
    }, [values.events, values.deals])



    
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

    const loadMore = () => {
      const { client } = props;
      const { filter } = props;
      console.log("offfset:", values.offset)

      client
        .query({
          query: QUERY_LANDING_FEED,
          variables: {
            limit: values.limit,
            offset: values.offset,
            city: `${filter.city}`,
            state: `${filter.state}`,
            date: filter.date !== null ? filter.date.formatDate() : null,
            weekday: filter.date !== null ? `%${filter.date.getDay()}%` : null
          }
        })
        .then(data => {
          let mergedEvents = values.events.concat(data.data.events);
          let mergedDeals = values.deals.concat(data.data.deals);

            if(isMounted) {
              setValues({
                ...values,
                events: mergedEvents,
                eventsLength: mergedEvents.length,

                deals: mergedDeals,
                dealsLength: mergedDeals.length,

                offset: values.offset + values.limit
              });
            }
        }).catch(error => {
          console.log(error)
        });
    }
    

    // Start Filtering Responses here. Since it's so fucking hard in GraphQL
    let finalEvents = values.events
    let finalDeals = values.deals
    
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
    //         <LandingFutureContainer
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
            {/* <hr />
            {
                values.loadedAllEvents ? <h2 style={{textAlign: 'center'}}>Future Events</h2> : ""
            }
          {futureEvents} */}
        </div>
      )
    }
    
    // if(isSearch) {
    //   return <div>Loading...</div>
    // }

    return(
      <div>
        <CustomTabs
          headerColor="primary"
          plainTabs={true}
          tabs={[
            {
              tabName: "Deals",
              tabIcon: LocalAtmIcon,
              tabContent: (
                <InfiniteScroll
                  dataLength={values.events.length} //This is important field to render the next data
                  next={loadMore}
                  hasMore={true}
                  style={{overflow: 'visible'}}
                  // loader={<h4>Loading...</h4>}
                >
                <GridContainer justify='center' style={{minHeight: '8em', margin: '10px 0px 0px 0px'}}>
                  {
                    values.deals.map((deal, index) => {
                      return (
                        <Fragment key={deal.id}>
                          <GridItem xs={12} sm={4} md={4}>
                            <DealCard 
                              itemInfo={deal} 
                              listType={"landing"}
                              client={props.client}
                              userId={props.userId}
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
                <Button color="primary" variant='outlined' onClick={() =>loginWithRedirect({})}>Sign in to view more</Button>
                </InfiniteScroll>
              )
            },
            {
              tabName: "Events",
              tabIcon: DateRangeIcon,
              tabContent: (
                <InfiniteScroll
                  dataLength={values.events.length} //This is important field to render the next data
                  next={loadMore}
                  hasMore={true}
                  style={{overflow: 'visible'}}

                  // loader={<h4>Loading...</h4>}
                >
                <GridContainer justify='center' style={{minHeight: '8em', margin: '10px 0px 0px 0px'}}>
                  {
                    finalEvents.map((event, index) => {
                      return (
                        <Fragment key={event.id}>
                          <GridItem xs={12} sm={4} md={4}>
                            <EventCard 
                              event={event} 
                              listType={"landing"}
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
                <Button color="primary" variant='outlined' onClick={() =>loginWithRedirect({})}>Sign in to view more</Button>

                </InfiniteScroll>
              )
            }
          ]}
        />
      </div>
    )
}