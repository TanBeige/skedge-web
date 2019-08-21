import React, { Component } from "react";
import EventPublicList from "./EventPublicList";
import EventInput from "./EventInput";
//import "../../styles/App.css";

class EventPublicWrapper extends Component {
  render() {
    // const userId = localStorage.getItem("auth0:id_token:sub");
    return (
      <div className="todoWrapper">
        <EventInput userId={this.props.userId} type="public" />
        <EventPublicList
          userId={this.props.userId}
          type="public"
          client={this.props.client}
        />
      </div>
    );
  }
}

export default EventPublicWrapper;
