import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import Container from '@material-ui/core/Container'
import { GRAPHQL_URL } from "../../../../utils/constants";
import FriendItem from "./FriendItem";
import { QUERY_ACCEPTED_FRIENDS } from "EventQueries/EventQueries.js";
import List from '@material-ui/core/List';
import { Button } from "@material-ui/core";

class ListFriends extends Component {
    constructor(props) {
      super(props);
      this.state = { 
          selectedIndex: 0,
          cohost_id: 0
       };
       this.handleSelect = this.handleSelect.bind(this)
    }

    handleSelect(event, index, cohostId) {
        this.setState({
            selectedIndex: index,
        })
        this.props.selectCohost(cohostId)
    }

    render() {
      const { userId } = this.props;
      return (
        <Query query={QUERY_ACCEPTED_FRIENDS} variables={{ userId: userId }}>
          {({ loading, error, data, refetch }) => {
            if (loading) {
              return <div>Loading. Please wait...</div>;
            }
            if (error) {
              return <div>{""}</div>;
            }
            refetch();
            console.log(data.relationship)
            let finalData = data.relationship;

            return (
              <div className="listFriends">
                    <List style={{width: '100%'}}>
                        {finalData.map((friend, index) => {
                        return (
                                <FriendItem
                                key={index}
                                index={index}
                                friend={friend}
                                userId={userId}
                                selectedFriend={this.state.selectedIndex}
                                handleSelect={this.handleSelect}
                                />
                        );
                        })}
                    </List>
              </div>
            );
          }}
        </Query>
      );
    }
  }
  
  ListFriends.propTypes = {
    userId: PropTypes.string.isRequired,
};
  
export default ListFriends;
  