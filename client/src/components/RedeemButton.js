import React, { Fragment, useState } from 'react';
import axios from 'axios'
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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'
//Google analytics import
import ReactGA from 'react-ga';

import {
    MUTATION_ADD_ANONYMOUS_MAIL
} from 'EventQueries/EventQueries.js';

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});
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
    const [modalPage, setModalPage] = useState(0);
    const [allowEmails, setAllowEmails] = useState(true);

    const [values, setValues] = React.useState({
        email: ""
    });
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const submitEmail = async () => {

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
                city: props.city,
                state: props.state,
                allow_emails: allowEmails
            }
        }).then((data) => {
            if(allowEmails) {
                // ReactGA.initialize('UA-151937222-1');
                // ReactGA.event({
                //     category: 'Redeem',
                //     action: 'CLICKED_SUBMIT_EMAIL_WITH_PERMISSION'
                // });
            }
            // ReactGA.initialize('UA-151937222-1');
            // ReactGA.event({
            //     category: 'Redeem',
            //     action: 'CLICKED_SUBMIT_EMAIL_WITHOUT_PERMISSION'
            // });
            console.log(data);
            setModalPage(modalPage + 1)
        })


        const picUrl = cloudinary.url(props.picId, {secure: true, height: 900, crop: "scale", fetch_format: "auto", quality: "auto"})

        const request_config = {
            method: "post",
            url: `/email/add_and_send_deal`,
            params: {
                toEmail: values.email,
                saveEmail: allowEmails,
                subject: 'Redeem Your Deal',
                preheader: `${props.deal_name} at ${props.location_name}`,
                deal_name: props.deal_name,
                description: props.description,
          
                phone_number: props.phone_number,
                web_url: props.web_url,
                location_name: props.location_name,
                city: props.city,
                state: props.state,
                street: "",
                cover_url: picUrl
        },
        };

        let response = await axios(request_config).then((res)=>{
            console.log(res)
            // return res;
        }).catch(error => {
            console.log(error);
            // alert("Could not upload Moment, try again later, or try another picture.")
        });

        // API call to store email and send Deal Info
        // const response = await axios.post(
        //     '/email/add_and_send_deal',
        //     {
        //         params: {
        //             subject: 'Skedge Deals',
        //             deal_name: 'FREE Smoothie',
        //             description: '',
              
        //             phone_number: props.phone_number,
        //             web_url: props.web_url,
        //             location_name: '',
        //             city: props.city,
        //             state: props.state,
        //             street: "",
        //             cover_url: "https://res.cloudinary.com/skedge/image/upload/c_fill,f_auto,h_400,q_auto,w_800/v1/deal_covers/bosxof30i4by1dkevtpm"
        //     }}
        //     ).then(() => {
        //         console.log("success");
        //         return;
        //     }).catch(error => {
        //         // alert("error:", error)
        //         console.log(error)

        //         return;
        // });

        // console.log(response)
          
    }

    const onClickCall = () => {
        // ReactGA.initialize('UA-151937222-1');
        // ReactGA.event({
        // category: 'Redeem',
        // action: 'CLICKED_CALL_BUTTON'
        // });
        window.location.href = `tel:${props.phone_number}`
    }
    const onClickLink = () => {
        // ReactGA.initialize('UA-151937222-1');
        // ReactGA.event({
        //     category: 'Redeem',
        //     action: 'CLICKED_WEB_LINK_BUTTON'
        // });
        // window.location.href = props.web_url
        window.open(
            props.web_url,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    const onClickCancel = () => {
        setOpenEmail(false);
    }

    const onClickRedeem = () => {
        // ReactGA.initialize('UA-151937222-1');
        // ReactGA.event({
        //     category: 'Redeem',
        //     action: 'CLICKED_REDEEM_BUTTON'
        // });
        setOpenEmail(true);
    }
    const onClickCloseRedeem = () => {
        // ReactGA.initialize('UA-151937222-1');
        // ReactGA.event({
        //     category: 'Redeem',
        //     action: 'CLICKED_CLOSE_BEFORE_MAIL'
        // });
        setOpenEmail(false);
    }

    const getEmail = (
        <div style={{margin: 4, padding: 12}}>
            
            <div style={{float: 'left', marginTop: 14, marginRight: 16}}>
                <img src={require("assets/img/logoheader.png")} width={65} height={65}/>
            </div>
            <h3 style={{marginBottom: 0,marginTop: 0}}>Enter Your Email</h3>
            <h4 style={{marginBottom: 0, marginTop: 0, fontSize:16}}>The direct link to the deal will be automatically sent to your inbox.</h4>
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
          <div style={{textAlign: 'left', margin: '6px 0'}}>
            <FormControlLabel
                control={
                    <Checkbox checked={allowEmails} onChange={() => setAllowEmails(!allowEmails)} value="allow_emails" color='primary'/>
                }
                  label={<p style={{fontSize: 14}}><strong>Yes!</strong> I want FREE food & drink deals sent to my inbox that others won't see.</p>}
                  labelPlacement="end"
            />
          </div>
          <div style={{marginTop: 8, textAlign: 'center'}} onClick={submitEmail}>
            <Button  round color='primary'>Redeem!</Button>
          </div>
          
        </div>
    )
    const showRedemption = (
        <div style={{margin: 4, padding: 12,  textAlign: 'left'}}>
            <h3 style={{marginTop: 0}}>Sent!</h3>
            <h4 style={{marginTop: 0}}>The email should be in your inbox soon.</h4>
            <div style={{display: 'grid'}}>
                
                {/* <a style={{color: '#02C39A'}} href={`tel:${props.phone_number}`}><Button onClick={onClickCall} color='info'>Call</Button></a></div> : ""
                {
                    props.phone_number && <Button onClick={onClickCall} color='info'>Call</Button>
                }
                {
                    props.web_url && <Button onClick={onClickLink} color='info'>Link to Deal</Button>
                }
                {
                    props.street && <Button onClick={onClickLink} color='info'>Address: <br/>{`${props.street} ${props.city}, ${props.state}`}</Button>
                } */}
                
                <Button onClick={onClickCancel}>Close</Button>
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
            <div>
                <Button round color='primary' onClick={onClickRedeem} size='sm'>Redeem</Button>
            </div>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                // className={classes.modal}
                // style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                open={openEmail}
                onClose={onClickCloseRedeem}
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