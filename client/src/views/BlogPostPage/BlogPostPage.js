import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
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
// sections for this page
import SectionText from "./Sections/SectionText.js";
import SectionBlogInfo from "./Sections/SectionBlogInfo.js";
import SectionComments from "./Sections/SectionComments.js";
import SectionSimilarStories from "./Sections/SectionSimilarStories.js";
import CategoryFragment from './Sections/CategoryFragment.js'
import LoadingPage from '../LoadingPage/LoadingPage.js'

import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import {
  FETCH_EVENT_INFO,
  MUTATION_EVENT_VIEW
} from 'EventQueries/EventQueries.js'
import ErrorPage from "views/ErrorPage/ErrorPage.js";

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(blogPostPageStyle);

export default function BlogPostPage(props) {
  const eventId = props.match.params.id;

  const [values, setValues] = useState({
    event_id: eventId,
    event_exists: true,

    name: "",
    description: "",
    event_type: "",
    event_date: "",
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

    cover_url: "",
    user_id: 0,
    user_pic: "",
    user_name: "",
    user_full_name: "",
    
    event_cohosts: [],
    event_tags: [],
    users_liked: [],
    like_amount: 0
  })

  const goBack = () => {
    console.log(props)
    props.history.goBack()
  }

  const getEvent = () => {
    props.client.query({
      query: FETCH_EVENT_INFO,
      variables: {
        eventId: eventId
      }
    }).then((data) => {
      console.log("event data: ", data.data.events);
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

          name: data.data.events[0].name,
          description: data.data.events[0].description,
          event_type: data.data.events[0].event_type,
          event_date: data.data.events[0].event_date,
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
      
          cover_url: cloudinary.url(data.data.events[0].image.image_uuid, {secure: true, width: window.innerWidth, crop: "scale", fetch_format: "auto", quality: "auto"}),
          user_id: data.data.events[0].user.id,
          user_pic: data.data.events[0].user.picture,
          user_name: data.data.events[0].user.name,
          user_full_name: data.data.events[0].user.full_name,
          user_biography: data.data.events[0].user.biography,
          
          event_cohosts: data.data.events[0].event_cohosts,
          event_tags: data.data.events[0].event_tags,
          users_liked: data.data.events[0].event_like,
          like_amount: data.data.events[0].event_like_aggregate.aggregate.count
        })
      }
    })
  }
  console.log(values.cover_url)

  const addView = () => {
    props.client.mutate({
      mutation: MUTATION_EVENT_VIEW,
      variables: {
        eventId: eventId
      }
    }).then((data) =>{
        console.log("Event Views: ", data)
      }
    )
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true);
    getEvent();
    addView();
    setIsLoading(false);
  }, [])

  const classes = useStyles();

  if(values.event_exists === false) {
    return <ErrorPage />
    //return <div>hello</div>
  }
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
  else {
    const userLink = `/users/${values.user_id}`

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
        <Parallax image={values.cover_url} filter="dark">
          <div className={classes.container}>
            <Button onClick={goBack} justIcon round style={{position: 'absolute', top: 75,  left: 22}} color="primary">
                <ChevronLeftIcon/>
            </Button>
            <GridContainer justify="center">
              <GridItem md={8} className={classes.textCenter}>
                <h1 className={classes.title} style={{fontSize: '10vw'}}>
                  {values.name}
                </h1>
                <h4 className={classes.subtitle}>
                  Created by: <Link to={userLink}>{values.user_name}</Link>
                </h4>
                <br />
               <CategoryFragment category={values.category}/>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classes.main}>
          <div className={classes.container}>
            <SectionText eventInfo={values}/>
            <SectionBlogInfo
              eventInfo={values}
              />
            <SectionComments />
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
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="https://blog.creative-tim.com/?ref=mkpr-blog-post"
                      target="_blank"
                      className={classes.block}
                    >
                      Blog
                    </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="https://www.creative-tim.com/license?ref=mkpr-blog-post"
                      target="_blank"
                      className={classes.block}
                    >
                      Licenses
                    </a>
                  </ListItem>
                </List>
              </div>
              <div className={classes.right}>
                &copy; {1900 + new Date().getYear()} , made with{" "}
                <Favorite className={classes.icon} /> by{" "}
                <a
                  href="https://www.creative-tim.com?ref=mkpr-blog-post"
                  target="_blank"
                >
                  Creative Tim
                </a>{" "}
                for a better web.
              </div>
            </div>
          }
        />
      </div>
    );
  } 
}