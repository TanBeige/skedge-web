import React, { Component } from 'react';

class SectionTitle extends Component {
    //This component renders the title "Skedge" as well as the blinking dot.
    constructor(props) {
        super(props);

        this.state = {
            showBlink: true,
            dot: '.',
        }
    }

    blinkDot = () => {
        let blink = !(this.state.showBlink);
        this.setState({showBlink: blink});
    }

    componentDidMount() {
        setInterval(this.blinkDot, 1500)
    }

    render() { 
        return <h1 className='homeTitle'>Skedge{(this.state.showBlink)?this.state.dot:''}</h1>
    }
}
 
export default SectionTitle;