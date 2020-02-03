/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios'
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import EventLoading from 'components/EventLoading.js'
// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Favorite from "@material-ui/icons/Favorite";
import {IconButton} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

// sections for this page
import LocalOrPrivate from 'views/CreatePage/Sections/LocalOrPrivate.js';
import EventCreateInfo from 'views/CreatePage/Sections/EventCreateInfo.js';
import TagSelect from 'views/CreatePage/Sections/TagSelect.js';
import InviteUsers from 'views/CreatePage/Sections/InviteUsers.js';
import AddCohost from 'views/CreatePage/Sections/AddCohost/AddCohost.js';
import AddBanner from 'views/CreatePage/Sections/AddBanner.js';
import Header from "components/Header/Header.js";

import DealInfo from 'views/CreatePage/Sections/CreateDeal/DealInfo.js';

//Popups notifications
import { store } from 'react-notifications-component';

import pricingStyle from "assets/jss/material-kit-pro-react/views/pricingStyle.js";
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js';
import { createWeekdayString } from 'components/CommonFunctions.js';

import {
  FETCH_IF_ENTITY,
  MUTATION_EVENT_ADD,
  QUERY_FILTERED_EVENT,
  FETCH_FOLLOWING_FEED
} from 'EventQueries/EventQueries.js'

//For Google Analytics
import ReactGA from 'react-ga';

const useStyles = makeStyles(pricingStyle);
const primaryColor = "#02C39A"

export default function PricingPage(props) {
  
  var MomentUtils = require('moment');

  const { user } = useAuth0();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();

  const [values, setValues] = useState({
      // Page information for display
      currentPage: 0,
      goingBack: false,
      eventSubmitted: false,

      // User information
      isEntity: false,

      // Event Information to be submitted
      event_type: "",
      street: "",
      location_name: "",
      city: "",
      state: "",
      zip_code: 0,

      name: "",
      description: "",
      start_date: new Date(),
      end_date: new Date(),

      start_time: new Date(),
      end_time: null,
      price: "0.00",
      web_url: "",

      invite_only: false,
      guest_invites: false,
      host_approval: false,
      web_url: "",
      cover_pic: "",
      is_recurring: false,
      weekday: "",

      categories: [],
      tags: [],

      cohosts: [],
      guests: []
  });

  // Functions
  const handleGoBack = () => {
    if (values.currentPage > 0 && values.currentPage !== 6) {
        setValues({
          ...values,
          currentPage: values.currentPage - 1,
          goingBack: true
        })
    }
    else if(values.currentPage === 6) {
      setValues({
        ...values,
        currentPage: 0,
        goingBack: true
      })
    }
    else {
        let path = `home`;
        //props.history.push(path);
        props.history.goBack()
        // eslint-disable-next-line
        /*window.location.reload()*/
    }
  }

// Page 0: Loca or Private Choosing
const handleLocalOrPrivate = (type) => {
    setValues({
        ...values,
        goingBack: false,
        event_type: type,
        currentPage: type === 'deal' ? 6 : values.currentPage + 1 // If making deal, go to page 6
    });
}
// Page 1: Event Info Submission
  const handleTagInfo = (cat, inTags) => {
    setValues({
        ...values,
        currentPage: values.event_type === "local" ? values.currentPage + 2 : values.currentPage + 1,
        goingBack: false,

        categories: cat,
        tags: inTags
    });
}

  const handleEventInfo = (valuesInfo) => {

    let weekdayString = createWeekdayString({
      monday: valuesInfo.monday,
      tuesday: valuesInfo.tuesday,
      wednesday: valuesInfo.wednesday,
      thursday: valuesInfo.thursday,
      friday: valuesInfo.friday,
      saturday: valuesInfo.saturday,
      sunday: valuesInfo.sunday,
    });
    
    setValues({
      ...values, 
      currentPage: values.currentPage + 1,
      goingBack: false,

      name: valuesInfo.name,
      location_name: valuesInfo.location_name,
      description: valuesInfo.description,
      street: valuesInfo.street,
      city: valuesInfo.city,
      state: valuesInfo.state,
      price: valuesInfo.price,
      web_url: valuesInfo.web_url,
      start_date: valuesInfo.start_date,
      end_date: valuesInfo.end_date,
      start_time: valuesInfo.start_time,
      end_time: valuesInfo.endTimeExists ? valuesInfo.end_time : null,
      is_recurring: valuesInfo.repeatCheck,
      weekday: weekdayString
    });
  }

  const handleCohost = (cohostId) => {
    setValues({
        ...values,
        currentPage: values.currentPage + 1,
        goingBack: false,

        cohosts: cohostId
    });
  }

  const handleGuests = (inGuests, inviteSettings) => {
    setValues({
        ...values,
        currentPage: values.currentPage + 1,
        goingBack: false,

        guests: inGuests,
        invite_only: inviteSettings.inviteOnly,
        guest_invites: inviteSettings.allowGuestInvites,
        host_approval: inviteSettings.inviteApproval
    });
  }

  const setLoadingPage = (val) => {
    setValues({
      ...values,
      eventSubmitted: val
    });
  }

  const eventSubmitting = () => {
    if(values.eventSubmitted) {
      return(
        <EventLoading text={values.currentPage === 6 ? "Creating Deal" : "Creating Event"}/>
      )
    }
    else {
      return
    }
  }

/**
 * This function finally submits all the information received from the user.
 * Import bannerImg so we don't have to put it in the state.
 */
  const submitEvent = async (bannerImg) => {

    let errorOccurred = false;

    // Error Check event creation first
    if(
      !values.name.replace(/\s/g, '').length && 
      !values.city.replace(/\s/g, '').length && 
      !values.state.replace(/\s/g, '').length
      )
    {
      // Error message or something
      console.log("Event not completed")
      let path = `home`;
      props.history.push(path);
    }
    // If no errors, store image on cloudinary, display loading bar

    setValues({
      ...values,
      eventSubmitted: true
    })

    let response;

    if(typeof bannerImg !== "number") {
      const form_data = new FormData();

      form_data.append('file', bannerImg)

      // Upload file to Cloudinary
      response = await axios.post(`/storage/upload`, form_data).catch((error => {
        alert("Error Occurred: ", error.name)
        setValues({
          ...values,
          eventSubmitted: false
        })
        errorOccurred = true;
        return;
      }))
      
      if (errorOccurred) {
        return
      }
    }

    // Grabs image info and adds uploaded file ID to cover_pic in events table.

    //Order tags so they can be input properly
    let newTags = [];
    let i;
    // Adds all input tags inside these keys
    //  This is so if a tag already exists, we just grab the
    //  tag id and make the event_tags equal to that id.
    for(i = 0; i < values.tags.length; i++){
        newTags.push({
            tag: {
                    data: { name: values.tags[i] },
                    "on_conflict": {
                      "constraint": "tags_name_key",
                      "update_columns": "name"
                    }
                }
            }
    )};

    // Order Cohosts so they can be input into graphql
    let newCohosts = [];
    for(i = 0; i < values.cohosts.length; i++){
        newCohosts.push({
            cohost_id: values.cohosts[i]
        });
    }

    // Order guestsinto array so they can be input into graphql
    let newGuests = [];
    for(i = 0; i < values.guests.length; i++){
        newGuests.push({
          invited_id: values.guests[i],
          inviter_id: user.sub
        });
    }


    // Inputs all information into Hasura Postgres DB via GraphQL
    //If user submits their own image
    if(typeof bannerImg !== "number") {
      props.client.mutate({
          mutation: MUTATION_EVENT_ADD,
          // refetchQueries: [{
          //   query: values.event_type === "private" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT
          // }],
          variables: {
              objects: [
                  {
                      creator_id: user.sub,
                      event_type: values.event_type,
                      name: values.name,
                      description: values.description,
                      start_time: MomentUtils(values.start_time).format('HH:mm:ss'),
                      end_time: values.end_time !== null ? MomentUtils(values.end_time).format('HH:mm:ss') : null,
                      price: values.price,
                      web_url: values.web_url ? values.web_url : "",
                      //allow_invites: values.allow_invites,
                      //host_approval: values.host_approval,

                      invite_only: values.invite_only,
                      guest_invites: values.guest_invites,
                      host_approval: values.host_approval,
                      category: values.categories[0],
                      second_category: values.categories.length === 2 ? values.categories[1] : null,

                      street: values.street,
                      city: values.city,
                      state: values.state,
                      location_name: values.location_name,

                      event_date: {
                        data: {
                          start_date: MomentUtils(values.start_date).format('YYYY-MM-DD'),
                          end_date: values.is_recurring ? MomentUtils(values.end_date).format('YYYY-MM-DD') : values.start_date,
                          is_recurring: values.is_recurring,
                          weekday: values.weekday
                        }
                      },
                      image: {
                          data: {
                              image_name: bannerImg.name,
                              image_uuid: response.data.id,
                              url: response.data.url,
                              content_type: bannerImg.type,
                          }
                      },
                      event_tags: {
                          data: newTags
                      },
                      event_cohosts: {
                        data: newCohosts
                      },
                      event_invites: {
                        data: newGuests
                      }
                  }
              ],
              
          },
      }).then((data) =>{
        store.addNotification({
          title: `You created the event ${values.name}`,
          message: `Viewing your event right now!`,
          //content: <div style={{backgroundColor: primaryColor}}><a href={`/events/${data.data.insert_events.returning[0].id}`}>Click here to go to event</a></div>,
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
        let path = `/events/${data.data.insert_events.returning[0].id}`;
        props.history.push(path);
      }).catch(error => {
        console.log(error);
        alert("Error Occurred: ", error.name)
        setValues({
          ...values,
          eventSubmitted: false
        })
        return
      });
    }

    //If user selects one of our images
    if(typeof bannerImg === "number") {
      props.client.mutate({
        mutation: MUTATION_EVENT_ADD,
        // refetchQueries: [{
        //   query: values.event_type === "private" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT,
        //   variables: {
        //     userId: user.sub
        //   }
        // }],
        variables: {
            objects: [
                {
                    creator_id: user.sub,
                    event_type: values.event_type,
                    name: values.name,
                    description: values.description,
                    start_time: MomentUtils(values.start_time).format('HH:mm:ss'),
                    end_time: values.end_time !== null ? MomentUtils(values.end_time).format('HH:mm:ss') : null,
                    price: values.price,
                    web_url: values.web_url ? values.web_url : "",
                    //allow_invites: values.allow_invites,
                    //host_approval: values.host_approval,
                    invite_only: values.invite_only,
                    guest_invites: values.guest_invites,
                    host_approval: values.host_approval,
                    category: values.categories[0],
                    second_category: values.categories.length === 2 ? values.categories[1] : null,

                    street: values.street,
                    city: values.city,
                    state: values.state,
                    location_name: values.location_name,

                    event_date: {
                      data: {
                        start_date: MomentUtils(values.start_date).format('YYYY-MM-DD'),
                        end_date: MomentUtils(values.end_date).format('YYYY-MM-DD'),
                        is_recurring: values.is_recurring,
                        weekday: values.weekday
                      }
                    },
                    cover_pic: bannerImg,
                    event_tags: {
                        data: newTags
                    },
                    event_cohosts: {
                      data: newCohosts
                    },
                    event_invites: {
                      data: newGuests
                    }
                }
            ],
            
        },
    }).then((data) =>{
      store.addNotification({
        title: `You created the event ${values.name}`,
        message: `Viewing your event right now!`,
        //content: <div style={{backgroundColor: primaryColor}}><a href={`/events/${data.data.insert_events.returning[0].id}`}>Click here to go to event</a></div>,
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
      let path = `/events/${data.data.insert_events.returning[0].id}`;
      props.history.push(path);
    }).catch(error => {
      console.log(error)
      alert("Error Occurred: ", error.name)
      setValues({
        ...values,
        eventSubmitted: false
      })
      return
    });
  }

    // If returning to the Homepage becomes a problem:
    /*let path = `home`;
    props.history.push(path);
    // eslint-disable-next-line
    window.location.reload()*/
  }

  useEffect(() => {
    const userId = user.sub;

    //Record page view on Google analytics
    console.log("ReactGA Called: ", window.location.pathname)
    ReactGA.initialize('UA-151937222-1');
    ReactGA.pageview(window.location.pathname)

    //Check if user is an entity
    if (props.client) {
      props.client.query({
          query: FETCH_IF_ENTITY,
          variables: {
            userId: userId,
          }
        })
        .then(data => {
          setValues({ 
            ...values, 
            isEntity: data.data.users[0].entity
          });
        });
    }
  }, [])

  //---------------------- Page Numbers -------------------------
  // Handling What page displays here:
  let currentPageNumber = values.currentPage;
  let appBarTitle = "";
  let page = "";

  switch(currentPageNumber) {
    case 0:
      appBarTitle = "Create An Event";
      page = <LocalOrPrivate entity={values.isEntity} goingBack={values.goingBack} handleLocalOrPrivate={handleLocalOrPrivate}/>
      break;
    case 1:
      appBarTitle = "Create An Event";
      page = (
      <EventCreateInfo 
        entity={values.isEntity} 
        savedValues={values} 
        goingBack={values.goingBack} 
        handleEventInfo={handleEventInfo} 
      />
      )
      break;
    case 2:
      appBarTitle = "Category";
      page = (<TagSelect 
        goingBack={values.goingBack} 
        savedTag={values.tags} 
        savedCategory={values.category}
        eventType={values.event_type} 
        handleTagInfo={handleTagInfo} 
      />)
      break;
    case 3: 
        appBarTitle = "Invite Guests"
        page = <InviteUsers 
          goingBack={values.goingBack} 
          handleGuests={handleGuests}
          guests={values.guests}
          invite_only={values.invite_only}
          guest_invites={values.guest_invites}
          host_approval={values.host_approval}
          client={props.client}
          userId={user.sub}
          event_type={values.event_type}
          entity={values.isEntity} 

        />
        break;
    case 4:
      appBarTitle = "Add A Cohost";
      page = <AddCohost 
        goingBack={values.goingBack} 
        handleCohost={handleCohost}
        cohosts={values.cohosts}
        client={props.client}
        userId={user.sub}
        event_type={values.event_type}
      />
      break;
    case 5:
      appBarTitle = "Banner";
      page = <AddBanner 
          goingBack={values.goingBack} 
          submitEvent={submitEvent} 
          client={props.client}
      />
      break;
    case 6:
      appBarTitle = "Create a Deal";
      page = <DealInfo 
          goingBack={values.goingBack} 
          client={props.client}
          setLoadingPage={setLoadingPage}
      />
      break;
  }

  // For the appBarTitle, for some reason page 2 is not bold when using the <strong> tag
  //  so I set fontWeight to bolder, this fixed the problem but now none of the titles are bold except
  //  page 2. So I have to have BOTH fontWeight: 'bolder' AND <strong> for all of them.
  //  This is probably becsue I used a material-ui theme in EventCreateInfo.js
  return (
    <div style={{marginTop: '7vh'}}>
      <Header
        brand="Skedge"
        fixed
        color="primary"//"transparent"
        changeColorOnScroll={{
          height: 100,
          color: "primary"
        }}
      />
      {/* <div className={classNames(classes.main, classes.mainRaised)} style={{minHeight: '70vh', marginBottom: '2em', marginTop: '8vh'}}> */}
        <div className={classes.container}>
          <IconButton style={{position: 'absolute', left: 0}} onClick={handleGoBack}>
            <ChevronLeftIcon style={{fontSize: '2em'}} />
          </IconButton>
          <h2 style={{paddingTop: 8, textAlign: 'center', fontWeight: 'bolder'}}><strong>{appBarTitle}</strong></h2>
          <hr />
          {eventSubmitting()}
          { page }
        </div>
      {/* </div> */}
    </div>
  );
}
