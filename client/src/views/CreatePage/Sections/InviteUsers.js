import React from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/styles';


import ListFollowers from 'views/CreatePage/Sections/ListFollowers.js';
import { Checkbox, FormControlLabel } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(2),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      height: '4em'
    },
  }));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    },
  },
});


export default function InviteUsers (props) {
    const classes = useStyles();

    const [guests, setGuests] = React.useState(props.guests);

    const [inviteSettings, setInviteSettings] = React.useState({
      inviteOnly: props.invite_only,
      allowGuestInvites: props.guest_invites,
      inviteApproval: props.host_approval
    })
    
    const selectGuests = (inGuests) => {
      console.log(inGuests)
      setGuests(inGuests);
    };

    const handleChange = name => event => {
      setInviteSettings({ ...inviteSettings, [name]: event.target.checked });
    };


    let dir = props.goingBack ? 'right' : 'left';

    let privacyText = "Your event can be seen and shared by all of your followers.";

    if (inviteSettings.inviteOnly && inviteSettings.allowGuestInvites && inviteSettings.inviteApproval) {
      privacyText = "Your event can only be seen by invited users and guest invites must be approved before sent."
    }
    else if (inviteSettings.inviteOnly && inviteSettings.allowGuestInvites) {
      privacyText = "Your event can only be seen by invited users."
    }
    else if (inviteSettings.allowGuestInvites && inviteSettings.inviteApproval) {
      privacyText = "Your event can be seen by all of your followers."
    }
    else if (inviteSettings.inviteOnly) {
      privacyText = "Your event can only be seen by users you invite."
    }
    else if(inviteSettings.allowGuestInvites){
      privacyText = "Your event can only be seen by invited users."
    }

    return(
        <Slide direction={dir} in mountOnEnter unmountOnExit>
            <Container component="main">
              <ThemeProvider theme={theme}>

                <div className={classes.paper}>
                  <h5 style={{height: '4em'}}>{privacyText}</h5>
                  <div style={{textAlign: 'left'}}>
                    <FormControlLabel 
                      style={{color: "black"}} 
                      control={
                          <Checkbox
                          checked={inviteSettings.inviteOnly}
                          onChange={handleChange("inviteOnly")}
                          color='primary'/>
                      } 
                      label={"Invite Only"} 
                    />
                    <FormControlLabel 
                      style={{color: "black"}} 
                      control={
                          <Checkbox
                          disabled={!inviteSettings.inviteOnly}
                          checked={inviteSettings.allowGuestInvites}
                          onChange={handleChange("allowGuestInvites")}
                          color='primary'/>
                      } 
                      label={"Allow Guests to Invite"} 
                    />
                    <FormControlLabel 
                      style={{color: "black"}} 
                      control={
                          <Checkbox
                          disabled={!inviteSettings.allowGuestInvites}
                          checked={inviteSettings.inviteApproval}
                          onChange={handleChange("inviteApproval")}
                          color='primary'/>
                      } 
                      label={"Invite Must Be Approved"} 
                    />
                  </div>

                  <h4>Send Invite:</h4>
                  <div className='AddCohost' style={{maxHeight: "60vh", overflow: 'hidden', overflowY: 'scroll'}}>
                      <ListFollowers
                        client={props.client}
                        userId={props.userId}
                        selectGuests={selectGuests}
                        guests={guests}
                      />
                  </div>
                </div>
                <div className='centerSubmit'>
                  <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{margin: 3, height: '4em', color: 'white'}}
                  onClick={() => props.handleGuests(guests, inviteSettings)}
                  >
                    Invite Cohosts ->
                  </Button>
                </div>
              </ThemeProvider>
            </Container>
        </Slide>
    )
}