import React from 'react'

import EventCardListHome from 'components/EventCards/HomeEventList/EventCardListHome.js'
import FollowingFeedList from 'components/EventCards/FollowingEventList/FollowingFeedList.js'
import EventCardListSaved from 'components/EventCards/EventCardListSaved.js'
import EventCardListProfile from 'components/EventCards/EventCardListProfile.js'
import EventCardListLand from 'components/EventCards/LandingEventList/EventCardListLand.js'
import CardListCreated from 'components/EventCards/CardListCreated.js'

export default function EventCardList(props) {
console.log(props.listType)
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
