// React Imports
import React, {Fragment, useEffect} from 'react';
import gql from 'graphql-tag';
import axios from 'axios';

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

import TagsInput from "react-tagsinput";
import { categoryList } from "utils/constants";
import ImageUpload from 'components/CustomUpload/ImageUpload.js';


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

export default function DealInfo(props) {
    const classes = useStyles();
    const { user } = useAuth0();
    

    const [uploading, setUploading] = React.useState(false);

    const [values, setValues] = React.useState({
        // Deal Creation
        name: "",
        street: "",
        location_name: "",
        city: "",
        state: "",
        entityCityState: {},

        start_date: null,
        end_date: null,

        start_time: null,
        endTimeExists: false,
        end_time: null,

        savings: "0",
        web_url: "",
        description: "",
        point_1: "",
        point_2: "",

        //Recurring Deals
        repeatCheck: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,

        //Categories
        categories: [],
        tags: [],

        //Banner
        loading: false,
        bannerImg: null,
        selectingBanner: false,
        selectBanners: []
    });

  // Deal Info Functions: 
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

    // Deal Categories Functions:
    const handleTags = (regularTags) => {
        setValues({
            ...values,
            tags: regularTags
        });
    };

    const handleToggle = value =>{
        
        const currentIndex = values.categories.indexOf(value);
        const newChecked = values.categories;

        if (currentIndex === -1) {
            if(values.categories.length >= 2) {
                return
            }
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        console.log("Array: ", newChecked)


        setValues({
            ...values,
            categories: newChecked
        })
    };

    // Deal Banner Functions
    const bannerSelect = (banner) => {
        setValues({
            ...values,
            selectingBanner: !values.selectingBanner
        })
    };

    const bannerChoose = (banner) => {
        setValues({ ...values, bannerImg: banner });
    };


    const bannerSubmit = (e) => {
        const {bannerImg} = values;
        e.preventDefault();

        props.submitEvent(bannerImg);
    }


    //Get banner pics before they show up
    const getBannerPics = () => {
        props.client.query({
            query: gql`
                query bannerPics {
                    images(where: {_and: [{id: {_gte: 184}}, {id: {_lte: 191}}]}
                    ){
                    id
                    image_uuid
                    }
                }
                `
        }).then((data) => {
            setValues({
                ...values,
                selectBanners: data.data.images
            })
        })
    }

    const selectBanners = () => {
        if (values.selectingBanner) {
            return (
                <div style={{textAlign: 'center'}}>
                    <h3 >Click image to select and submit deal.</h3>
                    {
                        values.selectBanners.map(image => {
                            if(image) {
                                return  (
                                    <img
                                        key ={image.id}
                                        src={cloudinary.url(image.image_uuid, {secure: true, width: 600, height: 400, crop: "fill" ,fetch_format: "auto", quality: "auto"})} className='selectImage' 
                                        style={{width: '100%', margin: '10px 0px', maxWidth: 500, borderRadius: 3}} 
                                        onClick={()=>bannerChosen(image.id)}
                                    />
                                )
                            }
                        })
                    }
                </div>
            )
        }
        else {
            return
        }
    }

    //As soon as a user click on an image
    const bannerChosen = (imageId) => {
        props.submitEvent(imageId);
    }

    // useEffect(() => {
    //     getBannerPics();
    // }, [])


    // Actually Submitting the Deal
    const submitDealInfo = async () => {

        // Overlay website when deal is uploading
        setUploading(true);
        props.setLoadingPage(true);
        

        // Upload Image to Cloudinary
        let errorOccurred = false;
        let response = "";

        const form_data = new FormData();
        form_data.append('file', values.bannerImg)

        response = await axios.post(`/deal/upload`, form_data).catch((error => {
            alert("Error occurred while uploading picture, try uploading a smaller image size or try again later.")
            errorOccurred = true;
            return;
        }))
        // Cancel Deal making if image upload failed
        if (errorOccurred) {
            props.setLoadingPage(false);
            return
        }

        //Create Weekday string for Database:
        let weekdayString = ""
        if(values.monday) {
            if(weekdayString === "") {
                weekdayString += "1"
            }
            else {
                weekdayString += " 1"
            }
        }
        if(values.tuesday) {
            if(weekdayString === "") {
                weekdayString += "2"
            }
            else {
                weekdayString += " 2"
            }
        }
        if(values.wednesday) {
            if(weekdayString === "") {
                weekdayString += "3"
            }
            else {
                weekdayString += " 3"
            }
        }
        if(values.thursday) {
            if(weekdayString === "") {
                weekdayString += "4"
            }
            else {
                weekdayString += " 4"
            }
        }
        if(values.friday) {
            if(weekdayString === "") {
                weekdayString += "5"
            }
            else {
                weekdayString += " 5"
            }
        }
        if(values.saturday) {
            if(weekdayString === "") {
                weekdayString += "6"
            }
            else {
                weekdayString += " 6"
            }
        }
        if(values.sunday) {
            if(weekdayString === "") {
                weekdayString += "0"
            }
            else {
                weekdayString += " 0"
            }
        }

        props.client.mutate({
            mutation: MUTATION_DEAL_ADD,
            variables: {
                objects: {
                    category: "", 
                    city: values.city, 
                    cover_pic: response.data.id, 
                    creator_id: user.sub, 
                    description: values.description, 
                    end_date: values.repeatCheck ? moment(values.end_date).format('YYYY-MM-DD') : moment(values.start_date).format('YYYY-MM-DD'), 
                    end_time: values.endTimeExists ? moment(values.end_time).format('HH:mm:ss') : null, 
                    is_recurring: values.repeatCheck, 
                    location_name: values.location_name, 
                    name: values.name, 
                    point_1: values.point_1, 
                    point_2: values.point_2, 
                    savings: values.savings, 
                    start_date: moment(values.start_date).format('YYYY-MM-DD'), 
                    start_time: moment(values.start_time).format('HH:mm:ss'),
                    state: values.state, 
                    street: values.street, 
                    web_url: values.web_url, 
                    weekday: weekdayString
                }
            }
        }).then((data)=> {
            setUploading(false);
            props.setLoadingPage(false);

            store.addNotification({
                title: `You created the deal ${values.name}`,
                message: `Viewing your deal right now!`,
                //content: <div style={{backgroundColor: primaryColor}}><a href={`/events/${data.data.insert_events.returning[0].id}`}>Click here to go to event</a></div>,
                type: "info",
                insert: "bottom",
                container: "bottom-center",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: false
                }
            });
            let path = `/deals/${data.data.insert_deals.returning[0].id}`;
            history.push(path);
        }).catch(error => {
            props.setLoadingPage(false);
            console.log(error)
        })
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

  let repeatDeal = ""
  if (!values.repeatCheck) {
    repeatDeal = (<MuiPickersUtilsProvider utils={MomentUtils}>
                    <Grid item xs={12}>
                        <DatePicker
                            variant="inline"
                            label="Deal Date"
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
    repeatDeal = (
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
              label="Deal Starting Date"
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
                label="Deal Ending Date"
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
    //Checking the Deal Info
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
    if(values.repeatCheck) {
        if(
            !values.monday &&
            !values.tuesday && 
            !values.wednesday && 
            !values.thursday &&
            !values.friday &&
            !values.saturday &&
            !values.sunday
        ) {
            continueDisabled = true;
        }
    }
    if(values.bannerImg == null) {
        continueDisabled = true;
    }

  // Date/Time input based on if Entity or not
  let inputCityState = ""
    inputCityState = (
        <Fragment>
            <Grid item xs={12}>
                <TextField
                    id="City, State"
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
                    margin="normal">
                    {
                        skedgeLocations.map((item, index) => {
                            return <MenuItem key={index} value={item}>{item.city}, {item.state}</MenuItem>
                        })
                    }
                </TextField>
            </Grid>
        </Fragment>
    )
  
  

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
                            {/* <Button variant='contained' color='primary' onClick={bannerSelect}>
                                Choose A Banner
                            </Button>
                            {selectBanners()} */}
                        </div>

                        <div className='DealInfo'>
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
                                        id="deal_name"
                                        label="Deal Name"
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

                                {inputCityState}

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
                                        label="Repeated Weekly Deal"
                                    />
                                </Grid>

                                {repeatDeal}
                                
                                <Grid item xs={12} >
                                    <FormControl fullWidth variant="outlined" style={{marginTop: '1em'}}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Deal Savings</InputLabel>
                                        <OutlinedInput
                                        id="outlined-adornment-amount"
                                        value={values.savings}
                                        type='number'
                                        onChange={handleChange('savings')}
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
                                        label="Link to Deal"
                                        autoFocus
                                        // placeholder="50 character max."
                                    />
                                </Grid>
                                <div style={{margin: '8px 8px 0px 8px'}}>
                                    <h4 style={{marginBottom: 0}}>Deal Bullet Points</h4>
                                    <p>- These will be shown on the display cards</p>
                                </div>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        error={values.name.length > 50}
                                        className={classes.input}
                                        name="point_1"
                                        variant="outlined"
                                        value={values.point_1}
                                        fullWidth
                                        onChange={handleChange('point_1')}
                                        id="point_1"
                                        label="Point 1"
                                        placeholder="50 character max."
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        error={values.name.length > 50}
                                        className={classes.input}
                                        name="point_2"
                                        variant="outlined"
                                        value={values.point_2}
                                        fullWidth
                                        onChange={handleChange('point_2')}
                                        id="point_2"
                                        label="Point 2"
                                        placeholder="50 character max."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField 
                                        id="description"
                                        label="Deal Description"
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

                            {/* ----Deal Tags---- */}
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
                                values.repeatCheck &&
                                !values.monday &&
                                !values.tuesday && 
                                !values.wednesday && 
                                !values.thursday &&
                                !values.friday &&
                                !values.saturday &&
                                !values.sunday
                                ? `Weekdays ` : "" 
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
                        onClick={submitDealInfo}
                    >
                    Submit Deal ->
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
