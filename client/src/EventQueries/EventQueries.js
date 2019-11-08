/*  Code Written By: Tan Arin
*
*   Description: 
*     Stores GraphQL queries that are used often in Skedge.
*/

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
  location_name
  event_type
  event_date {
    start_date
    is_recurring
    weekday
  }
  start_time
  end_time
  category
  city
  state
  image {
    image_uuid
  }
  user {
    id
    name
    picture
  }
  event_like{
    user_id
  }
  event_like_aggregate {
    aggregate {
      count
    }
  }
  shared_event {
    user_id
  }
  shared_event_aggregate {
    aggregate {
      count
    }
  }
  
}
`;

const USER_FRAGMENT = gql`
  fragment UserFragment on users {
    auth0_id
    full_name
    name
    email
    biography
    picture
    verified
  }
`;

const USER_FRIENDS_FRAGMENT = gql`
  fragment FriendListFragment on users {
    relationship_user_one {
      status
      friend_two {
        auth0_id
        id
        name
        picture
      }
    }
    relationship_user_two {
      status
      friend_one {
        auth0_id
        id
        name
        picture
      }
    }
  }

`

const FRIEND_FRAGMENT = gql`
fragment FriendFragment on users {
  auth0_id
  name
  picture
}
`;

// Fetch Users
const QUERY_USER_PROFILE = gql`
  query fetch_user($userId: bigint!, $limit: Int) {
    users(
      where: {id: { _eq: $userId }}
    ) {  
      ...UserFragment
    
      events (limit: $limit){
        ...EventFragment
      }
    
      shared_event (limit: $limit){
        event{
          ...EventFragment
        }
      }

      ...FriendListFragment
    }
  }
  ${USER_FRAGMENT}
  ${EVENT_FRAGMENT}
  ${USER_FRIENDS_FRAGMENT}
`;

const FETCH_IF_ENTITY = gql`
  query fetch_user_entity($userId: String!) {
    users(where: {auth0_id: {_eq: $userId}}) {
      entity
    }
  }
`

const MUTATION_EDIT_USER = gql`
  mutation edit_user($authId: String, $changes: users_set_input) {
    update_users(where: {auth0_id: {_eq: $authId}}, _set: $changes) {
      affected_rows
      returning{
        full_name
        id
      }
    }
  }
`
const REFETCH_USER_INFO = gql`
  query fetch_user_info($userId: String!) {
    users(where: {auth0_id: {_eq: $userId}}) {
      full_name
      biography
      picture
    }
  }
`


// Fetch Events

const FETCH_EVENT_GOING_SAVE = gql`
  query fetch_event_going_save($eventId: Int, $userId: String) {
    users(where: {auth0_id: {_eq: $userId}}) {
      user_saved_events(where:{event_id:{_eq: $eventId}}) {
        time_saved
      }
      event_goings(where:{event_id:{_eq: $eventId}}) {
        event_id
      }
    }
  }
`

  //Event Saves
const MUTATION_EVENT_SAVE = gql`  
mutation save_event($eventId: Int, $userId: String) {
  insert_user_saved_events(
    objects: {
      event_id: $eventId, 
      user_id: $userId}, 
      on_conflict: {
        update_columns: 
        time_saved, 
        constraint: user_saved_events_pkey
      }) {
    affected_rows
  }
}
`
const MUTATION_EVENT_UNDO_SAVE = gql`  
mutation unsave_event($eventId: Int, $userId: String) {
  delete_user_saved_events(
    where: { 
      _and:[
        {event_id: { _eq: $eventId }},
        {user_id:{_eq: $userId}}
      ]
    }) {
    affected_rows
  }
}
`
const REFETCH_EVENT_SAVES = gql`
query fetch_event_saves($eventId: Int) {
  user_saved_events(where: {event_id: {_eq: $eventId}}) {
    user_id
  }
}
`
  //Event Going
const MUTATION_EVENT_GOING = gql`
mutation event_going($eventId: Int, $userId: String) {
  insert_event_going(
    objects: {
      event_id: $eventId, 
      user_id: $userId}, 
      on_conflict: {
        update_columns:
        user_id
        constraint: event_going_pkey
      }) {
    affected_rows
  }
}
`
const MUTATION_EVENT_UNDO_GOING = gql`
mutation undo_going_event($eventId: Int, $userId: String) {
  delete_event_going(
    where: { 
      _and:[
        {event_id: { _eq: $eventId }},
        {user_id:{_eq: $userId}}
      ]
    }) {
    affected_rows
  }
}
`
const REFETCH_EVENT_GOING = gql`
query fetch_event_going($eventId: Int) {
  event_going(where: {event_id: {_eq: $eventId}}) {
    user_id
  }
}
`


// Filter Event
const QUERY_FILTERED_EVENT = gql`
query fetch_filtered_events($eventLimit: Int, $eventOffset: Int, $search: String, $category: String, $city: String, $state: String, $type: String, $date: date, $weekday: String) {
  events(
    order_by:[{start_time: asc}, {event_like_aggregate: {count: desc_nulls_last}}]
    limit: $eventLimit
    offset: $eventOffset
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
        {state: {_ilike: $state}},
        {event_date:{
          _or:[
            {
              _and: [
                {is_recurring: {_eq: false}},
                {start_date: {_eq: $date}}
           		]
            },
            {
              _and: [
                {is_recurring: {_eq: true}},
                {start_date: {_lte: $date}},
              	{end_date: {_gte: $date}},
                {weekday: {_like: $weekday}}
              ]
            }
          ]
        }}
      ]
    }
  )
  {
    ...EventFragment
  }
}
  ${EVENT_FRAGMENT}
`

const FETCH_EVENT_LIKES_REPOSTS = gql`
query event_likes_reblogs($eventId: Int) {
  events (where: {id: {_eq: $eventId}}) {
    event_like{
      user_id
    }
    event_like_aggregate {
      aggregate {
        count
      }
    }
    shared_event_aggregate {
      aggregate {
        count
      }
    }
    shared_event {
      user_id
    }
  }
}
`

const REFETCH_EVENT_LIKES = gql`
  query refetch_event_likes($eventId: Int) {
    events(where: {id:{_eq: $eventId}}) {
      event_like_aggregate{
        aggregate{
          count
        }
      }
      event_like {
        user_id
      }
    }
  }
`
const REFETCH_EVENT_REPOSTS = gql`
  query refetch_event_reposts($eventId: Int) {
    events(where: {id:{_eq: $eventId}}) {
      shared_event_aggregate{
        aggregate{
          count
        }
      }
      shared_event {
        user_id
      }
    }
  }
`

const FETCH_EVENT_INFO = gql`
  query fetch_event_info($eventId: Int) {
    events(where: {id: {_eq: $eventId}}) {
      name
      description
      location_name
      event_type

      event_date {
        start_date
        is_recurring
        weekday
      }

      start_time
      end_time
      category
      city
      state
      street
      price
      web_url
      allow_invites
      host_approval
      updated_at

      image {
        image_uuid
      }
      user {
        id
        auth0_id
        picture
        name
        full_name
      }

      event_going {
        user_id
      }
      user_saved_events {
        user_id
      }

      event_cohosts {
        cohost {
          name
          auth0_id
          id
          picture
        }
        accepted
      }
      event_tags {
        tag {
          name
        }
      }
      event_like {
        user {
          id
          name
        }
      }
      event_like_aggregate {
        aggregate {
          count
        }
      }
    }
  }
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
      event_cohosts {
        event_id
        cohost_id
      }
      image {
        image_name
        image_uuid
        url
        content_type
      }
      event_tags {
        tag {
          name
          id
        }
        tag_id
        event_id
      }
    }
  }
}

`;

const MUTATION_EVENT_UPDATE = gql`
mutation update_event($eventId: Int, $name: String, $locationName: String, $street: String, $city: String, $state: String, $startDate: date, $startTime: timetz, $endTime: timetz, $description: String, $category: String){
  update_events(
    where: {id: {_eq: $eventId}}
    _set: {
      name: $name,
      location_name: $locationName,
      street: $street,
      city: $city,
      state: $state,
      start_time: $startTime,
      end_time: $endTime,
      description: $description,
      category: $category
    }
  ) {
    affected_rows
  }
  update_event_dates(
    where: {event_id: {_eq: $eventId}}
    _set: {
			start_date: $startDate
    }
  ){
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
const MUTATION_EVENT_VIEW = gql`
  mutation update_events_mutation($eventId: Int) {
    update_events(
      where: {id: {_eq: $eventId}},
      _inc: {views: 1}
    ) {
      affected_rows
    }
  }
`

const MUTATION_LIKE_EVENT = gql`
mutation like_event($eventId: Int, $userId: String) {
  insert_event_likes(
    objects: {
      event_id: $eventId, 
      user_id: $userId}, 
      on_conflict: {
        update_columns: 
        time_liked, 
        constraint: event_likes_pkey
      }) {
    affected_rows
  }
}
`
const MUTATION_UNLIKE_EVENT = gql`
mutation unlike_event($eventId: Int, $userId: String) {
  delete_event_likes(
    where: { 
      _and:[
        {event_id: { _eq: $eventId }},
        {user_id:{_eq: $userId}}
      ]
    }) {
    affected_rows
  }
}
`

const MUTATION_REPOST_EVENT = gql`
mutation repost_event($eventId: Int, $userId: String) {
  insert_shared_events(
    objects: {
      event_id: $eventId, 
      user_id: $userId}, 
      on_conflict: {
        update_columns: 
        time_shared, 
        constraint: shared_events_pkey
      }) {
    affected_rows
  }
}
`

const MUTATION_UNPOST_EVENT = gql`
mutation unpost_event($eventId: Int, $userId: String) {
  delete_shared_events(
    where: { 
      _and:[
        {event_id: { _eq: $eventId }},
        {user_id:{_eq: $userId}}
      ]
    }) {
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

// Adding/Deleting Friends
const MUTATION_FRIEND_REQUEST = gql`
  mutation insert_relationships($objects: [relationship_insert_input!]!) {
    insert_relationship(
      objects: $objects, 
      on_conflict: {
        update_columns: status, 
        constraint: relationship_pkey
      }) {
      affected_rows
    }
  }
`;
const MUTATION_FRIEND_DELETE = gql`
  mutation delete_relationships($user_one_id: String, $user_two_id: String) {
    delete_relationship(
      where: {
        _and: [
          {user_one_id: {_eq: $user_one_id}},
          {user_two_id: {_eq: $user_two_id}}
        ]
      }
      ) {
      affected_rows
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
      status
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

const QUERY_CHECK_FRIEND = gql`
query check_relationship ($userId: String!, $profileId: String!) {
  relationship(
    where: {
      _or: [
        {_and: [
          {user_one_id: {_eq: $userId}},
          {user_two_id: {_eq: $profileId}}
        ]},
        {_and: [
          {user_one_id: {_eq: $profileId}},
          {user_two_id: {_eq: $userId}}
        ]},
      ]
    }
  ) {
    status
  }
}
`


export {
  QUERY_FILTERED_EVENT,
  QUERY_USER_PROFILE,
  FETCH_IF_ENTITY,
  MUTATION_EDIT_USER,
  REFETCH_USER_INFO,

  MUTATION_EVENT_SAVE,
  MUTATION_EVENT_UNDO_SAVE,
  REFETCH_EVENT_SAVES,
  MUTATION_EVENT_GOING,
  MUTATION_EVENT_UNDO_GOING,
  REFETCH_EVENT_GOING,

  FETCH_EVENT_GOING_SAVE,

  FETCH_EVENT_LIKES_REPOSTS,
  REFETCH_EVENT_LIKES,
  REFETCH_EVENT_REPOSTS,

  FETCH_EVENT_INFO,
  QUERY_PRIVATE_EVENT,
  QUERY_LOCAL_EVENT,
  QUERY_FEED_LOCAL_EVENT,
  QUERY_FEED_LOCAL_OLD_EVENT,
  FETCH_TAGGED_EVENTS,

  MUTATION_EVENT_ADD,
  MUTATION_EVENT_UPDATE,
  MUTATION_EVENT_DELETE,
  MUTATION_UNLIKE_EVENT,
  MUTATION_LIKE_EVENT,
  MUTATION_EVENT_IMPRESSION,
  MUTATION_EVENT_VIEW,
  MUTATION_REPOST_EVENT,
  MUTATION_UNPOST_EVENT,
  MUTATION_FRIEND_REQUEST,
  MUTATION_FRIEND_DELETE,
  
  SUBSCRIPTION_EVENT_LOCAL_LIST,
  QUERY_ACCEPTED_FRIENDS,
  QUERY_CHECK_FRIEND
};


/*
Hasura GraphQL event search filter Test: 
// Not Ready Yet





*/