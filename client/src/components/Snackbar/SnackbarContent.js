import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Snack from "@material-ui/core/SnackbarContent";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components

import styles from "assets/jss/material-kit-pro-react/components/snackbarContentStyle.js";

const useStyles = makeStyles(styles);

export default function SnackbarContent(props) {
  const { message, color, close, icon } = props;
  const classes = useStyles();
  var action = [];
  const closeAlert = () => {
    setAlert(null);
  };
  console.log("snackbar opened")
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={closeAlert}
      >
        <Close className={classes.close} />
      </IconButton>
    ];
  }
  let snackIcon = null;
  switch (typeof icon) {
    case "object":
      snackIcon = <props.icon className={classes.icon} />;
      break;
    case "string":
      snackIcon = <Icon className={classes.icon}>{props.icon}</Icon>;
      break;
    default:
      snackIcon = null;
      break;
  }
  const [alert, setAlert] = React.useState(
    // <Snackbar
    //   anchorOrigin={{
    //     vertical: 'bottom',
    //     horizontal: 'left',
    //   }}
    //   autoHideDuration={6000}
    //   onClose={closeAlert}
    // >
      <Snack
        message={
          <div>
            {snackIcon}
            {message}
            {close !== undefined ? action : null}
          </div>
        }
        style={{position: 'fixed', bottom: 50, minWidth: '30%', zIndex: 100}}
        classes={{
          root: classes.root + " " + classes[color],
          message: classes.message + " " + classes.container
        }}
      />
    // </Snackbar>
  );
  return alert;
}

SnackbarContent.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger", "primary"]),
  close: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};
