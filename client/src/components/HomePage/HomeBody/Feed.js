import React, { Component } from 'react';

import EventList from '../../EventComponents/EventList/EventList';
import TabButtons from './TabButtons'
import debounce from 'lodash/debounce'
import TopNavBanner from '../../NavBanner/TopNavBanner'
import moment from "moment";
import gql from "graphql-tag";

import auth from "../../Auth/Auth";
import EventPublicList from '../../Todo/EventPublicList';
import {
    SUBSCRIPTION_EVENT_LOCAL_LIST,
    QUERY_LOCAL_EVENT,
    QUERY_FEED_LOCAL_EVENT,
    QUERY_FEED_LOCAL_OLD_EVENT
} from "../../Todo/EventQueries";


require('./feed.css');


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
        super();

        this.state = {
            events: [],
            tabType: 'local',
            search: "",
            limit: 10
        };
    }

    updateLastSeen = () => {
        const userId = auth.sub;
        const timestamp = moment().format();
        if (this.props.client) {
          this.props.client
            .mutate({
              mutation: gql`
                mutation($userId: String!, $timestamp: timestamp!) {
                  update_users(
                    where: { auth0_id: { _eq: $userId } }
                    _set: { auth0_id: $userId, last_seen: $timestamp }
                  ) {
                    affected_rows
                  }
                }
              `,
              variables: {
                userId: userId,
                timestamp: timestamp
              }
            })
            .then(() => {
              // handle response if required
            })
            .catch(error => {
              console.error(error);
            });
        }
      };


    //defaultLoad = () => {}    //This one is when searchbar is empty
    handleSearch = debounce((text) => {
        this.setState({
            search: text
        });
        console.log("Searched " + text);
    }, 500)
    searchEvents = (location) => {  //search in database
        this.setState({
            events: [event, event]
        })
      }

    handleChange = (localOrPrivate) => {
        console.log(localOrPrivate)
        if(localOrPrivate === "local") {
            this.setState({
              tabType: "local"
            })
        }
        else if(localOrPrivate === "friends") {
            this.setState({
              tabType: "public"
            })
        }
    }

    componentDidMount() {
        const { renewSession } = auth;
    
        if (localStorage.getItem("isLoggedIn") === "true") {
          // eslint-disable-next-line
          const lastSeenMutation = setInterval(
            this.updateLastSeen.bind(this),
            5000
          );
          renewSession().then(data => {
            this.setState({ session: true });
          });
        } else {
          window.location.href = "/";
        }
      }


    render() { 
        return ( 
            <div className='feed'>
                <TopNavBanner handleSearch={this.handleSearch}/>
                <TabButtons onChange={this.handleChange.bind(this)}/>

                <span role="img" aria-label="sheep">
                    <h1 style={{textAlign: 'center', margin: 0, marginTop: '-1.1em'}}>😳</h1> {/* I fucking love that I can do this */}
                </span>

                <div className='displayEvent'>
                    {/*<EventPublicList 
                    userId={this.props.userId}
                    type="public"
                    client={this.props.client}/>*/}

                    <EventList 
                    userId={this.props.userId}
                    type='local'
                    client={this.props.client}/>

                    
                </div>
                {/*<img src={require('../../../SkedgeDiffColor.png')} alt='Skedge' height={150} width={200} style={{textAlign: 'center'}}/>*/}
                <h1>{this.state.search}</h1>
            </div>
        );
    }
}
 
export default Feed;