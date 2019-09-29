import React, { Component } from 'react';

class LoadingPage extends Component {
    constructor(props) {
        super(props);

    }
    render() { 
        return ( 
            <div>
                {this.props.reason}...
            </div>
         );
    }
}
 
export default LoadingPage;