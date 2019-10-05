import React, { Component } from 'react';
import Slide from '@material-ui/core/Slide';

import Button from 'components/CustomButtons/Button.js';


const buttonStyle = {
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    width: '20%',
    minWidth: '10em',
    fontSize: 26,
    //color: '#00A896',
    //fontWeight: '400'
}


export default function LocalOrPrivate(props) {
    //Functions
    const handleLocal = () => {
        this.props.handleLocalOrPrivate('local')
    }
    const handlePrivate = () => {
        this.props.handleLocalOrPrivate('private')
    }

    //Rendering
    let dir = props.goingBack ? 'right' : 'left';

    return (
        <Slide direction={dir} in >
            <div className='localOrPrivate' style={{paddingBottom: 20, textAlign: 'center', verticalAlign: 'middle'}}>
                <Button size='large' variant='contained' color='primary' style={buttonStyle} onClick={handlePrivate}>
                    Private
                </Button>
                <div className='OrText'>
                    -Or-
                </div>
                <Button size='large' variant='contained' color='primary' style={buttonStyle} onClick={handleLocal}>
                    Local
                </Button>
            </div>
        </Slide>
    )
}