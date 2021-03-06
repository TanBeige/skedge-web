import React from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/styles';


import ListCohosts from 'views/CreatePage/Sections/AddCohost/ListCohosts.js'

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

export default function AddCohost (props) {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        cohostId: props.cohosts
    });
    
    const selectCohosts = (cohosts) => {
      setValues({ ...values, cohostId: cohosts });
    };

    let dir = props.goingBack ? 'right' : 'left';

    return(
        <Slide direction={dir} in mountOnEnter unmountOnExit>
          <Container component="main">
            <ThemeProvider theme={theme}>
            <h5 style={{height: '4em', textAlign: 'center'}}>Cohosts can edit an event as well as the invites.</h5>

                <div className={classes.paper}>
                    <div className='AddCohost'>
                        <ListCohosts
                          client={props.client}
                          userId={props.userId}
                          selectCohosts={selectCohosts}
                          cohosts={values.cohostId}
                         />
                    </div>
                </div>
                <div className='centerSubmit'>
                  <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{margin: 3, height: '4em', color: 'white'}}
                  onClick={() => props.handleCohost(values.cohostId)}
                  >
                    Preview Event ->
                  </Button>
                </div>
              </ThemeProvider>
          </Container>
        </Slide>
    )
}