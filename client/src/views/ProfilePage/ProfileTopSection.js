import React, { useEffect, useState } from 'react';

import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
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



import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";


export default function ProfileTopSection(props) {

  const { logout } = useAuth0();

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
      picture: props.values.picture,

      editProfile: false
    })

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
      setValues({
        ...vals,
        name: props.values.name,
        full_name: props.values.full_name,
        biography: props.values.biography ? props.values.biography : "" ,
        picture: props.values.picture,
      })
    }, [props.values])

    const editProfilePage = () => {
      setValues({
        ...vals,
        editProfile: !vals.editProfile,
        full_name: props.values.full_name,
        biography: props.values.biography ? props.values.biography : "" ,
        picture: props.values.picture,
      })
    }

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

  
//------------------ START RENDERING PAGE ---------------------

// If user is NOT editing their profile
    return (
      <div>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.profile}>
              <div>
                <img src={vals.picture} alt="..." className={imageClasses} />
                {/* <LoadImage src={vals.picture} alt={vals.name} className={imageClasses} /> */}
              </div>
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
        <div className={classNames(classes.description, classes.textCenter)}>
          <p>
            {vals.biography}
          </p>
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
