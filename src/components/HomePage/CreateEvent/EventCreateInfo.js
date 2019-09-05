// React Imports
import React from 'react';

// Material Ui Imports
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';

// Material-UI transition imports
import Collapse from '@material-ui/core/Collapse';
import Slide from '@material-ui/core/Slide'
import { MenuItem } from '@material-ui/core';

// Time/Date Selections Imports
import MomentUtils from '@date-io/moment';
import {
    DatePicker,
    MuiPickersUtilsProvider,
    TimePicker
  } from '@material-ui/pickers';

// Lodash import
import _ from 'lodash'

// Begin Code !
const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: '4em'
  },
}));

export default function EventCreateInfo(props) {
  const classes = useStyles();

  const [values, setValues] = React.useState({
  name: "",
  address: "",
  city: "",
  state: "Florida",
  selectedDay: new Date(),
  startTime: new Date(),

  endTimeExists: false,
  endTime: new Date(),
  price: 0,
  description: "",

  repeatCheck: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false
  });

  //Functions
  const handleChange = name => event => {
      setValues({ ...values, [name]: event.target.value });
  };
  const handleCheck = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleDayClick = (day) => {
      setValues({
          ...values,
          selectedDay: day
      })
  }

  const handleTimeClick = (time) => {
      setValues({
          ...values,
          startTime: time
      })
  }

  const handleEndTimeClick = () => {
    setValues({
          ...values,
          endTimeExists: !values.endTimeExists
      })
  }
  const submitEventInfo = () => {
    props.handleEventInfo(
        values.name,
        values.address,
        values.city,
        values.state,
        values.event_date,
        values.start_time,
        values.end_time,
        values.description,
        values.repeatCheck
    )
  }



  //Returned JSX
  let dir = props.goingBack ? 'right' : 'left';

  const error = [values.monday, values.tuesday, values.wednesday, values.thursday, values.friday, values.saturday, values.sunday].filter(v => v).length < 1;

  let endTimeJS = ""

  if (values.endTimeExists) {
    endTimeJS = (<div>
                <Grid container>
                  <Grid item xs={8}>
                    <TimePicker 
                      label="End Time"
                      variant="outlined"
                      fullWidth
                      value={values.endTime}
                      onChange={handleTimeClick}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button variant='outlined' style={{marginTop: 8}} size='small' color='primary' onClick={handleEndTimeClick}>X</Button>
                  </Grid>
                </Grid>

                </div>
    )
  }
  else {
    endTimeJS = (<Button 
                  variant="contained" 
                  color='primary' 
                  style={{width: '100%', height: '80%'}}
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
                            value={values.selectedDay}
                            onChange={handleDayClick}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TimePicker
                            label="Start Time"
                            variant="outlined"
                            fullWidth
                            value={values.startTime}
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
      <FormControl required error={error} component="fieldset">
        <FormLabel component="legend">Check at least one</FormLabel>
        <FormGroup>
          <Grid container direction='row' alignContent='center'>
            <Grid item xs>
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
          </Grid>
          <Grid container direction='row'>
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
            <TimePicker
                label="Start Time"
                variant="outlined"
                fullWidth
                value={values.startTime}
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

  //********************* Return ******************************
  return (
    <Slide direction={dir} in mountOnEnter unmountOnExit>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate>
        <div className='EventCreateInfo'>
          <Grid container spacing={2} >
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Event Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Location"
                name="address"
                autoComplete="address"
              />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="city"
                    label="City"
                    variant="outlined"
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
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          onClick={submitEventInfo}
          >
          Choose Category ->
          </Button>
        </form>
      </div>
    </Container>
    </Slide>
  );
}

const states = [ "Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
 "Delaware",
 "District Of Columbia",
 "Federated States Of Micronesia",
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
 "Marshall Islands",
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
 "Northern Mariana Islands",
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