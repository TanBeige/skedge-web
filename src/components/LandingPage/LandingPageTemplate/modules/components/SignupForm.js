import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import MenuItem from '@material-ui/core/MenuItem';
import _ from 'lodash'

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
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  DOB: {
      //display: 'inline-block',
  }
}));

// Creating dropdown items for date
const months = [
    {
        name: 'January',
        value: 1
    },
    {
        name: 'February',
        value: 2
    },
    {
        name: 'March',
        value: 3
    },
    {
        name: 'April',
        value: 4
    },
    {
        name: 'May',
        value: 5
    },
    {
        name: 'June',
        value: 6
    },
    {
        name: 'July',
        value: 7
    },
    {
        name: 'August',
        value: 8
    },
    {
        name: 'September',
        value: 9
    },
    {
        name: 'October',
        value: 10
    },
    {
        name: 'November',
        value: 11
    },
    {
        name: 'December',
        value: 12
    }
]
const currentYear = new Date().getFullYear();

export default function SignUp(props) {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    username: 'Cat in the Hat',
    email: "",
    password: "",
    month: 1,
    day: 1,
    year: currentYear
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  }

  const handleSubmit = event => {
    props.auth.login();
    console.log(props.auth)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        autoComplete="username"
                        name="username"
                        variant="outlined"
                        required
                        fullWidth
                        onChange={handleChange('username')}
                        id="username"
                        label="Username"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        onChange={handleChange('email')}
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        onChange={handleChange('password')}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                </Grid>
            </Grid>

            {/* Date of Birth Select*/}
            <Grid container direction='row'>
                <Grid item xs={4}>
                <TextField
                    id="month"
                    select
                    label="Month"
                    className={classes.textField}
                    value={values.month}
                    onChange={handleChange('month')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                >
                    {months.map(month => (
                        <MenuItem key={month.value} value={month.value}>
                            {month.name}
                        </MenuItem>
                    ))}
                </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="day"
                        select
                        label="Day"
                        className={classes.textField}
                        value={values.day}
                        onChange={handleChange('day')}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {
                        _.range(1, 32).map(value => 
                            (<MenuItem key={value} value={value}>{value}</MenuItem>)
                        )}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="year"
                        select
                        label="Year"
                        className={classes.textField}
                        value={values.year}
                        onChange={handleChange('year')}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {
                        _.range(currentYear, 1930).map(value => 
                            (<MenuItem key={value} value={value}>{value}</MenuItem>)
                        )}
                    </TextField>
                </Grid>
            </Grid>
            <InputLabel>Date of Birth</InputLabel>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>

          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}