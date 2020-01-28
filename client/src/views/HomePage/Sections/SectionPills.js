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

import TextField from '@material-ui/core/TextField';


// Time/Date Selections Imports
import MomentUtils from '@date-io/moment';    //uninstall if dont need this later
import {
    DatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';

// @material-ui/icons
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ApartmentIcon from '@material-ui/icons/Apartment';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import DateRangeIcon from '@material-ui/icons/DateRange';
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
import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";
import DateSelect from 'views/HomePage/Sections/DateSelect.js';
import SearchFilterBar from 'views/HomePage/Sections/SearchFilterBar.js';

// Constants
import { categoryList } from "utils/constants";

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
    lowerPrice: "",
    upperPrice: "",
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
    lowerPrice: values.lowerPrice,
    upperPrice: values.upperPrice,
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
    lowerPrice: values.lowerPrice,
    upperPrice: values.upperPrice,
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
      lowerPrice: values.lowerPrice === "" ? null : values.lowerPrice,
      upperPrice: values.upperPrice === "" ? null : values.upperPrice,
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
      lowerPrice: values.lowerPrice === "" ? null : values.lowerPrice,
      upperPrice: values.upperPrice === "" ? null : values.upperPrice,
      date: values.date,
      weekday: values.weekday
    });
  }



  //Changes day to a moment.js object so I can format easier
  const moment = require('moment')
  const formatDate = moment(values.date);


  // If user is an entity, only show local event feed
  const navPillsDisplay = (
    <NavPillsSearch
        alignCenter
        color="primary"
        client={props.client}
        isEntity={props.isEntity}
        searchText={localFilter.searchText}
        tabs={[
        {
          tabButton: "Events",
          tabIcon: DateRangeIcon,
          tabContent: (
            <div>
              <EventCardList 
                  client={props.client}
                  userId={props.userId}
                  filter={localFilter}
                  listType='local'
              />

            </div>
          )
        },
        {
          tabButton: "Deals",
          tabIcon: LocalAtmIcon,
          tabContent: (
            <div>
              <EventCardList 
                  client={props.client}
                  userId={props.userId}
                  filter={privateFilter}
                  listType='deals'
              />
            </div>
          )
        },
        {
          tabButton: "Following",
          tabIcon: EmojiPeopleIcon,
          tabContent: (
            <div>
              <EventCardList 
                  client={props.client}
                  userId={props.userId}
                  filter={privateFilter}
                  listType='following'
              />
            </div>
          )
        }
      ]}
    />
  )

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.section} style={{paddingTop: 0, paddingBottom: '1em'}}>
        <IconButton>
          Search
          <ExpandMoreIcon onClick={handleExpandClick}/>
        </IconButton>
        <Collapse in={expanded} timeout="auto">
          <SearchFilterBar handleFilters={handleFilters} handleDateChange={handleDateChange} submitSearch={submitSearch} values={values}/>
        </Collapse>
        <Divider />        
        <DateSelect handleDayBack={handleDayBack} handleDayForward={handleDayForward} date={formatDate.format("dddd, MMM D")}/>
        <div className={classes.profileTabs} style={{marginTop: 10}}>
              {navPillsDisplay}
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

const skedgeLocations = [
  {
    city: "Tallahassee",
    state: "Florida"
  }
]