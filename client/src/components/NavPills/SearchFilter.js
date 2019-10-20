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
import Collapse from '@material-ui/core/Collapse';

// @material-ui/icons
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from 'components/CustomInput/CustomInput.js';


import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

// Constants
import { categoryList } from "utils/constants";



const useStyles = makeStyles(sectionPillsStyle);


export default function SearchFilter(props) {
  const classes = useStyles();
      // 0 is local, 1 is private
  const [values, setValues] = useState({
    type: "local",
    category: "Any",
    searchText: "", //Search Text can look for Event Names, Tags, or Event Creators!
    city: "",
    state: "",
    limit: 10,

    expanded: false
  })

  // Handle Event Type Button Press
  const changeToLocal = () => {
    setValues({
      ...values,
      type: "local",
      city: "",
      state: ""
    });
  }
  const changeToPrivate = () => {
    setValues({
      ...values,
      type: "private",
    });
  }

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

  useEffect(() => {
      props.handleFilters(values)
  },[values])

    return(
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
    )
}