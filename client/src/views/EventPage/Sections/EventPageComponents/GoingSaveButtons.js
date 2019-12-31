import React, {useEffect, useState} from 'react';
import Button from 'components/CustomButtons/Button.js'
import { useAuth0 } from 'Authorization/react-auth0-wrapper';

import {
    MUTATION_EVENT_SAVE,
    MUTATION_EVENT_UNDO_SAVE,
    REFETCH_EVENT_SAVES,

    MUTATION_EVENT_GOING,
    MUTATION_EVENT_UNDO_GOING,

    MUTATION_EVENT_RESPONSE,

    REFETCH_EVENT_GOING,
    FETCH_EVENT_INFO,
    FETCH_EVENT_GOING_SAVE,

  } from 'EventQueries/EventQueries.js'
import { userInfo } from 'os';

export default function GoingSaveButtons (props) {

    const { user } = useAuth0();

    const [values, setValues] = useState({
        ifGoing: false,
        ifSaved: false
    })

    //Handle Event Going    
    const goingToEvent = () => {
    // Change to Not Going To Event
    if(values.ifGoing) {
        props.client.mutate({
            mutation: MUTATION_EVENT_RESPONSE,
            refetchQueries: [{
                query: FETCH_EVENT_GOING_SAVE,
                variables: {
                    eventId: props.eventId,
                    userId: user.sub
                }
            }],
            variables: {
                invitedId: user.sub,
                inviterId: props.eventHost,
                eventId: props.eventId,
                response: 2
            }
        }).then(() => {
            setValues({
                ...values,
                ifGoing: false,
            })
        })
    }
    // Change to Going To Event
    else {
        props.client.mutate({
            mutation: MUTATION_EVENT_RESPONSE,
            refetchQueries: [{
                query: FETCH_EVENT_GOING_SAVE,
                variables: {
                    eventId: props.eventId,
                    userId: user.sub
                }
            }],
            variables: {
                invitedId: user.sub,
                inviterId: props.eventHost,
                eventId: props.eventId,
                response: 1
            }
        }).then(() => {
            setValues({
                ...values,
                ifGoing: true
            })
        })
    }
    }
    // Handle Event Saving
    const saveEvent = () => {
    // Change to Not Saving To Event
    if(values.ifSaved) {
        props.client.mutate({
        mutation: MUTATION_EVENT_UNDO_SAVE,
        refetchQueries: [{
            query: FETCH_EVENT_GOING_SAVE,
            variables: {
                eventId: props.eventId,
                userId: user.sub
            }
        }],
        variables: {
            eventId: props.eventId,
            userId: user.sub
        }
        }).then(() => {
        setValues({
            ...values,
            ifSaved: false,
        })
        })
    }
    else {
    // Change to Saving To Event
        props.client.mutate({
        mutation: MUTATION_EVENT_SAVE,
        refetchQueries: [{
            query: FETCH_EVENT_GOING_SAVE,
            variables: {
                eventId: props.eventId,
                userId: user.sub
            }
        }],
        variables: {
            eventId: props.eventId,
            userId: user.sub
        }
        }).then(() => {
        setValues({
            ...values,
            ifSaved: true
        })
        })
    }
    }

    useEffect(() => {
        setValues({
            ifGoing: props.ifGoing,
            ifSaved: props.ifSaved
        })
    }, [props.ifGoing, props.ifSaved])


    let goingButton = "";
    if(!values.ifGoing){ // not going to event
      goingButton = <Button color="rose" onClick={goingToEvent} style={{margin: '0px 10px', width: '40%'}}>Status: Not Going</Button>
    }
    else {
      goingButton = <Button color="info" onClick={goingToEvent} style={{margin: '0px 10px', width: '40%'}}>status: Going</Button>
    }
  
    let saveButton = "";
    if(!values.ifSaved) {
      saveButton = <Button color="rose" onClick={saveEvent} style={{margin: '0px 10px', width: '40%'}}>Save</Button>
    }
    else {
      saveButton = <Button color="info" onClick={saveEvent} style={{margin: '0px 10px', width: '40%'}}>Saved</Button>
    }

    return (
        <div>
            {goingButton}
            {saveButton}
        </div>
    )
}