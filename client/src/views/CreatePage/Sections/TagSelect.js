import React from 'react';
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TagsInput from "react-tagsinput";
import TextField from '@material-ui/core/TextField'
import { ThemeProvider } from '@material-ui/styles';


import Button from 'components/CustomButtons/Button.js';


const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#02C39A"
      },
    },
  });

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
    submit: {
      margin: theme.spacing(3, 0, 2),
      height: '4em'
    },
  }));

export default function TagSelect(props) {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        category: props.savedCategory,
        tags: props.savedTag
      });
    
    const handleChange = (event) => {
        setValues({ ...values, category: event.target.value });
    };

    const handleTags = (regularTags) => {
        setValues({
            ...values,
            tags: regularTags
        });
    };

    const submitTags = () => {
        props.handleTagInfo(values.category, values.tags)
    }

    let dir = props.goingBack ? 'right' : 'left';

    return (
        <Slide direction={dir} in >
        <Container component="main" >
        <ThemeProvider theme={theme}>

            <div className={classes.paper}>
                <div className='TagSelect'>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Choose a category</FormLabel>
                            <FormGroup>
                                <EventTags values={values} onRadioChange={handleChange}/>
                            </FormGroup>
                    </FormControl>

                    <Grid item xs={12}>
                        <div style={{border: '2px solid #02C39A', borderRadius: 10, marginTop: '1em'}}>
                            <TagsInput 
                            value={values.tags}
                            onChange={handleTags}
                            tagProps={{ className: "react-tagsinput-tag primary" }}
                            />
                        </div>
                    </Grid>
                </div>
                <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={submitTags}
                >
                Choose Cohost ->
                </Button>
            </div>
            </ThemeProvider>

            </Container>
        </Slide>
    )
}


const EventTags = ({values, onRadioChange}) => {
    return(
        <div className='TagCheckbox'>
            <RadioGroup
            aria-label="tags"
            name="tags"
            value={values.category}
            onChange={onRadioChange}
            >
            <Grid container>
                <Grid item xs={6}>
                    <FormControlLabel value="Sports" control={<Radio color='primary'/>} label="Sports" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Music" control={<Radio color='primary'/>} label="Music" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Arts/Culture" control={<Radio color='primary'/>} label="Arts/Culture" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Games" control={<Radio color='primary'/>} label="Games" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Politics" control={<Radio color='primary'/>} label="Politics" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Food" control={<Radio color='primary'/>} label="Food" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Education" control={<Radio color='primary'/>} label="Education" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Movies/Theater" control={<Radio color='primary'/>} label="Movies/Theater" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Business" control={<Radio color='primary'/>} label="Business" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Seasonal" control={<Radio color='primary'/>} label="Seasonal" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Party" control={<Radio color='primary'/>} label="Party" />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel value="Miscellaneous" control={<Radio color='primary'/>} label="Miscellaneous" />
                </Grid>
            </Grid>
            </RadioGroup>
        </div>
    )
}



/*
sports: false,
music: false,
artsCulture: false,
games: false,
politics: false,
food: false,
education: false,
moviesTheater: false,
business: false,
seasonal: false,
party: false
*/