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
import React, {useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui icons
import People from '@material-ui/icons/People';
// core components
import TextField from '@material-ui/core/TextField';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from 'components/CustomInput/CustomInput.js';
import { MenuItem } from '@material-ui/core';
import { categoryList } from "utils/constants";


// Time/Date Selections Imports
import MomentUtils from '@date-io/moment';    //uninstall if dont need this later
import {
    DatePicker,
    MuiPickersUtilsProvider,
    TimePicker
  } from '@material-ui/pickers';  //if i dont need this later uninstall

// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import Button from "components/CustomButtons/Button.js";

import style from "assets/jss/material-kit-pro-react/modalStyle.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(style);
var moment = require("moment")


export default function ExampleLiveDemo(props) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [endTimeExists, setEndTimeExists] = React.useState(props.oldEvent.end_time ? true : false)
  const classes = useStyles();


    const [eventInfo, setEventInfo] = React.useState({
        name: props.oldEvent.name,
        location_name: props.oldEvent.location_name,
        street: props.oldEvent.street,
        city: props.oldEvent.city,
        state: props.oldEvent.state,
        start_date: props.oldEvent.start_date,
        end_date: props.oldEvent.end_date,
        is_recurring: props.oldEvent.is_recurring,
        start_time: moment(props.oldEvent.start_time, "HH:mm:ss"),
        end_time: props.oldEvent.end_time ? moment(props.oldEvent.end_time, "HH:mm:ss") : null,
        description: props.oldEvent.description,
        category: props.oldEvent.category,
        tags: [],
        cohosts: [],
        cover_pic: ""
    })
    console.log("Times: ", eventInfo.start_time)
    // Submit Changes:
    const submitChanges = () => {
        props.handleEventChange(eventInfo);
        setIsEditing(false);
    }

    //Editing Functions

    const handleChange = name => event => {
        setEventInfo({ ...eventInfo, [name]: event.target.value });
    };

    const handleDayClick = (day) => {
        setEventInfo({
            ...eventInfo,
            start_date: day
        })
    }
  
    const handleTimeClick = (time) => {
        setEventInfo({
            ...eventInfo,
            start_time: time
        })
    }
  
    const handleEndTime = (time) => {
        setEventInfo({
          ...eventInfo,
          end_time: time
      })
    }


    // Show Edit Button if user is host
    let editButton = "";
    if(props.userId === props.creatorId) {
        editButton = (
            <Button style={{marginTop: 20, marginBottom: 8}} color="info" round onClick={() => setIsEditing(!isEditing)}>
                Edit Event
            </Button>
        )
    }

    //If Event has an end time, toggle it here
    let endTimeJS = ""
    if(endTimeExists) {
        endTimeJS = (
            <TimePicker
                label="End Time"
                fullWidth
                value={eventInfo.end_time}
                onChange={handleEndTime}
                margin="normal"
            />
        )
    }
    else {
        endTimeJS = <Button onClick={() => setEndTimeExists(!endTimeExists)} style={{width: '100%'}}>End Time</Button>
    }

    useEffect(() => {
        //Reload
        setEventInfo({
            name: props.oldEvent.name,
            location_name: props.oldEvent.location_name,
            street: props.oldEvent.street,
            city: props.oldEvent.city,
            state: props.oldEvent.state,
            start_date: props.oldEvent.start_date,
            end_date: props.oldEvent.end_date,
            is_recurring: props.oldEvent.is_recurring,
            start_time: moment(props.oldEvent.start_time, "HH:mm:ss"),
            end_time: props.oldEvent.end_time ? moment(props.oldEvent.end_time, "HH:mm:ss") : null,
            description: props.oldEvent.description,
            category: props.oldEvent.category,
            tags: [],
            cohosts: [],
            cover_pic: ""
        })
        setEndTimeExists(props.oldEvent.end_time ? true : false);
        console.log("AAAAAAAAAA")
    }, [isEditing])

    // Check Values
    let continueDisabled = true;
    console.log(eventInfo)
    if(
        eventInfo.name.replace(/\s/g, '').length && 
        eventInfo.name.length <= 50 && 
        eventInfo.location_name.replace(/\s/g, '').length && 
        eventInfo.street.replace(/\s/g, '').length && 
        eventInfo.city.replace(/\s/g, '').length && 
        eventInfo.state.replace(/\s/g, '').length
    ) {
        continueDisabled = false;
    }
    else {
        continueDisabled = true;
    }

    //return
     return (
        <div>

            {editButton}

            <Dialog
                classes={{
                    root: classes.modalRoot,
                    paper: classes.modal
                }}
                open={isEditing}
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
                    <h4 className={classes.modalTitle}>Edit Event</h4>
                </DialogTitle>
                <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                >

                    <GridItem xs={12} sm={12}>
                        <TextField
                            name="name"
                            value={eventInfo.name}
                            required
                            fullWidth
                            onChange={handleChange('name')}
                            id="event_name"
                            label="Name"
                            placeholder="Name"
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                        <TextField
                            name="location_name"
                            value={eventInfo.location_name}
                            required
                            fullWidth
                            onChange={handleChange('location_name')}
                            id="location_name"
                            label="Location Name"
                            placeholder="Location Name"
                            margin="normal"

                        />
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                        <TextField
                            name="street"
                            value={eventInfo.street}
                            required
                            fullWidth
                            onChange={handleChange('street')}
                            id="street"
                            label="Street"
                            placeholder="Street"
                            margin="normal"

                        />
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                        <TextField
                            name="city"
                            value={eventInfo.city}
                            required
                            fullWidth
                            onChange={handleChange('city')}
                            id="city"
                            label="City"
                            placeholder="City"
                            margin="normal"

                        />
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                        <TextField
                            id="state"
                            select
                            label="State"
                            required
                            fullWidth
                            value={eventInfo.state}
                            onChange={handleChange('state')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            margin="normal"
                        >
                            {
                            states.map(value => 
                                (<MenuItem key={value} value={value}>{value}</MenuItem>)
                            )}
                        </TextField>
                    </GridItem>

                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <GridItem xs={12}>
                            <DatePicker
                                variant="dialog"
                                label="Event Date"
                                format="dddd, MMMM Do YYYY"
                                fullWidth
                                value={eventInfo.start_date}
                                onChange={handleDayClick}
                                margin="normal"

                            />
                        </GridItem>
                    
                        <GridItem xs={12}>
                            <TimePicker
                                label="Start Time"
                                fullWidth
                                value={eventInfo.start_time}
                                onChange={handleTimeClick}
                                margin="normal"

                            />
                        </GridItem>
                        <GridItem xs={12}>
                            {endTimeJS}
                        </GridItem>
                    </MuiPickersUtilsProvider>

                    <GridItem xs={12} sm={12}>
                        <TextField
                            id="category"
                            select
                            label="Category"
                            required
                            fullWidth
                            value={eventInfo.category}
                            onChange={handleChange('category')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            margin="normal"

                        >
                            {
                                categoryList.map(value => {
                                    if(value === "Any") {
                                        return;
                                    }
                                    else{
                                        return (<MenuItem key={value} value={value}>{value}</MenuItem>)
                                    }
                                }
                            )}
                        </TextField>
                    </GridItem>





                    <GridItem xs={12} sm={12}>
                        <TextField 
                            id="description"
                            label="Event Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows="3"
                            className={classes.textField}
                            value={eventInfo.description}
                            fullWidth
                            onChange={handleChange('description')}
                            margin="normal"
                        />
                    </GridItem>





                    
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                    <Button onClick={() => setIsEditing(false)} color="secondary">
                        Close
                    </Button>
                <Button color="primary" disabled={continueDisabled} onClick={submitChanges}>Save changes</Button>
                </DialogActions>
            </Dialog>
        </div>
  );
}

const states = [ "Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
 "Delaware",
 "District Of Columbia",
 "Florida",
 "Georgia",
 "Guam",
 "Hawaii",
 "Idaho",
 "Illinois",
 "Indiana",
 "Iowa",
 "Kansas",
 "Kentucky",
 "Louisiana",
 "Maine",
 "Maryland",
 "Massachusetts",
 "Michigan",
 "Minnesota",
 "Mississippi",
 "Missouri",
 "Montana",
 "Nebraska",
 "Nevada",
 "New Hampshire",
 "New Jersey",
 "New Mexico",
 "New York",
 "North Carolina",
 "North Dakota",
 "Ohio",
 "Oklahoma",
 "Oregon",
 "Palau",
 "Pennsylvania",
 "Puerto Rico",
 "Rhode Island",
 "South Carolina",
 "South Dakota",
 "Tennessee",
 "Texas",
 "Utah",
 "Vermont",
 "Virgin Islands",
 "Virginia",
 "Washington",
 "West Virginia",
 "Wisconsin",
 "Wyoming"
]