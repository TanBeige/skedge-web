import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    //backgroundColor: theme.palette.secondary.dark,
  },
  container: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    display: 'flex',
  },
  text: {
    fontFamily: 'Roboto Condensed',
  }
}));

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  },
  {
    code: 'fr-FR',
    name: 'Français',
  },
];

export default function AppFooter() {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={1} direction={'row'}>
          <Grid container>
            <Grid item xs={4} sm={3}>
              <Link href="/premium-themes/onepirate/terms/" className={classes.text}>Terms<br/></Link>
              <Link href="/premium-themes/onepirate/privacy/" className={classes.text}>Privacy</Link>
            </Grid>
            <Grid item xs={4} sm={3}>
                <p className={classes.text}>© 2019 <br/>Skedge</p>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
