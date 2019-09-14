import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
//import "../../styles/App.css";

import {
  QUERY_PRIVATE_EVENT,
  QUERY_LOCAL_EVENT,
  MUTATION_EVENT_UPDATE,
  MUTATION_EVENT_DELETE
} from "./EventQueries";

const handleEventToggle = (
  toggleEvent,
  event,
  type,
  userId,
  completePublicEventClicked
) => {
  toggleEvent({
    variables: {
      eventId: event.id,
      set: {
        is_completed: !event.is_completed
      }
    },
    update: (cache, { data: { update_event } }) => {
      // eslint-disable-line
      const query = type === "private" ? QUERY_PRIVATE_EVENT : QUERY_LOCAL_EVENT;
      if (type === "private") {
        const data = cache.readQuery({
          query: query,
          variables: { userId: userId }
        });
        const toggledEvent = data.events.find(t => t.id === event.id);
        toggledEvent.is_completed = !event.is_completed;
        cache.writeQuery({
          query: query,
          variables: {
            userId: userId
          },
          data
        });
      } else if (type === "public") {
        completePublicEventClicked(event);
      }
    }
  });
};

const handleEventDelete = (
  deleteEvent,
  event,
  type,
  userId,
  deletePublicEventClicked
) => {
  deleteEvent({
    variables: {
      eventId: event.id
    },
    update: (cache, { data: { update_event } }) => {
      // eslint-disable-line
      const query = type === "private" ? QUERY_PRIVATE_EVENT : QUERY_LOCAL_EVENT;
      if (type === "private") {
        const data = cache.readQuery({
          query: query,
          variables: { userId: userId }
        });
        data.events = data.events.filter(t => {
          return t.id !== event.id;
        });
        cache.writeQuery({
          query: query,
          variables: {
            userId: userId
          },
          data
        });
      } else if (type === "public") {
        deletePublicEventClicked(event);
      }
    }
  });
};

const EventItem = ({
  index,
  event,
  type,
  userId,
  completePublicEventClicked,
  deletePublicEventClicked
}) => (
  <Mutation mutation={MUTATION_EVENT_UPDATE}>
    {updateEvent => {
      return (
        <Mutation mutation={MUTATION_EVENT_DELETE}>
          {deleteEvent => {
            return (
              <li
                onClick={() => {
                  handleEventToggle(
                    updateEvent,
                    event,
                    type,
                    userId,
                    completePublicEventClicked
                  );
                }}
              >
                {event.is_public ? (
                  <div className="userInfoPublic" title={event.user.name}>
                    {/*event.user.name.charAt(0).toUpperCase()*/}
                  </div>
                ) : null}
                <div className="view">
                  {event.is_completed ? (
                    <div className="round">
                      <input
                        checked={true}
                        type="checkbox"
                        id={event.id}
                        onChange={() => {
                          handleEventToggle(
                            updateEvent,
                            event,
                            type,
                            userId,
                            completePublicEventClicked
                          );
                        }}
                      />
                      <label htmlFor={event.id} />
                    </div>
                  ) : (
                    <div className="round">
                      <input
                        type="checkbox"
                        checked={false}
                        id={event.id}
                        onChange={() => {
                          handleEventToggle(
                            updateEvent,
                            event,
                            type,
                            userId,
                            completePublicEventClicked
                          );
                        }}
                      />
                      <label htmlFor={event.id} />)
                    </div>
                  )}
                </div>
                <div className="labelContent">
                  {event.is_completed ? (
                    <strike className="todoLabel">
                      <div data-test={type + "_" + index + "_" + event.text}>
                        {event.text}
                      </div>
                    </strike>
                  ) : (
                    <div data-test={type + "_" + index + "_" + event.text}>
                      {event.text}
                    </div>
                  )}
                </div>
                <button
                  className="closeBtn"
                  data-test={"remove_" + type + "_" + index + "_" + event.text}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEventDelete(
                      deleteEvent,
                      event,
                      type,
                      userId,
                      deletePublicEventClicked
                    );
                  }}
                >
                  x
                </button>
              </li>
            );
          }}
        </Mutation>
      );
    }}
  </Mutation>
);

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  type: PropTypes.string,
  userId: PropTypes.string
};

export default EventItem;
