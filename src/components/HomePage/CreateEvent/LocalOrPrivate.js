import React from 'react';

import Button from '@material-ui/core/Button'

const localStyle = {
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    width: '20%',
    minWidth: '10em',
    fontSize: 28,
    //fontWeight: '400'
}

const privateSyle = {

}

const LocalOrPrivate = (props) => {
    return (
        <div className='localOrPrivate'>
            <Button size='large' variant='contained' color='secondary' style={localStyle}>
                LOCAL
            </Button>
            -Or-
            <Button size='large' variant='contained' color='secondary' style={localStyle}>
                Private
            </Button>
        </div>
    )
}

export default LocalOrPrivate;