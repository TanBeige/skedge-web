/*eslint-disable*/
import React, {useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";


import errorPageStyle from "assets/jss/material-kit-pro-react/views/errorPageStyles.js";

import image from "assets/img/bg.jpg";
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'


const useStyles = makeStyles(errorPageStyle);

export default function NotSignedIn({ ...rest }) {
    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    });
    const classes = useStyles();

    const { loading, user, isAuthenticated, loginWithRedirect} = useAuth0();



    const handleLogin = () => {
        //Google Analytics Record when someone Clicks this
        ReactGA.initialize('UA-151937222-1');
        ReactGA.event({
        category: 'User',
        action: 'Login/Sign Up: Deal Page'
        });
        //Then Login/Sign up
        loginWithRedirect({});
        // loginWithPopup({});
    }

    useEffect(() => {

        // if(!isAuthenticated) {
        //   console.log("pathname prviate", path)
        //   localStorage.setItem('originPath', window.location.pathname);
        // }
    
        // const fn = async () => {
        //   await loginWithRedirect();
        // };
        
        // fn();
    }, [loading, isAuthenticated]);



return (
    <div>
        <div
            className={classes.pageHeader}
            style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
            }}
        >
            {/* <div className={classes.container}> */}
            <div className={classes.contentCenter}>
            <GridContainer>
                <GridItem md={12}>
                {/* <h1 style={{fontWeight: 'bolder'}}>404</h1> */}
                <h2 className={classes.subTitle}>Redirecting...</h2>
                <h4 className={classes.description}>
                    If you have logged in and have been on this page too long, then try signing in on a different browser.
                </h4>
                <h4 className={classes.description}>
                    Otherwise If you have not logged in...
                    <br />
                    <Button
                        color="primary"
                        // style={{color: 'black'}}
                        onClick={handleLogin}
                    >
                        Login or Sign Up
                    </Button>
                </h4>
                </GridItem>
            </GridContainer>
            </div>
            {/* </div> */}
        </div>
    </div>
);
}
