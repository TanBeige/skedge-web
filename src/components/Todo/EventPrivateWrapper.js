import React, { Component } from "react";
import EventPrivateList from "./EventPrivateList";
import EventInput from "./EventInput";
import "../../styles/App.css";

class EventPrivateWrapper extends Component {
  render() {
    return (
      <div className="todoWrapper">
        <EventInput userId={this.props.userId} type="private" />
        <EventPrivateList
          userId={this.props.userId}
          client={this.props.client}
          type="private"
        />
      </div>
    );
  }
}

export default EventPrivateWrapper;
