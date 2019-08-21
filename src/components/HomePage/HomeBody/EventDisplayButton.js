import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'

class EventDisplayButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            location: ""
        };
    }

    handleLocation = (e) => {
        this.props.searchEvents(this.state.location);
        e.preventDefault();
    }

    render() { 
        return ( 
            <Button onClick={this.handleLocation}>Find Events</Button>
        );
    }
}
 
export default EventDisplayButton;