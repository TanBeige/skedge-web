import React from 'react'

import EventCardListHome from 'components/EventCards/EventCardListHome.js'

export default function EventCardList(props) {

  const eventList = () => {
    if(props.listType == 'home'){
      return (<EventCardListHome {...props}/>)
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
