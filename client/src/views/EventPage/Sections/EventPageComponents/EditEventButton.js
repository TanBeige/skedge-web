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
import React, {Fragment, useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';


// @material-ui icons
import People from '@material-ui/icons/People';
// core components
import TextField from '@material-ui/core/TextField';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
//import CustomInput from 'components/CustomInput/CustomInput.js';
import { MenuItem } from '@material-ui/core';
import { categoryList } from "utils/constants";
import DeleteEventButton from './DeleteEventButton.js';

import { createWeekdayString } from 'components/CommonFunctions.js'


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



export default function EditEventButton(props) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [endTimeExists, setEndTimeExists] = React.useState(props.oldEvent.end_time ? true : false)
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState(props.oldEvent.cover_uuid);
    let fileInput = React.createRef();

    const classes = useStyles();


    const [eventInfo, setEventInfo] = React.useState({
        cover_url: props.oldEvent.cover_uuid,
        picFile: null,

        name: props.oldEvent.name,
        location_name: props.oldEvent.location_name,
        street: props.oldEvent.street,
        city: props.oldEvent.city,
        state: props.oldEvent.state,
        start_date: props.oldEvent.start_date,
        end_date: props.oldEvent.is_recurring ? props.oldEvent.end_date : new Date(),
        weekday: props.oldEvent.weekday,

        start_time: moment(props.oldEvent.start_time, "HH:mm:ss"),
        end_time: props.oldEvent.end_time ? moment(props.oldEvent.end_time, "HH:mm:ss") : null,
        category: props.oldEvent.category,
        description: props.oldEvent.description,

        web_url: props.oldEvent.web_url ? props.oldEvent.web_url : "",
        price: props.oldEvent.price,

        //Recurring events
        is_recurring: props.oldEvent.is_recurring,
        monday: props.oldEvent.weekday.includes("1"),
        tuesday: props.oldEvent.weekday.includes("2"),
        wednesday: props.oldEvent.weekday.includes("3"),
        thursday: props.oldEvent.weekday.includes("4"),
        friday: props.oldEvent.weekday.includes("5"),
        saturday: props.oldEvent.weekday.includes("6"),
        sunday: props.oldEvent.weekday.includes("0")
    })
    // Submit Changes:
    const submitChanges = () => {
        let weekdayString = createWeekdayString({
            monday: eventInfo.monday,
            tuesday: eventInfo.tuesday,
            wednesday: eventInfo.wednesday,
            thursday: eventInfo.thursday,
            friday: eventInfo.friday,
            saturday: eventInfo.saturday,
            sunday: eventInfo.sunday,
        });

        props.handleEventChange(eventInfo, weekdayString, endTimeExists);
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
      });
    }

    const handleCheck = name => event => {
        setEventInfo({ ...eventInfo, [name]: event.target.checked });
    };


    const handleEndDateClick = (day) => {
        setEventInfo({
            ...eventInfo,
            end_date: day
        })
    }

    //Editing Cover Image
    const coverPic = () => {
        const imageStyle = {
            opacity: '0.5', 
            objectFit: 'cover',
            width: '100%', 
            borderRadius: 8, 
            marginBottom: 10, 
            height: 225
        }
        if(!eventInfo.picFile){
            return (
                <div>
                    <div className="fileinput" style={{display: 'inline', width:'100%'}} onClick={() => editCoverPic()}>
                        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInput} />
                        <img src={cloudinary.url(imagePreviewUrl, {secure: true, width: 800, height: 450, crop: "fill"})}  alt="..." style={imageStyle}/>
                        <AddAPhotoIcon style={{position: 'absolute', left: '50%', marginLeft: '-12px', top: 105}}/>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div style={{width: '100%'}}>
                    <div style={{width: '100%'}}>
                        <div className="fileinput" style={{display: 'inline'}} onClick={() => editCoverPic()}>
                            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInput} />
                            <img src={imagePreviewUrl}  alt="..." style={imageStyle}/>
                            <AddAPhotoIcon style={{position: 'absolute', left: '50%', marginLeft: '-12px', top: 105}}/>
                        </div>
                    </div>
                </div>
            )
        }
        // }
        // else {
            // return (
            //     <div>
            //         <img src={vals.picture} alt="..." className={imageClasses} />
            //         {/* <LoadImage src={vals.picture} alt={vals.name} className={imageClasses} /> */}
            //         {updateProfileButton}
            //     </div>
            // )
    }
    
    const editCoverPic = () => {
        fileInput.current.click();
    }
    const handleImageChange = e => {
        e.preventDefault();
        let reader = new FileReader();
        let inFile = e.target.files[0];
        reader.onloadend = () => {
            setEventInfo({
                ...eventInfo,
                picFile: inFile
            });
            setImagePreviewUrl(reader.result);
        };
        if(inFile){
            reader.readAsDataURL(inFile);
        }
    };



    // Show Edit Button if user is host
    let editButton = "";
    // if(props.userId === props.creatorId) {
        editButton = (
            <Button  size='sm' color="info" onClick={() => setIsEditing(!isEditing)}>
                Edit Event
            </Button>
        )
    // }

    //If Event has an end time, toggle it here
    let endTimeJS = ""
    if(endTimeExists) {
        endTimeJS = (
            <div style={{display: 'inline-flex', alignItems: 'center', width: '100%'}}>
                <div style={{width: '100%'}}>
                    <TimePicker
                        label="End Time"
                        fullWidth
                        value={eventInfo.end_time}
                        onChange={handleEndTime}
                        margin="normal"
                    />
                </div>
                <Button onClick={() => setEndTimeExists(false)} style={{width: '1em'}}>X</Button>
            </div>
        )
    }
    else {
        endTimeJS = <Button onClick={() => setEndTimeExists(!endTimeExists)} style={{width: '100%'}}>End Time</Button>
    }

    // If Recurring Events
    let repeatEvent = ""
    if (!eventInfo.is_recurring) {
        repeatEvent = (
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
        )
    }
    else {
    const error = [eventInfo.monday, eventInfo.tuesday, eventInfo.wednesday, eventInfo.thursday, eventInfo.friday, eventInfo.saturday, eventInfo.sunday].filter(v => v).length < 1;
    repeatEvent = (
        <div className='weekdayCheckboxes'>
        <FormControl required error={error} component="fieldset" style={{marginBottom: 15, width: '100%'}}>
            <FormLabel component="legend" style={{marginBottom: 15}}>Check at least one</FormLabel>
            <FormGroup>
                <GridContainer direction='row' alignContent='center'>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={<Checkbox checked={eventInfo.monday} onChange={handleCheck('monday')} value="monday" color='primary'/>}
                        label="Mon."
                        labelPlacement="top"
                        />
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={<Checkbox checked={eventInfo.tuesday} onChange={handleCheck('tuesday')} value="tuesday" color='primary'/>}
                        label="Tue."
                        labelPlacement="top"
                        />
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={eventInfo.wednesday} onChange={handleCheck('wednesday')} value="wednesday" color='primary'/>
                        }
                        label="Wed."
                        labelPlacement="top"
                        />
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={eventInfo.thursday} onChange={handleCheck('thursday')} value="thursday" color='primary'/>
                        }
                        label="Thu."
                        labelPlacement="top"
                        />
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={eventInfo.friday} onChange={handleCheck('friday')} value="friday" color='primary'/>
                        }
                        label="Fri."
                        labelPlacement="top"/>
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={eventInfo.saturday} onChange={handleCheck('saturday')} value="saturday"  color='primary'/>
                        }
                        label="Sat."
                        labelPlacement="top"/>
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={eventInfo.sunday} onChange={handleCheck('sunday')} value="sunday" color='primary'/>
                        }
                        label="Sun."
                        labelPlacement="top"/>
                    </GridItem>
                </GridContainer>
            </FormGroup>
        </FormControl>
        <MuiPickersUtilsProvider utils={MomentUtils} >
            <GridContainer spacing={2}>
                <GridItem xs={12}>
                    <DatePicker
                        variant="dialog"
                        label="Event Starting Date"
                        format="dddd, MMMM Do YYYY"
                        fullWidth
                        value={eventInfo.start_date}
                        onChange={handleDayClick}
                        margin="normal"
                    />
                </GridItem>
                <GridItem xs={12}>
                    <DatePicker
                        variant="dialog"
                        label="Event Ending Date"
                        format="dddd, MMMM Do YYYY"
                        fullWidth
                        value={eventInfo.end_date}
                        onChange={handleEndDateClick}
                        margin="normal"
                    />
                </GridItem>
                <GridItem xs={12}>
                    <TimePicker
                        label="Start Time"
                        variant="outlined"
                        fullWidth
                        value={eventInfo.start_time}
                        onChange={handleTimeClick}
                    />
                </GridItem>
                <GridItem xs={12}>
                    {endTimeJS}
                </GridItem>
            </GridContainer>
        </MuiPickersUtilsProvider>
        </div>
        )
    }


    // Check Values
    let continueDisabled = false;
    if(
        !eventInfo.name.replace(/\s/g, '').length ||
        eventInfo.name.replace(/\s/g, '').length >= 50 ||
        !eventInfo.location_name.replace(/\s/g, '').length || 
        !eventInfo.street.replace(/\s/g, '').length ||
        !eventInfo.city.replace(/\s/g, '').length ||
        !eventInfo.state.replace(/\s/g, '').length       
    ) {
        continueDisabled = true;
    }
    if(eventInfo.is_recurring) {
        if(
            !eventInfo.monday &&
            !eventInfo.tuesday && 
            !eventInfo.wednesday && 
            !eventInfo.thursday &&
            !eventInfo.friday &&
            !eventInfo.saturday &&
            !eventInfo.sunday &&
            !eventInfo.end_date
        ) {
            continueDisabled = true;
        }
    }

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
                    <h4 className={classes.modalTitle}>Edit Event</h4>
                </DialogTitle>
                <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                >
                    {/* Cover Image */}
                    <GridItem xs={12} sm={12}>
                        {coverPic()}
                    </GridItem>

                    {/* Event Name */}
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

                    {/* Location Name */}
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

                    {/* Street Name */}
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

                    <GridItem xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                color="primary"
                                onChange={handleCheck('is_recurring')}
                                checked={eventInfo.is_recurring}
                                value="is_recurring"
                                style={{marginTop: 0, marginBottom: 0}}
                                />
                            }
                            label="Repeated Weekly Event"
                        />
                    </GridItem>

                    {/* Category */}
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

                    {repeatEvent}

                    <GridItem xs={12} >
                        <FormControl fullWidth variant="outlined" style={{marginTop: '1em'}}>
                            <InputLabel htmlFor="outlined-adornment-amount">Event Price</InputLabel>
                            <OutlinedInput
                            id="outlined-adornment-amount"
                            value={eventInfo.price}
                            type='number'
                            onChange={handleChange('price')}
                            startAdornment={<InputAdornment position="start">-$</InputAdornment>}
                            labelWidth={110}
                            />
                        </FormControl>
                    </GridItem>
                    
                    <GridItem xs={12}>
                        <TextField
                            name="web_url"
                            variant="outlined"
                            margin="normal"

                            value={eventInfo.web_url}
                            fullWidth
                            onChange={handleChange('web_url')}
                            id="web_url"
                            label="Link to Event"
                        />
                    </GridItem>

                    


                    {/* Event Description */}
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

                    {/* Delete Event */}
                    <DeleteEventButton 
                        userId={props.userId}
                        creatorId={props.creatorId}
                        handleDeleteEvent={props.handleDeleteEvent}
                    />
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                    <Button onClick={() => setIsEditing(false)} color="secondary">
                        Close
                    </Button>
                    <Button color={continueDisabled ? "white" : "primary"} disabled={continueDisabled} onClick={submitChanges}>Save changes</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
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