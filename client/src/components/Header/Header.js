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

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'

// core components
import styles from "assets/jss/material-kit-pro-react/components/headerStyle.js";



const useStyles = makeStyles(styles);

export default function Header(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElTop, setAnchorElTop] = useState(null);

  const { logout } = useAuth0();

  const classes = useStyles();
  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;

    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  };
  const { color, links, brand, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });
  return (
    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}>
        <Button className={classes.title}>
          <Link to="/home"><img alt='Skedge' src={require("assets/img/logoheader.png")} height={40} width={40}/></Link>
        </Button>
        <CustomButton round justIcon color="primary">
          <PersonIcon style={{color: "white"}} onClick={event => setAnchorElTop(event.currentTarget)} className={classes.followIcon} />
        </CustomButton>
        <Popover
          classes={{
            paper: classes.popover
          }}
          open={Boolean(anchorElTop)}
          anchorEl={anchorElTop}
          onClose={() => setAnchorElTop(null)}
          anchorOrigin={{
            vertical: "center",
            horizontal: "left"
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "right"
          }}
        >
          <div style={{textAlign: 'center'}}>
            <div className={classes.popoverBody}>
              <CustomButton round color="info" onClick={logout}>
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

