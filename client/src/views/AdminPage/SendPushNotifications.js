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


import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";

require('dotenv');
var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(blogPostPageStyle);

require('./AppStore.css');


export default function SendPushNotifications(props) {

    const [page, setPage] = useState()
    const classes = useStyles();

    sendPushNotification = async () => {
        
        const message = {
            to: this.state.expoPushToken,
            sound: 'default',
            title: 'Original Title',
            body: 'And here is the body!',
            data: { data: 'goes here' },
            _displayInForeground: true,
        };
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    };
    


    return (
        <div>            
            <h2>Sending push notifications to all devices.</h2>
            <h3>
                Title: 
            </h3>
            <h4>Subtitle: </h4>
            <h4>Body: </h4>
        </div>
    );
  
}
