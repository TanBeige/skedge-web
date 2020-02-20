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
import DeleteDealButton from './DeleteDealButton.js';

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



export default function EditDealButton(props) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [endTimeExists, setEndTimeExists] = React.useState(props.oldDeal.end_time ? true : false)
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState(props.oldDeal.cover_uuid);
    let fileInput = React.createRef();

    const classes = useStyles();


    const [dealInfo, setDealInfo] = React.useState({
        cover_url: props.oldDeal.cover_uuid,
        picFile: null,

        name: props.oldDeal.name,
        location_name: props.oldDeal.location_name,
        street: props.oldDeal.street,
        city: props.oldDeal.city,
        state: props.oldDeal.state,
        start_date: props.oldDeal.start_date,
        end_date: props.oldDeal.end_date,
        weekday: props.oldDeal.weekday,

        start_time: moment(props.oldDeal.start_time, "HH:mm:ss"),
        end_time: props.oldDeal.end_time ? moment(props.oldDeal.end_time, "HH:mm:ss") : null,
        description: props.oldDeal.description,
        point_1: props.oldDeal.point_1 ? props.oldDeal.point_1 : "",
        point_2: props.oldDeal.point_2 ? props.oldDeal.point_2 : "",

        web_url: props.oldDeal.web_url,
        savings: props.oldDeal.savings,

        //Recurring events
        is_recurring: props.oldDeal.is_recurring,
        monday: props.oldDeal.weekday.includes("1"),
        tuesday: props.oldDeal.weekday.includes("2"),
        wednesday: props.oldDeal.weekday.includes("3"),
        thursday: props.oldDeal.weekday.includes("4"),
        friday: props.oldDeal.weekday.includes("5"),
        saturday: props.oldDeal.weekday.includes("6"),
        sunday: props.oldDeal.weekday.includes("0")
    })
    // Submit Changes:
    const submitChanges = () => {
        let weekdayString = createWeekdayString({
            monday: dealInfo.monday,
            tuesday: dealInfo.tuesday,
            wednesday: dealInfo.wednesday,
            thursday: dealInfo.thursday,
            friday: dealInfo.friday,
            saturday: dealInfo.saturday,
            sunday: dealInfo.sunday,
        });

        props.handleDealChange(dealInfo, weekdayString, endTimeExists);
        setIsEditing(false);
    }

    //Editing Functions

    const handleChange = name => event => {
        setDealInfo({ ...dealInfo, [name]: event.target.value });
    };

    const handleDayClick = (day) => {
        setDealInfo({
            ...dealInfo,
            start_date: day
        })
    }
  
    const handleTimeClick = (time) => {
        setDealInfo({
            ...dealInfo,
            start_time: time
        })
    }
  
    const handleEndTime = (time) => {
        setDealInfo({
          ...dealInfo,
          end_time: time
      });
    }

    const handleCheck = name => event => {
        setDealInfo({ ...dealInfo, [name]: event.target.checked });
    };


    const handleEndDateClick = (day) => {
        setDealInfo({
            ...dealInfo,
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
        if(!dealInfo.picFile){
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
            setDealInfo({
                ...dealInfo,
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
            <Button size='sm' color="info" onClick={() => setIsEditing(!isEditing)}>
                Edit Deal
            </Button>
        )
    // }

    //If Deal has an end time, toggle it here
    let endTimeJS = ""
    if(endTimeExists) {
        endTimeJS = (
            <div style={{display: 'inline-flex', alignItems: 'center', width: '100%'}}>
                <div style={{width: '100%'}}>
                    <TimePicker
                        label="End Time"
                        fullWidth
                        value={dealInfo.end_time}
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
    let repeatDeal = ""
    if (!dealInfo.is_recurring) {
        repeatDeal = (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <GridItem xs={12}>
                    <DatePicker
                        variant="dialog"
                        label="Deal Date"
                        format="dddd, MMMM Do YYYY"
                        fullWidth
                        value={dealInfo.start_date}
                        onChange={handleDayClick}
                        margin="normal"
                    />
                </GridItem>
            
                <GridItem xs={12}>
                    <TimePicker
                        label="Start Time"
                        fullWidth
                        value={dealInfo.start_time}
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
    const error = [dealInfo.monday, dealInfo.tuesday, dealInfo.wednesday, dealInfo.thursday, dealInfo.friday, dealInfo.saturday, dealInfo.sunday].filter(v => v).length < 1;
    repeatDeal = (
        <div className='weekdayCheckboxes'>
        <FormControl required error={error} component="fieldset" style={{marginBottom: 15, width: '100%'}}>
            <FormLabel component="legend" style={{marginBottom: 15}}>Check at least one</FormLabel>
            <FormGroup>
                <GridContainer direction='row' alignContent='center'>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={<Checkbox checked={dealInfo.monday} onChange={handleCheck('monday')} value="monday" color='primary'/>}
                        label="Mon."
                        labelPlacement="top"
                        />
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={<Checkbox checked={dealInfo.tuesday} onChange={handleCheck('tuesday')} value="tuesday" color='primary'/>}
                        label="Tue."
                        labelPlacement="top"
                        />
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={dealInfo.wednesday} onChange={handleCheck('wednesday')} value="wednesday" color='primary'/>
                        }
                        label="Wed."
                        labelPlacement="top"
                        />
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={dealInfo.thursday} onChange={handleCheck('thursday')} value="thursday" color='primary'/>
                        }
                        label="Thu."
                        labelPlacement="top"
                        />
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={dealInfo.friday} onChange={handleCheck('friday')} value="friday" color='primary'/>
                        }
                        label="Fri."
                        labelPlacement="top"/>
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={dealInfo.saturday} onChange={handleCheck('saturday')} value="saturday"  color='primary'/>
                        }
                        label="Sat."
                        labelPlacement="top"/>
                    </GridItem>
                    <GridItem xs={3}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={dealInfo.sunday} onChange={handleCheck('sunday')} value="sunday" color='primary'/>
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
                        label="Deal Starting Date"
                        format="dddd, MMMM Do YYYY"
                        fullWidth
                        value={dealInfo.start_date}
                        onChange={handleDayClick}
                        margin="normal"
                    />
                </GridItem>
                <GridItem xs={12}>
                    <DatePicker
                        variant="dialog"
                        label="Deal Ending Date"
                        format="dddd, MMMM Do YYYY"
                        fullWidth
                        value={dealInfo.end_date}
                        onChange={handleEndDateClick}
                        margin="normal"
                    />
                </GridItem>
                <GridItem xs={12}>
                    <TimePicker
                        label="Start Time"
                        variant="outlined"
                        fullWidth
                        value={dealInfo.start_time}
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
        !dealInfo.name.replace(/\s/g, '').length ||
        dealInfo.name.replace(/\s/g, '').length >= 50 ||
        !dealInfo.location_name.replace(/\s/g, '').length || 
        !dealInfo.street.replace(/\s/g, '').length ||
        !dealInfo.city.replace(/\s/g, '').length ||
        !dealInfo.state.replace(/\s/g, '').length       
    ) {
        continueDisabled = true;
    }
    if(dealInfo.is_recurring) {
        if(
            !dealInfo.monday &&
            !dealInfo.tuesday && 
            !dealInfo.wednesday && 
            !dealInfo.thursday &&
            !dealInfo.friday &&
            !dealInfo.saturday &&
            !dealInfo.sunday &&
            !dealInfo.end_date
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
                    <h4 className={classes.modalTitle}>Edit Deal</h4>
                </DialogTitle>
                <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                >
                    {/* Cover Image */}
                    <GridItem xs={12} sm={12}>
                        {coverPic()}
                    </GridItem>

                    {/* Deal Name */}
                    <GridItem xs={12} sm={12}>
                        <TextField
                            name="name"
                            value={dealInfo.name}
                            required
                            fullWidth
                            onChange={handleChange('name')}
                            id="deal_name"
                            label="Name"
                            placeholder="Name"
                        />
                    </GridItem>

                    {/* Location Name */}
                    <GridItem xs={12} sm={12}>
                        <TextField
                            name="location_name"
                            value={dealInfo.location_name}
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
                            value={dealInfo.street}
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
                                checked={dealInfo.is_recurring}
                                value="is_recurring"
                                style={{marginTop: 0, marginBottom: 0}}
                                />
                            }
                            label="Repeated Weekly Deal"
                        />
                    </GridItem>

                    {repeatDeal}

                    <GridItem xs={12} >
                        <FormControl fullWidth variant="outlined" style={{marginTop: '1em'}}>
                            <InputLabel htmlFor="outlined-adornment-amount">Deal Savings</InputLabel>
                            <OutlinedInput
                            id="outlined-adornment-amount"
                            value={dealInfo.savings}
                            type='number'
                            onChange={handleChange('savings')}
                            startAdornment={<InputAdornment position="start">-$</InputAdornment>}
                            labelWidth={110}
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                        <TextField
                            name="web_url"
                            variant="outlined"
                            margin="normal"

                            value={dealInfo.web_url}
                            fullWidth
                            onChange={handleChange('web_url')}
                            id="web_url"
                            label="Link to Deal"
                            // placeholder="50 character max."
                        />
                    </GridItem>

                    <GridItem xs={12} sm={12}>
                        <TextField
                            error={dealInfo.point_1.length > 35}
                            margin="normal"
                            required
                            name="point_1"
                            variant="outlined"
                            value={dealInfo.point_1}
                            fullWidth
                            onChange={handleChange('point_1')}
                            id="point_1"
                            label="Point 1"
                            placeholder="35 character max."
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                        <TextField
                            error={dealInfo.point_2.length > 35}
                            margin="normal"
                            name="point_2"
                            variant="outlined"
                            value={dealInfo.point_2}
                            fullWidth
                            onChange={handleChange('point_2')}
                            id="point_2"
                            label="Point 2"
                            placeholder="35 character max."
                        />
                    </GridItem>

                    {/* Deal Description */}
                    <GridItem xs={12} sm={12}>
                        <TextField 
                            id="description"
                            label="Deal Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows="3"
                            className={classes.textField}
                            value={dealInfo.description}
                            fullWidth
                            onChange={handleChange('description')}
                            margin="normal"
                        />
                    </GridItem>

                    {/* Delete Deal */}
                    <DeleteDealButton 
                        userId={props.userId}
                        creatorId={props.creatorId}
                        handleDeleteDeal={props.handleDeleteDeal}
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