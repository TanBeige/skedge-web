import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'components/CustomButtons/Button.js';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core/styles";

import Stories from 'react-insta-stories';
import Fab from '@material-ui/core/Fab';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

//Icons
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NavigationIcon from '@material-ui/icons/Navigation';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

import LoadImage from 'material-ui-image';
import MomentPopover from './MomentPopover';
import PostMomentButton from './PostMomentButton.js'

import {
    QUERY_EVENT_PAGE_MOMENTS
} from 'EventQueries/EventQueries.js';


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

// Fade in for Modal
const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          onEnter();
        }
      },
      onRest: () => {
        if (!open && onExited) {
          onExited();
        }
      },
    });
  
    return (
      <animated.div ref={ref} style={style} {...other}>
        {children}
      </animated.div>
    );
});
  
Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

// Modal Styling
const useStyles = makeStyles(theme => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: "white",
      border: '1px solid #000',
      boxShadow: theme.shadows[5],
      borderRadius: 5,
      padding: theme.spacing(2, 3, 2),
    },
  }));

// --------------------Actualy Component!!!---------------

export default function EventMoments(props) {

    const [openMoments, setOpenMoments] = useState(false)
    const [values, setValues] = useState({
        randomColor: getRandomColor(),
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

    //Modal Styling
    const classes = useStyles();

    // Get a random color so we can display if there are no moments posted
    // let randomColor = getRandomColor();


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
                        url: `https://picsum.photos/1080/1920`,
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
                <PhotoCameraIcon />
            </Fab>
        )
    }
    else if(false) {
        submitMoment = (
            <Fragment>
                <Fab size='small' color='primary' onClick={handleClick} style={{marginTop: -20, color: 'white'}}>
                    <PhotoCameraIcon />
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
        //momentCover = "https://picsum.photos/1080/1920"
    }

    let displayMoments = (
        <div style={{textAlign: 'center'}}>
            <h5>There are currently no Moments for this event.</h5>
            <h3 style={{margin: '0px 0px 20px 0px'}}>Add First Moment?</h3>
            <Fab size='small' color='primary' style={{marginTop: -20, color: 'white'}}>
                <PhotoCameraIcon />
            </Fab>
            <hr />
            <p>
                Moments are photos users share while at the event.
                Use it to store all the good times you had with your friends and show everyone else what's going on!
            </p>
        </div>
        );
    if(values.moments.length > 0) {
        displayMoments = (
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
                <GridContainer spacing={3} justify="center">
                    <GridItem xs={10}>
                        <div onClick={() => setOpenMoments(true)} style={{overflow: 'hidden', borderRadius: 8, border: '2px solid #02C39A',  width: '100%', height: 64, display: 'flex', justifyContent: 'center'}}>
                            <img style={{objectFit: 'cover', width: '100%', backgroundColor: values.randomColor}} src={momentCover}/>
                        </div>
                        <Modal
                            aria-labelledby="spring-modal-title"
                            aria-describedby="spring-modal-description"
                            className={classes.modal}
                            // style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                            open={openMoments}
                            onClose={() => setOpenMoments(false)}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                            timeout: 500,
                            }}
                        >
                            <Fade in={openMoments}>
                                <div className={classes.paper}>
                                    {displayMoments}
                                </div>
                            </Fade>
                        </Modal>
                    </GridItem>
                </GridContainer>

                <PostMomentButton client={props.client}/>
            </div>
        </ThemeProvider>
    )
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }