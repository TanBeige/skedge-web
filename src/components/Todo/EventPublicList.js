import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import EventItem from "./EventItem";
import EventFilters from "./EventFilters";
import {
  SUBSCRIPTION_EVENT_PUBLIC_LIST,
  QUERY_PUBLIC_EVENT,
  QUERY_FEED_PUBLIC_EVENT,
  QUERY_FEED_PUBLIC_OLD_EVENT
} from "./TodoQueries";

class EventPublicList extends Component {
  constructor() {
    super();
    this.state = {
      filter: "all",
      dataLength: 0,
      showNew: false,
      showOlder: true,
      newEventsLength: 0,
      limit: 5,
      events: []
    };
    this.deletePublicEventClicked = this.deletePublicEventClicked.bind(this);
    this.completePublicEventClicked = this.completePublicEventClicked.bind(this);
    this.loadMoreClicked = this.loadMoreClicked.bind(this);
    this.loadOlderClicked = this.loadOlderClicked.bind(this);
    this.filterResults = this.filterResults.bind(this);
  }
  componentDidMount() {
    const { client } = this.props;
    const _this = this;
    // query for public events
    client
      .query({
        query: QUERY_PUBLIC_EVENT,
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
            query: SUBSCRIPTION_EVENT_PUBLIC_LIST,
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
  filterResults(type) {
    this.setState({ filter: type });
  }
  loadMoreClicked() {
    const { client } = this.props;
    this.setState({ showNew: false, newEventsLength: 0 });
    client
      .query({
        query: QUERY_FEED_PUBLIC_EVENT,
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
        query: QUERY_FEED_PUBLIC_OLD_EVENT,
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
  deletePublicEventClicked(deletedEvent) {
    const finalEvents = this.state.events.filter(t => {
      return t.id !== deletedEvent.id;
    });
    this.setState({ events: finalEvents });
  }
  completePublicEventClicked(completedEvent) {
    const finalEvents = this.state.events.filter(t => {
      if (t.id === completedEvent.id) {
        t.is_completed = !t.is_completed;
        return t;
      }
      return t;
    });
    this.setState({ events: finalEvents });
  }
  render() {
    const { userId, type } = this.props;

    // apply client side filters for displaying events
    let finalEvents = this.state.events;
    if (this.state.filter === "active") {
      finalEvents = this.state.events.filter(event => event.is_completed !== true);
    } else if (this.state.filter === "completed") {
      finalEvents = this.state.events.filter(event => event.is_completed === true);
    }

    // show new event feed logic
    let showNewEvents = null;
    if (this.state.showNew && this.state.newEventsLength) {
      showNewEvents = (
        <div className={"loadMoreSection"} onClick={this.loadMoreClicked}>
          You have {this.state.newEventsLength} new{" "}
          {this.state.newEventsLength > 1 ? "events" : "event"}
        </div>
      );
    }

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
      <Fragment>
        <div className="todoListwrapper">
          {showNewEvents}
          <ul>
            {finalEvents.map((event, index) => {
              return (
                <EventItem
                  key={index}
                  index={index}
                  event={event}
                  type={type}
                  userId={userId}
                  client={this.props.client}
                  deletePublicEventClicked={this.deletePublicEventClicked}
                  completePublicEventClicked={this.completePublicEventClicked}
                />
              );
            })}
          </ul>
          {showOlderEvents}
        </div>
        <EventFilters
          events={this.state.events}
          userId={userId}
          type={type}
          currentFilter={this.state.filter}
          filterResults={this.filterResults}
        />
      </Fragment>
    );
  }
}

EventPublicList.propTypes = {
  userId: PropTypes.string,
  client: PropTypes.object,
  type: PropTypes.string
};

export default EventPublicList;
