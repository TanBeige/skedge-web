/*  Code Written By: Tan Arin
*
*   Description: 
*     Functional Component that holds SectionPills that display all the events.
*     Page that loads all /home page informaiton.
*/

/*eslint-disable*/
import React, { useState, useEffect } from "react";
import moment from "moment";
import gql from "graphql-tag";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
// import Footer from "components/Footer/Footer.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import GridItem from "components/Grid/GridItem.js";
// import Parallax from "components/Parallax/Parallax.js";
import Button from "components/CustomButtons/Button.js";

// sections for this page
import SectionPills from "./Sections/SectionPills.js";
//import auth from "../../Authorization/Auth";
import { useAuth0 } from "../../Authorization/react-auth0-wrapper";

// Queries
import {
  FETCH_IF_ENTITY
} from 'EventQueries/EventQueries.js';

//For Google Analytics
import ReactGA from 'react-ga';

// For Scrolling to top
import * as Scroll from 'react-scroll';
import { animateScroll as scroll } from 'react-scroll'
//import { animateScroll as scroll} from 'react-scroll'

//Styles
import blogPostsPageStyle from "assets/jss/material-kit-pro-react/views/blogPostsPageStyle.js";
import './HomePageStyle.css';

const useStyles = makeStyles(blogPostsPageStyle);

export default function HomePage(props) {
  //Styling
  const classes = useStyles();
  const { loading, isAuthenticated, user } = useAuth0();

  //Variables
  const [isEntity, setIsEntity] = useState(true);


  //Scroll To Top of the page
  const scrollToTop = () => {
    // scroll.scrollTo('listTop', {
    //   duration: 1500,
    //   delay: 100,
    //   isDynamic: true,
    //   smooth: true,
    //   containerId: 'scrollableDiv'
    // })
    
    scroll.scrollToTop();
  }  
  var ScrollLink = Scroll.Link;
 

 


  // Login/Event Logic:
  const updateLastSeen = () => {
    const userId = user.sub;
    const timestamp = moment().format();
    if (props.client) {
      props.client.mutate({
        mutation: gql`
          mutation($userId: String!, $timestamp: timestamp!) {
            update_users(
              where: { auth0_id: { _eq: $userId } }
              _set: { auth0_id: $userId, last_seen: $timestamp }
            ) {
              affected_rows
            }
          }
        `,
        variables: {
          userId: userId,
          timestamp: timestamp
        }
      })
      .then((response) => {
        //console.log("Blogs Response: ", response)
      })
      .catch(error => {
        console.error(error);
      });
    }
  };



  //Replaces ComponentDidMount() from React Components in Function Components

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  })

  // useEffect(() => {
    // props.client.query({
    //   query: gql`
    //     query fetch_user_id($userId: String) {
    //       users(
    //         where: {auth0_id: { _eq: $userId }}
    //       ) {
    //         id
    //       }
    //     }
    //   `,
    //   variables: {
    //     userId: user.sub
    //   }
    // }).then((data) => {
    //   setValues({
    //       ...values,
    //       currentUserId: data.data.users[0].id
    //   })
    // })
  // }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      // eslint-disable-next-line
      const lastSeenMutation = setInterval(
        updateLastSeen,
        10000
      );

      //Check if the user is an entity
      props.client.query({
        query: FETCH_IF_ENTITY,
        variables: {
          userId: user.sub
        }
      }).then((data) => {
        setIsEntity(data.data.users[0].entity)
      })
    }
    if(!loading) {
      console.log("ReactGA Called: ", window.location.pathname)
      ReactGA.initialize('UA-151937222-1');
      ReactGA.pageview(window.location.pathname)
    }

  },[props.client]); // Empty array for param means effect will only run on first render.

  //Place this here before returning the actual page so we can determine 
  // what displays while loading
  if (!user) {
    return (
      <div>Loading...</div>
    )
  }
  else {
    return (
      // <div style={{backgroundColor: "#52D3B6"}}>
      <div style={{paddingTop: '1px', paddingBottom: '5vh'}}>
        <Header
          brand="Skedge"
          //links={<HeaderLinks dropdownHoverColor="info"/>}
          fixed
          color="primary"//"transparent"
          changeColorOnScroll={{
            height: 100,
            color: "primary"
          }}
        />
        {/* <div className={classes.main} style={{backgroundColor: "white", minHeight: '80vh', marginBottom: '5vh', marginTop: '8vh'}}> */}
          <Button style={{position: 'fixed', bottom: 55, right: 10, zIndex: 5}} round justIcon color="primary" onClick={scrollToTop}>
                <ArrowUpwardIcon style={{color: "white"}} />
          </Button>
          <div className={classes.container} style={{ marginTop: '7vh'}} >

            {/* <h1 className='homeTitle'>Skedge</h1> */}
            {
              loading || !user ?
              "" :
              <SectionPills 
                client={props.client}
                userId={user.sub}
                isEntity={isEntity}
              />
            }
          </div>
        {/* </div> */}
      </div>
    );
  }
}
