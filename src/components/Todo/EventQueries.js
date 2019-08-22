import gql from "graphql-tag";

/*
  users is the database TABLE.
  user is the relationship between events.creator_id and users.auth0_id
*/


// Fragments
const EVENT_FRAGMENT = gql`
  fragment TodoFragment on events {
    id

    event_type
    name
    description
    event_date
    start_time 
    end_time 
    price
    allow_invites 
    host_approval 
    category
    web_url
    cover_pic
    street
    city
    state
    zip_code
  }
`;

const USER_FRAGMENT = gql`
  fragment UserFragment on users {
    username
    name
    email
    auth0_id
  }
`;

// Fetch Users
const QUERY_USER_PROFILE = gql`
  query fetch_user($userId: String!) {
    users(
      where: {auth0_id: { _eq: $userId }}
    ) {
      ...UserFragment
    }
    events(
      where: {creator_id: { _eq: $userId }}
    ) {
      ...TodoFragment
    }
  }
  ${EVENT_FRAGMENT}
`;


// Fetch Events
const QUERY_PRIVATE_EVENT = gql`
  query events($userId: String!) {
    events(
      where: { 
        _or: [
          {event_type: { _eq: "private" }}, 
          {creator_id: { _eq: $userId }}
        ]
      }
      order_by: { created_at: desc }
    ) {
      ...TodoFragment
    }
  }
  ${EVENT_FRAGMENT}
`;

const QUERY_LOCAL_EVENT = gql`
  query fetch_events($eventLimit: Int, $eventId: Int) {
    events(
      where: { event_type: { _eq: "local" }}
      order_by: { created_at: desc }
      limit: $eventLimit
    ) {
      ...TodoFragment
      user {
        ...UserFragment
      }
    }
  }
  ${EVENT_FRAGMENT}
  ${USER_FRAGMENT}
`;

const QUERY_FEED_LOCAL_EVENT = gql`
  query fetch_events($eventId: Int) {
    events(
      where: { event_type: { _eq: "local" }, id: { _gt: $eventId } }
      order_by: { created_at: desc }
    ) {
      ...TodoFragment
      user {
        ...UserFragment
      }
    }
  }
  ${EVENT_FRAGMENT}
  ${USER_FRAGMENT}
`;

const QUERY_FEED_LOCAL_OLD_EVENT = gql`
  query fetch_events($eventId: Int) {
    events(
      where: { event_type: { _eq: "local" }, id: { _lt: $eventId } }
      limit: 5
      order_by: { created_at: desc }
    ) {
      ...TodoFragment
      user {
        ...UserFragment
      }
    }
  }
  ${EVENT_FRAGMENT}
  ${USER_FRAGMENT}
`;

// Mutate Events
const MUTATION_EVENT_ADD = gql`
  mutation insert_events($objects: [events_insert_input!]!) {
    insert_events(objects: $objects) {
      affected_rows
      returning {
        id
        description
        created_at
        updated_at
        event_type
      }
    }
  }
`;

const MUTATION_EVENT_UPDATE = gql`
  mutation update_events($eventId: Int, $set: events_set_input!) {
    update_events(where: { id: { _eq: $eventId } }, _set: $set) {
      affected_rows
    }
  }
`;

const MUTATION_EVENT_DELETE = gql`
  mutation delete_events($eventId: Int) {
    delete_events(where: { id: { _eq: $eventId } }) {
      affected_rows
    }
  }
`;

const SUBSCRIPTION_EVENT_LOCAL_LIST = gql`
  subscription($eventId: Int) {
    events(
      where: { event_type: { _eq: "local" }, id: { _gt: $eventId } }
      order_by: { created_at: desc }
      limit: 1
    ) {
      id
      description
      created_at
      event_type
    }
  }
`;

// Fetching friends
const QUERY_ACCEPTED_FRIENDS = gql`
  query fetch_accepted_friends($userId: String!) {
    relationship(
      where: {
        _or: [
          {user_one_id: {_eq: $userId}}
          {user_two_id: {_eq: $userId}}
        ]
        _and: [
          {status: {_eq: 1}}
        ]
      }
    ) {
      user_one_id
      user_two_id
      status
    }
  }
`;


export {
  QUERY_USER_PROFILE,
  QUERY_PRIVATE_EVENT,
  QUERY_LOCAL_EVENT,
  QUERY_FEED_LOCAL_EVENT,
  QUERY_FEED_LOCAL_OLD_EVENT,
  MUTATION_EVENT_ADD,
  MUTATION_EVENT_UPDATE,
  MUTATION_EVENT_DELETE,
  SUBSCRIPTION_EVENT_LOCAL_LIST,
  QUERY_ACCEPTED_FRIENDS
};



