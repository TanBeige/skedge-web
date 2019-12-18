/*!

=========================================================
* Material Kit PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import List from '@material-ui/core/List';

import ProfileFriendItem from './ProfileFriendItem.js'
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
//import Button from "components/CustomButtons/Button.js";
import Button from "@material-ui/core/Button";
import {
    QUERY_ACCEPTED_FRIENDS
} from 'EventQueries/EventQueries.js'

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

export default function ProfileFollowerList(props) {
  const [scrollingModal, setScrollingModal] = React.useState(false);
  const classes = useStyles();

  const [friendData, setFriendData] = useState([]);

  const friendList = () => {
      setScrollingModal(true)
      props.client.query({
          query: QUERY_ACCEPTED_FRIENDS,
          variables: {
              userId: props.profileId
          }
      }).then((data) => {
        setFriendData(data.data.follower);
      })
  }

  const followerText = props.followerCount !== 1 ? `${props.followerCount} Followers` : `${props.followerCount} Follower`

  return (
    <div>
      <Button 
        onClick={friendList} 
        // simple
        style={{width: '7em', marginRight: 5}}
      >
          {followerText}
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
            <List style={{width: '100%'}}>  
            {
                friendData.map((friend, index) => {
                  console.log(friend)
                    return(
                        <ProfileFriendItem 
                            key={index}
                            index={index}
                            friend={friend.user}
                            profileId={friend.user.auth0_id}
                            userId={props.userId}
                            client={props.client}
                        />
                    )
                })
            }
            </List>
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