import React from 'react';
import { Link } from 'react-router-dom';
import  { extractDays } from 'components/CommonFunctions.js';

// @material-ui/core components
import Paper from '@material-ui/core/Paper';

import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TodayIcon from '@material-ui/icons/Today';

require('./InfoItems.css');

export default function PageDateTime({start_date, start_time, end_time, is_recurring, weekday}) {
    
    // Styling
    const timePaper= {
        margin: '0 0.4em'
    }
    
    // Display Information Logic
    var moment = require('moment');
    let formattedStartTime = "";
    if(start_time) {
        formattedStartTime = moment(start_time, "HH:mm:ss");
    }
  
    //style={{borderRadius: 5, backgroundColor: "#02C39A", color: 'white'}}
    let formattedEndTime = ""
    if(end_time) {
        formattedEndTime = moment(end_time, "HH:mm:ss")
    }
    let formattedDate = ""
    if(is_recurring) {
        formattedDate = extractDays(weekday);
    }
    else {
        formattedDate = moment(start_date, "YYYY-MM-DD").format("MMM D, YYYY")
    }

    
    return(
        <div className='ItemDateTime'>
            <Paper style={timePaper} elevation={0} className='ItemDate'>
                <TodayIcon style={{height: '100%'}}/>
                <h4 style={{margin: '0 5px', fontSize: '1em', alignSelf: 'center', fontWeight: '400'}}>
                    {formattedDate}
                </h4>
            </Paper>
            <Paper style={timePaper} elevation={0} className='ItemDate'>
                <AccessAlarmIcon style={{height: '100%'}}/>
                <h4 style={{margin: 5, fontSize: '1em', alignSelf: 'center', fontWeight: '400'}}>
                    {moment(formattedStartTime).format("h:mmA")}
                    {end_time ? ` - ${moment(formattedEndTime).format("h:mmA")}` : ""}
                </h4>
            </Paper>
        </div>
    )
}