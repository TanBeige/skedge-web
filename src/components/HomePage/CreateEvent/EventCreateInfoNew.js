import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MomentUtils from '@date-io/moment';

import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText'

import {
    DatePicker,
    MuiPickersUtilsProvider,
    TimePicker
  } from '@material-ui/pickers';
import _ from 'lodash'

import Slide from '@material-ui/core/Slide'
import { MenuItem } from '@material-ui/core';


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
  textField: {
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

export default function SignUp(props) {
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



  //Returned JSX
  let dir = props.goingBack ? 'right' : 'left';

  const error = [values.monday, values.tuesday, values.wednesday, values.thursday, values.friday, values.saturday, values.sunday].filter(v => v).length < 1;

  let endTimeJS = ""

  if (values.endTimeExists) {
    endTimeJS = (<TimePicker 
                  label="End Time"
                  variant="outlined"
                  fullWidth
                  value={values.endTime}
                  onChange={handleTimeClick}
                />
    )
  }
  else {
    endTimeJS = <Button contained color='primary'>End Time</Button>
  }

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
            <TimePicker 
                label="End Time"
                variant="outlined"
                fullWidth
                value={values.endTime}
                onChange={handleTimeClick}
            />
        </Grid>
      </Grid>
      </MuiPickersUtilsProvider>
      </div>
    )
  }



  //Return
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
                label="Address"
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
                label="Repeated Event"
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
          onClick={props.handleEventInfo}
          >
          Continue
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