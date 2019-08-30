import React from 'react';
import Slide from '@material-ui/core/Slide';

import {Button} from '@material-ui/core'

const buttonStyle = {
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    width: '20%',
    minWidth: '10em',
    fontSize: 26,
    color: '#02C39A',
    //fontWeight: '400'
}


const LocalOrPrivate = (props) => {

    const handleLocal = () => {
        props.handleLocalOrPrivate('local')
    }
    const handlePrivate = () => {
        props.handleLocalOrPrivate('private')
    }

    let dir = props.goingBack ? 'right' : 'left';

    return (
        <Slide direction={dir} in >
            <div className='localOrPrivate'>
                <Button size='large' variant='contained' color='secondary' style={buttonStyle} onClick={handleLocal}>
                    Local
                </Button>
                -Or-
                <Button size='large' variant='contained' color='secondary' style={buttonStyle} onClick={handlePrivate}>
                    Private
                </Button>
            </div>
        </Slide>
    )
}

export default LocalOrPrivate;