import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';

import LocalOrPrivate from './LocalOrPrivate';

require('./CreateEvent.css')

class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            currentPage: 0,

            event_type: "",
            name: "",
            description: "",
            event_date: "",
            start_time: "",
            end_time: "",
            price: 0,
            allow_invites: false,
            host_approval: false,
            category: "",
            web_url: "",
            cover_pic: "",
            street: "",
            city: "",
            state: "",
            zip_code: 0,
         }

        this.handleLocalOrPrivate = this.handleLocalOrPrivate.bind(this)
    }

    handleLocalOrPrivate(type) {
        this.setState({
            event_type: type,
            currentPage: this.state.currentPage + 1
        });
    }

    render() { 
        let currentPageNumber = this.state.currentPage
        let appBarTitle = ""
        let page = ""

        switch(currentPageNumber) {
            case 0:
                appBarTitle = "Create An Event"
                page = <LocalOrPrivate handleSubmit={this.handleLocalOrPrivate}/>
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
        console.log("Create Event Opened")

        return ( 
            <div className='createEvent'>
                <AppBar color="primary" position="static">
                <Toolbar>
                    <TypoGraphy variant="h4"
                    align='center'
                    color="inherit"
                    style={{width: '100%'}}
                    >
                        {appBarTitle}
                    </TypoGraphy>
                </Toolbar>
            </AppBar>
                {page}
            </div>
         );
    }
}
 
export default CreateEvent;