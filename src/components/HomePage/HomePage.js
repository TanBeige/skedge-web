import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import moment from "moment";
import gql from "graphql-tag";

import Feed from './HomeBody/Feed';
import Profile from './Profile/Profile'
import BottomBar from '../BottomBar/BottomBar';
import auth from "../Auth/Auth";
import CreateEvent from './CreateEvent/CreateEvent';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = { session: false };
    }

    /* NOT USING CURRENTLY, SWITCH TO routes.js */
    
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
        const { isAuthenticated } = this.props.auth;
        if (!this.state.session) {
          return <div>Loading</div>;
        }

        let mainComponent = ""
        console.log(this.props.location)
        switch(this.props.location.pathname) {
          case "/home":
            mainComponent = <Feed {...this.props}/>
            //mainComponent = this.props.auth.isAuthenticated() ? <HomePage {...this.props} /> : <Home {...this.props}/>;
            break;
    
          case "/create":
          mainComponent = <CreateEvent />
          break;
        
          case "/user":
            mainComponent = <Profile {...this.props}/>
            break;
    
          default:
            mainComponent = <div>Page Not Found</div>;
        }
     

        return (
            <div>
              {mainComponent}
              <BottomBar />
            </div>
         );
    }
}

export default HomePage;