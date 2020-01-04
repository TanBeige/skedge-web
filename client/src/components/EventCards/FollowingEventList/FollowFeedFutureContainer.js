import React, { Fragment, useState, useEffect } from 'react'
import FollowingFeedFuture from "components/EventCards/FollowingFeedFuture/FollowingFeedFuture.js"

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";

import {
    QUERY_FILTERED_EVENT
} from "EventQueries/EventQueries.js";

const dateHeaderStyle = {
  textAlign: 'center',
  color: "black",
  backgroundColor: "#F0F3BD",
  border: "1px solid grey",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
}

const moment = require("moment")

// Functional Component
export default function FutureContainer(props) {

  const [filter, setFilter] = useState({
    searchText: props.filter.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
    type: props.filter.type,
    category: props.filter.category,
    city: props.filter.city,
    state: props.filter.state,
    limit: props.filter.limit,
    date: props.filter.date.addDays(1),
  })

  useEffect(() => {
    let isMounted = true;
    
    if(isMounted) {
      setFilter({
          ...filter,
          date: props.filter.date.addDays(1),
      })
    }

    return () =>{
      isMounted = false;
    }
  }, [props.filter])

  return (
    <Fragment>
      <FollowingFeedFuture
        client={props.client}
        filter={filter}
        userId={props.userId}
        listType="home"
      />
    </Fragment>
  )
}

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}