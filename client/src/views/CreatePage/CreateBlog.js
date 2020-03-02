import React, {Fragment} from 'react';

// Material Ui Imports
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

// Lodash import
import _ from 'lodash'


export default function CreateBlog() {

    const [values, setValues] = React.useState({
        // Event Creation
        name: "",
        date: "",
        city: "Tallahassee",
        state: "Florida"
    });

    //Functions
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const submitEventInfo = () => {
      console.log("ass");
    }


    return(
    <Container component="main" maxWidth="md" style={{paddingBottom: '0.5em'}}>
      <CssBaseline />
        <form  noValidate>
        <div className='EventCreateInfo'>
          <Grid container spacing={2} >
            <Grid item xs={12} sm={12}>
              <TextField
                error={values.name.length > 50}
                name="name"
                variant="outlined"
                value={values.name}
                required
                fullWidth
                onChange={handleChange('name')}
                id="event_name"
                label="Event Name"
                autoFocus
                placeholder="50 character max."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                value={values.location_name}
                required
                fullWidth
                onChange={handleChange('date')}
                id=""date
                label="Date"
                name="date"
                placeholder="ex) YYYY-MM-DD ex) 2020-03-20"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                value={values.street}
                required
                fullWidth
                onChange={handleChange('city')}
                id="city"
                label="City"
                name="city"
                placeholder="Tallahassee"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="state"
                value={values.street}
                required
                fullWidth
                onChange={handleChange('state')}
                id="state"
                label="State"
                name="state"
                placeholder="Florida"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                  id="description"
                  label="Event Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  value={values.description}
                  fullWidth
                  onChange={handleChange('description')}
                  margin="normal"
              />
            </Grid>
          </Grid>
          
          </div>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={{color: 'white'}}
            onClick={submitEventInfo}
          >
           Choose Category ->
          </Button>
        </form>
    </Container>
    )
}

/*

{
  "objects": {
    "name": "Top 3 Deals Today",
    "date": "2020-03-02",
    "city": "Tallahassee",
    "state": "Florida",
    "announcement_deals": {
      "data": [
        {
          "deal_id": 71,
          "description": "2 for $20 chef special rolls at Sakura Japanese Sushi & Grill. Usually prices vary from $12-$17 per roll. If you go at the right time, they also have happy hour where they offer BOGO sake, wine, and beer along with 30% off appetizers. Click the banner for details about this deal."
        },
        {
          "deal_id": 85,
          "description": "All day Monday, The Mann’s Doghouse offers a burger, fries, and a soft drink for only $6.99. Click the banners for details about this deal."
        },
        {
          "deal_id": 54,
          "description": "If you get there early enough, The Bada Bean offers their traditional egg breakfast for only $2.99 (usually $5.29) as well as 2 of their buttermilk short stack pancakes for only $1.99. Click the banner for details about this deal."
        }
      ]
    }
  }
}

*/