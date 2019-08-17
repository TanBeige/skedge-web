import React, { Component } from 'react';
//import {Tabs, Tab, Button} from 'react-bootstrap';

//import { ProgressBar } from 'react-bootstrap'; remove progressBar later
//import Calendar from 'react-calendar';
//import eventDB from '______' //This is our database

import EventList from '../../EventComponents/EventList/EventList';
import EventDisplayButton from './EventDisplayButton';
import TabButtons from './TabButtons'
import debounce from 'lodash/debounce'
import TopNavBanner from '../../NavBanner/TopNavBanner'


require('./homeBody.scss');


const event = {     //event object TEST
    name: "Event Name", 
    address: "1234 Wiener Lane",
    city: "Jonestown",
    zipCode: 11111,
    state: "Ohio",
    date: "12-03-2020",    //month, day, year
    startTime: "5:32",
    endTime: "6:00",
    repeatedDays: ['monday'],
    freeEvent: true, //boolean
    /*
    freeFood:,
    etc..
    */
    bio: "AAAAAAAAAAAAAAAA FREE HOT DOGS. Wiener town, destination super weenie hut juniors. When you want god to cock and ball torture you, make sure you're here.",
    category: "Party",
    tags: [""],
    rating: 5,
    reviewCount: 20,
    imgSrc: "https://www.collegeatlas.org/wp-content/uploads/2014/06/Top-Party-Schools-main-image.jpg",
    websiteURL: "",

    //themeSong: "" //Kyle will warm up to this one day :)
}

const eventDB = [event];

class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
            local: true,
            private: false,
            search: ""
        };
    }

    //defaultLoad = () => {}    //This one is when searchbar is empty

    handleSearch = debounce((text) => {
        this.setState({
            search: text
        });
        console.log("Searched " + text);
    }, 500)

    searchEvents = (location) => {  //search in database
        /*
        eventDB.search(location).then((events) => {     //make function to search db
          this.setState({
            events: events
          })
        });*/
        this.setState({
            events: [event, event]
        })
      }

    handleChange = (localOrPrivate) => {
        console.log(localOrPrivate)
        if(localOrPrivate === "Local") {
            this.setState({
                local: true,
                private: false
            })
        }
        else if(localOrPrivate === "Private") {
            this.setState({
                local: false,
                private: true
            })
        }
      }

    componentWillMount() {
        //Starts off on the Local tab, displays local information
        this.setState({
            events: [event,event,event,event,event,event,event]
        })
    }

    render() { 
        return ( 
            <div className='feed'>
                <TopNavBanner handleSearch={this.handleSearch}/>
                <TabButtons onChange={this.handleChange.bind(this)}/>
                <h1 style={{marginTop:'-1em'}}>😳</h1> {/* I fucking love that I can do this */}
                <div className='displayEvent'>
                    <EventList events={this.state.events}/>
                </div>
                <h1>{this.state.search}</h1>
            </div>
        );
    }
}
 
export default Feed;