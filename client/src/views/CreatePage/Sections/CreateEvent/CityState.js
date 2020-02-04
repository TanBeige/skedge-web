// React Imports
import React, {Fragment, useState} from 'react';
// Material Ui Imports
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
// Material-UI transition imports
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import pricingStyle from "assets/jss/material-kit-pro-react/views/pricingSections/pricingStyle.js";

import { skedgeLocations, states } from 'utils/constants.js'

// Lodash import
import _ from 'lodash'

const useStyles = makeStyles(pricingStyle);



export default function CityState({type, city, state, entityCityState, handleChange, handleEntityLocation}) {
    const classes = useStyles();

    // Date/Time input based on if Entity or not
  if(type === "local") {
    return (
      <Fragment>
        <Grid item xs={12}>
          <TextField
              id="locations"
              select
              label="Locations"
              variant="outlined"
              required
              fullWidth
              className={classes.textField}
              value={entityCityState}
              onChange={handleEntityLocation}
              SelectProps={{
                  MenuProps: {
                      className: classes.menu,
                  },
              }}
              margin="normal"
          >
              {
              skedgeLocations.map((item, index) => 
                  (<MenuItem key={index} value={item}>{item.city}, {item.state}</MenuItem>)
              )}
          </TextField>
        </Grid>
      </Fragment>
    )
  }
  else {
    return (
      <Fragment>
        <Grid item xs={6}>
          <TextField
              id="city"
              label="City"
              variant="outlined"
              required
              fullWidth
              className={classes.textField}
              value={city}
              onChange={handleChange('city')}
              margin="normal"
          >
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
              id="state"
              select
              label="State"
              variant="outlined"
              required
              fullWidth
              className={classes.textField}
              value={state}
              onChange={handleChange('state')}
              SelectProps={{
                  MenuProps: {
                      className: classes.menu,
                  },
              }}
              margin="normal"
          >
              {
              states.map(value => 
                  (<MenuItem key={value} value={value}>{value}</MenuItem>)
              )}
          </TextField>
        </Grid>
      </Fragment>
    )
  }

}