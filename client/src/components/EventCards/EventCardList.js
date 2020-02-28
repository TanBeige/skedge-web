import React from 'react'

import EventCardListHome from 'components/EventCards/HomeEventList/EventCardListHome.js'
import FollowingFeedList from 'components/EventCards/FollowingEventList/FollowingFeedList.js'
import EventCardListSaved from 'components/EventCards/EventCardListSaved.js'
import EventCardListProfile from 'components/EventCards/EventCardListProfile.js'
import EventCardListLand from 'components/EventCards/LandingEventList/EventCardListLand.js'
import CardListCreated from 'components/EventCards/CardListCreated.js'
import Button from "components/CustomButtons/Button.js";


import EventList from 'components/EventCards/List/EventList.js'
import ReactGA from 'react-ga';




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

  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    //Google Analytics Record when someone Clicks this
    ReactGA.initialize('UA-151937222-1');
    ReactGA.event({
      category: 'User',
      action: 'Login/Sign Up: Home Page'
    });
    //Then Login/Sign up
    loginWithRedirect({});
    // loginWithPopup({});
  }

  const eventList = () => {
    if(!isAuthenticated){
      return (
        <div style={{textAlign: 'center', marginTop: '3em'}}>
          <h3>
            Sign in to view feeds.
            <br />
            <Button
                color="primary"
                // style={{color: 'black'}}
                onClick={handleLogin}
            >
                Sign in
            </Button>
          </h3>
        </div>
      )
    }
    else if(props.listType === 'local'){
      return (
        <EventCardListHome
          userId={user.sub}
          {...props}
        />)
    }
    else if(props.listType === 'following'){
      return (
        <FollowingFeedList
          userId={user.sub}
          // type='following'
          {...props}  
        />)
    }
    else if(props.listType === 'landing'){
      return (
        <EventCardListLand
          userId={user.sub}
          type='landing' 
          {...props} 
        />)
    }
    else if(props.listType === 'saved'){
      return (
        <EventCardListSaved
          userId={user.sub}
          {...props}
        />)
    }
    else if(props.listType === 'profile'){
      return (
        <EventCardListProfile
          userId={user.sub}
          {...props}
        />)
    }
    else if(props.listType === 'created'){
      return (
        <CardListCreated
          userId={user.sub}
          {...props}
        />)
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
          tryTomorrow={props.tryTomorrow}
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
