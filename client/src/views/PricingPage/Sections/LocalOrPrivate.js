import React, { Component } from 'react';
import Slide from '@material-ui/core/Slide';

import Button from 'components/CustomButtons/Button.js';


const buttonStyle = {
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    width: '8em',
    fontSize: 26,
    maxWidth: '%90',
    //color: '#00A896',
    //fontWeight: '400'
}

const vertStyle = {
    position: 'block',
    textAlign: 'center',
    margin: '4em 0 0 0'
}

export default function LocalOrPrivate(props) {
    //Functions
    const handleLocal = () => {
        props.handleLocalOrPrivate('local')
    }
    const handlePrivate = () => {
        props.handleLocalOrPrivate('private')
    }

    //Rendering
    let dir = props.goingBack ? 'right' : 'left';

    return (
        <Slide direction={dir} in >
            <div className='localOrPrivate' style={vertStyle}>
                <div >
                    <Button variant='contained' color='primary' style={buttonStyle} onClick={handlePrivate}>
                        Private
                    </Button>
                    <div className='OrText'>
                        -Or-
                    </div>
                    <Button variant='contained' color='primary' style={buttonStyle} onClick={handleLocal}>
                        Local
                    </Button>
                </div>
            </div>
        </Slide>
    )
}