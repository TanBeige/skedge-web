/*eslint-disable*/
import React, { useState, useEffect } from "react";
import SwipeableViews from 'react-swipeable-views';

import FormControl from "@material-ui/core/FormControl";
import CustomInput from 'components/CustomInput/CustomInput.js';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";




// import NotificationList from './Sections/NotificationList.js';
// import FriendRequestsList from './Sections/FriendRequestsList.js';

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import UserSearchList from 'components/UserSearch/UserSearchList.js';
import useDebounce from 'components/Debounce/Debounce.js';



// @material-ui/icons
import SearchIcon from '@material-ui/icons/Search';


// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { ThemeProvider } from '@material-ui/styles';

import shoppingCartStyle from "assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";

const useStyles = makeStyles(shoppingCartStyle);
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    }
  },
});

// import './Sections/NotificationStyle.css';

export default function SearchPage(props) {

  const [searchText, setSearchText] = useState("")
  const [searchSubmit, setSearchSubmit] = useState("")

  
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   document.body.scrollTop = 0;
  // });
  const classes = useStyles();

  const debouncedSearchTerm = useDebounce(searchText, 300);


  useEffect(() => {
    if(debouncedSearchTerm) {
      setSearchSubmit(searchText)
    }
  },[debouncedSearchTerm])

  return (
    <ThemeProvider theme={theme}>
      <div style={{paddingTop: '7vh', paddingBottom: '5vh', minHeight: '100vh'}}>
        <Header
          brand="Skedge"
          links={<HeaderLinks dropdownHoverColor="info"/>}
          fixed
          color="primary"//"transparent"
          changeColorOnScroll={{
            height: 100,
            color: "primary"
          }}
        />

        {/* <div className={classNames(classes.main, classes.mainRaised)}> */}
          <div className={classes.container}>
            <Card plain>
              <CardBody plain>
                {/* <h3 className={classes.cardTitle}>Notifications</h3> */}
                <GridContainer justify='center'>
                {/* autoComplete={false}
                      variant='outlined'
                      
                      inputProps={{
                        variant: 'outlined',
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        autoComplete: 'off',
                        onChange: (e) => {setSearchText(e.target.value)},
                        onKeyPress: (e) => {
                          console.log(`Pressed keyCode ${e.key}`);
                          if (e.key === 'Enter') {
                            // Do code here
                            e.preventDefault();
                            setSearchSubmit(searchText);
                          }
                        } */}
                  <GridItem xs={12} md={6}>
                  <FormControl fullWidth className={classes.selectFormControl} style={{marginBottom: 0}}>            
                      <TextField
                        className={classes.margin}
                        label="Search Users"
                        variant="outlined"
                        onChange={(e) => {setSearchText(e.target.value)}}

                        InputProps={{
                          autoComplete: 'off',
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                          //onChange: (e) => {console.log(e.target.value);setSearchText(e.target.value)},
                          onKeyPress: (e) => {
                            if (e.key === 'Enter') {
                              // Do code here
                              e.preventDefault();
                              setSearchSubmit(searchText);
                            }
                          }
                        }}
                      />
                    </FormControl> 
                    </GridItem>
                </GridContainer>
                <UserSearchList 
                  client={props.client}
                  searchText={searchSubmit}
                />
              </CardBody>
            </Card>
          </div>
        {/* </div> */}
      </div>
    </ThemeProvider>
  );
}
