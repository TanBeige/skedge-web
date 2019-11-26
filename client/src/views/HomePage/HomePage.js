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

// import SectionInterested from "./Sections/SectionInterested.js";
// import SectionImage from "./Sections/SectionImage.js";
// import SubscribeLine from "./Sections/SubscribeLine.js";
// import LoadingPage from '../LoadingPage/LoadingPage.js'

// import SectionTitle from 'views/LandingPage/Sections/SectionTitle.js';

//import auth from "../../Authorization/Auth";
import { useAuth0 } from "../../Authorization/react-auth0-wrapper";

//For Google Analytics
import ReactGA from 'react-ga';

// Fro Scrolling to top
import { animateScroll as scroll} from 'react-scroll'

//Styles
import blogPostsPageStyle from "assets/jss/material-kit-pro-react/views/blogPostsPageStyle.js";
import './HomePageStyle.css';

const useStyles = makeStyles(blogPostsPageStyle);

export default function HomePage(props) {
  //Styling
  const classes = useStyles();

  const homeTitle = {
    textAlign: 'center',
    marginBottom: 0,
    paddingTop: 10,
    fontStyle: '"Roboto Slab", "Times New Roman", serif',
    fontWeight: '700',
    color: '#02C39A',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: '#000',
  }

  //Variables
  const [values, setValues] = useState({
    events: [],
    tabType: 'local',
    search: "",
  });

  const selectValues = (id) => {
    setValues({ ...values, cohostId: id });
  };

  const { loading, isAuthenticated, user } = useAuth0();

  //Scroll To Top of the page
  const scrollToTop = () => {
    scroll.scrollToTop();
  }

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

  // useEffect(() => {
  //   props.client.query({
  //     query: gql`
  //       query fetch_user_id($userId: String) {
  //         users(
  //           where: {auth0_id: { _eq: $userId }}
  //         ) {
  //           id
  //         }
  //       }
  //     `,
  //     variables: {
  //       userId: user.sub
  //     }
  //   }).then((data) => {
  //     setValues({
  //         ...values,
  //         currentUserId: data.data.users[0].id
  //     })
  //   })
  // }, [])

  console.log(user)

  useEffect(() => {
    if (isAuthenticated && user) {
      // eslint-disable-next-line
      const lastSeenMutation = setInterval(
        updateLastSeen,
        10000
      );
    }
    if(!loading) {
      console.log("ReactGA Called: ", window.location.pathname)
      ReactGA.initialize('UA-151937222-1');
      ReactGA.pageview(window.location.pathname)
    }

  },[loading, props.client]); // Empty array for param means effect will only run on first render.

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
        //links={<HeaderLinks dropdownHoverColor="info"/>}
        fixed
        color="primary"//"transparent"
        changeColorOnScroll={{
          height: 100,
          color: "primary"
        }}
      />
      {
      // <Parallax image={require("assets/img/cover1.jpg")} filter="dark" small>
      //   <div className={classes.container}>
      //     <GridContainer justify="center">
      //       <GridItem xs={12} sm={12} md={8} className={classes.textCenter}>
      //       </GridItem>
      //     </GridContainer>
      //   </div>
      // </Parallax>
      // Add style={{marginTop: '5em'}} to  <div className={classes.main} > if not using parallax
      }
      <div className={classes.main} style={{backgroundColor: "white", minHeight: '80vh', marginBottom: '4em', marginTop: '5em'}}>
        <Button style={{position: 'fixed', bottom: 55, right: 10, zIndex: 5}} round justIcon color="primary" onClick={scrollToTop}>
              <ArrowUpwardIcon style={{color: "white"}} />
        </Button>
        <div className={classes.container} >
          {/* <h1 className='homeTitle'>Skedge</h1> */}
          {
            loading ?
            "" :
            <SectionPills 
              client={props.client}
              userId={user.sub}
            />
          }
        </div>
      </div>
    </div>
  );
      }
}
