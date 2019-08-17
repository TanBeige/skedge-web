import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Grid from '@material-ui/core/Grid';

import Event from '../Event/Event';
require('./EventList.scss')

class EventList extends Component {

    render() { 
        return ( 
            <div className="EventList">
                <Grid container spacing={1} direction="row">
                {
                    this.props.events.map((event) =>
                        <Grid container item xs justify="center">
                            <div className='eachEvent'>
                                <Event event={event} key={event.id} />
                            </div>
                        </Grid>
                    )
                }
                </Grid>
            </div>
        );
    }
}
 
export default EventList;