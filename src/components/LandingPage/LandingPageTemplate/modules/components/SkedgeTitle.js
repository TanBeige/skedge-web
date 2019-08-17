import React, { Component } from 'react';
//import Button from 'react-bootstrap/Button';
import Button from '@material-ui/core/Button';
import LoginModal from './LoginModal';
import debounce from 'lodash/debounce';
import LoginButtons from './LoginButtons'


//Styling Home Page
const style = {
    display: 'block',
    width: '8em',
}

class SkedgeTitle extends Component {
    //This component renders the Login button and blinks the dot at the end of Skedge
    constructor(props) {
        super(props);

        this.state = {
            showBlink: true,
            dot: '.',

            isMobile: false,

            show: false     //for Modal
        }
        this.changeMobileState = this.changeMobileState.bind(this);
    }

    blinkDot = () => {
        let blink = !(this.state.showBlink);
        this.setState({showBlink: blink});
    }

    changeMobileState = () => {
        this.setState({ isMobile: window.innerWidth < 760 })
    }

    //For some reason this.changeMobileState isn't running.
    //  Need to figure this out to be able to throttle later
    throttledHandleWindowResize = () => {
        return debounce(this.changeMobileState, 200);
      }

    componentDidMount() {
        setInterval(this.blinkDot, 1500)
        this.changeMobileState();
        window.addEventListener('resize', this.changeMobileState);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.changeMobileState);
    }


    handleShow = () => {
        /*
        this.setState({
            show: true
        });*/
    }
    handleHide = () => {
        this.setState({
            show: false
        });
    }

    render() { 
        const { isMobile } = this.state;
        let btnStyle = isMobile ? 'outlined' : 'contained';

        return ( 
            <div className='homeLogin'>
                <h1 style={{display:'block'}}className='homeTitle'>Skedge{(this.state.showBlink)?this.state.dot:''}</h1>
            </div>
         );
    }
}
 
export default SkedgeTitle;