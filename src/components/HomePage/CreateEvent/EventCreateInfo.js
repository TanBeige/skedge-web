import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MenuItem } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { Grid } from '@material-ui/core';
import { Button } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import moment from 'moment'
import {
    DatePicker,
    MuiPickersUtilsProvider,
    TimePicker
  } from '@material-ui/pickers';
import _ from 'lodash'

/*format='YYYY-MM-DD' for PostgreSQL*/

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



const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: '1em'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '100%',
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  }));

const EventCreateInfo = (props) => {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        name: "",
        address: "",
        city: "",
        state: "Florida",
        selectedDay: new Date(),
        startTime: new Date(),
        endTime: 0,
        recurring: false,
        price: 0,
        description: "",
    });

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
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

    let dir = props.goingBack ? 'right' : 'left';
    
    return (
        <Slide direction={dir} in mountOnEnter unmountOnExit>
            <div className='EventCreateInfoContainer'>
            <div className='EventCreateInfo'>
                <form className={classes.container} noValidate autoComplete="off">
                    <FormControl fullWidth>
                        <h3>Event Info</h3>
                        <TextField
                            id="name"
                            label="Name of Event"
                            className={classes.textField}
                            value={values.name}
                            fullWidth
                            onChange={handleChange('name')}
                            margin="normal"
                        />
                        {/* Address */}
                        <TextField
                            id="address"
                            label="Address"
                            className={classes.textField}
                            value={values.address}
                            fullWidth
                            onChange={handleChange('address')}
                            margin="normal"
                        />

                        <Grid container direction='row'>
                            <Grid item xs={6}>
                                <TextField
                                    id="city"
                                    label="City"
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
                        </Grid>

                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                                variant="inline"
                                label="Event Date"
                                format="dddd, MMMM Do YYYY"
                                value={values.selectedDay}
                                onChange={handleDayClick}
                            />
                            <Grid container direction='row'>
                                <Grid item xs={6}>
                                    <TimePicker
                                        label="Start Time"
                                        value={values.startTime}
                                        onChange={handleTimeClick}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TimePicker 
                                        label="End Time"
                                        value={values.endTime}
                                        onChange={handleTimeClick}
                                    />
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider>
                        <TextField 
                            id="description"
                            label="Event Description"
                            className={classes.textField}
                            value={values.description}
                            fullWidth
                            onChange={handleChange('description')}
                            margin="normal"
                        />
                    </FormControl>
                </form>
            </div>
            <div className='center'>
                <Button className='submitButton' variant='contained' color="secondary" onClick={props.handleEventInfo}>Continue</Button>
            </div>
            </div>
        </Slide>

    )
}

export default EventCreateInfo;