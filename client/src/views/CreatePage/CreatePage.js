/*eslint-disable*/
import React, { useEffect, useState } from "react";
import axios from 'axios'
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import {IconButton} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

// core components
import MomentUtils from '@date-io/moment';    //uninstall if dont need this later

// sections for this page
import LocalOrPrivate from 'views/CreatePage/Sections/LocalOrPrivate.js';
import EventCreateInfo from 'views/CreatePage/Sections/EventCreateInfo.js';
import TagSelect from 'views/CreatePage/Sections/TagSelect.js';
import AddCohost from 'views/CreatePage/Sections/AddCohost/AddCohost.js';
import AddBanner from 'views/CreatePage/Sections/AddBanner.js';

import pricingStyle from "assets/jss/material-kit-pro-react/views/pricingStyle.js";
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
import {
  FETCH_IF_ENTITY,
  MUTATION_EVENT_ADD
} from 'EventQueries/EventQueries.js'

const useStyles = makeStyles(pricingStyle);

export default function PricingPage(props) {

  console.log("props blog: ", props);

  const { user } = useAuth0();

  console.log("user: ", user)


  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();

  const [values, setValues] = useState({
      // Page information for display
      currentPage: 0,
      goingBack: false,

      // User information
      isEntity: false,

      // Event Information to be submitted
      event_type: "",
      street: "",
      city: "",
      state: "",
      zip_code: 0,

      name: "",
      description: "",
      event_date: new Date(),
      start_time: new Date(),
      end_time: null,
      price: "0.00",
      allow_invites: false,
      host_approval: false,
      web_url: "",
      cover_pic: "",
      repeat_days: false,

      category: "Sports",
      tags: [],

      cohosts: []
  });

  // Functions
  const handleGoBack = () => {
    if (values.currentPage > 0) {
        setValues({
          ...values,
          currentPage: values.currentPage - 1,
          goingBack: true
        })
    }
    else {
        let path = `home`;
        props.history.push(path);
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
        currentPage: values.currentPage + 1
    });
}
// Page 1: Event Info Submission
  const handleTagInfo = (cat, inTags) => {
    setValues({
        ...values,
        currentPage: values.currentPage + 1,
        goingBack: false,

        category: cat,
        tags: inTags
    });
}

  const handleEventInfo =(
    name,
    address,
    city,
    state,
    event_date,
    start_time,
    end_time,
    description,
    repeat_days
  ) => {
    setValues({
      ...values, 
      currentPage: values.currentPage + 1,
      goingBack: false,

      name: name,
      description: description,
      street: address,
      city: city,
      state: state,
      event_date: event_date,
      start_time: start_time,
      end_time: end_time,
      repeat_days: repeat_days,
    });
  }

  const handleCohost = (cohostId) => {
    console.log(cohostId)
    setValues({
        ...values,
        currentPage: values.currentPage + 1,
        goingBack: false,

        cohosts: cohostId
    });
  }

/**
 * This function finally submits all the information received from the user.
 * Import bannerImg so we don't have to put it in the state.
 */
  const submitEvent = async (bannerImg) => {

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
    // If no errors, store image on cloudinary.
    console.log("SubmitEvnt Values: ", values);

    const form_data = new FormData();

    form_data.append('file', bannerImg)
    console.log(form_data)

    // Upload file to Cloudinary
    const response = await axios.post(`/storage/upload`, form_data);

    // Grabs image info and adds uploaded file ID to cover_pic in events table.
    console.log(response);
    console.log(response.data)

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

    // Inputs all information into Hasura Postgres DB via GraphQL
    props.client.mutate({
        mutation: MUTATION_EVENT_ADD,
        variables: {
            objects: [
                {
                    creator_id: user.sub,
                    event_type: values.event_type,
                    name: values.name,
                    description: values.description,
                    event_date: values.event_date.format('YYYY-MM-DD'),
                    start_time: values.start_time.format('HH:mm:ssZ'),
                    end_time: values.end_time.format('HH:mm:ssZ'),
                    price: values.price,
                    //allow_invites: values.allow_invites,
                    //host_approval: values.host_approval,
                    category: values.category,

                    street: values.street,
                    city: values.city,
                    state: values.state,

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
                    }
                }
            ],
            
        },
    }).then(() =>{
        let path = `home`;
        props.history.push(path);
    })

    // If returning to the Homepage becomes a problem:
    /*let path = `home`;
    props.history.push(path);
    // eslint-disable-next-line
    window.location.reload()*/
  }

  useEffect(() => {
    const userId = user.sub;
    if (props.client) {
      props.client.query({
          query: FETCH_IF_ENTITY,
          variables: {
            userId: userId,
          }
        })
        .then(data => {
          console.log("Entity Data: ", data.data.users[0].entity)
          setValues({ 
            ...values, 
            isEntity: data.data.users[0].entity
          });
        });
    }
  }, [])


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
        handleTagInfo={handleTagInfo} 
      />)
      break;
    case 3:
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
    case 4:
      appBarTitle = "Banner";
      page = <AddBanner 
          goingBack={values.goingBack} 
          submitEvent={submitEvent} 
          client={props.client}
      />
  }

  // For the appBarTitle, for some reason page 2 is not bold when using the <strong> tag
  //  so I set fontWeight to bolder, this fixed the problem but now none of the titles are bold except
  //  page 2. So I have to have BOTH fontWeight: 'bolder' AND <strong> for all of them.
  //  This is probably becsue I used a material-ui theme in EventCreateInfo.js
  return (
    <div style={{backgroundColor: "#02C39A", height: '100vh', overflowY: 'scroll'}}>
      <div style={{height: 60}}></div>
      <div className={classNames(classes.main, classes.mainRaised)} style={{minHeight: '90vh'}}>
        <div className={classes.container}>
          <IconButton style={{position: 'absolute', left: 0}} onClick={handleGoBack}>
            <ChevronLeftIcon style={{fontSize: '2em'}} />
          </IconButton>
          <h2 style={{paddingTop: 8, textAlign: 'center', fontWeight: 'bolder'}}><strong>{appBarTitle}</strong></h2>
          <hr />
          { page }
        </div>
      </div>
      <div style={{height: '2em'}}></div>
    </div>
  );
}