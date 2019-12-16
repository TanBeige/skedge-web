import React, { useEffect, useState } from 'react';

import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import People from "@material-ui/icons/People";
import Add from "@material-ui/icons/Add";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import EditIcon from '@material-ui/icons/Edit';
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import HeaderLinks from "components/Header/HeaderLinks.js";
// import NavPills from "components/NavPills/NavPills.js";
// import Card from "components/Card/Card.js";
// import CardBody from "components/Card/CardBody.js";
// import CardHeader from "components/Card/CardHeader.js";
// import Badge from "components/Badge/Badge.js";
// import Muted from "components/Typography/Muted.js";
// import Parallax from "components/Parallax/Parallax.js";
// import Clearfix from "components/Clearfix/Clearfix.js";
import Button from "components/CustomButtons/Button.js";
import Popover from "@material-ui/core/Popover";
import { useAuth0 } from 'Authorization/react-auth0-wrapper'
import CustomInput from 'components/CustomInput/CustomInput.js';
import LoadImage from 'material-ui-image'
import ImageUpload from 'components/CustomUpload/ImageUpload.js';
import CircularProgress from '@material-ui/core/CircularProgress';



import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";

// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

export default function ProfileTopSection(props) {

  const { logout } = useAuth0();
  let fileInput = React.createRef();


  const useStyles = makeStyles(profilePageStyle);
  const classes = useStyles();
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );


  // Editing Profile Page

  const [vals, setValues] = useState({
    name: "",
    full_name: "",
    biography: "",
    picture: "",
    followingStatus: props.values.followingStatus,

    picFile: null,

    editProfile: false
  })

  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(
    vals.picture
  );
  const [file, setFile] = React.useState(null);


  const handleProfileEdit = () => {
    props.handleProfileEdit(vals)

    setValues({
      ...vals,
      editProfile: false,
    })
  }

  const changeName = (event) => {
    setValues({
      ...vals,
      full_name: event.target.value
    })
  }

  const changeBio = (event) => {
    setValues({
      ...vals,
      biography: event.target.value
    })
  }

  useEffect(() => {
    const profilePic = cloudinary.url(props.values.picture, {secure: true, width: 200, height: 200, crop: "fill"})
    setValues({
      ...vals,
      name: props.values.name,
      full_name: props.values.full_name,
      biography: props.values.biography ? props.values.biography : "" ,
      picture: profilePic,
    });
    setImagePreviewUrl(profilePic);
  }, [props.values]);

  const editProfilePage = () => {
    setValues({
      ...vals,
      editProfile: !vals.editProfile,
      full_name: props.values.full_name,
      biography: props.values.biography ? props.values.biography : "" ,
      picture: props.values.picture,
    })
  }

  //Follow/Following Button
  const followButton = () => {
    console.log("following status: ", props.values.followingStatus)
    if (props.values.currentUserProfile) {
      return null;
    }
    else if(props.values.followingStatus === 1) {
      //Unfollow
      return (
        <Button onClick={handleFollowing} size='sm' color='white' style={{marginTop: 10, color: 'black'}}>
          Following
        </Button>
      )
    }
    if(props.values.followingStatus === 0) {
      //Remove Follow Request
      return (
        <Button onClick={handleFollowing} size='sm' style={{marginTop: 10}}>
          Requested...
        </Button>
      )
    }
    else {
      //No Request Sent, Send Follow Request
      return (
        <Button onClick={handleFollowing} size='sm' color='info' style={{marginTop: 10}}>
          Follow
        </Button>
      )
    }
  }
  const handleFollowing = () => {
    //If not Following or not requesting to follow, Request Follow
    if(vals.followingStatus === -1) {
      props.followInvite();

      const followStatus = props.isEntity ? 1 : 0
      setValues({
        ...vals,
        followingStatus: followStatus
      });
    }
    //If Already Requested to Follow, Remove Follow Request
    else if(vals.followingStatus === 0) {
      props.followRemove();
      setValues({
        ...vals,
        followingStatus: -1
      })
    }
    // If Following Already, Remove Follow
    else if(vals.followingStatus === 1) {
      props.followRemove();
      setValues({
        ...vals,
        followingStatus: -1
      })
    }
  }

  //For editing Profile
  const displayName = vals.editProfile ? 
  (
    <CustomInput 
      id="regular"
      labelText="Name"
      inputProps={{
        value:  vals.full_name,
      }}
      formControlProps={{
        onChange: changeName
      }}
    />
  ) : vals.full_name
  const displayBio = vals.editProfile ?
  (
    <CustomInput 
      id="regular"
      labelText="Bio"
      inputProps={{
        value:  vals.biography
      }}
      formControlProps={{
        fullWidth: true,
        onChange: changeBio
      }}
    />
  ) : <p>{vals.biography}</p>

  //Editing Profile Picture
  const profilePicSection = () => {
    if(props.imageUploading) {
      return (
        <div>
          <img src={vals.picture} alt="..." className={imageClasses} style={{opacity: '0.5'}}/>
          <CircularProgress style={{position: 'absolute', left: '50%', marginLeft: '-20px', top: 50}}/>
          {/* <LoadImage src={vals.picture} alt={vals.name} className={imageClasses} /> */}
          {updateProfileButton}
        </div>
      )
    }
    else if(vals.editProfile) {
      return (
        <div>
          <div className="fileinput" style={{display: 'inline'}} onClick={() => editProfilePic()}>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInput} />
            <img src={imagePreviewUrl}  alt="..." className={imageClasses} style={{opacity: '0.5', objectFit: 'cover'}}/>
            <AddAPhotoIcon style={{position: 'absolute', left: '50%', marginLeft: '-12px', top: 105}}/>
          </div>
          {updateProfileButton}
        </div>
      )
    }
    else {
      return (
        <div>
          <img src={vals.picture} alt="..." className={imageClasses} />
          {/* <LoadImage src={vals.picture} alt={vals.name} className={imageClasses} /> */}
          {updateProfileButton}
        </div>
      )
    }
  }
  const editProfilePic = () => {
    fileInput.current.click();
  }
  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let inFile = e.target.files[0];
    reader.onloadend = () => {
      setValues({
        ...vals,
        picFile: inFile
      });
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(inFile);
  };

  const saveUpdateButton = vals.editProfile ? (<Button color="primary" onClick={handleProfileEdit}>Save</Button>) : "";

  const updateProfileButton = props.values.currentUserProfile ? (
    <Button 
      style={{position: 'absolute', top: 70, margin: 20, zIndex: 10}} 
      justIcon 
      round 
      size='sm'
      color='info'
      onClick={() => setValues({...vals, editProfile: !vals.editProfile})}
    >
      <EditIcon />
    </Button> 
  ) : ""
  
//------------------ START RENDERING PAGE ---------------------

// If user is NOT editing their profile
    return (
      <div>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.profile}>

              {profilePicSection()}

              <div className={classes.name}>
                <h3 className={classes.title} style={{margin: 0}}>
                  {/* <CheckCircleOutlineIcon style={{textAlign: 'center', verticalAlign: 'middle'}} />
                  <br /> */}
                  {displayName}
                </h3>
                <h4 style={{margin: 0}}>
                  @{vals.name}
                </h4>
                {/*<h6>DESIGNER</h6> add this in for entities*/}
              </div>
            </div>
          </GridItem>
        </GridContainer>
        <div className={classNames(classes.description, classes.textCenter)} style={{marginTop: 5}}>
          {displayBio}
          {saveUpdateButton}
          {followButton()}
        </div>
      </div>
      )
  }
// // If user IS editing their profile
//   else {
//     return (
//       <div style={{textAlign: 'center'}}>
//         <GridContainer justify="center">
//           <GridItem xs={12} sm={12} md={6}>
//             <div className={classes.profile}>
//               <div>
//                 <img src={vals.picture} alt="..." className={imageClasses} />
//               </div>
//               <div className={classes.name}>
//                 <h3>
//                   {/* <CheckCircleOutlineIcon style={{textAlign: 'center', verticalAlign: 'middle'}} /> */}
//                   <br />
//                   <CustomInput 
//                     id="regular"
//                     labelText="Name"
//                     inputProps={{
//                       value:  vals.full_name,
//                     }}
//                     formControlProps={{
//                       onChange: changeName
//                     }}
//                   />
//                 </h3>
//                 <h4 style={{margin: 0}}>
//                   @{vals.name}
//                 </h4>
//                 {/*<h6>DESIGNER</h6> add this in for entities*/}
//               </div>
//             </div>
//           </GridItem>
//         </GridContainer>
//         <div className={classNames(classes.description, classes.textCenter)}>
//           <CustomInput 
//             id="regular"
//             labelText="Bio"
//             inputProps={{
//               value:  vals.biography
//             }}
//             formControlProps={{
//               fullWidth: true,
//               onChange: changeBio
//             }}
//           />
//         </div>
//         <Button color="primary" onClick={handleProfileEdit}>
//           Save
//         </Button>
//       </div>
//     )
//   }

// }
