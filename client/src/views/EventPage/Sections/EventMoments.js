import React, {useEffect, useState} from 'react';
import Button from 'components/CustomButtons/Button.js';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core/styles";

import Stories from 'react-insta-stories';
import Fab from '@material-ui/core/Fab';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';


import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

//Icons
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NavigationIcon from '@material-ui/icons/Navigation';



import LoadImage from 'material-ui-image'

import {
    QUERY_EVENT_PAGE_MOMENTS
} from 'EventQueries/EventQueries.js';
import { Fragment } from 'react';
import { array } from 'prop-types';


//Theme of app
const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#02C39A"
      }
    },
  });

// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

export default function EventMoments(props) {

    const [openMoments, setOpenMoments] = useState(false)
    const [values, setValues] = useState({
        moments: [],
        //image_url: cloudinary.url("", {secure: true, width: 1080, height: 1920 ,fetch_format: "auto"})
    })

    //For popover
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);


    const getMoments = () => {
        props.client.query({
            query: QUERY_EVENT_PAGE_MOMENTS,
            variables: {
                eventId: props.eventId,
                limit: 10,
                offset: 0
            }
        }).then((data) => {
            let momentsList = []; 

            // data.data.events[0].moments.forEach((moment) => {
            //     let tempMoment = {
            //         url: moment.source,
            //         header: {
            //             heading: "name",
            //             subheading: 'Posted 5 hours ago',
            //             profileImage: 'aass'
            //         }
            //     };

            //     momentsList.push(tempMoment);
            // });

            setValues({
                ...values,
                // moments: momentsList
                moments: [
                    {
                        url: 'https://picsum.photos/1080/1920',
                        // seeMore: ({ close }) => (
                        //     <div style={{ width: '100%', height: '100%' }}>Hello</div>
                        // ),
                        header: {
                            heading: 'Mohit Karekar',
                            subheading: 'Posted 5h ago',
                            profileImage: 'https://picsum.photos/1000/1000'
                        }
                    }
                ]
            })
        })
    }

    useEffect(() => {
        getMoments();
    },[])

    //In the future, get current location and see if they're at the event
    // and only allow memory uploads if they are + the event is ongoing
    let submitMoment = ""
    if(true) {
        submitMoment = (
            <Fab size='small' color='primary' style={{marginTop: -20, color: 'white'}}>
                <AddIcon />
            </Fab>
        )
    }
    else if(false) {
        submitMoment = (
            <Fragment>
                <Fab size='small' color='primary' onClick={handleClick} style={{marginTop: -20, color: 'white'}}>
                    <AddIcon />
                </Fab>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Typography style={{padding: '5px 10px'}}>Must be at the event to post.</Typography>
                </Popover>
            </Fragment>

        )
    }

    let momentCover = "";
    if(values.moments[0]) {
        momentCover = values.moments[0].url;
    }
    else {
        momentCover = props.cover
        //momentCover = 'grey';
    }

    if(openMoments && values.moments.length > 0) {
        return(
            <div>
                <Stories
                    stories={values.moments}
                    defaultInterval={2000}
                    width={'100%'}
                    height={'70vh'}
                    onAllStoriesEnd={() => setOpenMoments(false)}
                />
            </div>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <div style={{margin: 'auto', textAlign: 'center'}}>
                <h4 style={{}}>Event Moments</h4>
                <GridContainer spacing={3} justify="center">
                    <GridItem xs={10}>
                        <div onClick={() => setOpenMoments(true)} style={{overflow: 'hidden', borderRadius: 8, border: '2px solid #02C39A',  width: '100%', height: 64, display: 'flex', justifyContent: 'center'}}>
                            <img style={{objectFit: 'cover', width: '100%'}} color='white' src={momentCover}/>
                        </div>
                    </GridItem>
                </GridContainer>
                {submitMoment}
            </div>
        </ThemeProvider>
    )
}