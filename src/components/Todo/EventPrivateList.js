import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { GRAPHQL_URL } from "../../utils/constants";
import EventItem from "./EventItem";
import EventFilters from "./EventFilters";
import { QUERY_PRIVATE_EVENT } from "./TodoQueries";

class EventPrivateList extends Component {
  constructor() {
    super();
    this.state = { filter: "all", clearInProgress: false };
  }
  filterResults(type) {
    this.setState({ filter: type });
  }
  clearCompleted(type) {
    // mutation to delete all is_completed with is_public clause
    const isOk = window.confirm("Are you sure?");
    if (isOk) {
      this.setState({ clearInProgress: true });
      const isPublic = type === "public" ? true : false;
      this.props.client
        .query({
          query: `
            mutation ($isPublic: Boolean!) {
              delete_events (
                where: { is_public: {_eq: $isPublic}}
              ) {
                affected_rows
              }
            }
          `,
          endpoint: GRAPHQL_URL,
          variables: {
            isPublic: isPublic
          }
        })
        .then(() => {
          // handle response
          this.setState({ clearInProgress: false });
        })
        .catch(error => {
          this.setState({ clearInProgress: false });
          console.error(error);
        });
    }
  }
  render() {
    const { userId, type } = this.props;
    return (
      <Query query={QUERY_PRIVATE_EVENT} variables={{ userId: userId }}>
        {({ loading, error, data, refetch }) => {
          if (loading) {
            return <div>Loading. Please wait...</div>;
          }
          if (error) {
            return <div>{""}</div>;
          }
          refetch();
          // apply filters for displaying events
          console.log(data.events)
          let finalData = data.events;
          if (this.state.filter === "active") {
            finalData = data.events.filter(event => event.is_completed !== true);
          } else if (this.state.filter === "completed") {
            finalData = data.events.filter(event => event.is_completed === true);
          }
          return (
            <Fragment>
              <div className="todoListwrapper">
                <ul>
                  {finalData.map((event, index) => {
                    return (
                      <EventItem
                        key={index}
                        index={index}
                        event={event}
                        type={type}
                        userId={userId}
                      />
                    );
                  })}
                </ul>
              </div>
              <EventFilters
                events={data.events}
                userId={userId}
                type={type}
                currentFilter={this.state.filter}
                filterResults={this.filterResults.bind(this)}
                clearCompleted={this.clearCompleted.bind(this)}
                clearInProgress={this.state.clearInProgress}
              />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

EventPrivateList.propTypes = {
  userId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default EventPrivateList;
