import React from 'react'

import EventCardListHome from 'components/EventCards/EventCardListHome.js'
import EventCardListSaved from 'components/EventCards/EventCardListSaved.js'

export default function EventCardList(props) {

  const eventList = () => {
    if(props.listType == 'home'){
      return (<EventCardListHome {...props}/>)
    }
    else if(props.listType == 'saved'){
      return (<EventCardListSaved {...props}/>)
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
