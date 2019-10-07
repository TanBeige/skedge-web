import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import Container from '@material-ui/core/Container'
import { GRAPHQL_URL } from "../../../../utils/constants";
import FriendItem from "./FriendItem";
import { QUERY_ACCEPTED_FRIENDS } from "EventQueries/EventQueries.js";
import List from '@material-ui/core/List';
import { Button } from "@material-ui/core";

export default function ListFriends (props) {

    //const [checked, setChecked] = React.useState(props.cohosts);

    const handleToggle = value => () => {
      const currentIndex = props.cohosts.indexOf(value);
      const newChecked = props.cohosts;

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      //setChecked(newChecked);
      props.selectCohosts(newChecked)
    };

    const { userId } = props;
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
          let finalData = data.relationship;

          return (
            <div className="listFriends">
                  <List style={{width: '100%'}}>
                      {finalData.map((friend, index) => {
                      return (
                              <FriendItem
                              key={index}
                              index={index}
                              check={props.cohosts}
                              friend={friend}
                              userId={userId}
                              handleChange={handleToggle}
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
  
ListFriends.propTypes = {
  userId: PropTypes.string.isRequired,
};
    