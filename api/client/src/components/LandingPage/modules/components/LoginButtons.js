import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import LoginModals from './LoginModal'

import debounce from 'lodash/debounce'

const style = {
    display: 'block',
}

class LoginButtons extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isMobile: false,
         }
    }

    changeMobileState = () => {
        this.setState({ isMobile: window.innerWidth < 760 })
    }

    //For some reason this.changeMobileState isn't running.
    //  Need to figure this out to be able to throttle later
    throttledHandleWindowResize = debounce(() => {
        return this.changeMobileState;
    }, 500)

    handleClick = () => {
        this.props.auth.login()
    }

    componentDidMount() {
        this.changeMobileState();
        window.addEventListener('resize', this.changeMobileState);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.changeMobileState);
    }

    render() { 
        let buttonStyle = (this.state.isMobile) ? 'outlined' : 'contained';
        return ( 
            <div className='loginButtons' style={style}>
                {/*<LoginModals type='signup' {...this.props} />
                <LoginModals type='login' {...this.props} />*/}
                <Button color='secondary' variant={buttonStyle} style={{display: 'block', width: '8em', fontSize: 12}} onClick={this.handleClick}>Let's Go!</Button>
            </div>
         );
    }
}
 
export default LoginButtons;