// React Imports
import React, {Fragment, useEffect} from 'react';
import PreviewCard from './PreviewCard.js';

// Material Ui Imports
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';



import { createWeekdayString } from 'components/CommonFunctions.js'

import pricingStyle from "assets/jss/material-kit-pro-react/views/pricingSections/pricingStyle.js";


// Material-UI transition imports
import Slide from '@material-ui/core/Slide'

import _ from 'lodash'

// Cloudinary Setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
    cloud_name: "skedge"
});


// Begin Code !
var moment = require('moment');
const useStyles = makeStyles(pricingStyle);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    },
  },
});


export default function PreviewEvent(props) {
    let dir = props.goingBack ? 'right' : 'left';

  //**************************** Return ******************************
    return (
        <Slide direction={dir} in mountOnEnter unmountOnExit>
            <Container component="main" maxWidth="md" style={{paddingBottom: '1.5em'}}>
                <CssBaseline />
                <PreviewCard 
                    event={props.event} 
                    client={props.client}
                    userId={props.userId}
                    username={props.username}
                />
                <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{color: 'white', marginTop: '1em', height: '4em'}}
                        onClick={props.submitEvent}
                    >
                    Submit Event ->
                    </Button>
            </Container>
        </Slide>
    );
}