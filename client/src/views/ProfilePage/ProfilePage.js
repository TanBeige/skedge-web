/*eslint-disable*/
import React, {useState, useEffect} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";

import LoadingPage from "views/LoadingPage/LoadingPage.js"

import ProfileTopSection from 'views/ProfilePage/ProfileTopSection.js';


import FriendProfile from "views/ProfilePage/FriendStatus/FriendProfile.js"
import NotFriendProfile from "views/ProfilePage/FriendStatus/NotFriendProfile.js"
import ErrorPage from "views/ErrorPage/ErrorPage.js"
import gql from 'graphql-tag'

import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";

import { useAuth0 } from 'Authorization/react-auth0-wrapper'

import {
  QUERY_USER_PROFILE,
  MUTATION_FRIEND_REQUEST,
  MUTATION_FRIEND_DELETE,
  MUTATION_EDIT_USER,
  REFETCH_USER_INFO
} from 'EventQueries/EventQueries.js'
import { getArgumentValues } from "graphql/execution/values";

//Google analytics import
import ReactGA from 'react-ga';


const useStyles = makeStyles(profilePageStyle);

export default function ProfilePage(props, { ...rest }) {

  // is Mounted variable
  let isMounted = true;
  
  //// Get Page Styling
  const classes = useStyles();
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );

  //// Grab Current User ID and user info
  const userId = props.match.params.id;
  const { isAuthenticated, user } = useAuth0();

  // Page is Loading variable
  const [isLoading, setIsLoading] = useState(false)

  //// Set State Values
  const [values, setValues] = useState({
    user_id: userId,
    user_exists: true,
    currentUserId: 0,

    editProfile: false,

    currentUserProfile: false,
    relationshipType: 5,

    auth0Id: "",
    name: "",
    biography: "",
    full_name: "",
    email: "",
    picture: "",
    verified: false,

    userEvents: [],
    userReposts: []
  })

  const handleProfileEdit = (vals) => {
    // setValues({
    //   ...values,
    //   full_name: vals.full_name,
    //   biography: vals.biography,
    //   picture: vals.picture
    // })

    props.client.mutate({
      mutation: MUTATION_EDIT_USER,
      refetchQueries: [{
        query: QUERY_USER_PROFILE,
        variables: {
          userId: userId,
          limit: 10
        }
      }],
      variables: {
        authId: user.sub,
        changes: {
          full_name: vals.full_name,
          biography: vals.biography,
          picture: vals.picture
        }
      }
    }).then(data => {
      console.log("Success!")
    }).catch( error =>{
      console.error(error)
      alert("Couldn't update profile, try again later or report error to info@theskedge.com")
    })
  }

  //// Handling Friend Invites

  const handleFriendInvite = () => {
    //  Handling relationship. column 1 must be > column 2 for errors. 
    //    For more info check relationship table docs.
    console.log("Add Friend")
    let user_one = "";
    let user_two = "";
    let action_user = user.sub;

    if(user.sub <= values.auth0Id) {
      user_one = user.sub;
      user_two = values.auth0Id;
    }
    else {
      user_one = values.auth0Id;
      user_two = user.sub
    }
    
    props.client.mutate({
      mutation: MUTATION_FRIEND_REQUEST,
      refetchQueries: [{
        query: QUERY_USER_PROFILE,
        variables: {
          userId: userId,
          limit: 10
        }
      }],
      variables: {
        objects: {
          user_one_id: user_one,
          user_two_id: user_two,
          action_user_id: action_user,
          status: 0
        }
      }
    }).then(() => {
      //Change relationship type for button to change
      setValues({
        ...values,
        relationshipType: 0
      })
    })
  }

  // If already friends, remove friend
  const handleRemoveFriend = () => {
    console.log("Removing Friend")
    let user_one = "";
    let user_two = "";

    if(user.sub <= values.auth0Id) {
      user_one = user.sub;
      user_two = values.auth0Id;
    }
    else {
      user_one = values.auth0Id;
      user_two = user.sub
    }
    
    props.client.mutate({
      mutation: MUTATION_FRIEND_DELETE,
      refetchQueries: [{
        query: QUERY_USER_PROFILE,
        variables: {
          userId: userId,
          limit: 10
        }
      }],
      variables: {
          user_one_id: user_one,
          user_two_id: user_two
        }
    }).then((data) => {
      //Change relationship type for button to change
      console.log(data)
      setValues({
        ...values,
        relationshipType: -1
      })
    })
  }


  //// Getting Profile Info, called in useEffect()
  const getUser = () =>  {
    setIsLoading(true);

    props.client.query({
      query: QUERY_USER_PROFILE,
      variables: {
        userId: userId,
        limit: 10
      }
    }).then((data) => {
      console.log("user data: ", data.data.users);
      if(isMounted) {
        if(data.data.users === undefined || data.data.users.length === 0) {
          if (isMounted) {
            setValues({
              ...values,
              user_exists: false
            })
          }
        }
        else {
          //Find the relationship between Current User and Profile User
          let relationship = 0

          
          // Set Values
          setValues({
            ...values,
            user_exists: true,

            userEvents: data.data.users[0].events,
            userReposts: data.data.users[0].shared_event,

            name: data.data.users[0].name,
            biography: data.data.users[0].biography,
            full_name: data.data.users[0].full_name,
            email: data.data.users[0].email,
            picture: data.data.users[0].picture,
            verified: data.data.users[0].verified,
            auth0Id: data.data.users[0].auth0_id,

            currentUserProfile: (user.sub === data.data.users[0].auth0_id) ? true : false,

            //relationshipType: relationship
          })
          setIsLoading(false);
        }
      }
    });
  }

  //// Use Effects / Check loading
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  useEffect(() => {
    // Get Profile age
    isMounted = true;
    getUser();  

    return () => {
      isMounted = false;
    }
  }, [values.auth0Id, userId])

  //Google Analytics useEffects
  useEffect(()=>{
    //For Google Analytics 
    console.log("ReactGA Called: ", window.location.pathname)
    ReactGA.initialize('UA-151937222-1');
    ReactGA.pageview(window.location.pathname)
  }, [])


  if(values.user_exists === false) {
    return <ErrorPage />
  }
  else {
    let profileContent = ""

    // If user are friends
    profileContent = (
      <FriendProfile 
        client={props.client}
        userId={user.sub}
        profileId={values.auth0Id}
        currentUserProfile={values.currentUserProfile}
      />
    )
    
    // Gradient colors: 'linear-gradient(#02C39A 200px, white 400px)'
    return (
    <div style={{minHeight: '100vh', backgroundImage: 'linear-gradient(#52D3B6 300px, white 400px)' , paddingTop: '20px'}}>
      <Header
        color="primary"
        brand="Skedge"
        links={<HeaderLinks dropdownHoverColor="info" userId={values.currentUserId}/>}
        fixed
        
        {...rest}
      />
      { isLoading ? (<LoadingPage />) : 
        (
          <div className={classNames(classes.main, classes.mainRaised)} style={{minHeight: '85vh', marginBottom: '4em', marginTop: '4em'}}>
            <div className={classes.container}>
              <ProfileTopSection 
                values={values} 
                friendInvite={handleFriendInvite} 
                removeFriend={handleRemoveFriend}
                handleProfileEdit={handleProfileEdit}
              />    
              {profileContent}
            </div>
          </div>
        )
      }
      
    </div>
  );
}
}
