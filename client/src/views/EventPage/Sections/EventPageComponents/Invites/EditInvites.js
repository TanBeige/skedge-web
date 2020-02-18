/*!

=========================================================
* Material Kit PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {Fragment, useState,  useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from '@material-ui/core/List'
// @material-ui icons
import People from '@material-ui/icons/People';
// core components
import TextField from '@material-ui/core/TextField';
//import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
//import CustomInput from 'components/CustomInput/CustomInput.js';
import { MenuItem } from '@material-ui/core';
import { categoryList } from "utils/constants";

import InvitedItem from './InvitedItem.js';


// Time/Date Selections Imports
import MomentUtils from '@date-io/moment';    //uninstall if dont need this later
import {
    DatePicker,
    MuiPickersUtilsProvider,
    TimePicker
  } from '@material-ui/pickers';  //if i dont need this later uninstall

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
// core components
import Button from "components/CustomButtons/Button.js";

import style from "assets/jss/material-kit-pro-react/modalStyle.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(style);
var moment = require("moment");

// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});



export default function EditInvites({userList, client, eventId}) {
    const classes = useStyles();

    const [isEditing, setIsEditing] = useState(false);

    const listItems = () => {
        if(userList.length === 0) {
            return(<h3>No users are invited or going.</h3>)
        }

        const mergedUsers = userList.filter((thing, index, self) => self.findIndex(t => t.invited.auth0_id === thing.invited.auth0_id) === index)

        return(
            <Fragment>
              <List style={{width: '100%', height: '65vh', overflow:'auto'}}>  
                  {
                      mergedUsers.map((user, index) => {
                          return(
                              <InvitedItem 
                                  key={index}
                                  account={user.invited}
                                  response={user.response}
                                  profileId={user.invited.auth0_id}
                                  eventId={eventId}
                                  client={client}
                              />
                          )
                      })
                  }
              </List>
            </Fragment>
        )
        
    }
    

    // Show Edit Button if user is host
    let editButton = "";
    // if(props.userId === props.creatorId) {
        editButton = (
            <Button size='sm' color="tumblr" onClick={() => setIsEditing(!isEditing)}>Edit Invites</Button>
        )
    // }

    //return
     return (
        <Fragment>

            {editButton}

            <Dialog
                classes={{
                    root: classes.modalRoot,
                    paper: classes.modalEdit
                }}
                open={isEditing}
                style={{ paddingTop: 30}}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setIsEditing(false)}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={classes.modalHeader}
                >
                <Button
                    simple
                    className={classes.modalCloseButton}
                    key="close"
                    aria-label="Close"
                    onClick={() => setIsEditing(false)}
                >
                    {" "}
                    <Close className={classes.modalClose} />
                </Button>
                    <h4 className={classes.modalTitle}>Edit Invites</h4>
                </DialogTitle>
                <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                >

                    {listItems()}
                    
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                    <Button onClick={() => setIsEditing(false)} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
  );
}