import React, { useState } from "react";
import { Link } from "react-router-dom";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Popover from '@material-ui/core/Popover';
import Popper from '@material-ui/core/Popper';

import CustomButton from "components/CustomButtons/Button.js";
// nodejs library that concatenates classes
import classNames from "classnames";
import PersonIcon from '@material-ui/icons/Person';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
// History
import history from "utils/history";

// core components
import styles from "assets/jss/material-kit-pro-react/components/headerStyle.js";



const useStyles = makeStyles(styles);

export default function InformationPopover() {
  const [anchorElTop, setAnchorElTop] = useState(null);

  const classes = useStyles();


  const goToPage = (page) => {
    history.push(`/${page}`)
  }
return (
    <div>
        <CustomButton size='sm' round onClick={event => setAnchorElTop(anchorElTop ? null : event.currentTarget)} justIcon color="primary">
            <HelpOutlineIcon style={{color: "white"}} className={classes.followIcon} />
        </CustomButton>
        <Popper
            classes={{
                paper: classes.popover
            }}
            open={Boolean(anchorElTop)}
            anchorEl={anchorElTop}
        >
            <div style={{textAlign: 'center'}}>
                <div className={classes.popoverBody} style={{display: 'grid'}}>
                    <CustomButton size='sm' round color="info" onClick={() => {goToPage("about-us")}}>
                        About Us
                    </CustomButton>
                    <CustomButton size='sm' round color="info" onClick={() => {goToPage("privacy")}}>
                        Privacy Policy
                    </CustomButton>
                    <CustomButton size='sm' round color="info" onClick={() => {goToPage("terms-and-conditions")}}>
                        Terms and Conditions
                    </CustomButton>
                </div>
            </div>
        </Popper>  
    </div>
)
        }