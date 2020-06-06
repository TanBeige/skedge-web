import React, { Fragment, useState, useEffect } from 'react'

import EventCard from "components/EventCards/EventCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";
import DealCard from "components/Deals/DealCard.js";

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'


import {
    QUERY_SAVED_DEALS,
} from "../../EventQueries/EventQueries";

const dateHeaderStyle = {
  textAlign: 'center',
  color: "black",
  backgroundColor: "#F0F3BD",
  border: "1px solid grey",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
}

var moment = require('moment');


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
export default function SavedDealsList(props) {
  // Checks if we are still grabbing events
  const [isSearch, setIsSearch] = useState(false);
  let isMounted = true;

  const { user } = useAuth0()

  const [values, setValues] = useState({
      type: props.type,
      filter: props.filter,
      loadedAllEvents: false,
      showOlder: true,
      eventsLength: 0,
      showNew: false,
      limit: 10,
      events: [],
  });

  const grabEvents = () => {
    const { client } = props;
    const { filter } = props;

    if(!values.showNew) {

      setIsSearch(true);
      // query for public events
      client
        .query({
          query: QUERY_SAVED_DEALS,
          variables: {
              userId: user.sub,
              limit: values.limit,
              offset: 0,
              inputDate: props.date.format("YYYY-MM-DD"), 
              inputWeekday: `%${props.date.day()}%`
          }
        })
        .then(data => {
          if(isMounted){
            let tempEvents = [];
            const deals = data.data.deals
            console.log("Deals: ", deals);
            // for(let i = 0; i < deals.length; ++i) {
            //     tempEvents.push(deals[i].event)
            // }
            setValues({ 
              ...values, 
              events: deals, 
              eventsLength: deals.length,
              showNew: false,
              loadedAllEvents: deals.length < values.limit
            });
            // When done grabbing events, set seraching to false
            setIsSearch(false)
          }
      });
    }
  }

    // Update Query When new Events are added
    const loadMoreClicked = () => {
      const { client } = props;
      const { filter } = props;

      const totalEventsPrevious = values.eventsLength;

      client
        .query({
            query: QUERY_SAVED_DEALS,
            variables: {
                userId: user.sub,
                limit: values.limit,
                offset: 0,
                inputDate: props.date.format("YYYY-MM-DD"), 
                inputWeekday: props.date.day()
              }
          }).then(data => {
            if(isMounted){
                const deals = data.data.deals
              if (deals) {
                let tempEvents = [];
                for(let i = 0; i < deals.length; ++i) {
                  tempEvents.push(deals[i].event)
                }
                let mergedEvents = values.events.concat(tempEvents);
                
                // update state with new events
                setValues({ 
                  ...values,
                  events: mergedEvents,
                  showNew: true,
                  eventsLength: values.events.length + deals.length,
                  loadedAllEvents: deals.length < values.limit
                });
              }
              else {
                setValues({
                  ...values,
                  loadedAllEvents: true
                })
              }
            }
          }).catch(error => {
            console.log(error);
            if(isMounted) {
              setValues({
                ...values,
                loadedAllEvents: true
              })
            }
        });
    }

    // Replaces ComponentDidMount() in a Functional Component

    useEffect(() => {

      isMounted = true;

      setValues({
        ...values,
        showNew: false,
        loadedAllEvents: false,
      })
      grabEvents();

      return () => {
        isMounted = false;
      }
    }, [])

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

    // Components to Render

    if(values.events.length === 0 && !isSearch)
    {
      return(
        <div>
          <h5 style={{marginTop: 20, textAlign: 'center'}}>You have not saved any events!</h5>
        </div>
      )
    }

    return (
      <InfiniteScroll
          dataLength={values.eventsLength}
          next={loadMoreClicked}
          hasMore={!values.loadedAllEvents}
          loader={<div style={{textAlign: 'center'}}><CircularProgress size={20} color='primary'/></div>}
          scrollThreshold={0.95}
          style={{overflow: 'none'}}
      >
        <GridContainer style={{minHeight: '8em'}}>
            {
              finalEvents.map((event, index) => {
                  console.log("event: ", event)
                  return (
                    <Fragment key={event.id}> 
                      <GridItem xs={12} sm={6} md={4} >
                        {/* <EventCard 
                            event={event} 
                            client={props.client}
                            userId={props.userId}
                            filter={props.filter}
                        /> */}
                        <DealCard 
                            itemInfo={event} 
                            listType={"landing"}
                            client={props.client}
                            userId={props.userId}
                            currentDate={props.date.format("YYYY-MM-DD")}
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

    )
}