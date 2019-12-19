import React from 'react'

import EventCardListHome from 'components/EventCards/EventCardListHome2.js'
import EventCardListSaved from 'components/EventCards/EventCardListSaved.js'
import EventCardListProfile from 'components/EventCards/EventCardListProfile.js'

export default function EventCardList(props) {

  const eventList = () => {
    if(props.listType == 'home'){
      return (<EventCardListHome {...props}/>)
    }
    else if(props.listType == 'saved'){
      return (<EventCardListSaved {...props}/>)
    }
    else if(props.listType == 'profile'){
      return (<EventCardListProfile {...props}/>)
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
