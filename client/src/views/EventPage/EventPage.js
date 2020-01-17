import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
// nodejs library to set properties for components
import gql from "graphql-tag";

import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import EventLoading from 'components/EventLoading.js'


// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
// sections for this page
import SectionText from "./Sections/SectionText.js";
import SectionBlogInfo from "./Sections/SectionBlogInfo.js";
import SectionComments from "./Sections/SectionComments.js";
import SectionSimilarStories from "./Sections/SectionSimilarStories.js";
import CategoryFragment from './Sections/CategoryFragment.js';
import LoadingPage from '../LoadingPage/LoadingPage.js';
import EditEventButton from './Sections/EventPageComponents/EditEventButton.js';
import DeleteEventButton from './Sections/EventPageComponents/DeleteEventButton.js';



import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import {
  FETCH_EVENT_INFO,
  MUTATION_EVENT_VIEW,
  MUTATION_EVENT_UPDATE,
  MUTATION_EVENT_DELETE,
  QUERY_FILTERED_EVENT
} from 'EventQueries/EventQueries.js'
import ErrorPage from "views/ErrorPage/ErrorPage.js";

//Google analytics import
import ReactGA from 'react-ga';

var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(blogPostPageStyle);

export default function EventPage(props) {
  const eventId = props.match.params.id;

  const { loading, user, isAuthenticated} = useAuth0();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false)

  const [values, setValues] = useState({
    event_id: eventId,
    event_date_id: null,
    event_exists: true,

    invite_only: true,

    name: "",
    description: "",
    event_type: "",
    start_date: "",
    start_time: "",
    end_time: "",
    category: "",
    location_name: "",
    city: "",
    state: "",
    street: "",
    price: "",
    web_url: "",
    allow_invites: false,
    host_approval: true,
    updated_at: "",

    cover_uuid: "",
    cover_url: "",
    cover_pic: 0,

    user_id: 0,
    user_pic: "",
    user_name: "",
    user_full_name: "",

    views: 0,
    impressions: 0,
    
    event_cohosts: [],
    event_tags: [],
    liked_users: [],
    like_amount: 0,

    ifSaved: false,
    ifGoing: false,

    going_users: []
  })

  const goBack = () => {
    props.history.goBack()
  }

  const getEvent = () => {
    // Says we're loading the event
    setIsLoading(true);

    //Get Event Info from Database
    props.client.query({
      query: FETCH_EVENT_INFO,
      variables: {
        eventId: eventId
      }
    }).then((data) => {
      if(data.data.events === undefined || data.data.events.length === 0) {
        setValues({
          ...values,
          event_exists: false
        })
      }
      else {
        setValues({
          ...values,

          event_exists: true,
          event_date_id: data.data.events[0].event_date_id,

          invite_only: data.data.events[0].invite_only,

          name: data.data.events[0].name,
          description: data.data.events[0].description,
          event_type: data.data.events[0].event_type,

          start_date: data.data.events[0].event_date.start_date,
          end_date: data.data.events[0].event_date.end_date,

          is_recurring: data.data.events[0].event_date.is_recurring,
          weekday: data.data.events[0].event_date.weekday,

          start_time: data.data.events[0].start_time,
          end_time: data.data.events[0].end_time,
          category: data.data.events[0].category,
          location_name: data.data.events[0].location_name,
          city: data.data.events[0].city,
          state: data.data.events[0].state,
          street: data.data.events[0].street,
          price: data.data.events[0].price,
          web_url: data.data.events[0].web_url,
          allow_invites: data.data.events[0].allow_invites,
          host_approval: data.data.events[0].host_approval,
          updated_at: data.data.events[0].updated_at,
      
          cover_uuid: data.data.events[0].image.image_uuid,
          cover_url: cloudinary.url(data.data.events[0].image.image_uuid, {secure: true, height: window.innerHeight, crop: "scale", fetch_format: "auto", quality: "auto"}),
          cover_pic: data.data.events[0].cover_pic,

          user_id: data.data.events[0].user.id,
          user_pic: data.data.events[0].user.picture,
          user_name: data.data.events[0].user.name,
          user_full_name: data.data.events[0].user.full_name,
          user_biography: data.data.events[0].user.biography,
          user_auth0_id: data.data.events[0].user.auth0_id,

          views: data.data.events[0].views,
          impressions: data.data.events[0].impressions,
          
          event_cohosts: data.data.events[0].event_cohosts,
          event_tags: data.data.events[0].event_tags,

          ifSaved: data.data.events[0].user_saved_events.some(user => user.user_id === user.sub),
          ifGoing: data.data.events[0].event_invites.some(user => user.invited_id === user.sub),


          going_users: data.data.events[0].event_invites,

          liked_users: data.data.events[0].event_like,
          like_amount: data.data.events[0].event_like_aggregate.aggregate.count,

          shared_users: data.data.events[0].shared_event,
          share_amount: data.data.events[0]. shared_event_aggregate.aggregate.count
        })
        //Say that we're not loading the event anymore.
        setIsLoading(false);
      }
    }).catch(error => {
      console.log(error)
    })
  }

  //Submit Changes
  const handleEventChange = async (newInfo) => {
    setImageUploading(true)


    //Upload Image to Cloudinary, Delete Old picture Afterwards
    let errorOccurred = false;
    let coverPicId = values.cover_pic;
    let response = "";

    if(newInfo.picFile) {
      const form_data = new FormData();

      form_data.append('file', newInfo.picFile)

      // Upload file to Cloudinary
      response = await axios.post(
        `/storage/update`, 
        form_data, 
        {
        params: {
          picId: values.cover_uuid
        }}
      ).catch((error => {
        alert("Error occurred while uploading picture, try uploading a smaller image size or try again later.")
        errorOccurred = true;
        return;
      }))


      //After submitting image, save it in database
      await props.client.mutate({
        mutation: gql`
          mutation insert_image($objects: [images_insert_input!]!){
            insert_images(objects: $objects){
              returning{
                id
              }
            }
          }
        `,
        variables: {
          objects: {
            image_name: newInfo.name,
            image_uuid: response.data.id,
            url: response.data.url
          }
        },
      }).then((data) => {
        coverPicId = data.data.insert_images.returning[0].id

      }).catch(error => {
        console.log(error);
        errorOccurred = true;
      })
    }

    if (errorOccurred) {
      return
    }


    //Make Changes to Database
    props.client.mutate({
      mutation: MUTATION_EVENT_UPDATE,
      refetchQueries: [{
        query: FETCH_EVENT_INFO,
        variables: {
          eventId: eventId
        }
      }],
      variables: {
        eventId: values.event_id,
        eventDateId: values.event_date_id,
        name: newInfo.name,
        locationName: newInfo.location_name,
        street: newInfo.street,
        city: newInfo.city,
        state: newInfo.state,
        startDate: newInfo.start_date,
        startTime: moment(newInfo.start_time).format("HH:mm:ss"),
        endTime: newInfo.end_time ? moment(newInfo.end_time).format("HH:mm:ss") : null,
        description: newInfo.description,
        category: newInfo.category,
        coverPic: coverPicId
      }
    }).then((data)=> {
      console.log("Success!")
      setImageUploading(false)
    }).catch(error => {
      console.error(error);
    });

    setValues({
      ...values,
      name: newInfo.name,
      location_name: newInfo.location_name,
      street: newInfo.street,
      city: newInfo.city,
      state: newInfo.state,
      start_date: newInfo.start_date,
      //end_date: ,
      //is_recurring: newInfo.is_recurring,
      start_time: newInfo.start_time,
      end_time: newInfo.end_time,
      description: newInfo.description,
      category: newInfo.category,
      // cover_url: response.data.id
      cover_url: cloudinary.url(response.data.id, {secure: true, height: window.innerHeight, crop: "scale", fetch_format: "auto", quality: "auto"}),

    })
  }

  //DELETE EVENT
  const handleDeleteEvent = () => {
    props.client.mutate({
      mutation: MUTATION_EVENT_DELETE,
      refetchQueries: [{
        query: QUERY_FILTERED_EVENT,
        variables: {
          userId: user.sub
        }
      }],
      variables: {
        eventId: values.event_id
      }
    }).then(()=> {
      console.log("Success!");
      props.history.push("/home")
    }).catch(error => {
      console.error(error);
      alert("Error Deleted Event Occurred")
    });
  }

  // Add a View to the event
  const addView = () => {
    props.client.mutate({
      mutation: MUTATION_EVENT_VIEW,
      variables: {
        eventId: eventId
      }
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });


  useEffect(() => {
    console.log(imageUploading)
    getEvent();
    addView();
    
    //For Google Analytics 
    console.log("ReactGA Called: ", window.location.pathname)
    ReactGA.initialize('UA-151937222-1');
    ReactGA.pageview(window.location.pathname)
  }, [])

  let titleSize = '10vw'

  if (window.innerWidth > 1000) {
    titleSize = '5vw'
  }

  const classes = useStyles();

  const editingEvent = () => {
      if(isAuthenticated) {
        if(user.sub === values.user_auth0_id) {
          return (
            <div>
                {/* <Button size='sm' style={{marginTop: 20, marginBottom: 8}} color="tumblr">Edit Invites</Button> */}
                <EditEventButton 
                    client={props.client}
                    userId={user.sub}
                    creatorId={values.user_auth0_id}
                    handleEventChange={handleEventChange}
                    oldEvent={values}
                    handleDeleteEvent={handleDeleteEvent}
                />
                {/* <Button size='sm' style={{marginTop: 20, marginBottom: 8}} color="pinterest">Edit Cohosts</Button> */}
              </div>
          )
        }
      }
  }
  const deleteButton = () => {
    if(isAuthenticated) {
      return (
        <DeleteEventButton 
          userId={user.sub}
          creatorId={values.user_auth0_id}
          handleDeleteEvent={handleDeleteEvent}
        />
      )
    }
  }

  if(values.event_exists === false) {
    return <ErrorPage />
    //return <div>hello</div>
  }

  //If Event info is loadng
  else if(isLoading) {
    return (
      <div>
        <Header
          brand="Skedge"
          links={<HeaderLinks dropdownHoverColor="info" />}
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 300,
            color: "primary"
          }}
        />
        <LoadingPage reason="Loading Events"/>
      </div>
    )
  }
  //If user is not logged in
  else if(!user) {
    const userLink = `/users/${values.user_name}`
    return(
      <div>
        

        <Button onClick={goBack} justIcon round style={{position: 'fixed', top: 50,  left: 22, zIndex: 100}} color="primary">
                <ChevronLeftIcon/>
            </Button>
        <Parallax image={values.cover_url} filter="dark">
          <div className={classes.container}>
            
            <GridContainer justify="center">
              <GridItem md={10} className={classes.textCenter}>
                <h1 className={classes.title} style={{fontSize: titleSize, wordWrap: 'break-word'}}>
                  {values.name}
                </h1>
                <h4 className={classes.subtitle}>
                  Created by: <Link to={userLink}>{values.user_name}</Link>
                </h4>
                <br />
                  <CategoryFragment category={values.category}/>
                <br />                
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classes.main}>
          <div className={classes.container}>
            <SectionText 
              eventInfo={values}
              client={props.client}
            />
            {/* <SectionComments /> */}
          </div>
        </div>
        {/*<SectionSimilarStories />*/}
        <Footer
          content={
            <div>
              <div className={classes.left}>
                <List className={classes.list}>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="/home"
                      className={classes.block}
                    >
                      Skedge
                    </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="https://www.creative-tim.com/presentation?ref=mkpr-blog-post"
                      target="_blank"
                      className={classes.block}
                    >
                      About us
                    </a>
                  </ListItem>
                </List>
              </div>
            </div>
          }
        />
      </div>
    )
  }
  //If user is signed in
  else {
    const userLink = `/users/${values.user_name}`

    return (
      <div>
        {/* <Header
          brand="Skedge"
          links={<HeaderLinks dropdownHoverColor="info" />}
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 300,
            color: "primary"
          }}
        /> */}

        {
          //If user is changing events
          imageUploading ? 
          <EventLoading text="Saving Changes" /> : ""
        }

        <Button onClick={goBack} justIcon round style={{position: 'fixed', top: 50,  left: 22, zIndex: 100}} color="primary">
          <ChevronLeftIcon/>
        </Button>
        <Parallax image={values.cover_url} filter="dark">
          <div className={classes.container}>
            
            <GridContainer justify="center">
              <GridItem md={10} className={classes.textCenter}>
                <h1 className={classes.title} style={{fontSize: titleSize, wordWrap: 'break-word'}}>
                  {values.name}
                </h1>
                <h4 className={classes.subtitle}>
                  Created by: <Link to={userLink}>{values.user_name}</Link>
                </h4>
                <br />
                  <CategoryFragment category={values.category}/>
                <br />

                {editingEvent()}
                
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classes.main}>
          <div className={classes.container}>
            <SectionText 
              eventInfo={values}
              client={props.client}
            />
            <SectionBlogInfo
              eventInfo={values}
              eventId={values.event_id}
              client={props.client}
              />
            {/* <SectionComments /> */}
          </div>
        </div>
        {/*<SectionSimilarStories />*/}
        <Footer
          content={
            <div>
              <div className={classes.left}>
                <List className={classes.list}>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="/home"
                      className={classes.block}
                    >
                      Skedge
                    </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="https://www.creative-tim.com/presentation?ref=mkpr-blog-post"
                      target="_blank"
                      className={classes.block}
                    >
                      About us
                    </a>
                  </ListItem>
                </List>
              </div>
            </div>
          }
        />
      </div>
    );
  } 
}
