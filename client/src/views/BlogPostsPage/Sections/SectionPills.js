import React, { useState } from "react";
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
import FormatAlignLeft from "@material-ui/icons/FormatAlignLeft";
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ApartmentIcon from '@material-ui/icons/Apartment';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import EventCardList from "components/EventCards/EventCardList.js";
import CustomInput from 'components/CustomInput/CustomInput.js';


import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";




// Constants
import { categoryList } from "utils/constants";



const useStyles = makeStyles(sectionPillsStyle);



export default function SectionPills(props) {
  const classes = useStyles();
  console.log("SectionPills New Load")

  // 0 is local, 1 is exclusive
  const [values, setValues] = useState({
    type: "local",
    category: "Any",
    searchText: "", //Search Text can look for Event Names, Tags, or Event Creators!
    city: "Tallahassee",
    state: "Florida",

    expanded: false
  })

  // Handle Event Type Button Press
  const changeToLocal = () => {
    setValues({
      ...values,
      type: "local"
    });
  }
  const changeToExclusive = () => {
    setValues({
      ...values,
      type: "exclusive",
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
      console.log("GOOOOO")
      setValues({
        ...values,
        [name]: event.target.value,
      });
  };



  // Change Selected Buttons
  let localBtn;
  let exclusiveBtn;
  if (values.type === "local") {
      localBtn = true;
      exclusiveBtn = false;
  }
  else if (values.type === "exclusive") {
      localBtn = false;
      exclusiveBtn = true;
  }

  const filter = {
    searchText: values.searchText, //Search Text can look for Event Names, Tags, or Event Creators!
    type: values.type,
    category: values.category,
    city: values.city,
    state: values.state,
    limit: 20   // This is how many events will show up in the eventList
  };

  //  style={{paddingTop: 25}}
  // Add above^^^ to <div className={classes.section} > if I am not using parallax
  return (
    <div className={classes.section} style={{paddingTop: 25}}>
      <GridContainer justify="center">
        <GridItem xs={12} className={classes.textCenter}>
            <div>
                <Button onClick={changeToLocal} simple={!localBtn} color="primary"><ApartmentIcon/>Local</Button>
                <Button onClick={changeToExclusive} simple={!exclusiveBtn} color="primary"><EmojiPeopleIcon/>Exclusive</Button>
            </div>
        </GridItem>
        <GridItem xs={12}>

        <br />

        <Paper elevation={10} style={{paddingLeft:20, paddingRight: 20}} color="primary">
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
                      defaultValue: "Tallahassee"
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
                    defaultValue: "Florida"
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

      <EventCardList 
        client={props.client}
        filter={filter}
      /> 
    </div>
  );
}
