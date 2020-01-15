import React, {Fragment, useState} from "react";
import PropTypes from 'prop-types';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';



import UserItem from './UserItem.js'
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
//import Button from "components/CustomButtons/Button.js";
import Button from "@material-ui/core/Button";

import modalStyle from "assets/jss/material-kit-pro-react/modalStyle.js";

const style = theme => ({
  ...modalStyle(theme),
  modalRootExample: {
    "& > div:first-child": {
      display: "none"
    },
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(style);



export default function UserModalList({buttonText, userList, loadMoreFunction, emptyListText, client, nestedLabel}) {
  const [scrollingModal, setScrollingModal] = React.useState(false);
  const classes = useStyles();

  const friendList = () => {
      setScrollingModal(true);
  }

  const listItems = () => {
      if(userList.length === 0) {
          return(<h3>{emptyListText}</h3>)
      }

      return(
          <Fragment>
            <List style={{width: '100%', height: '70vh', overflow:'auto'}}>  
                {
                    userList.map((user, index) => {
                        return(
                            <UserItem 
                                key={index}
                                account={user[nestedLabel]}
                                profileId={user[nestedLabel].id}
                                client={client}
                            />
                        )
                    })
                }
            </List>
          </Fragment>
      )
      
  }

  return (
    <div>
      <Button 
        onClick={friendList} 
        variant='outlined'
        style={{width: '100%'}}
      >
          {buttonText}
      </Button>
      
      <Dialog
        classes={{
          root: `${classes.modalRoot} ${classes.modalRootExample}`,
          paper: classes.modal
        }}
        open={scrollingModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setScrollingModal(false)}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            onClick={() => setScrollingModal(false)}
          >
            {" "}
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>Followers</h4>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
          style={{padding: 5}}
        >
          {listItems()}
        </DialogContent>
        <DialogActions className={classes.modalFooter}>
          <Button onClick={() => setScrollingModal(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

UserModalList.propTypes = {
    buttonText: PropTypes.string.isRequired,
    userList: PropTypes.array.isRequired, 
    loadMoreFunction: PropTypes.func, 
    emptyListText: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired
};