import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
//Google Analytics
import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';


// import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";

require('dotenv');
var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

// const useStyles = makeStyles(blogPostPageStyle);



export default function EventPage(props) {

    const [page, setPage] = useState()
    // const classes = useStyles();



    const displayView = () => {

        switch(page) {
            case "push_notification": 
                return (
                    <div>
                        <p>push_notification</p>
                    </div>
                );
        }
    }


    return (
        <div style={{minHeight: '90vh'}}>            
            <Header
                brand="Skedge"
                //links={<HeaderLinks dropdownHoverColor="info"/>}
                fixed
                color="primary"//"transparent"
                changeColorOnScroll={{
                height: 100,
                color: "primary"
                }}
            />
            <Button onClick={()=>{setPage("push_notifications")}}>Send Push Notifications</Button>

        </div>
    );
  
}
