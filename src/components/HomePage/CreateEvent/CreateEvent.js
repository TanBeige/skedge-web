import React, { Component } from 'react';
import {AppBar} from '@material-ui/core';
import {Toolbar} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import TypoGraphy from '@material-ui/core/Typography';

import LocalOrPrivate from './LocalOrPrivate';
import CreateEventInfo from './EventCreateInfo';
import TagSelect from './TagSelect'

require('./CreateEvent.css')

class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            currentPage: 0,
            goingBack: false,

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

        this.handleLocalOrPrivate = this.handleLocalOrPrivate.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleEventInfo = this.handleEventInfo.bind(this);
        this.handleTagInfo = this.handleTagInfo.bind(this);
    }

    // Functions
    handleGoBack() {
        console.log("Go Back:", this.state.currentPage)
        if (this.state.currentPage > 0) {
            this.setState({
                currentPage: this.state.currentPage - 1,
                goingBack: true
            })
        }
        else {
            let path = `home`;
            this.props.history.push(path);
            // eslint-disable-next-line
            window.location.reload()
        }
    }

    // Page 0: Loca or Private Choosing
    handleLocalOrPrivate(type) {
        this.setState({
            event_type: type,
            currentPage: this.state.currentPage + 1,
            goingBack: false

        });
    }
    // Page 1: Event Info Submission
    handleEventInfo() {
        this.setState({
            currentPage: this.state.currentPage + 1,
            goingBack: false
        });
        console.log("Submitted")
    }

    handleTagInfo() {
        this.setState({
            currentPage: this.state.currentPage + 1,
            goingBack: false
        });
    }

    render() { 

        //CHECK FOR IF LOGGED IN HERE (AND ON EVERY PAGE)



        console.log(this.state)
        let currentPageNumber = this.state.currentPage
        let appBarTitle = ""
        let page = ""

        switch(currentPageNumber) {
            case 0:
                appBarTitle = "Create An Event"
                page = <LocalOrPrivate goingBack={this.state.goingBack} handleLocalOrPrivate={this.handleLocalOrPrivate}/>
                break;
            case 1:
                appBarTitle = "Create An Event"
                page = <CreateEventInfo goingBack={this.state.goingBack} handleEventInfo={this.handleEventInfo} />
                break;
            case 2:
                appBarTitle = "Category"
                page = <TagSelect goingBack={this.state.goingBack} handleTagInfo={this.handleTagInfo} />
                break;
            case 3:
                break;
        }

        return ( 
            <div className='createEvent'>
                <AppBar color="primary" position="static">
                <Toolbar>
                    <IconButton style={{position: 'absolute', left: 0}} onClick={this.handleGoBack}>
                        <ChevronLeftIcon style={{fontSize: '2em'}} />
                    </IconButton>
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