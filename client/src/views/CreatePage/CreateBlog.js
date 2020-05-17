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
        state: "Florida",
        deals: [
          {dealId: 0, description: ""}
        ]
    });

    //Functions
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const submitEventInfo = () => {
      console.log("ass");
    }

    const handleDealIdChange = (dealId, index) => {
      let tempDeals = values.deals;
      tempDeals[index].dealId = dealId
      setValues({
        ...values,
        deals: tempDeals
      })
    }
    const handleDealDescriptionChange = (description, index) => {
      let tempDeals = values.deals;
      tempDeals[index].description = description
      setValues({
        ...values,
        deals: tempDeals
      })
    }

    const addDeal = () => {
      let tempDeals = values.deals;
      tempDeals.push({dealID: 0, description: ""})
      setValues({
        ...values,
        deals: tempDeals
      })
    }


    return(
    <Container component="main" maxWidth="md" style={{paddingBottom: '0.5em', marginTop: 30}}>
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
                  id="blog_name"
                  label="Blog Title"
                  autoFocus
                  placeholder="Ex) Top 3 Deals in Tallahassee"
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
                  variant="outlined"
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
                    label="Blog Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    value={values.description}
                    fullWidth
                    onChange={handleChange('description')}
                    margin="normal"
                    placeholder="Ex) We set out to find the best deals in tally, here they are ...: "
                />
              </Grid>
            </Grid>
            <hr />
            {
              values.deals.map((item, index) => {
                return(
                  <Grid container>
                    <h5>Deal #{index + 1}</h5>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        // value={values.deals[index].dealId}
                        style={{marginTop: 10}}

                        required
                        fullWidth
                        onChange={(event) => handleDealIdChange(event.target.value, index)}
                        id="deal_id"
                        label="Deal ID"
                        name="Deal Id"
                        placeholder="324"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        style={{marginTop: 10}}
                        // value={values.deals[index].description}
                        required
                        fullWidth
                        multiline
                        onChange={(event) => handleDealDescriptionChange(event.target.value, index)}
                        id="description"
                        label="Description"
                        name="description"
                        placeholder="blah blah blah when/where"
                      />
                    </Grid>
                  </Grid>
                )
              })
            }
            <Button
              variant="contained"
              color="primary"
              style={{color: 'white', marginTop: 10}}
              onClick={addDeal}
            >
            Add Deal +
            </Button>          
          </div>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={{color: 'white', marginTop: 10}}
            onClick={submitEventInfo}
          >
           Create Blog ->
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