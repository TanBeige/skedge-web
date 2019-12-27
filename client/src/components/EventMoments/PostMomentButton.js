import React, {Fragment, useState} from 'react';
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

//Cropping
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

//Icons
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { useEffect } from 'react';


/*
    //From react-image-crop documents, for Video Support: 
    -----
    Render a custom HTML element in place of an image. Useful if you want to support videos:

    const videoComponent = (
    <video autoPlay loop style={{ display: 'block', maxWidth: '100%' }}>
        <source src="sample.mp4" type="video/mp4" />
    </video>
    );

    <ReactCrop onChange={this.onCropChange} renderComponent={videoComponent} />;
    ----
*/

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
        maxWidth: '90vw',
        backgroundColor: "white",
        border: '1px solid #000',
        boxShadow: theme.shadows[5],
        borderRadius: 5,
        padding: theme.spacing(2, 3, 2),
    },
  }));


export default function PostMomentButton() {
    // Creating Variables and States
    const [uploadValues, setUploadValues] = useState({
        file: null,
        uploading: false,
        openPreview: false,

        src: null,
        crop: {
            unit: '%',
            width: 30,
            aspect: 9 / 16,
        },
        //croppedImageUrl: null,
        //imageRef: null
    })

    const [theCrop, setTheCrop] = useState({
        unit: '%',
        width: 30,
        aspect: 9 / 16,
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

    // For Cropping
    const onImageLoaded = image => {
        imageRef.current = image;
    };
    
    const onCropComplete = crop => {
        makeClientCrop(crop);
    };

    const onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        //setUploadValues({ ...uploadValues, crop });
        setTheCrop(crop);
    };

    const makeClientCrop = async (crop) => {
        if (imageRef.current && crop.width && crop.height) {
          const croppedImageUrl = await getCroppedImg(
            imageRef.current,
            crop,
            'newFile.jpeg'
          );
          setUploadValues({...uploadValues, croppedImageUrl });
        }
    }
    const getCroppedImg = (image, crop, fileName) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
    
        return new Promise((resolve, reject) => {
          canvas.toBlob(blob => {
            if (!blob) {
              //reject(new Error('Canvas is empty'));
              console.error('Canvas is empty');
              return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(fileUrl);
            fileUrl = window.URL.createObjectURL(blob);
            resolve(fileUrl);
          }, 'image/jpeg');
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
                            {/* <img style={{maxWidth: '100%', maxHeight: '100%'}} alt='Moment Preview' src={uploadValues.src} /> */}
                            <h4>Click and Drag to Crop</h4>
                            <ReactCrop
                                src={uploadValues.src}
                                crop={theCrop}
                                ruleOfThirds
                                onImageLoaded={onImageLoaded}
                                onComplete={onCropComplete}
                                onChange={onCropChange}
                            />
                            {/* {uploadValues.croppedImageUrl && (
                                <img alt="Crop" style={{ maxWidth: '100%' }} src={uploadValues.croppedImageUrl} />
                            )} */}
                                <img alt="Crop" style={{ maxWidth: '100%' }} src={uploadValues.croppedImageUrl} />

                            <Button variant='outlined'>Post Moment</Button>
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

    //Submit to cloudinary
    const submitMoment = async () => {
        //Upload Image to Cloudinary, Delete Old picture Afterwards
        let errorOccurred = false;
        let response = "";
        if(uploadValues.file !== null) {
            setUploadValues({
                ...uploadValues,
                uploading: true
            });
            const form_data = new FormData();

            form_data.append('file', uploadValues.file)

            // Upload file to Cloudinary
            response = await axios.post(
                `/profile/upload`, 
                form_data, 
                {
                    params: {
                        //picId: values.picture //send parameters to backend here
                    }
                }
            ).catch((error => {
                alert("Error occurred while uploading picture, try uploading a smaller image size or try again later.")
                errorOccurred = true;
                return;
            })).then(() => {
                console.log("Success!")
                setUploadValues({
                    ...uploadValues,
                    uploading: false
                });
            })
        }
        if (errorOccurred) {
            return
        }
    }
    

    return(
        <div className="fileinput" style={{display: 'inline'}} >
            <input type="file" accept="image/*" onChange={handleImageSelected} ref={fileInput} />
            {submitButton}
        </div>
    )
}
