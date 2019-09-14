import React, { Component } from 'react';
import Slide from '@material-ui/core/Slide';

import {Button} from '@material-ui/core'

const buttonStyle = {
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    width: '20%',
    minWidth: '10em',
    fontSize: 26,
    color: '#00A896',
    //fontWeight: '400'
}


class LocalOrPrivate extends Component {
    constructor(props) {
        super(props)
    }
    handleLocal = () => {
        this.props.handleLocalOrPrivate('local')
    }
    handlePrivate = () => {
        this.props.handleLocalOrPrivate('private')
    }

    render() {
        let dir = this.props.goingBack ? 'right' : 'left';

        return (
            <Slide direction={dir} in >
                <div className='localOrPrivate'>
                    <Button size='large' variant='contained' color='secondary' style={buttonStyle} onClick={this.handlePrivate}>
                        Private
                    </Button>
                    <div className='OrText'>
                        -Or-
                    </div>
                    <Button size='large' variant='contained' color='secondary' style={buttonStyle} onClick={this.handleLocal}>
                        Local
                    </Button>
                    
                </div>
            </Slide>
        )
    }
}

export default LocalOrPrivate;