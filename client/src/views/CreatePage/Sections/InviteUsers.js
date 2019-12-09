import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

import ListFriends from 'views/CreatePage/Sections/AddCohost/ListFriends.js';
import ListFollowers from 'views/CreatePage/Sections/ListFollowers.js';

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

export default function InviteUsers (props) {
    const classes = useStyles();

    const [guests, setGuests] = React.useState(props.guests);
    
    const selectGuests = (inGuests) => {
      console.log(inGuests)
      setGuests(inGuests);
    };

    let dir = props.goingBack ? 'right' : 'left';

    return(
        <Slide direction={dir} in mountOnEnter unmountOnExit>
            <Container component="main">
                <div className={classes.paper}>
                    <div className='AddCohost'>
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
                  color="secondary"
                  style={{margin: 3, height: '4em'}}
                  onClick={() => props.handleGuests(guests)}
                  >
                   Invite Cohosts ->
                  </Button>
                </div>
            </Container>
        </Slide>
    )
}