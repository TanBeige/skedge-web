import React, { Component } from 'react';
import {AppBar} from '@material-ui/core';
import {Toolbar} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import TypoGraphy from '@material-ui/core/Typography';

import { Mutation } from "react-apollo";
import { useMutation } from '@apollo/react-hooks';
import { MUTATION_EVENT_ADD } from "../../Todo/EventQueries";


import auth from "../../Auth/Auth";


import LocalOrPrivate from './LocalOrPrivate';
import CreateEventInfo from './EventCreateInfo';
import TagSelect from './TagSelect';
import AddCohost from './AddCohost/AddCohost';
import AddBanner from './AddBanner';

require('./CreateEvent.css')

class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            currentPage: 0,
            goingBack: false,

            event_type: "",

            street: "",
            city: "",
            state: "",
            zip_code: 0,

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
            repeat_days: false,
            

            cohost_id: 0
         }

        this.handleLocalOrPrivate = this.handleLocalOrPrivate.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleEventInfo = this.handleEventInfo.bind(this);
        this.handleTagInfo = this.handleTagInfo.bind(this);
        this.handleCohost = this.handleCohost.bind(this);
        this.submitEvent = this.submitEvent.bind(this);
    }

    // Functions
    handleGoBack() {
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
            /*window.location.reload()*/
        }
    }

    // Page 0: Loca or Private Choosing
    handleLocalOrPrivate(type) {
        this.setState({
            currentPage: this.state.currentPage + 1,
            goingBack: false,

            event_type: type
        });
    }
    // Page 1: Event Info Submission
    handleEventInfo() {
        this.setState({
            currentPage: this.state.currentPage + 1,
            goingBack: false


        });
    }

    handleTagInfo(
        name,
        address,
        city,
        state,
        event_date,
        start_time,
        end_time,
        description,
        repeat_days
    ) {
        this.setState({
            currentPage: this.state.currentPage + 1,
            goingBack: false,

            name: name,
            description: description,
            street: address,
            city: city,
            state: state,
            event_date: event_date,
            start_time: start_time,
            end_time: end_time,
            repeat_days: repeat_days,

        });
    }

    handleCohost(cohostId) {
        this.setState({
            currentPage: this.state.currentPage + 1,
            goingBack: false,

            cohost_id: cohostId
        });
    }
    //TODO: Fix Payload Not Serializable Error
    submitEvent(addEvent, bannerImg) {
        console.log(addEvent)
        addEvent({
            variables: {
                objects: [
                    {
                        creator_id: auth.getSub(),
                        cohostId: this.state.cohost_id,
                        event_type: this.state.event_type,
                        name: this.state.name,
                        description: this.state.description,
                        /*event_date: this.state.event_date,
                        start_time: this.state.start_time,
                        end_time: this.state.end_time,
                        price: this.state.price,
                        allow_invites: this.state.allow_invites,
                        host_approval: this.state.host_approval,
                        category: this.state.category,

                        cover_pic: bannerImg,
                        street: this.state.street,
                        city: this.state.city,
                        state: this.state.state,*/
                    }
                ]
            }
        })

        let path = `home`;
        this.props.history.push(path);
        // eslint-disable-next-line
        /*window.location.reload()*/
    }

    render() { 

        //CHECK FOR IF LOGGED IN HERE (AND ON EVERY PAGE)


        let currentPageNumber = this.state.currentPage;
        let appBarTitle = "";
        let page = "";

        switch(currentPageNumber) {
            case 0:
                appBarTitle = "Create An Event";
                page = <LocalOrPrivate goingBack={this.state.goingBack} handleLocalOrPrivate={this.handleLocalOrPrivate}/>
                break;
            case 1:
                appBarTitle = "Create An Event";
                page = <CreateEventInfo goingBack={this.state.goingBack} handleEventInfo={this.handleEventInfo} />
                break;
            case 2:
                appBarTitle = "Category";
                page = <TagSelect goingBack={this.state.goingBack} handleTagInfo={this.handleTagInfo} />
                break;
            case 3:
                appBarTitle = "Add A Cohost";
                page = <AddCohost 
                            goingBack={this.state.goingBack} 
                            handleCohost={this.handleCohost} 
                            client={this.props.client}
                            userId={auth.getSub()}
                            event_type={this.state.event_type}
                        />
                break;
            case 4:

                appBarTitle = "Banner";
                page = <AddBanner 
                            goingBack={this.state.goingBack} 
                            submitEvent={this.submitEvent} 
                        />
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