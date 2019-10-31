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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
// sections for this page
import SectionPills from "./Sections/SectionPills.js";
import SectionInterested from "./Sections/SectionInterested.js";
import SectionImage from "./Sections/SectionImage.js";
import SubscribeLine from "./Sections/SubscribeLine.js";
import LoadingPage from '../LoadingPage/LoadingPage.js'

import SectionTitle from 'views/LandingPage/Sections/SectionTitle.js';


//import auth from "../../Authorization/Auth";
import { useAuth0 } from "../../Authorization/react-auth0-wrapper";

//Styles
import blogPostsPageStyle from "assets/jss/material-kit-pro-react/views/blogPostsPageStyle.js";

const useStyles = makeStyles(blogPostsPageStyle);

export default function BlogPostsPage(props) {
  const classes = useStyles();

  const [values, setValues] = useState({
    events: [],
    tabType: 'local',
    search: "",
    currentUserId: 0
  });

  const selectValues = (id) => {
    setValues({ ...values, cohostId: id });
  };

  const { loading, isAuthenticated, user } = useAuth0();

  //When called, updates last time user was seen on website.
  //  Called every time user enters home page.
  const getUserInfo = async() => {
    const token = await user;
  }


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
          console.log("Blogs Response: ", response)
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

  useEffect(() => {
    props.client.query({
      query: gql`
        query fetch_user_id($userId: String) {
          users(
            where: {auth0_id: { _eq: $userId }}
          ) {
            id
          }
        }
      `,
      variables: {
        userId: user.sub
      }
    }).then((data) => {
      setValues({
          ...values,
          currentUserId: data.data.users[0].id
      })
    })
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      // eslint-disable-next-line
      const lastSeenMutation = setInterval(
        updateLastSeen,
        10000
      );
    }

  },[loading]); // Empty array for param means effect will only run on first render.

  //Place this here before returning the actual page so we can determine 
  // what displays while loadinh
  if (loading || !user) {
    return (
      <div>Loading...</div>
    )
  }
  else {
  return (
    // <div style={{backgroundColor: "#52D3B6"}}>
    <div>
      <Header
        brand="Skedge"
        links={<HeaderLinks dropdownHoverColor="info" userId={values.currentUserId}/>}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 100,
          color: "primary"
        }}
      />
      {
      <Parallax image={require("assets/img/cover1.jpg")} filter="dark" small>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8} className={classes.textCenter}>

            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      // Add style={{marginTop: '5em'}} to  <div className={classes.main} > if not using parallax
      }
      <div className={classes.main} style={{backgroundColor: "white", minHeight: '80vh'}}>
        <div className={classes.container} >
          <SectionPills 
            client={props.client}
            userId={user.sub}
          />
        </div>
      </div>
      <Footer
        content={
          <div>
            <div className={classes.left}>
              <List className={classes.list}>
                <ListItem className={classes.inlineBlock}>
                  <a
                    href="/about-us"
                    target="_blank"
                    className={classes.block}
                  >
                    Skedge
                  </a>
                </ListItem>
                <ListItem className={classes.inlineBlock}>
                  <a
                    href="https://www.creative-tim.com/presentation?ref=mkpr-blog-posts"
                    target="_blank"
                    className={classes.block}
                  >
                    About us
                  </a>
                </ListItem>
                <ListItem className={classes.inlineBlock}>
                  <a
                    href="https://www.creative-tim.com/license?ref=mkpr-blog-posts"
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
            </div>
          </div>
        }
      />
    </div>
  );
      }
}
