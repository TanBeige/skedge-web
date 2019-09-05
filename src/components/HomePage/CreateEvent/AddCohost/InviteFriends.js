import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

import ListFriends from './ListFriends'

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

export default function InviteFriends (props) {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        cohostId: 0
    });
    
    const selectCohost = (id) => {
      setValues({ ...values, cohostId: id });
    };


    let dir = props.goingBack ? 'right' : 'left';

    return(
        <Slide direction={dir} in mountOnEnter unmountOnExit>
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <div className='AddCohost'>
                        <ListFriends
                          client={props.client}
                          userId={props.userId}
                          selectCohost={selectCohost}
                         />
                    </div>
                </div>
                <div className='centerSubmit'>
                  <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  style={{margin: 3, height: '4em'}}
                  onClick={() => props.handleCohost(values.cohostId)}
                  >
                  Choose Event Cover ->
                  </Button>
                </div>
            </Container>
        </Slide>
    )
}