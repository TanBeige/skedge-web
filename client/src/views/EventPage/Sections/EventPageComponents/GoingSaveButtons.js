import React, {useEffect, useState} from 'react';
import Button from 'components/CustomButtons/Button.js'

import { useAuth0 } from 'Authorization/react-auth0-wrapper';
import { store } from 'react-notifications-component';

import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
import TurnedInIcon from '@material-ui/icons/TurnedIn';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Tooltip from '@material-ui/core/Tooltip';


import RenewIcon from '@material-ui/icons/Autorenew';
import ReplyIcon from '@material-ui/icons/Reply';

import {
    MUTATION_EVENT_SAVE,
    MUTATION_EVENT_UNDO_SAVE,

    MUTATION_EVENT_RESPONSE,
    FETCH_EVENT_GOING_SAVE,

    
    MUTATION_LIKE_EVENT,
    MUTATION_UNLIKE_EVENT,

    
    MUTATION_REPOST_EVENT,
    MUTATION_UNPOST_EVENT,
} from 'EventQueries/EventQueries.js'


export default function GoingSaveButtons (props) {

    const { user } = useAuth0();

    const [values, setValues] = useState({
        ifGoing: false,
        ifSaved: false,
        ifLiked: false,
        ifReposted: false,

        likeAmount: 0,
        repostAmount: 0,
        goingAmount: 0

    })

    //Handle Event Going    
    const goingToEvent = () => {
    // Change to Not Going To Event
    if(values.ifGoing) {
        props.client.mutate({
            mutation: MUTATION_EVENT_RESPONSE,
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
                goingAmount: values.goingAmount - 1
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
            variables: {
                invitedId: user.sub,
                eventId: props.eventId,
                inviterId: props.eventHost,
                response: 1
            }
        }).then(() => {
            setValues({
                ...values,
                ifGoing: true,
                goingAmount: values.goingAmount + 1
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
    
    // Handling event reposts
    const handleRepost = () => {
  
        if(values.ifReposted) {
          props.client.mutate({
            mutation: MUTATION_UNPOST_EVENT,
            variables: {
              eventId: props.eventId,
              userId: user.sub
            }
          }).then((data) => {
            setValues({
              ...values,
              ifReposted: false,
              repostAmount: (values.repostAmount - 1)
            });
          })
        }
        else {
          props.client.mutate({
            mutation: MUTATION_REPOST_EVENT,
            variables: {
              eventId: props.eventId,
              userId: user.sub,
              objects: {
                user_id: props.eventHost,
                activity_type: 1,
                source_id: props.eventId,
                other_user_id: user.sub
              }
            }
          }).then((data) => {
            setValues({
              ...values,
              ifReposted: true,
              repostAmount: (values.repostAmount + 1)
            });
            store.addNotification({
              title: `Event shared!`,
              message: `This event is now shared with all of your followers.`,
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
  
      const handleLike = () => {
        if(values.ifLiked) {
        props.client.mutate({
            mutation: MUTATION_UNLIKE_EVENT,
            variables: {
              eventId: props.eventId,
              userId: user.sub
            }
          }).then((data) => {
            setValues({
              ...values,
              ifLiked: false,
              likeAmount: (values.likeAmount - 1)
            })
          })
        }
        else {
        props.client.mutate({
            mutation: MUTATION_LIKE_EVENT,
            variables: {
              eventId: props.eventId,
              userId: user.sub,
              objects: {
                user_id: props.eventHost,
                activity_type: 0,
                source_id: props.eventId,
                other_user_id: user.sub
              }
            }
          }).then((data) => {
            setValues({
              ...values,
              ifLiked: true,
              likeAmount: (values.likeAmount + 1)
            });
          })
        }
      }

    useEffect(() => {
        setValues({
            ifGoing: props.ifGoing,
            ifSaved: props.ifSaved,
            ifLiked: props.ifLiked,
            ifReposted: props.ifReposted,

            likeAmount: props.likeAmount,
            repostAmount: props.repostAmount,
            goingAmount: props.goingAmount
    
        })
    }, [props.ifGoing, props.ifSaved])



    // Buttons

    const goingButton = (
        <Button className='buttonMargin' round size={values.ifGoing ? 'sm' : null}color={values.ifGoing ? "info" : "primary"} onClick={goingToEvent}>
            {values.ifGoing ? `${values.goingAmount} Going` : "Go"}
        </Button>

    )
    const saveButton = (
      <Tooltip title="Save event for later"  placement="top">
        <Button className='buttonMargin' justIcon round size='sm' style={{backgroundColor: '#5F60F5'}} onClick={saveEvent}>
            {values.ifSaved ? <TurnedInIcon fontSize='small'/> : <TurnedInNotIcon fontSize='small'/>}
        </Button>
      </Tooltip> 
    )
    const likeButton = (
        <Button className='buttonMargin' justIcon round size='sm' color='rose' onClick={handleLike}>
            {values.ifLiked ? <FavoriteIcon fontSize='small'/> : <FavoriteBorderIcon fontSize='small'/>}
        </Button>
    )
    const repostButton = (
      <Tooltip title="Share to your followers"  placement="top">
        <Button className='buttonMargin' justIcon round size='sm' color={values.ifReposted ? 'primary' : 'white'} onClick={handleRepost}>
            <RenewIcon fontSize='small'/>
        </Button>
      </Tooltip>
    )
    const shareButton = (
        <Button className='buttonMargin' justIcon round size='sm' color='github' onClick={saveEvent}>
            <ReplyIcon fontSize='small'/>
        </Button>
    )

    return (
        <div style={{height: '4em', display: 'inline-block', marginBottom: '-50%'}}>
            {/* {likeButton} */}
            {repostButton}

            {goingButton}

            {saveButton}
            {/* {shareButton} */}
        </div>
    )
}