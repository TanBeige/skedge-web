import React from 'react'


import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ApartmentIcon from '@material-ui/icons/Apartment';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';



export default function DateSelect(props) {


    return(
        <div style={{display: "block", margin: '10px 0px'}}>
            <IconButton 
                onClick={props.handleDayBack}
                style={{position: 'absolute', left: 5, marginTop: '-12px', padding: '12px 18px'}}
            >
                <ChevronLeftIcon fontSize='large' />
            </IconButton>
            <IconButton 
                onClick={props.handleDayForward}
                style={{position: 'absolute', right: 5, marginTop: '-12px', padding: '12px 18px'}}
            >
                <ChevronRightIcon fontSize='large'  />
            </IconButton>
            <h3 style={{marginTop: 15, marginBottom: 0 ,textAlign: 'center', verticalAlign: 'middle'}}>{props.date}</h3>
        </div>
    )
}