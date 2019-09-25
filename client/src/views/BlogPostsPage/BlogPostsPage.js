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

//import auth from "../../Authorization/Auth";
import { useAuth0 } from "../../Authorization/react-auth0-wrapper";


import blogPostsPageStyle from "assets/jss/material-kit-pro-react/views/blogPostsPageStyle.js";

const useStyles = makeStyles(blogPostsPageStyle);

export default function BlogPostsPage(props) {
  const classes = useStyles();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  const [values, setValues] = useState({
    events: [],
    tabType: 'local',
    search: "",
    limit: 10
  });

  const selectValues = (id) => {
    setValues({ ...values, cohostId: id });
  };

  const { loading, isAuthenticated, user } = useAuth0();



  const getUserInfo = async() => {
    const token = await user;
    console.log("Token: ", token)
  }


  // Login/Event Logic:
  const updateLastSeen = () => {
    const userId = user.sub;
    console.log("user sub: ", user)
    console.log("props: ", props)
    const timestamp = moment().format();
    if (props.client) {
      props.client
        .mutate({
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
        .then(() => {
          // handle response if required
        })
        .catch(error => {
          console.error(error);
        });
    }
  };



  //Replaces ComponentDidMount() from React Components in Function Components
  useEffect(() => {
    console.log("props: ", props)
    if(user) {
      console.log("User: ", user.sub)
    }

    //const { renewSession } = auth;
    if (isAuthenticated/*localStorage.getItem("isLoggedIn") === "true"*/) {
      // eslint-disable-next-line
      const lastSeenMutation = setInterval(
        updateLastSeen.bind(this),
        5000
      );
      /*
      renewSession().then(data => {
        setValues({ 
          ...values,
          session: true 
        });
      });*/
    } else {
      //window.location.href = "/";
    }
  },[loading]); // Empty array for param means effect will only run on first render.

    //Place this here before returning the actual page so we can determine 
  // what displays while loadinh
  if (loading || !user) {
    return (
      <div>Loading...</div>
    )
  }
  console.log(user);

  return (
    <div>
      <Header
        brand="Skedge"
        links={<HeaderLinks dropdownHoverColor="info" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "primary"
        }}
      />
      {
      <Parallax image={require("assets/img/bg10.jpg")} filter="dark" small>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8} className={classes.textCenter}>
              <h2 className={classes.title}>
                A Place for Entrepreneurs to Share and Discover New Stories.
              </h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      }
      <div className={classes.main}>
        <div className={classes.container}>
          <SectionPills />
          <SectionInterested />
        </div>
        <SectionImage />
        <SubscribeLine />
      </div>
      <Footer
        content={
          <div>
            <div className={classes.left}>
              <List className={classes.list}>
                <ListItem className={classes.inlineBlock}>
                  <a
                    href="https://www.creative-tim.com/?ref=mkpr-blog-posts"
                    target="_blank"
                    className={classes.block}
                  >
                    Creative Tim
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
                  <a href="//blog.creative-tim.com/" className={classes.block}>
                    Blog
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
              <Favorite className={classes.icon} /> by{" "}
              <a
                href="https://www.creative-tim.com?ref=mkpr-blog-posts"
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
