import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '90%',
    maxWidth: 450,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4)
  },
  signupButton: {
    display: 'inline-block',
    width: '8em',
    marginBottom: '5px'
  },
  loginButton: {
      fontSize: 12
  }
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  let modalType = ""
  if (props.type === 'signup') {
    return (<div>
                <Button color='secondary' variant='contained' className={classes.signupButton} onClick={handleOpen} /*onClick={this.props.auth.login}*/>Sign Up</Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={open}
                    onClose={handleClose}
                >
                    <div style={modalStyle} className={classes.paper}>
                        <SignupForm {...props}/>
                    </div>
                </Modal>
            </div> 
        )
  }
  else if(props.type === 'login') {
    return(
        <div>
            <Button color='secondary' size='small' variant='outlined' className={classes.loginButton} onClick={handleOpen} /*onClick={this.props.auth.login}*/>Login</Button> 
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    <LoginForm {...props}/>
                </div>
            </Modal>
        </div>  
                )
  }

}