/*eslint-disable*/
import React, {useState, useEffect} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import People from "@material-ui/icons/People";
import Add from "@material-ui/icons/Add";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import EditIcon from '@material-ui/icons/Edit';
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import Badge from "components/Badge/Badge.js";
import Muted from "components/Typography/Muted.js";
import Parallax from "components/Parallax/Parallax.js";
import Clearfix from "components/Clearfix/Clearfix.js";
import Button from "components/CustomButtons/Button.js";
import Popover from "@material-ui/core/Popover";

import LoadingPage from "views/LoadingPage/LoadingPage.js"

import ProfileTopSection from 'views/ProfilePage/ProfileTopSection.js';


import FriendProfile from "views/ProfilePage/FriendStatus/FriendProfile.js"
import NotFriendProfile from "views/ProfilePage/FriendStatus/NotFriendProfile.js"
import ErrorPage from "views/ErrorPage/ErrorPage.js"
import gql from 'graphql-tag'


import oluEletu from "assets/img/examples/olu-eletu.jpg";
import clemOnojeghuo from "assets/img/examples/clem-onojeghuo.jpg";
import cynthiaDelRio from "assets/img/examples/cynthia-del-rio.jpg";
import mariyaGeorgieva from "assets/img/examples/mariya-georgieva.jpg";
import clemOnojegaw from "assets/img/examples/clem-onojegaw.jpg";
import darrenColeshill from "assets/img/examples/darren-coleshill.jpg";
import avatar from "assets/img/faces/avatar.jpg";
import marc from "assets/img/faces/marc.jpg";
import kendall from "assets/img/faces/kendall.jpg";
import cardProfile2Square from "assets/img/faces/card-profile2-square.jpg";

import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";

import { useAuth0 } from 'Authorization/react-auth0-wrapper'
import {
  QUERY_USER_PROFILE,
  MUTATION_FRIEND_REQUEST,
  MUTATION_FRIEND_DELETE
} from 'EventQueries/EventQueries.js'
import { getArgumentValues } from "graphql/execution/values";

const useStyles = makeStyles(profilePageStyle);

export default function ProfilePage(props, { ...rest }) {
  
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
      mutation: gql`
      mutation edit_user($authId: String, $changes: users_set_input) {
        update_users(where: {auth0_id: {_eq: $authId}}, _set: $changes) {
          affected_rows
          returning{
            full_name
            id
          }
        }
      }
      `,
      variables: {
        authId: user.sub,
        changes: {
          full_name: vals.full_name,
          biography: vals.biography,
          picture: vals.picture
        }
      }
    }).then(data => {
      console.log("data: ", data)
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
      variables: {
          user_one_id: user_one,
          user_two_id: user_two
        }
    }).then(() => {
      //Change relationship type for button to change
      setValues({
        ...values,
        relationshipType: 0
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
      if(data.data.users === undefined || data.data.users.length === 0) {
        setValues({
          ...values,
          user_exists: false
        })
      }
      else {
        //Find the relationship between Current User and Profile User
        let relationship = 0

        //Search through relationship friend_one to see if current user is in there
        const friend_set_one = data.data.users[0].relationship_user_one.find(friends => friends.friend_two.auth0_id === user.sub) 
        console.log("friend set one", friend_set_one)
        if (!friend_set_one) {
          //If not in friend_one, Search through relationship friend_two to see if current user is in there
          const friend_set_two = data.data.users[0].relationship_user_two.find(friends => friends.friend_one.auth0_id === user.sub)
          console.log("friend set two", friend_set_two)          
          if(!friend_set_two) {
            //Not friends
            relationship = -1
          }
          else {
            relationship = friend_set_two.status
          }
        }
        else {
          relationship = friend_set_one.status;
        }
        
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

          relationshipType: relationship
        })
        setIsLoading(false);
      }
    })
  }

  //// Use Effects / Check loading
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  useEffect(() => {

    // Get Profile age
    getUser();  

  }, [values.auth0Id])


  if(values.user_exists === false) {
    return <ErrorPage />
  }
  else {
    let profileContent = ""

    // If user are friends
    if (values.relationshipType === 1 || values.currentUserProfile) {  
      profileContent = (
        <FriendProfile 
          client={props.client}
          userId={user.sub}
          currentUserProfile={values.currentUserProfile}
        />
      )
    }
    //If user is blocked
    else if (values.relationshipType === 2) {
      profileContent = <h1>Blocked</h1>
    }
    else {
      profileContent = <NotFriendProfile />
    }
    
    return (
    <div style={{minHeight: '100vh'}}>
      <Header
        color="transparent"
        brand="Material Kit PRO React"
        links={<HeaderLinks dropdownHoverColor="info" userId={values.currentUserId}/>}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "primary"
        }}
        {...rest}
      />
      <Parallax
        image={require("assets/img/examples/city.jpg")}
        filter="dark"
        className={classes.parallax}
      />
      { isLoading ? (<LoadingPage />) : 
        (
          <div className={classNames(classes.main, classes.mainRaised)} style={{minHeight: '50vh', marginBottom: 30}}>
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
