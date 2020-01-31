import React, {useEffect, useState} from 'react';
import Button from 'components/CustomButtons/Button.js'

import { useAuth0 } from 'Authorization/react-auth0-wrapper';
import { store } from 'react-notifications-component';




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
                eventId: props.eventId,
                inviterId: props.eventHost,
                response: 2
            }
        }).then(() => {
            setValues({
                ...values,
                ifGoing: false,
            })
            store.addNotification({
                title: `Not Going`,
                message: `You are not going to this event.`,
                type: "danger",
                insert: "bottom",
                container: "bottom-center",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: false
                }
            });
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
                eventId: props.eventId,
                inviterId: props.eventHost,
                response: 1
            }
        }).then(() => {
            setValues({
                ...values,
                ifGoing: true
            });
            store.addNotification({
                title: `Now Going!`,
                message: `Now going to this event.`,
                type: "success",
                insert: "bottom",
                container: "bottom-center",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: false
                }
            });
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
            });
            store.addNotification({
                title: `Unsaved event`,
                message: `This event is now unsaved to your profile.`,
                type: "danger",
                insert: "bottom",
                container: "bottom-center",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: false
                }
            });
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
            });
            store.addNotification({
                title: `Saved event!`,
                message: `This event is now saved to your profile.`,
                type: "info",
                insert: "bottom",
                container: "bottom-center",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: false
                }
            });
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