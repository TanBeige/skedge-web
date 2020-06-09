import React, { useState, useEffect } from "react";
import axios from 'axios'

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// Material Ui Imports
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";


import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";

require('dotenv');
var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(blogPostPageStyle);

//Test notification:
// ExponentPushToken[Z-NfkJGdSK8h9M98q2cLfA]

export default function SendPushNotifications(props) {

    const classes = useStyles();

    const [values, setValues] = React.useState({
        // Event Creation
        title: "",
        subtitle: ""
    });

    //Functions
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const sendPushNotification = async () => {

        const request_config = {
            method: "post",
            url: `/notifications/to_all`,
            params: {
                title: "", 
                body: "",
                notifData: ""
            },
        };

        await axios(request_config).then((res)=>{
            console.log(res)
        }).catch(error => {
            console.log(error);
        });
        
        // const message = {
        //     to: "ExponentPushToken[Z-NfkJGdSK8h9M98q2cLfA]",
        //     sound: 'default',
        //     title: 'Title',
        //     body: 'Body',
        //     data: { dealId: 401 },
        //     _displayInForeground: true,
        // };
        // await fetch('https://exp.host/--/api/v2/push/send', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Accept-encoding': 'gzip, deflate',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(message),
        // });
    };
    


    return (
        <div style={{maxWidth: 600, margin: 'auto'}}> 
            <h2>Sending push notifications to all devices.</h2>
            <Grid container spacing={2} >
                <Grid item xs={12} sm={12}>
                    <h3>Title:</h3>
                    <TextField
                    error={values.title.length > 50}
                    name="title"
                    variant="outlined"
                    value={values.title}
                    required
                    fullWidth
                    onChange={handleChange('title')}
                    id="blog_name"
                    label="Notification Title"
                    autoFocus
                    placeholder="New Deals Today!"
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <h4>Subtitle: </h4>
                    <TextField
                    variant="outlined"
                    value={values.subtitle}
                    required
                    fullWidth
                    onChange={handleChange('subtitle')}
                    id="subtitle"
                    label="subtitle"
                    name="subtitle"
                    placeholder="Tallahassee"
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <h4>Body: </h4>
                    <TextField
                    variant="outlined"
                    value={values.street}
                    required
                    fullWidth
                    onChange={handleChange('body')}
                    id="body"
                    label="Body"
                    name="body"
                    placeholder="body"
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Button onClick={sendPushNotification}>Send to all</Button>
                </Grid>
            </Grid>           
            
        </div>
    );
  
}
