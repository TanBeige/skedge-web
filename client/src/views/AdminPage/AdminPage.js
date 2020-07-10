import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag'


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
//Google Analytics
import ReactGA from 'react-ga';
import SendPushNotifications from "./SendPushNotifications";
import { useAuth0 } from "../../Authorization/react-auth0-wrapper";


// import blogPostPageStyle from "assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";

require('dotenv');
var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});



const QUERY_ALL_ADMINS = gql`
query get_admins {
    administrators{
        id
        user_id
    }
  }
`


export default function EventPage(props) {

    const { user, isAuthenticated } = useAuth0();
    const [page, setPage] = useState("")

    // const classes = useStyles();

    const checkIfAdmin = async() => {
        const adminList = await props.client.query({query: QUERY_ALL_ADMINS})
        console.log(adminList.data)
        console.log(user.sub)
        const isAdmin = adminList.data.administrators.some(u => (u.user_id === user.sub))
        console.log(isAdmin)

        if(!isAdmin) {
            setPage("notAdmin")
            // props.history.push="/"
        }
        else {
            setPage("")
        }
    }

    useEffect(() => {
        // Get all admin users here:
        // compare to current user
        // Then allow them to enter if they are an admin
        if(isAuthenticated && user){
            checkIfAdmin()
        }
        else {
            setPage("notAdmin")
        }
    }, [user])



    const displayView = () => {
        switch(page) {
            case "notAdmin":
            return (
                <div>
                    <h2>get outta here</h2>
                </div>
            )
            case "push_notifications": 
                return (
                    <div>
                        <SendPushNotifications 
                            client={props.client}
                        />
                    </div>
                );
            default:
                return(
                    <div style={{textAlign: 'center'}}>
                        <Button color='primary' onClick={()=>{setPage("push_notifications")}}>Send Push Notifications</Button>
                    </div>
                )
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
            <div style={{marginTop: '4em'}}>
                {displayView()}
            </div>
        </div>
    );
  
}
