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
//import TextField from '@material-ui/core/TextField'
import { ThemeProvider } from '@material-ui/styles';
import { categoryList } from "utils/constants";

//import Button from 'components/CustomButtons/Button.js';
import Button from '@material-ui/core/Button';
import { Checkbox } from '@material-ui/core';



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
        categories: props.savedCategory,
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

    const handleToggle = value =>{
        
        const currentIndex = values.categories.indexOf(value);
        const newChecked = values.categories;

        if (currentIndex === -1) {
            if(values.categories.length >= 2) {
                return
            }
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }


        setValues({
            ...values,
            categories: newChecked
        })
    };

    const submitTags = () => {
        props.handleTagInfo(values.categories, values.tags)
    }

    let dir = props.goingBack ? 'right' : 'left';

    return (
        <Slide direction={dir} in >
        <Container component="main" style={{paddingLeft: 0, paddingRight: 0}}>
        <ThemeProvider theme={theme}>

            <div className={classes.paper}>
                <div className='TagSelect'>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Choose up to two (2) categories.</FormLabel>
                            <FormGroup>
                                <EventTags values={values} handleToggle={handleToggle}/>
                            </FormGroup>
                    </FormControl>

                    <Grid item xs={12}>
                        <div style={{border: '2px solid #02C39A', borderRadius: 10, marginTop: '1em'}}>
                            <TagsInput 
                            style={{width: '100%'}}
                            addKeys={[9, 13, 188]}
                            value={values.tags}
                            onChange={handleTags}
                            tagProps={{ className: "react-tagsinput-tag primary" }}
                            inputProps={{ placeholder: 'Add a tag (separate w/ commas)'}}
                            place
                            />
                        </div>
                    </Grid>
                </div>
                <Button
                fullWidth
                variant="contained"
                color="primary"
                style={{color: 'white'}}
                className={classes.submit}
                onClick={submitTags}
                disabled={values.categories.length === 0}
                >
                {
                    props.eventType === "local" ? "Invite Cohosts ->" : "Invite Followers ->"
                }
                </Button>
            </div>
            </ThemeProvider>

            </Container>
        </Slide>
    )
}


const EventTags = ({values, handleToggle}) => {
    return(
        <div className='TagCheckbox'>
            {/* <RadioGroup
            aria-label="tags"
            name="tags"
            //value={values.category}
            //onChange={onRadioChange}
            > */}
            <Grid container>
                {
                    categoryList.map((cat, index) => {
                        if(cat === "Any") {
                            return
                        }
                        else {
                            return(
                                <Grid item xs={6} key={index}>
                                    <FormControlLabel 
                                    key={index} 
                                    //value={values.categories.indexOf(cat) !== -1} 
                                    style={{color: "black"}} 
                                    control={
                                        <Checkbox
                                        checked={values.categories.indexOf(cat) !== -1}
                                        onChange={() => {handleToggle(cat)}} 
                                        indeterminate={values.categories.indexOf(cat) === 1}
                                        color='primary'/>
                                    } 
                                    label={cat} 
                                    />
                                </Grid>
                            )
                        }
                    })
                }
            </Grid>
            {/* </RadioGroup> */}
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