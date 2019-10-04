import gql from "graphql-tag";

/*
  users is the database TABLE.
  user is the relationship between events.creator_id and users.auth0_id
*/


// Fragments
const EVENT_FRAGMENT = gql`
  fragment EventFragment on events {
    id
    name
    description
    event_type
    event_date
    start_time
    end_time
    category
    city
    state
    image {
      url
    }
    user {
      name
    }
  }
`;

const USER_FRAGMENT = gql`
  fragment UserFragment on users {
    full_name
    name
    email
    auth0_id
  }
`;

const FRIEND_FRAGMENT = gql`
fragment FriendFragment on users {
  auth0_id
  name
  picture
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
      ...EventFragment
    }
  }
  ${EVENT_FRAGMENT}
`;


// Fetch Events

const QUERY_FILTERED_EVENT = gql`
  query fetch_filtered_events($eventLimit: Int, $search: String, $category: String, $city: String, $state: String, $type: String) {
    events(
      order_by:[{event_date: asc}, {start_time: asc}]
      limit: $eventLimit
      where: {
        _or: [
          {name: {_ilike: $search}},
          {user: {
            _or: [
              {full_name: {_ilike: $search}},
              {name: {_ilike: $search}}
            ]}
          },
          {event_tags: {
            tag: 
              {name: {_ilike: $search}}
          }}
        ]
        _and: [
          {event_type: {_eq: $type}},
          {category: {_like: $category}},
          {city: {_ilike: $city}},
          {state: {_ilike: $state}}
        ]
      }
    )
    {
      ...EventFragment
    }
  }
  ${EVENT_FRAGMENT}
`

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
      ...EventFragment
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
      ...EventFragment
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
      ...EventFragment
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
      ...EventFragment
      user {
        ...UserFragment
      }
    }
  }
  ${EVENT_FRAGMENT}
  ${USER_FRAGMENT}
`;

const FETCH_TAGGED_EVENTS = gql`
  query fetch_tagged_events($tag: String){
    event_tags(where: {tag: {name: {_like: $tag}}}, order_by: {event: {event_date: asc}}) {
      event {
        ...EventFragment
      }
    }
  }
  ${EVENT_FRAGMENT}
`

// Mutate Events
const MUTATION_EVENT_ADD = gql`
  mutation insert_events($objects: [events_insert_input!]!) {
    insert_events(objects: $objects) {
      affected_rows
      returning {
        id
        name
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

const MUTATION_EVENT_IMPRESSION = gql`
  mutation update_events_mutation($eventId: Int) {
    update_events(
      where: {id: {_eq: $eventId}},
      _inc: {impressions: 1}
    ) {
      affected_rows
    }
  }
`

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
      friend_one {
        ...FriendFragment
      }
      friend_two {
        ...FriendFragment
      }
    }
  }
  ${FRIEND_FRAGMENT}
`;


export {
  QUERY_FILTERED_EVENT,
  QUERY_USER_PROFILE,
  QUERY_PRIVATE_EVENT,
  QUERY_LOCAL_EVENT,
  QUERY_FEED_LOCAL_EVENT,
  QUERY_FEED_LOCAL_OLD_EVENT,
  FETCH_TAGGED_EVENTS,
  MUTATION_EVENT_ADD,
  MUTATION_EVENT_UPDATE,
  MUTATION_EVENT_DELETE,
  MUTATION_EVENT_IMPRESSION,
  SUBSCRIPTION_EVENT_LOCAL_LIST,
  QUERY_ACCEPTED_FRIENDS
};


/*
Hasura GraphQL event search filter Test: 
// Not Ready Yet





*/