import React, { Component } from 'react';
//import Spinner from 'react-bootstrap/Spinner';
import Auth from '../../controllers/Auth';
import './callback.scss';

class Callback extends Component {

    componentDidMount() {
        const auth = new Auth();
        auth.handleAuthentication();
    }

    render() { 
        return ( 
            <div className='loading'>
                <h1>Loading...</h1>
                {/*<Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
        </Spinner>*/}
            </div>
         );
    }
}
 
export default Callback;