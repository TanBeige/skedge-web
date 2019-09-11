import React, { Component } from 'react';

class PageNotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className='PageNotFound'>
                <h1>404 Page Not Found!</h1>
            </div>
         );
    }
}
 
export default PageNotFound;