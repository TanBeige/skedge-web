import React, { Component, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import Container from '@material-ui/core/Container'
import FriendItem from "./AddCohost/FriendItem";
import { QUERY_ACCEPTED_FRIENDS } from "EventQueries/EventQueries.js";
import List from '@material-ui/core/List';
import { Button } from "@material-ui/core";

export default function ListFollowers(props) {

    //const [checked, setChecked] = React.useState(props.guests);

    const handleToggle = value =>{
      console.log(value)
      const currentIndex = props.guests.indexOf(value);
      const newChecked = props.guests;

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      //setChecked(newChecked);
      props.selectGuests(newChecked)
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
          let finalData = data.follower;

          return (
            <div className="listFriends">
                  <List style={{width: '100%'}}>
                      {finalData.map((follower, index) => {
                      return (
                              <FriendItem
                              key={index}
                              index={index}
                              check={props.guests}
                              friend={follower}
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
  
ListFollowers.propTypes = {
  userId: PropTypes.string.isRequired,
};
    