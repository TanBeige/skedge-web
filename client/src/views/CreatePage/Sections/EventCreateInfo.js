// React Imports
import React, {Fragment} from 'react';

// Material Ui Imports
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


import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import pricingStyle from "assets/jss/material-kit-pro-react/views/pricingSections/pricingStyle.js";


// Material-UI transition imports
import Collapse from '@material-ui/core/Collapse';
import Slide from '@material-ui/core/Slide'
import { MenuItem } from '@material-ui/core';

// Time/Date Selections Imports
import MomentUtils from '@date-io/moment';    //uninstall if dont need this later
import {
    DatePicker,
    MuiPickersUtilsProvider,
    TimePicker
  } from '@material-ui/pickers';  //if i dont need this later uninstall

// Lodash import
import _ from 'lodash'

// Begin Code !
const useStyles = makeStyles(pricingStyle);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    },
  },
});

export default function EventCreateInfo(props) {
  const classes = useStyles();
  const savedValues = props.savedValues;

  const [values, setValues] = React.useState({
    // Event Creation
    name: savedValues.name,
    street: savedValues.street,
    location_name: savedValues.location_name,
    city: savedValues.city,
    state: savedValues.state,
    entityCityState: {},

    start_date: savedValues.start_date,
    end_date: savedValues.end_date,

    start_time: savedValues.start_time,
    endTimeExists: savedValues.end_time !== null ? true : false,
    end_time: savedValues.end_time,

    price: savedValues.price,
    description: savedValues.description,
    web_url: savedValues.web_url,

    //Recurring Events
    repeatCheck: savedValues.is_recurring,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,

  });

  //Functions
  const handleChange = name => event => {
      setValues({ ...values, [name]: event.target.value });
  };
  const handleCheck = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleEntityLocation = event => {
    console.log(event.target.value)
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
  const submitEventInfo = () => {
    props.handleEventInfo(values);
  }



  let dir = props.goingBack ? 'right' : 'left';

  const error = [values.monday, values.tuesday, values.wednesday, values.thursday, values.friday, values.saturday, values.sunday].filter(v => v).length < 1;

  // Changes to Date/Time input dynamically based on time types
  let endTimeJS = ""

  if (values.endTimeExists) {
    endTimeJS = (<div>

                <Grid container>
                  <Grid item xs={11}>
                    {/* <div style={{position: 'absolute', right: 10}}>
                      <Button variant='outlined' style={{marginTop: 8, minWidth: 32}} size='small' color='primary' onClick={handleEndTimeClick}>X</Button>
                    </div> */}
                    <TimePicker 
                      label="End Time"
                      variant="outlined"
                      fullWidth
                      value={values.end_time}
                      onChange={handleEndTime}
                    />
                      <Button variant='outlined' style={{position: 'absolute', marginTop: 8, marginRight: 16, minWidth: 32}} size='small' color='primary' onClick={handleEndTimeClick}>X</Button>

                    
                  </Grid>
                </Grid>

                </div>
    )
  }
  else {
    endTimeJS = (<Button 
                  variant="contained" 
                  color='primary' 
                  style={{width: '100%', height: '80%', color: 'white'}}
                  onClick={handleEndTimeClick}
                  >
                    End Time
                  </Button>
    )}

  let repeatEvent = ""
  if (!values.repeatCheck) {
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
              labelPlacement="top"
            />
            </Grid>
            <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox checked={values.saturday} onChange={handleCheck('saturday')} value="saturday"  color='primary'/>
              }
              label="Sat."
              labelPlacement="top"
            />
            </Grid>
            <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox checked={values.sunday} onChange={handleCheck('sunday')} value="sunday" color='primary'/>
              }
              label="Sun."
              labelPlacement="top"
            />
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
  let continueDisabled = true;

  if(
    values.name.replace(/\s/g, '').length && 
    values.name.replace(/\s/g, '').length <= 50 && 
    values.location_name.replace(/\s/g, '').length && 
    values.street.replace(/\s/g, '').length && 
    values.city.replace(/\s/g, '').length && 
    values.state.replace(/\s/g, '').length
    ) {
      if(values.repeatCheck)
      {
        if(
          values.monday || 
          values.tuesday || 
          values.wednesday || 
          values.thursday || 
          values.friday || 
          values.saturday ||
          values.sunday
          ) {
            continueDisabled = false;
          }
      }
      else {
        continueDisabled = false;
      }
  }
  else {
    continueDisabled = true;
  }

  // Date/Time input based on if Entity or not
  let inputCityState = ""
  if(props.savedValues.event_type === "local") {
    inputCityState = (
      <Fragment>
        <Grid item xs={12}>
          <TextField
              id="locations"
              select
              label="Locations"
              variant="outlined"
              required
              fullWidth
              className={classes.textField}
              value={values.entityCityState}
              onChange={handleEntityLocation}
              SelectProps={{
                  MenuProps: {
                      className: classes.menu,
                  },
              }}
              margin="normal"
          >
              {
              skedgeLocations.map((item, index) => 
                  (<MenuItem key={index} value={item}>{item.city}, {item.state}</MenuItem>)
              )}
          </TextField>
        </Grid>
      </Fragment>
    )
  }
  else {
    inputCityState = (
      <Fragment>
        <Grid item xs={6}>
          <TextField
              id="city"
              label="City"
              variant="outlined"
              required
              fullWidth
              className={classes.textField}
              value={values.city}
              onChange={handleChange('city')}
              margin="normal"
          >
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
              id="state"
              select
              label="State"
              variant="outlined"
              required
              fullWidth
              className={classes.textField}
              value={values.state}
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
        </Grid>
      </Fragment>
    )
  }
  

  //**************************** Return ******************************
  return (
    <Slide direction={dir} in mountOnEnter unmountOnExit>
    <Container component="main" maxWidth="md" style={{paddingBottom: '0.5em'}}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <form className={classes.form} noValidate>
        <div className='EventCreateInfo'>
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
                autoFocus
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
                placeholder="ex) Nellie's Place"
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

            {inputCityState}
            {/* <Grid item xs={6}>
                <TextField
                    id="city"
                    label="City"
                    variant="outlined"
                    onChange={handleChange}
                    required
                    fullWidth
                    className={classes.textField}
                    value={values.city}
                    onChange={handleChange('city')}
                    margin="normal"
                >
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="state"
                    select
                    label="State"
                    variant="outlined"
                    required
                    fullWidth
                    className={classes.textField}
                    value={values.state}
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
            </Grid> */}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                  color="primary"
                  onChange={handleCheck('repeatCheck')}
                  checked={values.repeatCheck}
                  value="repeatCheck"
                  style={{marginTop: 0, marginBottom: 0}}
                  />
                }
                label="Repeated Weekly Event"
              />
            </Grid>

            {repeatEvent}
            
            <Grid item xs={12} >
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">Event Entry Fee</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  value={values.price}
                  type='number'
                  onChange={handleChange('price')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
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
                    label="Link"
                    placeholder="Ex) Ticket link"

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
                  margin="normal"
              />
            </Grid>

          </Grid>
          
          </div>

          <Button
            disabled={continueDisabled}
            fullWidth
            variant="contained"
            color="primary"
            style={{color: 'white'}}
            className={classes.submit}
            onClick={submitEventInfo}
          >
           Choose Category ->
          </Button>
        </form>
      </ThemeProvider>
    </Container>
    </Slide>
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

const skedgeLocations = [
  {
    city: "Tallahassee",
    state: "Florida"
  }
]