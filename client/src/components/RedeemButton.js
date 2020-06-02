import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'components/CustomButtons/Button.js';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import Stories from 'react-insta-stories';
import Fab from '@material-ui/core/Fab';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
//Google analytics import
import ReactGA from 'react-ga';

import {
    MUTATION_ADD_ANONYMOUS_MAIL
} from 'EventQueries/EventQueries.js';

// Fade in for Modal
const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          onEnter();
        }
      },
      onRest: () => {
        if (!open && onExited) {
          onExited();
        }
      },
    });
  
    return (
      <animated.div ref={ref} style={style} {...other}>
        {children}
      </animated.div>
    );
});
  
Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

export default function RedeemButton (props) {

    const { user, loginWithRedirect, isAuthenticated} = useAuth0();
    const [openEmail, setOpenEmail] = useState(false);
    const [emailError, setEmailError] = useState(false)
    const [modalPage, setModalPage] = useState(0)
    const [values, setValues] = React.useState({
        email: ""
    });
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const submitEmail = () => {

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if ( re.test(values.email) ) {
            // this is a valid email address
            // call setState({email: email}) to update the email
            // or update the data in redux store.
            setEmailError(false);
        }
        else {
            // invalid email, maybe show an error to the user.
            setEmailError(true);
            return;
        }
        props.client.mutate({
            mutation: MUTATION_ADD_ANONYMOUS_MAIL,
            variables: {
                email: values.email,
            }
        }).then((data) => {
            console.log(data);
            setModalPage(modalPage + 1)
        })
    }

    const onClickCall = () => {
        ReactGA.initialize('UA-151937222-1');
        ReactGA.event({
        category: 'Redeem',
        action: 'Login/Sign Up: Deal Page'
        });
        window.location.href = `tel:${props.phone_number}`
    }
    const onClickLink = () => {
        ReactGA.initialize('UA-151937222-1');
        ReactGA.event({
            category: 'Redeem',
            action: 'Login/Sign Up: Deal Page'
        });
        // window.location.href = props.web_url
        window.open(
            props.web_url,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    const getEmail = (
        <div style={{margin: 4, padding: 12,  textAlign: 'center'}}>
            <h4 style={{marginBottom: 0}}>Enter your email to redeem deal.</h4>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              required
              fullWidth
            //   className={classes.textField}
              value={values.email}
              onChange={handleChange('email')}
              margin="normal"
          >
          </TextField>
            {
                emailError && <h4 style={{color: 'red'}}>* Please input a valid email</h4>
            }
          <div style={{marginTop: 8}} onClick={submitEmail}>
            <Button  round color='primary'>Redeem!</Button>
          </div>
          
        </div>
    )
    const showRedemption = (
        <div style={{margin: 4, padding: 12,  textAlign: 'center'}}>
            <h3 style={{marginTop: 0}}>Here you go!</h3>
            <div style={{display: 'grid'}}>
                
                {/* <a style={{color: '#02C39A'}} href={`tel:${props.phone_number}`}><Button onClick={onClickCall} color='info'>Call</Button></a></div> : "" */}
                {
                    props.phone_number && <Button onClick={onClickCall} color='info'>Call</Button>
                }
                {
                    props.web_url && <Button onClick={onClickLink} color='info'>Link to Deal</Button>
                }
                
                <Button onClick={() => {setOpenEmail(false)}} >Cancel</Button>
            </div>
        </div>
    )
    const currentPage = () => {
        switch(modalPage) {
            case 0: 
                return getEmail
            case 1: 
                return showRedemption
        }
    }
    const redeem = (
        <Fragment>
            <div onClick={() => setOpenEmail(true)}>
                <Button round color='primary' style={{padding: '10px 15px'}}>Redeem</Button>
            </div>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                // className={classes.modal}
                // style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                open={openEmail}
                onClose={() => setOpenEmail(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openEmail}>
                    <div style={{margin: 8}}>
                        <div style={{maxWidth: 500, backgroundColor: 'white',  margin: 'auto', borderRadius: 4, marginTop: window.innerHeight/4,}}>
                            {currentPage()}
                        </div>
                    </div>
                </Fade>
            </Modal>
        </Fragment>
    )
    return (
        <div>
            {redeem}
        </div>
    )
}