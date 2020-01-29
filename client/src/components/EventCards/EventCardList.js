import React from 'react'

import EventCardListHome from 'components/EventCards/HomeEventList/EventCardListHome.js'
import FollowingFeedList from 'components/EventCards/FollowingEventList/FollowingFeedList.js'
import EventCardListSaved from 'components/EventCards/EventCardListSaved.js'
import EventCardListProfile from 'components/EventCards/EventCardListProfile.js'
import EventCardListLand from 'components/EventCards/LandingEventList/EventCardListLand.js'
import CardListCreated from 'components/EventCards/CardListCreated.js'

import EventList from 'components/EventCards/EventList.js'


//Cards
import DealCard from 'components/Deals/DealCard.js';

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';

import {
  QUERY_FILTERED_EVENT,
  QUERY_PROFILE_EVENTS,
  QUERY_FOLLOWING_FEED,
  QUERY_DEAL_FEED
} from "EventQueries/EventQueries";
import { datePickerDefaultProps } from '@material-ui/pickers/constants/prop-types'

/*
props: 
  client={props.client}
  userId={props.userId}
  filter={privateFilter}
  listType='following'
*/

export default function EventCardList(props) {

  const { user } = useAuth0();

  const eventList = () => {
    if(props.listType === 'local'){
      return (<EventCardListHome {...props}/>)
    }
    else if(props.listType === 'following'){
      return (<FollowingFeedList {...props} type='following' />)
    }
    else if(props.listType === 'landing'){
      return (<EventCardListLand {...props} type='landing' />)
    }
    else if(props.listType === 'saved'){
      return (<EventCardListSaved {...props}/>)
    }
    else if(props.listType === 'profile'){
      return (<EventCardListProfile {...props}/>)
    }
    else if(props.listType === 'created'){
      return (<CardListCreated {...props}/>)
    }
    else if(props.listType === 'deals'){
      return (
        <EventList 
          listType={props.listType} 
          client={props.client}
          CardComponent={DealCard}
          userId={user.sub}
          query={QUERY_DEAL_FEED}
          filter={props.filter}
        />
      )
    }
    else {
      return <h1>Not Home</h1>
      //return (<EventCardListHome {...props}/>)
    }
  }

  return (
    <div >
      {eventList()}
    </div>
  )
}
