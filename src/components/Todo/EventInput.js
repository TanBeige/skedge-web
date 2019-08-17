import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import "../../styles/App.css";

import { QUERY_PRIVATE_EVENT, MUTATION_EVENT_ADD } from "./TodoQueries";

class EventInput extends React.Component {
  constructor() {
    super();
    this.state = {
      textboxValue: ""
    };
    this.handleTextboxValueChange = this.handleTextboxValueChange.bind(this);
    this.handleTextboxKeyPress = this.handleTextboxKeyPress.bind(this);
  }

  handleTextboxValueChange(e) {
    this.setState({
      textboxValue: e.target.value
    });
  }

  handleTextboxKeyPress(e, addEvent) {
    if (e.key === "Enter") {
      const newEvent = this.state.textboxValue;
      const userId = this.props.userId;
      const isPublic = this.props.type === "public" ? true : false;
      addEvent({
        variables: {
          objects: [
            {
              description: newEvent,
              creator_id: userId,
              is_public: isPublic
            }
          ]
        },
        update: (store, { data: { insert_events } }) => {
          const query = QUERY_PRIVATE_EVENT;
          try {
            if (this.props.type === "private") {
              const data = store.readQuery({
                query: query,
                variables: { userId: this.props.userId }
              });
              const insertedEvent = insert_events.returning;
              data.events.splice(0, 0, insertedEvent[0]);
              store.writeQuery({
                query: query,
                variables: {
                  userId: this.props.userId
                },
                data
              });
            }
          } catch (e) {
            console.error(e);
          }
          this.setState({
            textboxValue: ""
          });
        }
      });
    }
  }

  render() {
    return (
      <Mutation mutation={MUTATION_EVENT_ADD}>
        {(addEvent, { error }) => {
          if (error) {
            alert("Something went wrong");
          }
          return (
            <div className="formInput">
              <input
                className="input"
                data-test={
                  this.props.type === "private"
                    ? "input-private"
                    : "input-public"
                }
                placeholder="What needs to be done?"
                value={this.state.textboxValue}
                onChange={this.handleTextboxValueChange}
                onKeyPress={e => {
                  this.handleTextboxKeyPress(e, addEvent);
                }}
              />
              <i className="downArrow fa fa-angle-down" />
            </div>
          );
        }}
      </Mutation>
    );
  }
}

EventInput.propTypes = {
  userId: PropTypes.string,
  type: PropTypes.string
};

export default EventInput;
