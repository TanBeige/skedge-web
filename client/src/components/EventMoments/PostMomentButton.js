import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import axios from 'axios';

//Material-UI
import Fab from '@material-ui/core/Fab';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

//Icons
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

import CropImage from 'components/CropImage/CropImage.js';

import {
    MUTATION_ADD_MOMENT,
    QUERY_EVENT_PAGE_MOMENTS
} from 'EventQueries/EventQueries.js'

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
        maxHeight: '90vh',
        width: '90vw',
        backgroundColor: "white",
        border: '1px solid #000',
        boxShadow: theme.shadows[5],
        borderRadius: 6,
        padding: theme.spacing(2, 3, 2),
    },
  }));


export default function PostMomentButton(props) {

    let isMounted = true;
    // Creating Variables and States
    const [uploadValues, setUploadValues] = useState({
        file: null,
        uploading: false,
        openPreview: false,
    })

    //Modal Styling
    const classes = useStyles();


    //For popover
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    //Input Tag
    let fileInput = React.createRef();
    let imageRef = React.useRef();
    let fileUrl = React.useRef(0);

    const editMoment = () => {
        setUploadValues({...uploadValues, openPreview: true})
        fileInput.current.click();
    }
    const handleImageSelected = e => {
        e.preventDefault();
        let reader = new FileReader();
        let inFile = e.target.files[0];
        console.log(inFile)
        reader.onloadend = () => {
            setUploadValues({
                ...uploadValues,
                file: inFile,
                src: reader.result
            })
        };
        if(inFile){
            reader.readAsDataURL(inFile);
        }
    };

    //Submit to cloudinary
    const submitMoment = async (crop) => {
        //Upload Image to Cloudinary, Delete Old picture Afterwards
        console.log(crop)
        let errorOccurred = false;
        let response = "";
        if(uploadValues.file !== null) {
            setUploadValues({
                ...uploadValues,
                uploading: true
            });
            const form_data = new FormData();

            form_data.append('file', uploadValues.file)

            const request_config = {
                method: "post",
                url: `/moment/upload`,
                data: form_data,
                params: {
                    x: (crop.x/100),
                    y: (crop.y/100),
                    width: (crop.width/100),
                    height: (crop.height/100)
                },
            };
            response = await axios(request_config).then((res)=>{
                //After uploading to cloudinary
                return res;
            }).catch(error => {
                console.log(error);
                errorOccurred = true;
                alert("Could not upload Moment, try again later, or try another picture.")
            });
        }
        if (errorOccurred) {
            return
        }



        //After uploading to cloudinary, update database
        //Submit changes to database
        props.client.mutate({
            mutation: MUTATION_ADD_MOMENT,
            refetchQueries: [{
                query: QUERY_EVENT_PAGE_MOMENTS,
                variables: {
                    eventId: props.eventId,
                }
            }],
            variables: {
                eventId: props.eventId,
                sourceId: response.data.id,
                creatorId: props.userId
            }
        }).then(data => {
            if(isMounted){
                setUploadValues({
                    ...uploadValues,
                    uploading: false,
                    openPreview: false
                })
            }
            console.log("Success!")
        }).catch( error =>{
            console.error(error)
            alert("Could not upload Moment, try again later.")
        });
    }
    


    //In the future, get current location and see if they're at the event
    // and only allow memory uploads if they are + the event is ongoing
    let submitButton = ""
    if(true) {
        submitButton = (
            <Fragment>
                <Fab size='small' color='primary' style={{marginTop: -20, color: 'white'}} onClick={() => editMoment()}>
                    <PhotoCameraIcon />
                </Fab>
                <Modal
                    className={classes.modal}
                    // style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    open={uploadValues.openPreview}
                    onClose={() => setUploadValues({...uploadValues, openPreview: false})}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={uploadValues.openPreview}>
                        <div className={classes.paper}>
                            <h4>Click and Drag to Crop</h4>
                            <CropImage type='moment' src={uploadValues.src} cropSubmit={submitMoment}/>
                            {/* <Button variant='outlined'>Post Moment</Button> */}
                        </div>
                    </Fade>
                </Modal>
            </Fragment>
        )
    }
    else if(false) {
        submitButton = (
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
                    <Typography style={{padding: '5px 10px'}}>Must be at the event to post a Moment.</Typography>
                </Popover>
            </Fragment>
        )
    }

    
    useEffect(()=>{
        isMounted = true;

        return () => {
            isMounted = false;
        }
    }, [])

    return(
        <div className="fileinput" style={{display: 'inline'}} >
            <input type="file" accept="image/*" onChange={handleImageSelected} ref={fileInput} />
            {submitButton}
        </div>
    )
}
