/*  Code Written By: Tan Arin
*
*   Description: 
*     Functional Component that hold the EventList that is displayed on the home page
*/

import React, { useState, useEffect } from "react";
import Button from 'components/CustomButtons/Button.js';
import clsx from 'clsx';



// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core/styles";

// Time/Date Selections Imports
import MomentUtils from '@date-io/moment';    //uninstall if dont need this later
import {
    DatePicker,
    MuiPickersUtilsProvider,
    TimePicker
} from '@material-ui/pickers';

// @material-ui/icons
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ApartmentIcon from '@material-ui/icons/Apartment';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPillsSearch from "components/NavPills/NavPillsSearch.js";
import EventCardList from "components/EventCards/EventCardList.js";
import CustomInput from 'components/CustomInput/CustomInput.js';
import useDebounce from 'components/Debounce/Debounce.js';


import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";


// Constants
import { categoryList } from "utils/constants";
// import { dataTable } from "AdminDashboard/variables/general";

const useStyles = makeStyles(sectionPillsStyle);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    }
  },
});

export default function SectionPills(props) {
  const classes = useStyles();

  // 0 is local, 1 is private
  const [values, setValues] = useState({
    type: "local",
    category: "Any",
    searchText: "", //Search Text can look for Event Names, Tags, or Event Creators!
    city: "",
    state: "",
    limit: 10,
    date: new Date(),
    weekday: new Date().getDay()
  })

  //Search filters for list
  const [localFilter, setLocalFilter] = useState({
    searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
    type: "local",
    category: values.category,
    city: values.city,
    state: values.state,
    limit: values.limit,
    date: values.date,
    weekday: values.weekday
  })


  const [privateFilter, setPrivateFilter] = useState({
    searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
    type: "private",
    category: values.category,
    city: values.city,
    state: values.state,
    limit: values.limit,
    date: values.date,
    weekday: values.weekday
  })

  const [expanded, setExpanded] = useState(false)

  // Handle Filter Change
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleFilters = name => event => {
      setValues({
        ...values,
        [name]: event.target.value,
      });
  };

  const handleDateChange = date => {
    const day = date.toDate().getDay();
    
    setValues({
      ...values,
      date: date.toDate(),
      weekday: day
    })
    setLocalFilter({
      ...localFilter,
      date: date.toDate(),
      weekday: day
    });
    setPrivateFilter({
      ...privateFilter,
      date: date.toDate(),
      weekday: day
    });
  }

  const handleDayBack = () => {
    const newDate = values.date.addDays(-1)
    const day = newDate.getDay()

    setValues({
      ...values,
      date: newDate,
      weekday: day
    });
    setLocalFilter({
      ...localFilter,
      date: newDate,
      weekday: day
    });
    setPrivateFilter({
      ...privateFilter,
      date: newDate,
      weekday: day
    });
  }

  const handleDayForward = () => {
    const newDate = values.date.addDays(1)
    const day = newDate.getDay();

    setValues({
      ...values,
      date: newDate,
      weekday: day
    });
    setLocalFilter({
      ...localFilter,
      date: newDate,
      weekday: day
    });
    setPrivateFilter({
      ...privateFilter,
      date: newDate,
      weekday: day
    });
  }

  

  const submitSearch = () => {
    setLocalFilter({
      ...localFilter,
      searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
      type: "local",
      category: values.category,
      city: values.city,
      state: values.state,
      limit: values.limit,
      date: values.date,
      weekday: values.weekday
    });
    setPrivateFilter({
      ...privateFilter,
      searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
      type: "private",
      category: values.category,
      city: values.city,
      state: values.state,
      limit: values.limit,
      date: values.date,
      weekday: values.weekday
    });
  }

  

  // const debouncedSearchTerm = useDebounce(values, 300);

  // useEffect(() => {
  //   if(debouncedSearchTerm) {
  //     console.log("Test debounce")

  //     setLocalFilter({
  //       ...localFilter,
  //       searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
  //       type: "local",
  //       category: values.category,
  //       city: values.city,
  //       state: values.state,
  //       limit: values.limit,
  //       date: values.date,
  //       weekday: values.weekday
  //     });
  //     setPrivateFilter({
  //       ...privateFilter,
  //       searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
  //       type: "private",
  //       category: values.category,
  //       city: values.city,
  //       state: values.state,
  //       limit: values.limit,
  //       date: values.date,
  //       weekday: values.weekday
  //     });
  //   }
  // },[debouncedSearchTerm])


  //Changes day to a moment.js object so I can format easier
  const moment = require('moment')
  const formatDate = moment(values.date);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.section} style={{paddingTop: 0, paddingBottom: '1em'}}>
        <GridContainer justify="center">
          <GridItem xs={12}>
            <Paper elevation={10} style={{paddingLeft:20, paddingRight: 20, margin: '10px 0 20px 0'}} color="primary">
              <GridContainer>
                <GridItem xs={12}>
                  <FormControl fullWidth className={classes.selectFormControl} style={{marginBottom: 0}}>            
                    <CustomInput
                      labelText="Search by name, date, category, etc."
                      id="search"
                      inputProps={{
                        onChange: handleFilters("searchText")
                      }}
                    />
                  </FormControl>
                </GridItem>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    style={{position: 'absolute', right: 20, top: 20}}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
              </GridContainer>

              <Collapse in={expanded} timeout="auto" unmountOnExit style={{paddingBottom: 10}}>
                <GridContainer>
                  <GridItem xs={12} style={{textAlign: 'center'}}>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker 
                          autoOk
                          label="Event Date"
                          style={{width: '100%', marginBottom: 10}} 
                          disableToolbar
                          value={values.date} 
                          format="MMMM D, YYYY"
                          onChange={handleDateChange} 
                          variant="dialog"
                          openTo="date"
                        />
                    </MuiPickersUtilsProvider >  
                  </GridItem>
                  <GridItem xs={12}>
                    <FormControl fullWidth className={classes.selectFormControl}>            
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        Category
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={values.category}
                        onChange={handleFilters("category")}

                        inputProps={{
                          name: "category",
                          id: "category",
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          Categories
                        </MenuItem>
                        {
                          categoryList.map((category, index) => {
                            return(
                              <MenuItem
                                key={index}
                                onChange={handleFilters}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={category}
                              >
                                {category}
                              </MenuItem>
                            )
                          })
                        }
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={6}>
                    <FormControl fullWidth className={classes.selectFormControl}>
                      <CustomInput
                        labelText="City"
                        id="city"
                        inputProps={{
                          onChange: handleFilters("city"),
                          defaultValue: ""
                        }}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>            
                    <CustomInput
                      labelText="State"
                      id="state"
                      inputProps={{
                        onChange: handleFilters("state"),
                        defaultValue: ""
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} style={{textAlign: 'center'}}>
                    <Button color='info' onClick={submitSearch}>Search</Button>
                  </GridItem>
                </GridContainer>
              </Collapse>
            </Paper>
          </GridItem>
          
          <GridItem>
            <Divider />        
          </GridItem>
        </GridContainer>

        <div style={{display: "block", margin: '10px 0px'}}>
          <IconButton 
            onClick={handleDayBack}
            style={{position: 'absolute', left: 5, marginTop: '-12px', padding: '12px 18px'}}
          >
            <ChevronLeftIcon fontSize='large'  />
          </IconButton>
          <IconButton 
            onClick={handleDayForward}
            style={{position: 'absolute', right: 5, marginTop: '-12px', padding: '12px 18px'}}
          >
            <ChevronRightIcon fontSize='large'  />
          </IconButton>
            <h3 style={{textAlign: 'center', verticalAlign: 'middle'}}>{formatDate.format("MMMM D, YYYY")}</h3>
        </div>

        <div className={classes.profileTabs} style={{marginTop: 10}}>
              <NavPillsSearch
                  alignCenter
                  color="primary"
                  client={props.client}
                  tabs={[
                  {
                      tabButton: "Local",
                      tabIcon: ApartmentIcon,
                      tabContent: (
                          <EventCardList 
                              client={props.client}
                              userId={props.userId}
                              filter={localFilter}
                              listType='home'
                          /> 
                      )
                  },
                  {
                      tabButton: "Following",
                      tabIcon: EmojiPeopleIcon,
                      tabContent: (
                          <EventCardList 
                              client={props.client}
                              userId={props.userId}
                              filter={privateFilter}
                              listType='home'
                          />
                      )
                  }
                  ]}
              />
          </div>
      </div>
    </ThemeProvider>
  );
}

//Handling Date Formats

  // Adding Days
Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}