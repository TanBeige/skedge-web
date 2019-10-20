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

// @material-ui/icons
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ApartmentIcon from '@material-ui/icons/Apartment';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

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

const useStyles = makeStyles(sectionPillsStyle);

export default function SectionPills(props) {
  const classes = useStyles();
  console.log("SectionPills New Load")

  // 0 is local, 1 is private
  const [values, setValues] = useState({
    type: "local",
    category: "Any",
    searchText: "", //Search Text can look for Event Names, Tags, or Event Creators!
    city: "",
    state: "",
    limit: 10,
    date: new Date(),

    expanded: false
  })

  // Handle Filter Change

  const handleExpandClick = () => {
    setValues({
      ...values,
      expanded: !values.expanded
    })
  }

  const handleFilters = name => event => {
      setValues({
        ...values,
        [name]: event.target.value,
      });
  };

  const [localFilter, setLocalFilter] = useState({
    searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
    type: "local",
    category: values.category,
    city: values.city,
    state: values.state,
    limit: values.limit,
    date: values.date
  })

  const [privateFilter, setPrivateFilter] = useState({
    searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
    type: "private",
    category: values.category,
    city: values.city,
    state: values.state,
    limit: values.limit,
    date: values.date
  })

  const debouncedSearchTerm = useDebounce(values, 300);
  //const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if(debouncedSearchTerm) {
      // Set isSearching state
//      setIsSearching(true);

      setLocalFilter({
        ...localFilter,
        searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
        type: "local",
        category: values.category,
        city: values.city,
        state: values.state,
        limit: values.limit,
        date: values.date
      });
      setPrivateFilter({
        ...privateFilter,
        searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
        type: "private",
        category: values.category,
        city: values.city,
        state: values.state,
        limit: values.limit,
        date: values.date
      });

  //    setIsSearching(false);
    }
  },[debouncedSearchTerm])

  return (
    <div className={classes.section} style={{paddingTop: 25}}>
      <GridContainer justify="center">
        <GridItem xs={12}>
        <Paper elevation={10} style={{paddingLeft:20, paddingRight: 20, margin: '10px 0 20px 0'}} color="primary">
          <GridContainer>
            <GridItem xs={10}>
              <FormControl fullWidth className={classes.selectFormControl} style={{marginBottom: 0}}>            
                <CustomInput
                  labelText="Search Events"
                  id="search"
                  inputProps={{
                    onChange: handleFilters("searchText")
                  }}
                  formControlProps={{
                    fullWidth: true
                  }}
                />
              </FormControl>
            </GridItem>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: values.expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={values.expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
          </GridContainer>

          <Collapse in={values.expanded} timeout="auto" unmountOnExit>
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
          </Collapse>
          

        </Paper>

        </GridItem>
        <GridItem>
          <Divider />        
        </GridItem>
      </GridContainer>

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
                    tabButton: "Private",
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
  );
}