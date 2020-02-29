import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

import EventActivityTable from 'components/Tables/EventActivityTable.js';
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import Button from "components/CustomButtons/Button.js";

import style from "assets/jss/material-kit-pro-react/views/componentsSections/javascriptStyles.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(style);

export default function EventActivity({info}) {

  const [largeModal, setLargeModal] = React.useState(false);
  const classes = useStyles();
  return (
    <div>
      <Button style={{width: '100%'}} simple color="primary" onClick={() => setLargeModal(true)}>
        View event activity
      </Button>
      <Dialog
        classes={{
          root: classes.modalRoot,
          paper: classes.modal
        }}
        open={largeModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setLargeModal(false)}
        aria-labelledby="large-modal-slide-title"
        aria-describedby="large-modal-slide-description"
      >
        <DialogTitle
          id="large-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            simple
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            onClick={() => setLargeModal(false)}
          >
            {" "}
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>Event Activity</h4>
        </DialogTitle>
        <DialogContent
          id="large-modal-slide-description"
          className={classes.modalBody}
        >
          <EventActivityTable 
            impressions={info.impressions}
            views={info.views}
            shares={info.share_amount}
            likes={info.like_amount}
            going={info.going_users.length}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}