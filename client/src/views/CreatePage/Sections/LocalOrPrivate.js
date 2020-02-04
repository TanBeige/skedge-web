import React, { useState } from 'react';
import Slide from '@material-ui/core/Slide';
import { Link } from 'react-router-dom'
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";

import Button from 'components/CustomButtons/Button.js';
import popoverStyles from "assets/jss/material-kit-pro-react/popoverStyles.js";

require('./CreateEvent.css')

const buttonStyle = {
    textAlign: 'center',
    display: 'block',
    fontSize: 26,
    width: '100%',
    //color: '#00A896',
    //fontWeight: '400'
}

const vertStyle = {
    position: 'block',
    textAlign: 'center',
    margin: '2em auto',
    maxWidth: 400
}


const useStyles = makeStyles(popoverStyles);

export default function EventOrDeal(props) {

// Hook for popover
    const [anchorElBottom, setAnchorElBottom] = useState(null);
    const classes = useStyles();


//Rendering

    // To know which direction the page slides
    let dir = props.goingBack ? 'right' : 'left';

    // To negate the "local" button if the user is not an entity
    let localEntityButton = "";

    if(props.entity === true){
        localEntityButton = (
            <div>
                <Button variant='contained' color='primary' style={buttonStyle} onClick={() => props.handleCreateType("local")}>
                    Local
                </Button>
            </div>
        )
    }
    else {
        localEntityButton = (
            <div>
                <Button 
                    variant='contained' 
                    color="info" 
                    style={buttonStyle} 
                    onClick={event => setAnchorElBottom(event.currentTarget)}
                >
                    Local
                </Button>
                <Popover
                    classes={{
                        paper: classes.popover
                        }}
                        open={Boolean(anchorElBottom)}
                        anchorEl={anchorElBottom}
                        onClose={() => setAnchorElBottom(null)}
                        anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                        }}
                        transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                >
                <h3 className={classes.popoverHeader}>For Entities only.</h3>
                <div className={classes.popoverBody}>
                    You must create an entity (business) account in order to post deals. 
                    <br />Entity accounts will be available soon.
                    {/* To create local events, check <Link to="/subscriptions">here</Link>. */}
                </div>
                </Popover>
                
            </div>
        )
    }

    return (
        <Slide direction={dir} in >
            <div className='EventOrDeal' style={vertStyle}>
                <div style={{margin: '1em'}}>
                    <Button variant='contained' color='primary' style={buttonStyle} onClick={() => props.handleCreateType("private")}>
                        Private
                    </Button>

                    <div style={{margin: '2.5em'}}></div>
                    {localEntityButton}
                    <div style={{textAlign: 'left', marginTop: '3em'}}> 
                        <hr />

                        <h3>Private: </h3>
                        <ul>
                            <li>You have the option of either sharing your event to all of your followers or just the followers you invite.</li>
                        </ul>
                        <h3>Local: </h3>
                        <ul>
                            <li>Every Skedge user in your city will be able to see your event.</li>
                            <li>Only “Entity/Business” accounts can post events to this Feed.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Slide>
    )
}