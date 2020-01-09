/*eslint-disable*/
import React, {useState, useEffect} from "react";
import axios from 'axios';
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import LockIcon from '@material-ui/icons/Lock';

//Popup Notification
import SnackbarContent from "components/Snackbar/SnackbarContent";
import Snackbar from "@material-ui/core/Snackbar";
import { store } from 'react-notifications-component';


import LoadingPage from "views/LoadingPage/LoadingPage.js"
import ProfileTopSection from 'views/ProfilePage/ProfileTopSection.js';

import FriendProfile from "views/ProfilePage/FriendStatus/FriendProfile.js"
import NotFriendProfile from "views/ProfilePage/FriendStatus/NotFriendProfile.js"
import ErrorPage from "views/ErrorPage/ErrorPage.js"
import gql from 'graphql-tag'

import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";
import { ThemeProvider } from '@material-ui/styles';

import { useAuth0 } from 'Authorization/react-auth0-wrapper'

import {
  QUERY_USER_PROFILE,
  MUTATION_FOLLOW_REQUEST,
  MUTATION_FOLLOW_DELETE,
  MUTATION_EDIT_USER,
  REFETCH_USER_INFO
} from 'EventQueries/EventQueries.js'
import { getArgumentValues } from "graphql/execution/values";

//Google analytics import
import ReactGA from 'react-ga';
import { IconButton } from "@material-ui/core";


const useStyles = makeStyles(profilePageStyle);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    }
  },
});

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
  const userName = props.match.params.id;
  const { isAuthenticated, user } = useAuth0();

  // Page is Loading variable
  const [isLoading, setIsLoading] = useState(false);

  const [imageUploading, setImageUploading] = useState(false)


  //// Set State Values
  const [values, setValues] = useState({
    user_id: 0,
    user_exists: true,
    currentUserId: 0,

    editProfile: false,

    currentUserProfile: false,
    followingStatus: 5,

    auth0Id: "",
    name: "",
    biography: "",
    full_name: "",
    email: "",
    picture: "",
    verified: false,
    isEntity: false,
    followerCount: 0,

    userEvents: [],
    userReposts: []
  })

  const handleProfileEdit = async (vals) => {
    // setValues({
    //   ...values,
    //   full_name: vals.full_name,
    //   biography: vals.biography,
    //   picture: vals.picture
    // })

    //Upload Image to Cloudinary, Delete Old picture Afterwards
    let errorOccurred = false;
    let response = "";
    if(vals.picFile !== null) {
      setImageUploading(true)
      const form_data = new FormData();

      form_data.append('file', vals.picFile)

      // Upload file to Cloudinary
      response = await axios.post(
        `/profile/upload`, 
        form_data, 
        {
        params: {
          picId: values.picture
        }}
      ).catch((error => {
        alert("Error occurred while uploading picture, try uploading a smaller image size or try again later.")
        errorOccurred = true;
        return;
      }))
    }
    if (errorOccurred) {
      return
    }

    //Submit changes to database
    props.client.mutate({
      mutation: MUTATION_EDIT_USER,
      refetchQueries: [{
        query: QUERY_USER_PROFILE,
        variables: {
          username: userName
        }
      }],
      variables: {
        authId: user.sub,
        changes: {
          full_name: vals.full_name,
          biography: vals.biography,
          //picture: vals.picture,

          picture: response === "" ? values.picture : response.data.id
        }
      }
    }).then(data => {
      if(isMounted) {
        setValues({
          ...values,
          picture: response === "" ? values.picture : response.data.id,
          full_name: vals.full_name,
          biography: vals.biography
        })
        setImageUploading(false)
      }
      console.log("Success!")
    }).catch( error =>{
      console.error(error)
      alert("Couldn't update profile, try again later or report error to info@theskedge.com")
    });
  }

  //// Handling Friend Invites
  const handleFollowInvite = () => {
    //  Handling relationship. column 1 must be > column 2 for errors. 
    //    For more info check relationship table docs.
    console.log("Follow Request")

    const followStatus = values.isEntity ? 1 : 0;
    
    props.client.mutate({
      mutation: MUTATION_FOLLOW_REQUEST,
      refetchQueries: [{
        query: QUERY_USER_PROFILE,
        variables: {
          username: userName,
        }
      }],
      variables: {
        objects: {
          user_id: user.sub,
          is_following_id: values.auth0Id,
          status: followStatus
        }
      }
    }).then(() => {
      //Change relationship type for button to change
      setValues({
        ...values,
        followingStatus: followStatus
      })

      //Popup Notification
      if(values.isEntity){
        store.addNotification({
          title: `Followed ${values.name}`,
          message: `You have started following ${values.name}. You can now view their profile.`,
          type: "info",
          insert: "bottom",
          container: "bottom-center",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: false
          }
        });
      }
      else {
        store.addNotification({
          title: `Sent a follow request to ${values.name}`,
          message: `You have sent a follow request to ${values.name}.`,
          type: "info",
          insert: "bottom",
          container: "bottom-center",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: false
          }
        });
      }
    })
  }

  // If already friends, remove friend
  const handleFollowRemove = () => {
    console.log("Removing Friend")
    
    props.client.mutate({
      mutation: MUTATION_FOLLOW_DELETE,
      refetchQueries: [{
        query: QUERY_USER_PROFILE,
        variables: {
          username: userName,
        }
      }],
      variables: {
          userId: user.sub,
          followingId: values.auth0Id,
      }
    }).then((data) => {
      //Change relationship type for button to change
      setValues({
        ...values,
        followingStatus: -1
      })
      store.addNotification({
        title: `Unfollowed ${values.name}`,
        message: `You have unfollowed ${values.name}.`,
        type: "info",
        insert: "bottom",
        container: "bottom-center",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: false,
          pauseOnHover: true
        }
      });
    })
  }


  //// Getting Profile Info, called in useEffect()
  const getUser = () =>  {
    setIsLoading(true);

    props.client.query({
      query: QUERY_USER_PROFILE,
      variables: {
        username: userName,
      }
    }).then((data) => {
      if(isMounted) {
        if(data.data.users === undefined || data.data.users.length === 0) {
          setValues({
            ...values,
            user_exists: false
          })
        }
        else {
          //Find the relationship between Current User and Profile User
          let followType = 0

          //if user has followers
          if(data.data.users[0].followers) {
            const followValues = data.data.users[0].followers.find(users => users.user_id === user.sub) 
            //If current user is following profile confirmed
            if(followValues) {
              followType = followValues.status;
            }
            else{
              // If user is not following profile confirmed
              followType = -1;
            }
          }
          //User has no followers
          else {
            followType = -1;
          }

          // Set Values
          setValues({
            ...values,
            user_exists: true,

            userEvents: data.data.users[0].events,
            userReposts: data.data.users[0].shared_event,

            user_id: data.data.users[0].id,
            name: data.data.users[0].name,
            biography: data.data.users[0].biography,
            full_name: data.data.users[0].full_name,
            email: data.data.users[0].email,
            picture: data.data.users[0].picture,
            verified: data.data.users[0].verified,
            auth0Id: data.data.users[0].auth0_id,
            followerCount: data.data.users[0].followers_aggregate.aggregate.count,
            followingCount: data.data.users[0].following_aggregate.aggregate.count,

            currentUserProfile: (user.sub === data.data.users[0].auth0_id) ? true : false,

            followingStatus: followType,
            isEntity: data.data.users[0].entity
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
  }, [values.auth0Id, userName])

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
    if(values.followingStatus === 1 || values.currentUserProfile || values.isEntity) {
      profileContent = (
        <FriendProfile 
          client={props.client}
          userId={user.sub}
          profileId={values.auth0Id}
          currentUserProfile={values.currentUserProfile}
          followerCount={values.followerCount}
          followingCount={values.followingCount}
        />
      )
    }
    else {
      profileContent = (
        //<h3 style={{margin: '50px 20px', textAlign: 'center'}}>Must be following to view.</h3>
        <LockIcon style={{margin: '50px 0px', textAlign: 'center', width: '100%', height: 75}} />
      )
    }
    
    // Gradient colors: 'linear-gradient(#02C39A 200px, white 400px)'
    return (
    <div style={{minHeight: '100vh', backgroundImage: 'linear-gradient(#52D3B6 300px, white 400px)' , paddingTop: '20px'}}>
      <ThemeProvider theme={theme}>
        <Header
          color="primary"
          brand="Skedge"
          links={<HeaderLinks dropdownHoverColor="info" userId={values.currentUserId}/>}
          fixed
          
          {...rest}
        />
        { isLoading ? (<LoadingPage />) : 
          (
            <div className={classNames(classes.main, classes.mainRaised)} style={{minHeight: '90vh', marginBottom: '6vh', marginTop: '8vh'}}>
              <div className={classes.container}>
                <ProfileTopSection 
                  values={values} 
                  followInvite={handleFollowInvite} 
                  followRemove={handleFollowRemove}
                  handleProfileEdit={handleProfileEdit}
                  imageUploading={imageUploading}
                  isEntity={values.isEntity}
                />    
                {profileContent}
              </div>
            </div>
          )
        }
      </ThemeProvider>
    </div>
  );
}
}
