import React, { Component } from 'react';
import Button from '@material-ui/core/Button'

import {
    QUERY_LOCAL_EVENT,
    QUERY_FEED_LOCAL_EVENT,
    QUERY_FEED_LOCAL_OLD_EVENT,
    SUBSCRIPTION_EVENT_LOCAL_LIST
} from "../../Todo/EventQueries";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    
    login() {
        this.props.auth.login();
      }
    logout() {
        this.props.auth.logout();
    }

    componentDidMount() {
        const { client } = this.props;
        const _this = this;
        // query for public events
        client
          .query({
            query: QUERY_LOCAL_EVENT,
            variables: { eventLimit: this.state.limit }
          })
          .then(data => {
            this.setState({ events: data.data.events });
            const latestEventId = data.data.events.length
              ? data.data.events[0].id
              : null;
            // start a subscription
            client
              .subscribe({
                query: SUBSCRIPTION_EVENT_LOCAL_LIST,
                variables: { eventId: latestEventId } // update subscription when eventId changes
              })
              .subscribe({
                next(data) {
                  if (data.data.events.length) {
                    _this.setState({
                      showNew: true,
                      newEventsLength:
                        _this.state.newEventsLength + data.data.events.length
                    });
                  }
                },
                error(err) {
                  console.error("err", err);
                }
              });
          });
      }

    render() { 
    const { isAuthenticated } = this.props.auth;

    return ( 
        <div>
            <Button
            id="qsLoginBtn"
            variant='contained'
            color="primary"
            onClick={this.logout.bind(this)}
            >
            Logout
            </Button>
        </div>
        )
    }
}
 
export default Profile;