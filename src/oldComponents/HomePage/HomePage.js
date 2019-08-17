import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Feed from './HomeBody/Feed';
import BottomBar from '../BottomBar/BottomBar';
//import { Router } from 'express';

class HomePage extends Component {
    constructor(props) {
        super(props);
    }



    render() { 
        return ( 
            <Router>
                <div className='home'>
                    <Route path="/home" component={Feed} /> 
                    <Route path="/" component={Feed} /> 
                    <Route path="/create" component={Feed} />
                    <Route path="/notifications" component={Feed} />
                    <Route path="/user" component={Feed} />
                    <BottomBar/>
                </div>
            </Router>
         );
    }
}

export default HomePage;