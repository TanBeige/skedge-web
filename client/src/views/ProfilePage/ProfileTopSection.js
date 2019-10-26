import React, { useEffect, useState } from 'react';

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
import { useAuth0 } from 'Authorization/react-auth0-wrapper'
import CustomInput from 'components/CustomInput/CustomInput.js';


import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";


export default function ProfileTopSection(props) {

  const { logout } = useAuth0();

    const useStyles = makeStyles(profilePageStyle);
    const classes = useStyles();
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );

    const [anchorElTop, setAnchorElTop] = useState(null);

    // Editing Profile Page

    const [vals, setValues] = useState({
      name: "",
      full_name: "",
      biography: "",
      picture: props.values.picture,

      editProfile: false
    })

    const handleProfileEdit = () => {
      props.handleProfileEdit(vals)

      setValues({
        ...vals,
        editProfile: false,

      })
    }

    const changeName = (event) => {
      setValues({
        ...vals,
        full_name: event.target.value
      })
    }

    const changeBio = (event) => {
      setValues({
        ...vals,
        biography: event.target.value
      })
    }

    useEffect(() => {
      setValues({
        ...vals,
        name: props.values.name,
        full_name: props.values.full_name,
        biography: props.values.biography ? props.values.biography : "" ,
        picture: props.values.picture,
      })
    }, [props.values])




    const editProfilePage = () => {
      setValues({
        ...vals,
        editProfile: !vals.editProfile,
        full_name: props.values.full_name,
        biography: props.values.biography ? props.values.biography : "" ,
        picture: props.values.picture,
      })
    }

    const addFriendButton = () => {
      //If not Friends
      if (props.values.currentUserProfile) {
        let icon = <EditIcon className={classes.followIcon} />
          return (
            <Tooltip
              id="tooltip-bottom"
              title="Profile"
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
            >
              <div>
                <Button
                justIcon
                round
                color="primary"
                className={classes.followButton}
                onClick={event => setAnchorElTop(event.currentTarget)}
              >
                <PersonIcon className={classes.followIcon} />
              </Button>
              <Popover
                classes={{
                  paper: classes.popover
                }}
                open={Boolean(anchorElTop)}
                anchorEl={anchorElTop}
                onClose={() => setAnchorElTop(null)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
              >
                <div style={{textAlign: 'center', padding: 10}}>
                  <div className={classes.popoverBody}>
                    <Button round color="primary" onClick={editProfilePage}>
                      Edit Page
                    </Button>
                    <br/>
                    <Button round color="primary" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                </div>
              </Popover>
              </div>
            </Tooltip>
          )
      }
      if(props.values.relationshipType !== 1) {
        let icon = ""
  
        // If already sent request but not friends
        if (props.values.relationshipType === 0) {
          icon = <RecordVoiceOverIcon className={classes.followIcon} />
          return (
            <Tooltip
              id="tooltip-bottom"
              title="Unsend"
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
            >
              <div>
              <Button
                justIcon
                round
                color="primary"
                className={classes.followButton}
                onClick={event => setAnchorElTop(event.currentTarget)}
              >
                {icon}
              </Button>
              <Popover
                classes={{
                  paper: classes.popover
                }}
                open={Boolean(anchorElTop)}
                anchorEl={anchorElTop}
                onClose={() => setAnchorElTop(null)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
              >
                <div style={{textAlign: 'center', padding: 10}}>
                  <h3 >Invite Sent</h3>
                  <div className={classes.popoverBody}>
                    <Button round color="primary" onClick={props.RemoveFriend}>
                      Click to unsend.
                    </Button>
                  </div>
                </div>
              </Popover>
              </div>
            </Tooltip>
          )
        }}
        // If Not Friends and Didn't send request
        else if(props.values.relationshipType === -1) {
          const icon = <PersonAddIcon className={classes.followIcon} />
          return (
            <Tooltip
              id="tooltip-bottom"
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
            >
              <div>
              <Button
                justIcon
                round
                color="primary"
                className={classes.followButton}
                onClick={event => setAnchorElTop(event.currentTarget)}
              >
                {icon}
              </Button>
              <Popover
                classes={{
                  paper: classes.popover
                }}
                open={Boolean(anchorElTop)}
                anchorEl={anchorElTop}
                onClose={() => setAnchorElTop(null)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
              >
                <div style={{textAlign: 'center', padding: 10}}>
                  <div className={classes.popoverBody}>
                    <Button round color="primary" onClick={props.friendInvite}>
                      Add Friend!
                    </Button>
                  </div>
                </div>
              </Popover>
              </div>
            </Tooltip>
          )
          
        }
    
        
    // If Already Friends
    else {
      const icon = <PersonIcon className={classes.followIcon} />

      return (
        <Tooltip
          id="tooltip-bottom"
          title="Unfriend"
          placement="bottom"
          classes={{ tooltip: classes.tooltip }}
        >
          <div>
          <Button
            justIcon
            round
            color="primary"
            className={classes.followButton}
            onClick={event => setAnchorElTop(event.currentTarget)}
          >
            {icon}
          </Button>
          <Popover
            classes={{
              paper: classes.popover
            }}
            open={Boolean(anchorElTop)}
            anchorEl={anchorElTop}
            onClose={() => setAnchorElTop(null)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
          >
            <div style={{textAlign: 'center', padding: 10}}>
              <div className={classes.popoverBody}>
                <Button round color="primary" onClick={props.RemoveFriend}>
                  Unfriend.
                </Button>
              </div>
            </div>
          </Popover>
          </div>
        </Tooltip>
      )
    }
  }
  


// If user is NOT editing their profile
  if(!vals.editProfile) {
    return (
      <div>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.profile}>
              <div>
                <img src={vals.picture} alt="..." className={imageClasses} />
              </div>
              <div className={classes.name}>
                <h3 className={classes.title} style={{margin: 0}}>
                  <CheckCircleOutlineIcon style={{textAlign: 'center', verticalAlign: 'middle'}} />
                  <br />
                  {vals.full_name} 
                </h3>
                <h4 style={{margin: 0}}>
                  @{vals.name}
                </h4>
                {/*<h6>DESIGNER</h6> add this in for entities*/}
              </div>
            </div>
            <div className={classes.follow}>
              {addFriendButton()}
            </div>
          </GridItem>
        </GridContainer>
        <div className={classNames(classes.description, classes.textCenter)}>
          <p>
            {vals.biography}
          </p>
        </div>
      </div>
      )
  }
// If user IS editing their profile
  else {
    return (
      <div style={{textAlign: 'center'}}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.profile}>
              <div>
                <img src={vals.picture} alt="..." className={imageClasses} />
              </div>
              <div className={classes.name}>
                <h3>
                  <CheckCircleOutlineIcon style={{textAlign: 'center', verticalAlign: 'middle'}} />
                  <br />
                  <CustomInput 
                    id="regular"
                    labelText="Name"
                    inputProps={{
                      value:  vals.full_name,
                    }}
                    formControlProps={{
                      onChange: changeName
                    }}
                  />
                </h3>
                <h4 style={{margin: 0}}>
                  @{vals.name}
                </h4>
                {/*<h6>DESIGNER</h6> add this in for entities*/}
            </div>
            </div>
            <div className={classes.follow}>
              {addFriendButton()}
            </div>
          </GridItem>
        </GridContainer>
        <div className={classNames(classes.description, classes.textCenter)}>
          <CustomInput 
            id="regular"
            labelText="Bio"
            inputProps={{
              value:  vals.biography
            }}
            formControlProps={{
              fullWidth: true,
              onChange: changeBio
            }}
          />
        </div>
        <Button color="primary" onClick={handleProfileEdit}>
          Save
        </Button>
      </div>
    )
  }

}
