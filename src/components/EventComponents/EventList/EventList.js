import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button';
import Grid from '@material-ui/core/Grid';

import {
    QUERY_LOCAL_EVENT,
    QUERY_FEED_LOCAL_EVENT,
    QUERY_FEED_LOCAL_OLD_EVENT,
    SUBSCRIPTION_EVENT_LOCAL_LIST
} from "../../Todo/EventQueries";

import Event from '../Event/Event';
require('./EventList.scss')

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "private",
      dataLength: 0,
      showNew: false,
      showOlder: true,
      newEventsLength: 0,
      limit: 5,
      events: []
    };
    this.deletePublicEventClicked = this.deletePublicEventClicked.bind(this);
    this.loadMoreClicked = this.loadMoreClicked.bind(this);
    this.loadOlderClicked = this.loadOlderClicked.bind(this);
    this.filterResults = this.filterResults.bind(this);
  }

  //-------------ComponentDidMount()----------------
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
        console.log("Comp. Did Mount: ", data)
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

  // Support Function 

  loadMoreClicked() {
    const { client } = this.props;
    this.setState({ showNew: false, newEventsLength: 0 });
    client
      .query({
        query: QUERY_FEED_LOCAL_EVENT,
        variables: {
          eventId: this.state.events.length ? this.state.events[0].id : null
        }
      })
      .then(data => {
        if (data.data.events.length) {
          const mergedEvents = data.data.events.concat(this.state.events);
          // update state with new events
          this.setState({ events: mergedEvents });
        }
      });
  }

  loadOlderClicked() {
    const { client } = this.props;
    client
      .query({
        query: QUERY_FEED_LOCAL_OLD_EVENT,
        variables: {
          eventId: this.state.events.length
            ? this.state.events[this.state.events.length - 1].id
            : null
        }
      })
      .then(data => {
        if (data.data.events.length) {
          const mergedEvents = this.state.events.concat(data.data.events);
          // update state with new events
          this.setState({ events: mergedEvents });
        } else {
          this.setState({ showOlder: false });
        }
      });
  }

  filterResults(type) {
    this.setState({ filter: type });
  }

  deletePublicEventClicked(deletedEvent) {
    const finalEvents = this.state.events.filter(t => {
      return t.id !== deletedEvent.id;
    });
    this.setState({ events: finalEvents });
  }

  render() { 
    console.log("EventList.js: ", this.props)
    let finalEvents = this.state.events
    console.log("State Events: ", finalEvents)

    const { userId, type } = this.props;  //Might delete this later

    // show old event history logic
    let showOlderEvents = (
      <div className={"loadMoreSection"} onClick={this.loadOlderClicked}>
        Load Older Events
      </div>
    );
    if (!this.state.showOlder && this.state.events.length) {
      showOlderEvents = (
        <div className={"loadMoreSection"} onClick={this.loadOlderClicked}>
          No more events available
        </div>
      );
    }

      return ( 
          <div className="EventList">
              <Grid container spacing={1} direction="row">
              {
                  finalEvents.map((event, index) => {
                    return (
                        <Grid container item xs justify="center" key={event.id}>
                            <div className='eachEvent'>
                                <Event 
                                  event={event} 
                                  key={event.id} 
                                  client={this.props.client}
                                />
                            </div>
                        </Grid>
                      )
                  })
              }
              </Grid>
          </div>
      );
  }
}

EventList.propTypes = {
  client: PropTypes.object,
  type: PropTypes.string
};
 
export default EventList;