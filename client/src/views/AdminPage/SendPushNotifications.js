import React, { useState, useEffect } from "react";
import axios from 'axios'
import gql from 'graphql-tag'

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

const QUERY_ALL_TOKENS = gql`
query all_push_tokens {
    anonymous_users {
      expo_push_token
    }
    users(where: {_and: [{expo_push_token: {_is_null: false}}, {expo_push_token: {_neq: ""}}]}) {
      expo_push_token
    }
  }
`

export default function SendPushNotifications(props) {

    const classes = useStyles();

    const [values, setValues] = React.useState({
        // Event Creation
        title: "",
        subtitle: "",
        dealId: null,
        body: "",
    });

    //Functions
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const sendPushNotification = async () => {

        console.log(props.client)

        const token_list = await props.client.query({
            query: QUERY_ALL_TOKENS,
            variables: {
              eventLimit: values.limit,
              eventOffset: values.eventsLength,
              userId: props.userId,
  
            }
        })
        console.log(token_list)


        // Grab tokens from each table
        const anonymous_tokens = token_list.data.anonymous_users
        const user_tokens = token_list.data.users

        // Concatenate the two tables
        const all_tokens = anonymous_tokens.concat(user_tokens);

        // Turn array of objects into an array of only token values
        const token_array = all_tokens.map(item => {
            return item.expo_push_token
        })

        // console.log(all_tokens)
        console.log(token_array.length);
        token_array.filter((item,index) => {
            return token_array.indexOf(item) === index
        })

        for(let i = 0;i < token_array.length; i += 100) {
            console.log(i);

            const request_config = {
                method: "post",
                url: `/notifications/to_all`,
                params: {
                    title: values.title, 
                    body: values.body,
                    subtitle: values.subtitle,
                    notifData: {
                        dealId: values.dealId
                    },
                    expo_tokens: token_array.slice(i, i + 100)
                },
            };

            await axios(request_config).then((res)=>{
                console.log(res)
            }).catch(error => {
                console.log(error);
            });
        }
        
    };
    


    return (
        <div style={{maxWidth: 600, margin: 'auto', marginBottom: 60}}> 
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
                    label="Subtitle"
                    name="subtitle"
                    placeholder="Tallahassee"
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <h4 style={{marginBottom: 0}}>Deal ID: </h4>
                    <p>Found in link, first number before dash.<br/> ex) "theskedge.com/deals/<strong>123</strong>-10-percent-off-food" </p>
                    <TextField
                    variant="outlined"
                    value={values.dealId}
                    type="number"
                    fullWidth
                    onChange={handleChange('dealId')}
                    id="dealId"
                    label="Deal ID"
                    name="dealId"
                    placeholder="123"
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
                <hr />
                <Grid item xs={12} sm={12}>
                    <h5>Double check everything before sending to ALL USERS!</h5>
                    {/* <Button onClick={sendPushNotification}>Send to all</Button> */}
                </Grid>
            </Grid>           
            
        </div>
    );
  
}
