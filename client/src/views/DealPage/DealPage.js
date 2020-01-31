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
import EventLoading from 'components/EventLoading.js';

import DealInfoSection from 'views/DealPage/Sections/DealInfoSection.js'
import SkedgeDisclosure from 'components/Footer/SkedgeDisclosure';


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
import LoadingPage from '../LoadingPage/LoadingPage.js';



import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import {
  QUERY_DEAL_INFO,
  QUERY_DEAL_INFO_ANONYMOUS,
  MUTATION_DEAL_VIEW,
  MUTATION_EVENT_UPDATE,
  MUTATION_EVENT_DELETE,
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
require('views/DealPage/DealPage.css');
export default function DealPage(props) {
  const dealId = parseInt(props.match.params.id);

  const { loading, user, isAuthenticated, loginWithRedirect, loginWithPopup} = useAuth0();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false)

  const [values, setValues] = useState({
    deal_id: dealId,
    deal_exists: true,

    name: "",
    description: "",
    start_date: "",
    end_date: "",

    start_time: "",
    end_time: "",
    category: "",
    location_name: "",
    city: "",
    state: "",
    street: "",
    savings: "",
    web_url: "",
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
    
    liked_users: [],
    like_amount: 0,

    ifSaved: false,
    ifGoing: false,

    going_users: []
  })

  const goBack = () => {
    props.history.goBack()
  }
  const handleLogin = () => {
    //Google Analytics Record when someone Clicks this
    ReactGA.initialize('UA-151937222-1');
    ReactGA.event({
      category: 'User',
      action: 'Login/Sign Up: Deal Page'
    });
    //Then Login/Sign up
    loginWithRedirect({});
    // loginWithPopup({});
  }

  const getDeal = () => {
    // Says we're loading the event
    setIsLoading(true);

    //Get Deal Info from Database
    props.client.query({
      query: user ? QUERY_DEAL_INFO : QUERY_DEAL_INFO_ANONYMOUS,
      variables: {
        dealId: dealId
      }
    }).then((data) => {
      if(data.data.deals === undefined || data.data.deals.length === 0) {
        setValues({
          ...values,
          deal_exists: false
        })
      }
      else {
        setValues({
          ...values,

          deal_exists: true,

          name: data.data.deals[0].name,
          description: data.data.deals[0].description,

          start_date: data.data.deals[0].start_date,
          end_date: data.data.deals[0].end_date,

          is_recurring: data.data.deals[0].is_recurring,
          weekday: data.data.deals[0].weekday,

          start_time: data.data.deals[0].start_time,
          end_time: data.data.deals[0].end_time,
          category: data.data.deals[0].category,
          location_name: data.data.deals[0].location_name,
          city: data.data.deals[0].city,
          state: data.data.deals[0].state,
          street: data.data.deals[0].street,
          savings: data.data.deals[0].savings,
          web_url: data.data.deals[0].web_url,
          updated_at: data.data.deals[0].updated_at,
      
          cover_uuid: data.data.deals[0].cover_pic,
          cover_url: cloudinary.url(data.data.deals[0].cover_pic, {secure: true, height: Math.floor(window.innerHeight * 0.6), crop: "scale", fetch_format: "auto", quality: "auto"}),
          cover_pic: data.data.deals[0].cover_pic,

          user_id: data.data.deals[0].user.id,
          user_pic: data.data.deals[0].user.picture,
          user_name: data.data.deals[0].user.name,
          user_full_name: data.data.deals[0].user.full_name,

          // Creator of event:
          user_auth0_id: data.data.deals[0].user.auth0_id,

          views: data.data.deals[0].views,
          impressions: data.data.deals[0].impressions,
          
          ifSaved: data.data.deals[0].user_saved_deals ? data.data.deals[0].user_saved_deals.some(user => user.user_id === user.sub) : false,

          liked_users: data.data.deals[0].deal_likes ? data.data.deals[0].deal_likes : [],
          like_amount: data.data.deals[0].deal_likes_aggregate.aggregate.count,
        })
        //Say that we're not loading the event anymore.
        setIsLoading(false);
      }
    }).catch(error => {
      console.log(error)
    })
  }

  //Submit Changes
  const handleDealChange = async (newInfo) => {
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
        query: QUERY_DEAL_INFO,
        variables: {
          dealId: dealId
        }
      }],
      variables: {
        dealId: values.deal_id,
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
  const handleDeleteDeal = () => {
    props.client.mutate({
      mutation: MUTATION_EVENT_DELETE,
      variables: {
        dealId: values.deal_id
      }
    }).then(()=> {
      console.log("Success!");
      props.history.push("/home")
    }).catch(error => {
      console.error(error);
      alert("Error Deleted Deal Occurred")
    });
  }

  // Add a View to the event
  const addView = () => {
    props.client.mutate({
      mutation: MUTATION_DEAL_VIEW,
      variables: {
        dealId: dealId
      }
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });


  useEffect(() => {
    localStorage.setItem('originPath', window.location.pathname);
    getDeal();
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

  const editingDeal = () => {
      if(isAuthenticated) {
        if(user.sub === values.user_auth0_id ) {
          return (
            <div>
                {/* <Button size='sm' style={{marginTop: 20, marginBottom: 8}} color="tumblr">Edit Invites</Button> */}
                {/* <EditEventButton 
                    client={props.client}
                    userId={user.sub}
                    creatorId={values.user_auth0_id}
                    handleEventChange={handleDealChange}
                    oldEvent={values}
                    handleDeleteEvent={handleDeleteDeal}
                /> */}
                {/* <Button disabled={!user.sub === values.user_auth0_id} size='sm' style={{marginTop: 20, marginBottom: 8}} color="pinterest">Edit Cohosts</Button> */}
              </div>
          )
        }
      }
  }

  if(values.deal_exists === false) {
    return <ErrorPage />
    //return <div>hello</div>
  }

  //If Deal info is loadng
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
        <LoadingPage reason="Loading deal"/>
      </div>
    )
  }
  //If user is not logged in
  else if(!user) {
    const userLink = `/${values.user_name}`
    return(
      <div>
        <Button onClick={goBack} justIcon round style={{position: 'fixed', top: 5,  left: 20, zIndex: 100}} color="primary">
          <ChevronLeftIcon/>
        </Button>
        <Parallax image={values.cover_url} filter="dark">
          <div className={classes.container} >
            
            <GridContainer justify="center" >
              <GridItem  className={classes.textCenter} style={{paddingLeft: 0, paddingRight: 0}}>                
                <h1 className={classes.title} style={{fontSize: titleSize, wordWrap: 'break-word'}}>
                  {values.name}
                </h1>
                <div>
                  <h4 className={classes.subtitle} style={{alignSelf: 'center'}}>
                    {` Created by:` } <Link to={userLink}>{values.user_name}</Link>
                  </h4>
                </div>  
                {
                  !user ? 
                  <div style={{margin: 'auto', textAlign: 'center', marginBottom: '2em',paddingBottom: '12', maxWidth: '300px'}}>
                    <h3 style={{color:'white'}}>Sign up to see more deals like this happening soon.</h3>
                    <Button
                      color="white"
                      style={{color: 'black'}}
                      onClick={handleLogin}
                    >
                      Login or Sign Up
                    </Button>
                  </div> : ""
                }         
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classes.main}>
          <div className={classes.container}>
            <DealInfoSection 
              dealInfo={values}
              client={props.client}
            />
            <SkedgeDisclosure/>
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
                      href="/about-us"
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
    const userLink = `/${values.user_name}`

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
          //If user is changing deals
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
                <div>
                  <h4 className={classes.subtitle} style={{alignSelf: 'center'}}>
                    {` Created by:` } <Link to={userLink}>{values.user_name}</Link>

                  </h4>
                </div>  

                {editingDeal()}
                
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classes.main}>
          <div className={classes.container}>
            <DealInfoSection 
              dealInfo={values}
              client={props.client}
            />
            <SkedgeDisclosure />
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
                      href="/about-us"
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
