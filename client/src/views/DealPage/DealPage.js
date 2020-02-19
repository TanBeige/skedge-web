import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
// nodejs library to set properties for components
import gql from "graphql-tag";
import { Helmet } from 'react-helmet';


import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/styles';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import EventLoading from 'components/EventLoading.js';
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';

import DealInfoSection from 'views/DealPage/Sections/NewDealInfoSection.js'
import SkedgeDisclosure from 'components/Footer/SkedgeDisclosure';
import EditDealButton from './DealComponents/EditDealButton.js';
import RelatedDealsWrapper from './Sections/RelatedDeals/RelatedDealsWrapper.js';



// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';


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
  MUTATION_DEAL_UPDATE,
  MUTATION_DEAL_DELETE,
} from 'EventQueries/EventQueries.js'
import ErrorPage from "views/ErrorPage/ErrorPage.js";

//Google analytics import
import ReactGA from 'react-ga';

var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    },
    secondary: {
      main: pink[600]
    },
    // error: {
    //   main: "#F5DA5F"
    // }
  },
});

const useStyles = makeStyles(blogPostPageStyle);
require('views/DealPage/NewDealPage.css');

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

    point_1: "",
    point_2: "",

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
    if(!user) {
      props.history.push("/")
    }
    else{
      props.history.goBack()
    }
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
          point_1: data.data.deals[0].point_1 ? data.data.deals[0].point_1 : "",
          point_2: data.data.deals[0].point_2 ? data.data.deals[0].point_2 : "",
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

          latitude: data.data.deals[0].latitude,
          longitude: data.data.deals[0].longitude,
      
          cover_uuid: data.data.deals[0].cover_pic,
          cover_url: cloudinary.url(data.data.deals[0].cover_pic, {secure: true, height: Math.floor(window.innerHeight * 0.6), crop: "scale", fetch_format: "auto", quality: "auto"}),

          user_id: data.data.deals[0].user.id,
          user_pic: cloudinary.url(data.data.deals[0].user.picture, {secure: true, width: 32, height: 32, crop: "fill"}),

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
  const handleDealChange = async (newInfo, weekday, endTimeExists) => {
    setImageUploading(true)


    //Upload Image to Cloudinary, Delete Old picture Afterwards
    let errorOccurred = false;
    let coverPicId = values.cover_uuid;
    let response = "";

    if(newInfo.picFile) {
      const form_data = new FormData();

      form_data.append('file', newInfo.picFile)

      // Upload file to Cloudinary
      response = await axios.post(
        `/deal/update`, 
        form_data, 
        {
        params: {
          picId: coverPicId
        }}
      ).catch((error => {
        alert("Error occurred while uploading picture, try uploading a smaller image size or try again later.")
        errorOccurred = true;
        return;
      }));
    }

    if (errorOccurred) {
      return
    }


    //Make Changes to Database
    props.client.mutate({
      mutation: MUTATION_DEAL_UPDATE,
      refetchQueries: [{
        query: QUERY_DEAL_INFO,
        variables: {
          dealId: dealId
        }
      }],
      variables: {
        dealId: values.deal_id,

        name: newInfo.name,
        locationName: newInfo.location_name,
        street: newInfo.street,
        city: newInfo.city,
        state: newInfo.state,

        startDate: newInfo.start_date,
        endDate: newInfo.is_recurring ? newInfo.end_date : newInfo.start_date,
        startTime: moment(newInfo.start_time).format("HH:mm:ss"),
        endTime: newInfo.end_time ? moment(newInfo.end_time).format("HH:mm:ss") : null,
        isRecurring: newInfo.is_recurring,
        weekday: newInfo.is_recurring ? weekday : "",

        description: newInfo.description,
        point1: newInfo.point_1,
        point2: newInfo.point_2,

        coverPic: response ? response.data.id : coverPicId,
        webUrl: newInfo.web_url,
        savings: newInfo.savings,
        lat: newInfo.street != values.street ? null : values.latitude,
        long: newInfo.street != values.street ? null : values.longitude,
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
      end_date: newInfo.is_recurring ? newInfo.end_date : newInfo.start_date,
      is_recurring: newInfo.is_recurring,
      weekday: weekday,
      start_time: newInfo.start_time,
      end_time: newInfo.end_time,

      description: newInfo.description,
      point_1: newInfo.point_1,
      point_2: newInfo.point_2,
      cover_uuid: response ? response.data.id : coverPicId,
      cover_url: response ? cloudinary.url(response.data.id, {secure: true, height: window.innerHeight, crop: "scale", fetch_format: "auto", quality: "auto"}) : values.cover_url,

      webUrl: newInfo.web_url,
      savings: newInfo.savings
    })
  }

  //DELETE EVENT
  const handleDeleteDeal = () => {
    props.client.mutate({
      mutation: MUTATION_DEAL_DELETE,
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
  }, [dealId])

  const classes = useStyles();

  const editingDeal = () => {
      if(isAuthenticated) {
        if(user.sub === values.user_auth0_id ) {
          return (
            <div>
                <EditDealButton 
                    client={props.client}
                    userId={user.sub}
                    creatorId={values.user_auth0_id}
                    handleDealChange={handleDealChange}
                    oldDeal={values}
                    handleDeleteDeal={handleDeleteDeal}
                />
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
  //If user is signed in
  else {
    return (
      <div>
        <Helmet>
          <title>{values.name} | Skedge</title>
          <meta name="description" content={values.description ? values.description : values.point_1} />
          <meta name="theme-color" content="#02C39A" />

          <meta name="geo.region" content="US-FL" />
          <meta name="geo.placename" content={values.city} />
          <meta name="geo.position" content={`${values.latitude};${values.longitude}`}/>
          <meta name="ICBM" content={`${values.latitude},${values.longitude}`}/>
        </Helmet>
        <ThemeProvider theme={theme}>
        {
          //If user is changing deals
          imageUploading ? 
          <EventLoading text="Saving Changes" /> : ""
        }
        
        <Button onClick={goBack} justIcon round style={{position: 'fixed', top: 20,  left: 20, zIndex: 5}} color="primary">
          {
            user ?
            <ChevronLeftIcon /> : <HomeIcon />
          }
        </Button>
        <Parallax image={values.cover_url}>
          {/* {editingEvent()} */}
          {
            !user ? 
            <div style={{margin: 'auto', textAlign: 'center', marginBottom: '1em',paddingBottom: '12', maxWidth: '300px'}}>
              {/* <h4 style={{color:'white'}}>Sign up to see more events like this happening soon.</h4> */}
              <Button
                color="white"
                style={{color: 'black'}}
                onClick={handleLogin}
              >
                Login or Sign Up
              </Button>
            </div> : ""
          }     
        </Parallax>
            <div className={classes.container} style={{padding: 0, marginBottom: '7vh'}}>
                <DealInfoSection 
                    dealInfo={values}
                    client={props.client}
                />

                {
                    values.start_date !== "" ?
                    <RelatedDealsWrapper 
                        currentDealId={dealId}
                        client={props.client} 

                        start_date={values.start_date}
                        weekday={values.weekday}
                        city={values.city}
                        state={values.state}
                        is_recurring={values.is_recurring}
                    /> : ""
                }
            </div>
        </ThemeProvider>
      </div>
    );
  } 
}
