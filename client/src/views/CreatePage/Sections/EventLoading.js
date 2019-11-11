/*  Code Written By: Tan Arin
*
*   Description: 
*     This component is a modal that pops up whenever user Submits an Event
*     to stop user from submitting button multiple times.
*/

import React from 'react'

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

import style from "assets/jss/material-kit-pro-react/modalStyle.js";

const useStyles = makeStyles(style);


export default function EventLoading() {
    const classes = useStyles();

    return (
    <Dialog
        classes={{
          root: classes.modalRoot,
          paper: classes.modal
        }}
        open={true}
        keepMounted
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
        style={{textAlign: 'center'}}
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <h3 className={classes.modalTitle}>Creating Event</h3>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
        >
          <CircularProgress />
        </DialogContent>
      </Dialog>
    )
}