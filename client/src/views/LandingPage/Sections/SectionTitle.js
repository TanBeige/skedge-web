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
        // if(this.isMounted){
            this.setState({showBlink: blink});
        // }
    }

    componentDidMount() {
        this.intervalID = setInterval(this.blinkDot, 1500)
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    render() { 
        return <h1 style={{fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"}}>Skedge{(this.state.showBlink)?this.state.dot:''}</h1>
    }
}
 
export default SectionTitle;