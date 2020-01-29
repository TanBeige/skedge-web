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
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from 'components/CustomInput/CustomInput.js';
import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

// Constants
import { categoryList } from "utils/constants";

const useStyles = makeStyles(sectionPillsStyle);


export default function SearchFilterBar({handleFilters, handleDateChange, submitSearch, values}) {
    const classes = useStyles();

    return(
        <GridContainer justify="center">
          <GridItem xs={12}>
            <Paper elevation={10} style={{paddingLeft:'1em', paddingRight: '1em', margin: '10px 1em 20px 1em'}} color="primary">
              <GridContainer>
                <GridItem xs={12}>
                  <FormControl fullWidth className={classes.selectFormControl} style={{marginBottom: 0}}>            
                    <CustomInput
                      labelText="Search by name, date, category, etc."
                      id="search"
                      
                      inputProps={{
                        onChange: handleFilters("searchText"),
                        onKeyPress: (ev) => {
                          if (ev.key === 'Enter') {
                            // Do code here
                            ev.preventDefault();
                            submitSearch();
                          }
                        }
                      }}
                    />
                  </FormControl>
                </GridItem>
              </GridContainer>

                <div>
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
                    <GridItem xs={6}>
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
                    <GridItem xs={6} style={{marginTop: -12}}>
                      <CustomInput
                        labelText="Max Price ($)"
                        id="price"
                        //value={values.price}
                        inputProps={{
                          onChange: handleFilters("upperPrice"),
                          defaultValue: "",
                          type:'number'
                        }}
                        formControlProps={{
                          fullWidth: true
                        }}
                      >
                      </CustomInput>
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
                </div>
            </Paper>
          </GridItem>
        </GridContainer>
    )
}