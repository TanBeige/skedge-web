// React Imports
import React, {Fragment, useEffect} from 'react';
import gql from 'graphql-tag';
import axios from 'axios';

// Material Ui Imports
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import NumberFormat from 'react-number-format';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';


import { categoryList } from "utils/constants";
import ImageUpload from 'components/CustomUpload/ImageUpload.js';
import CityState from './CityState'


import { createWeekdayString } from 'components/CommonFunctions.js'

import pricingStyle from "assets/jss/material-kit-pro-react/views/pricingSections/pricingStyle.js";


// Material-UI transition imports
import Slide from '@material-ui/core/Slide'
import { MenuItem } from '@material-ui/core';

// Time/Date Selections Imports
import MomentUtils from '@date-io/moment';    //uninstall if dont need this later
import {
    DatePicker,
    MuiPickersUtilsProvider,
    TimePicker
} from '@material-ui/pickers';  //if i dont need this later uninstall

import { store } from 'react-notifications-component';
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
import {
    MUTATION_DEAL_ADD,
} from 'EventQueries/EventQueries.js'
import history from "utils/history";

// Lodash import
import _ from 'lodash'



// query bannerPics {
//     images(where: {image_uuid: {_ilike: "%default_images%"}}) {
//     id
//     image_uuid
//     }
// }

// Cloudinary Setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
    cloud_name: "skedge"
});


// Begin Code !
var moment = require('moment');
const useStyles = makeStyles(pricingStyle);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    },
  },
});

export default function CreateEvent(props) {
    const classes = useStyles();
    const { user } = useAuth0();
    console.log(props.image_file)
    
    const { savedValues } = props;
    const [values, setValues] = React.useState({
        // Event Creation
        event_type: savedValues.event_type,
        name: savedValues.name,
        street: savedValues.street,
        location_name: savedValues.location_name,
        city: "",
        state: "",
        entityCityState: {},

        start_date: savedValues.start_date,
        end_date: savedValues.end_date,

        start_time: savedValues.start_time,
        endTimeExists: savedValues.end_time_exists,
        end_time: savedValues.end_time ? savedValues.end_time : false,

        price: savedValues.price,
        web_url: savedValues.web_url,
        description: savedValues.description,

        //Recurring Events
        is_recurring: savedValues.is_recurring,
        monday: savedValues.weekday.includes("1"),
        tuesday: savedValues.weekday.includes("2"),
        wednesday: savedValues.weekday.includes("3"),
        thursday: savedValues.weekday.includes("4"),
        friday: savedValues.weekday.includes("5"),
        saturday: savedValues.weekday.includes("6"),
        sunday: savedValues.weekday.includes("0"),

        //Banner
        loading: false,
        bannerImg: savedValues.image_file,
    });

  // Event Info Functions: 
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };
    const handleCheck = name => event => {
        setValues({ ...values, [name]: event.target.checked });
    };

    const handleEntityLocation = event => {
        setValues({
        ...values,
        city: event.target.value.city,
        state: event.target.value.state,
        entityCityState: event.target.value
        })
    }

    const handleDayClick = (day) => {
        setValues({
            ...values,
            start_date: day
        })
    }
    const handleEndDateClick = (day) => {
        setValues({
            ...values,
            end_date: day
        })
    }

    const handleTimeClick = (time) => {
        setValues({
            ...values,
            start_time: time
        })
    }

    const handleEndTime = (time) => {
        setValues({
            ...values,
            end_time: time
        })
    }

    const handleEndTimeClick = () => {
        setValues({
            ...values,
            endTimeExists: !values.endTimeExists
        })
    }

    const bannerChoose = (banner) => {
        setValues({ ...values, bannerImg: banner });
    };

    //Save information
    const submitEventInfo = () => {
        props.handleEventInfo(values);
    }

    //When click Back button
    let dir = props.goingBack ? 'right' : 'left';

    //Checks form validation
    const error = [values.monday, values.tuesday, values.wednesday, values.thursday, values.friday, values.saturday, values.sunday].filter(v => v).length < 1;

    // Changes to Date/Time input dynamically based on time types
    let endTimeJS = ""

    if (values.endTimeExists) {
        endTimeJS = (
            <div>
                <Grid container>
                  <Grid item xs={11}>
                    <TimePicker 
                      label="End Time"
                      variant="outlined"
                      fullWidth
                      value={values.end_time}
                      onChange={handleEndTime}
                    />
                      <Button 
                      variant='outlined' 
                      style={{position: 'absolute', marginTop: 8, marginRight: 16, minWidth: 32}} 
                      size='small' 
                      color='primary' 
                      onClick={handleEndTimeClick}>
                          X
                      </Button>
                  </Grid>
                </Grid>
            </div>
        )
  }
  else {
    endTimeJS = (
        <Button 
            variant="contained" 
            color='primary' 
            style={{width: '100%', height: '80%', color: 'white'}}
            onClick={handleEndTimeClick}>
            End Time
        </Button>
    )}

  let repeatEvent = ""
  if (!values.is_recurring) {
    repeatEvent = (<MuiPickersUtilsProvider utils={MomentUtils}>
                    <Grid item xs={12}>
                        <DatePicker
                            variant="inline"
                            label="Event Date"
                            format="dddd, MMMM Do YYYY"
                            variant="outlined"
                            fullWidth
                            value={values.start_date}
                            onChange={handleDayClick}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TimePicker
                            label="Start Time"
                            variant="outlined"
                            fullWidth
                            value={values.start_time}
                            onChange={handleTimeClick}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {endTimeJS}
                    </Grid>
                </MuiPickersUtilsProvider>)
  }
  else {
    repeatEvent = (
      <div className='weekdayCheckboxes'>
      <FormControl required error={error} component="fieldset" style={{marginBottom: 15, width: '100%'}}>
        <FormLabel component="legend" style={{marginBottom: 15}}>Check at least one</FormLabel>
        <FormGroup>
            <Grid container direction='row' alignContent='center'>
                <Grid item xs={3}>
                    <FormControlLabel
                    control={<Checkbox checked={values.monday} onChange={handleCheck('monday')} value="monday" color='primary'/>}
                    label="Mon."
                    labelPlacement="top"
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel
                    control={<Checkbox checked={values.tuesday} onChange={handleCheck('tuesday')} value="tuesday" color='primary'/>}
                    label="Tue."
                    labelPlacement="top"
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel
                    control={
                        <Checkbox checked={values.wednesday} onChange={handleCheck('wednesday')} value="wednesday" color='primary'/>
                    }
                    label="Wed."
                    labelPlacement="top"
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel
                    control={
                        <Checkbox checked={values.thursday} onChange={handleCheck('thursday')} value="thursday" color='primary'/>
                    }
                    label="Thu."
                    labelPlacement="top"
                    />
                </Grid>
            {/* </Grid> */}
            {/* <Grid container direction='row'> */}
                <Grid item xs={3}>
                    <FormControlLabel
                    control={
                        <Checkbox checked={values.friday} onChange={handleCheck('friday')} value="friday" color='primary'/>
                    }
                    label="Fri."
                    labelPlacement="top"/>
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel
                    control={
                        <Checkbox checked={values.saturday} onChange={handleCheck('saturday')} value="saturday"  color='primary'/>
                    }
                    label="Sat."
                    labelPlacement="top"/>
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel
                    control={
                        <Checkbox checked={values.sunday} onChange={handleCheck('sunday')} value="sunday" color='primary'/>
                    }
                    label="Sun."
                    labelPlacement="top"/>
                </Grid>
            </Grid>
        </FormGroup>
      </FormControl>
      <MuiPickersUtilsProvider utils={MomentUtils} >
        <Grid container spacing={2}>
        <Grid item xs={6}>
          <DatePicker
              variant="inline"
              label="Event Starting Date"
              format="MMMM Do YYYY"
              variant="outlined"
              fullWidth
              value={values.start_date}
              onChange={handleDayClick}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
                variant="inline"
                label="Event Ending Date"
                format="MMMM Do YYYY"
                variant="outlined"
                fullWidth
                value={values.end_date}
                onChange={handleEndDateClick}
          />
        </Grid>
          <Grid item xs={6}>
              <TimePicker
                  label="Start Time"
                  variant="outlined"
                  fullWidth
                  value={values.start_time}
                  onChange={handleTimeClick}
              />
          </Grid>
          <Grid item xs={6}>
              {endTimeJS}
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
      </div>
    )
  }

    // Disable Button if form is filled incorrectly
    let continueDisabled = false;
    //Checking the Event Info
    if(
        !values.name.replace(/\s/g, '').length ||
        values.name.replace(/\s/g, '').length >= 50 ||
        !values.location_name.replace(/\s/g, '').length || 
        !values.street.replace(/\s/g, '').length ||
        !values.city.replace(/\s/g, '').length ||
        !values.state.replace(/\s/g, '').length 
    ) {
        continueDisabled = true;
    }
    if(values.is_recurring) {
        if(
            (!values.monday &&
            !values.tuesday && 
            !values.wednesday && 
            !values.thursday &&
            !values.friday &&
            !values.saturday &&
            !values.sunday) ||
            !values.end_date
        ) {
            continueDisabled = true;
        }
    }
    if(values.bannerImg === null) {
        continueDisabled = true;
    }

  // Date/Time input based on if Entity or not
//   let inputCityState = ""
//     inputCityState = (
//         <Fragment>
//             <Grid item xs={12}>
//                 <TextField
//                     id="City, State"
//                     select
//                     label="Locations"
//                     variant="outlined"
//                     required
//                     fullWidth
//                     className={classes.textField}
//                     value={values.entityCityState}
//                     onChange={handleEntityLocation}
//                     SelectProps={{
//                         MenuProps: {
//                             className: classes.menu,
//                         },
//                     }}
//                     margin="normal">
//                     {
//                         skedgeLocations.map((item, index) => {
//                             return <MenuItem key={index} value={item}>{item.city}, {item.state}</MenuItem>
//                         })
//                     }
//                 </TextField>
//             </Grid>
//         </Fragment>
//     )
  
  

  //**************************** Return ******************************
  return (
    <Slide direction={dir} in mountOnEnter unmountOnExit>
        <Container component="main" maxWidth="md" style={{paddingBottom: '1.5em'}}>
            <CssBaseline />
                <ThemeProvider theme={theme}>
                    <form className={classes.form} noValidate>
                        <div >
                            <div>
                                <ImageUpload setFile={bannerChoose} bannerImg={values.bannerImg}/>
                            </div>
                        </div>

                        <div className='EventInfo'>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        error={values.name.length > 50}
                                        className={classes.input}
                                        name="name"
                                        variant="outlined"
                                        value={values.name}
                                        required
                                        fullWidth
                                        onChange={handleChange('name')}
                                        id="event_name"
                                        label="Event Name"
                                        placeholder="50 character max."
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        value={values.location_name}
                                        required
                                        fullWidth
                                        onChange={handleChange('location_name')}
                                        id="location_name"
                                        label="Location Name"
                                        name="location"
                                        placeholder="ex) Paul's Pub"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        value={values.street}
                                        required
                                        fullWidth
                                        onChange={handleChange('street')}
                                        id="street"
                                        label="Address"
                                        name="street"
                                        placeholder="123 Example St."
                                    />
                                </Grid>

                                {/* {inputCityState} */}
                                <CityState type={values.event_type} city={values.city} state={values.state} entityCityState={values.entityCityState} handleChange={handleChange} handleEntityLocation={handleEntityLocation} />

                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                        <Checkbox 
                                        color="primary"
                                        onChange={handleCheck('is_recurring')}
                                        checked={values.is_recurring}
                                        value="is_recurring"
                                        style={{marginTop: 0, marginBottom: 0}}
                                        />
                                        }
                                        label="Repeated Weekly Event"
                                    />
                                </Grid>

                                {repeatEvent}
                                
                                <Grid item xs={12} >
                                    <FormControl fullWidth variant="outlined" style={{marginTop: '1em'}}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Event Price</InputLabel>
                                        <OutlinedInput
                                        id="outlined-adornment-amount"
                                        value={values.price}
                                        type='number'
                                        onChange={handleChange('price')}
                                        startAdornment={<InputAdornment position="start">-$</InputAdornment>}
                                        labelWidth={110}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        className={classes.input}
                                        name="web_url"
                                        variant="outlined"
                                        value={values.web_url}
                                        fullWidth
                                        onChange={handleChange('web_url')}
                                        id="web_url"
                                        label="Link to Event"
                                        // placeholder="50 character max."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField 
                                        id="description"
                                        label="Event Description"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows="3"
                                        className={classes.textField}
                                        value={values.description}
                                        fullWidth
                                        onChange={handleChange('description')}
                                        margin="normal"/>
                                </Grid>
                                
                            </Grid>

                            {/* ----Event Tags---- */}
                            {/* <div className='TagSelect'>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Choose up to two (2) categories.</FormLabel>
                                        <FormGroup>
                                            <EventTags values={values} handleToggle={handleToggle}/>
                                        </FormGroup>
                                </FormControl>

                                <Grid item xs={12}>
                                    <div style={{border: '2px solid #02C39A', borderRadius: 10, marginTop: '1em'}}>
                                        <TagsInput 
                                        style={{width: '100%'}}
                                        addKeys={[9, 13, 188]}
                                        value={values.tags}
                                        onChange={handleTags}
                                        tagProps={{ className: "react-tagsinput-tag primary" }}
                                        inputProps={{ placeholder: 'Add a tag (separate w/ commas)'}}/>
                                    </div>
                                </Grid>
                            </div> */}
                        </div>
                    {
                        continueDisabled ? 
                        <p style={{color: 'red', marginTop: '1em'}}>
                            {`Missing: `}
                            {
                                values.bannerImg ? "" : `Picture `
                            }
                            {
                                values.name.replace(/\s/g, '').length ? "" : `Name `
                            }
                            {
                                values.name.replace(/\s/g, '').length >= 50 ? `Name (too long) ` : "" 
                            }
                            {
                                values.location_name.replace(/\s/g, '').length ? "" : `Location `
                            }
                            {
                                values.street.replace(/\s/g, '').length ? "" : `Address `
                            }
                            {
                                values.city.replace(/\s/g, '').length ? "" : `City `
                            }
                            {
                                values.state.replace(/\s/g, '').length ? "" : `State `
                            }
                            {
                                values.is_recurring &&
                                !values.monday &&
                                !values.tuesday && 
                                !values.wednesday && 
                                !values.thursday &&
                                !values.friday &&
                                !values.saturday &&
                                !values.sunday
                                ? `Weekdays ` : "" 
                            }
                            {
                                values.is_recurring &&
                                !values.end_date
                                ? `End Date ` : "" 
                            }
                            {/*
                                values.categories.length < 1 ? `Category ` : ""  
                            */}

                        </p> : ""
                    }
                    <Button
                        disabled={continueDisabled}
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{color: 'white', marginTop: '1em'}}
                        className={classes.submit}
                        onClick={submitEventInfo}
                    >
                    Select Category ->
                    </Button>
                </form>
            </ThemeProvider>
        </Container>
    </Slide>
  );
}

const skedgeLocations = [
  {
    city: "Tallahassee",
    state: "Florida"
  }
]

const EventTags = ({values, handleToggle}) => {
    return(
        <div className='TagCheckbox'>
            <Grid container>
                {
                    categoryList.map((cat, index) => {
                        if(cat === "Any") {
                            return
                        }
                        else {
                            return(
                                <Grid item xs={6} key={index}>
                                    <FormControlLabel 
                                    key={index} 
                                    //value={values.categories.indexOf(cat) !== -1} 
                                    style={{color: "black"}} 
                                    control={
                                        <Checkbox
                                        checked={values.categories.indexOf(cat) !== -1}
                                        onChange={() => {handleToggle(cat)}} 
                                        indeterminate={values.categories.indexOf(cat) === 1}
                                        color='primary'/>
                                    } 
                                    label={cat} 
                                    />
                                </Grid>
                            )
                        }
                    })
                }
            </Grid>
            {/* </RadioGroup> */}
        </div>
    )
}
