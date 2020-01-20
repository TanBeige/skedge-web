import React, { Component, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import Container from '@material-ui/core/Container'
import FriendItem from "./FriendItem";
import { QUERY_ACCEPTED_FRIENDS } from "EventQueries/EventQueries.js";
import List from '@material-ui/core/List';
import { Button } from "@material-ui/core";

export default function ListCohosts(props) {

    //const [checked, setChecked] = React.useState(props.guests);

    const handleToggle = value =>{
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
          let finalData = data.follower;
          if(finalData.length === 0) {
            return(<h4 style={{textAlign: 'center'}}>No followers to invite.</h4>)
          }

          return (
            <div className="listFriends" style={{maxHeight: '50vh', overflow: 'auto'}}>
                  <List style={{width: '100%'}}>
                      {finalData.map((follower, index) => {
                      return (
                              <FriendItem
                              key={index}
                              index={index}
                              check={props.cohosts}
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
  
ListCohosts.propTypes = {
  userId: PropTypes.string.isRequired,
};
    