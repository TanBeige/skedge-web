import React, { useState } from "react";
import { Link } from "react-router-dom";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Popover from '@material-ui/core/Popover';
import CustomButton from "components/CustomButtons/Button.js";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import PersonIcon from '@material-ui/icons/Person';
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import Close from "@material-ui/icons/Close";

// Auth0 
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
// History
import history from "utils/history";

// core components
import styles from "assets/jss/material-kit-pro-react/components/headerStyle.js";



const useStyles = makeStyles(styles);

export default function Header(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElTop, setAnchorElTop] = useState(null);

  const { logout } = useAuth0();

  const classes = useStyles();

  const { color, links, brand, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });

  const goToPage = (page) => {
    history.push(`/${page}`)
  }

  return (
    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}>
        <Button className={classes.title}>
          <Link to="/home"><img alt='Skedge' src={require("assets/img/logoheader.png")} height={40} width={40}/></Link>
        </Button>
        <CustomButton round onClick={event => setAnchorElTop(event.currentTarget)} justIcon color="primary">
          <PersonIcon style={{color: "white"}} className={classes.followIcon} />
        </CustomButton>
        <Popover
          classes={{
            paper: classes.popover
          }}
          open={Boolean(anchorElTop)}
          anchorEl={anchorElTop}
          onClose={() => setAnchorElTop(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <div style={{textAlign: 'center'}}>
            <div className={classes.popoverBody} style={{display: 'grid'}}>
              <CustomButton size='sm' round color="info" onClick={() => {goToPage("about-us")}}>
                About Us
              </CustomButton>
              <CustomButton round color="danger" onClick={logout}>
                Logout
              </CustomButton>
            </div>
          </div>
        </Popover>
      </Toolbar>
    </AppBar>
  );
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  links: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};

