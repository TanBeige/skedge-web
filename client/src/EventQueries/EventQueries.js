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
  price
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
    id
    image_uuid
  }
  user {
    id
    auth0_id
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

  shared_event_aggregate {
    aggregate {
      count
    }
  }

  user_saved_events{
    user_id
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
    entity
    
    followers_aggregate(where: {status: {_eq: 1}}) {
      aggregate {
        count
      }
    }
    followers{
      user_id
      is_following_id
      status
    }

    following_aggregate(where: {status: {_eq: 1}}) {
      aggregate {
        count
      }
    }
    following{
      user_id
      is_following_id
      status
    }
  }
`;

const USER_SEARCH_FRAGMENT = gql`
  fragment UserSearchFragment on users {
      id
      name
      full_name
      picture
      auth0_id
      entity
      followers (where: {status: {_eq: 1}}){
        user_id
        user {
          name
        }
      }
      followers_aggregate{
      	aggregate{
        	count
      	}
      }
  }
`

const DEAL_FRAGMENT = gql`
  fragment DealFragment on deals {
      id
      name
      description
      point_1
      point_2
      location_name
      start_date
      end_date
      is_recurring
      weekday
      start_time
      end_time
      category
      city
      state
      cover_pic
      savings
      user {
        id
        auth0_id
        picture
        name
        full_name
      }
  
      deal_likes {
        user {
          id
          name
        }
      }
      deal_likes_aggregate {
        aggregate {
          count
        }
      }
  }
  
`

// Fetch Users
const QUERY_USER_PROFILE = gql`
  query fetch_user($username: String!) {
    users(
      where: {name: { _eq: $username }}
    ) {  
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;
const QUERY_PROFILE_EVENTS = gql`
query fetch_profile_events($eventLimit: Int, $eventOffset: Int, $profileId: String, $userId: String, $date: date, $weekday: String) {
  events(
    limit: $eventLimit
    offset: $eventOffset
    order_by: {start_time: asc}
    where:{
    	_and: [
        {_or: [
          {_and: [
            {creator_id: {_eq: $profileId}},
          	{invite_only: {_eq: false}}
          ]},
          {shared_event: {user_id: {_eq: $profileId}}},
          {_and: [
          	{invite_only: {_eq: false}}
            {event_invites: {invited_id: {_eq: $profileId}}}
            {event_invites: {response: {_eq: 1}}}
          ]},
          {_and: [
            {invite_only: {_eq: true}},
            {event_invites: {invited_id: {_eq: $profileId}}}
            {event_invites: {invited_id: {_eq: $userId}}}
            {event_invites: {response: {_eq: 1}}}
          ]}
        ]},

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
  ) {
    ...EventFragment

    shared_event(where: {
      _or: [
        {user_id: {_eq: $profileId}},
        {_and: [
        	{user: {followers: {user_id: {_eq: $userId}}}},
          {user: {followers: {status: {_eq: 1}}}},
        ]}
      ]}
      order_by: {time_shared : desc}
    ){
      user_id
      user{
        id
        name
        full_name
      }
    }
    event_invites(where: {
      _or: [
        {invited_id: {_eq: $profileId}},
        {_and: [
          {response: {_eq: 1}},
          {invited: {followers: {user_id: {_eq: $userId}}}}
          {invited: {followers: {status: {_eq: 1}}}},
        ]}
      ]
    })
    {
      response
      invited{
        id
        name
        full_name
        auth0_id
      }
      inviter {
        id
        name
      }
    }
    
  }
}
${EVENT_FRAGMENT}
`

const FETCH_IF_ENTITY = gql`
  query check_if_entity($userId: String!) {
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

const FETCH_NOTIFICATIONS = gql`
query fetch_notifications($userId: String!, $limit: Int, $offset: Int) {
  notifications(limit: $limit offset: $offset where: {user_id: {_eq: $userId}} order_by: {id: desc}) {
    other_user{
      name
      id
      picture
    }
    source {
      name
      id
      image {
        id
        image_uuid
      }
      event_like_aggregate{
        aggregate{
          count
        }
      }
      shared_event_aggregate{
        aggregate{
          count
        }
      }
    }
    id
    activity_type
    description
    other_user_id
    source_id
    time_created
    seen
  }
}
`
const SEE_NOTIFICATION = gql`
  mutation see_notification($id: Int) {
    update_notifications(
      where: {id: {_eq: $id}}
      _set: {seen: true}
    ) {
      affected_rows
    }
  }
`

const FETCH_FOLLOW_REQUESTS = gql`
  subscription follow_requests($userId: String) {
    follower(
      where: { 
        _and: [
          {is_following_id: {_eq: $userId}},
          {status: {_eq: 0}}
        ]
      }
    ){
      user{
        ...UserSearchFragment
      }
    }
  }
  ${USER_SEARCH_FRAGMENT}
`

const FETCH_EVENT_INVITES = gql`
subscription follow_requests($userId: String!) {
  users(where: {auth0_id: {_eq: $userId}}) {
    name
    event_invites(where: {response: {_eq: 0}}) {
      event {
        name
        id
        description
        event_type
        
        start_time
        event_date {
          start_date
          end_date
          is_recurring
          weekday
        }
        image {
          id
          image_uuid
        }
      }
      inviter {
        name
        auth0_id
        full_name
        id
        picture
      }
    }
  }
}
`
const MUTATION_REMOVE_INVITE = gql`
mutation remove_invite($eventId: Int!, $userId: String!) {
  delete_event_invites(
    where: { 
      _and:[
        {event_id: { _eq: $eventId }},
        {invited_id: { _eq: $userId }}
      ]
    }) {
    affected_rows
  }
}`

// Fetch User Search
const USER_SEARCH = gql`
  query user_search($search: String, $limit: Int, $offset: Int, $userId: String!){
    users(
      where: {
        _or:[
          {name: {_ilike: $search}},
          {full_name: {_ilike: $search}}
        ]
      }
      limit: $limit
      offset: $offset
      order_by: {id: desc}
    ){
      id
      name
      full_name
      picture
      auth0_id
      entity
      followers (where: {user_id: {_eq: $userId}}){
        user_id
        status
        user {
          name
        }
      }
      followers_aggregate{
      	aggregate{
        	count
      	}
      }
    }
  }

  ${USER_SEARCH_FRAGMENT}
`

// Use in te future when I can actually test it out after people actually start following people
const SUGGESTED_USERS = gql`
  query suggested_users($userId: String){
    follower(
      where: {
        user_id: {_eq: $userId}
        status: {_eq: 1}
      }
    ){
      user{
        name
      }
      is_following {
        name
        following{
          is_following{
            name
          }
        }
      }
    }
  }
`


// ---------------- EVENTS -----------------

const FETCH_EVENT_GOING_SAVE = gql`
query fetch_event_going_save($eventId: Int, $userId: String) {
  users(where: {auth0_id: {_eq: $userId}}) {
    user_saved_events(where:{event_id:{_eq: $eventId}}) {
      time_saved
    }
    event_invites(where:{event_id:{_eq: $eventId}}) {
      event_id
      response
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
      user_id: $userId
    }, 
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

//Event Going
const MUTATION_EVENT_RESPONSE = gql`
mutation event_going($invitedId: String!, $inviterId: String!, $eventId: Int!, $response: Int!) {
  insert_event_invites(
    objects: {
      invited_id: $invitedId,
      inviter_id: $inviterId,
      event_id: $eventId, 
      response: $response
    }, 
      on_conflict: {
        constraint: event_invites_pkey
        update_columns: [response, response_timestamp]
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

const MUTATION_REMOVE_COHOST = gql`
mutation remove_cohost($eventId: Int!, $userId: String!) {
  delete_event_cohosts(where: {
    _and: [
      {event_id: {_eq: $eventId}},
      {cohost_id: {_eq: $userId}}
    ]
  }) {
    affected_rows
  }
}
`

const MUTATION_ADD_COHOST = gql`
mutation insert_cohost($object: [event_cohosts_insert_input!]!) {
	insert_event_cohosts(objects: $object) {
    affected_rows
  }
}
`
//old order_by: [{start_time: asc}, {event_like_aggregate: {count: desc_nulls_last}}]
//new order_by: [{event_like_aggregate: {count: desc}}, {shared_event_aggregate: {count: desc}}]
// Filter Event
const QUERY_FILTERED_EVENT = gql`
query fetch_filtered_events($eventLimit: Int, $eventOffset: Int, $userId: String!, $search: String, $category: String, $city: String, $state: String, $type: String, $date: date, $weekday: String, $lowerPrice: money, $upperPrice: money) {
  events(
    order_by: [{event_like_aggregate: {count: desc}}, {shared_event_aggregate: {count: desc}}]    limit: $eventLimit
    offset: $eventOffset
    where: {
      _and: [
        {event_type: {_eq: $type}},
        {category: {_like: $category}},
        {city: {_ilike: $city}},
        {state: {_ilike: $state}},
        {_and: [
        	{price: {_gte: $lowerPrice}}
          {price: {_lte: $upperPrice}}
        ]},
        {
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
        }
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

    shared_event(where: {
      _or: [
        {user_id: {_eq: $userId}},
        {_and: [
        	{user: {followers: {user_id: {_eq: $userId}}}},
          {user: {followers: {status: {_eq: 1}}}},
        ]}
      ]}
      order_by: {time_shared : desc}
    )
    {
      user_id
      user{
        id
        name
        full_name
      }
    }
    event_invites(where: {
      _or: [
        {invited_id: {_eq: $userId}},
        {_and: [
          {response: {_eq: 1}},
          {invited: {followers: {user_id: {_eq: $userId}}}},
          {invited: {followers: {status: {_eq: 1}}}},
        ]}
      ]
    })
    {
      response
      invited{
        id
        name
        full_name
        auth0_id
      }
      inviter {
        id
        name
      }
    }
  }
}
  ${EVENT_FRAGMENT}
`

const FETCH_FOLLOWING_FEED = gql`
query fetch_following_feed($userId: String!, $eventLimit: Int, $eventOffset: Int, $search: String, $category: String, $city: String, $state: String, $date: date, $weekday: String, $lowerPrice: money, $upperPrice: money) {
  events(
    order_by:[{event_like_aggregate: {count: desc_nulls_last}}, {id: desc}]
    limit: $eventLimit
    offset: $eventOffset
    where: {
      _and: [
        {category: {_like: $category}},
        {city: {_ilike: $city}},
        {state: {_ilike: $state}},
        {_or: [
          {creator_id: {_eq: $userId}},
          {_and: [
            {invite_only: {_eq: false}},
            {_or: [
              {_and: [
                {user: {followers: {user_id: {_eq: $userId}}}}
                {user: {followers: {status: {_eq: 1}}}}
              ]},
              {_and: [
                {shared_event: {user: {followers: {user_id: {_eq: $userId}}}}},
                {shared_event: {user: {followers: {status: {_eq: 1}}}}},
              ]},
              {_and: [
                {event_invites: {response: {_eq: 1}}}
                {event_invites: {invited: {followers: {user_id: {_eq: $userId}}}}}
                {event_invites: {invited: {followers: {status: {_eq: 1}}}}}
              ]}
            ]}
          ]},
          {_and: [
            {invite_only: {_eq: true}}
            {event_invites: {invited_id: {_eq: $userId}}},
          ]}
        ]},
        {_and: [
        	{price: {_gte: $lowerPrice}}
          {price: {_lte: $upperPrice}}
        ]},
        {
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
        }
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
    invite_only

    shared_event(where: {
      _or: [
        {user_id: {_eq: $userId}},
        {_and: [
        	{user: {followers: {user_id: {_eq: $userId}}}},
          {user: {followers: {status: {_eq: 1}}}},
        ]}
      ]}
      order_by: {time_shared : desc}
    ){
      user_id
      user{
        id
        name
        full_name
      }
    }
    event_invites(where: {
      _or: [
        {invited_id: {_eq: $userId}},
        {_and: [
          {response: {_eq: 1}},
          {_and: [
            {invited: {followers: {user_id: {_eq: $userId}}}}
            {invited: {followers: {status: {_eq: 1}}}},
          ]}
        ]}
      ]
    })
    {
      response
      invited{
        id
        name
        full_name
        auth0_id
      }
      inviter {
        id
        name
      }
    }
  }
}
${EVENT_FRAGMENT}
`
const FETCH_LANDING_FEED = gql`
query fetch_filtered_events($eventLimit: Int, $eventOffset: Int, $search: String, $category: String, $city: String, $state: String, $type: String, $date: date, $weekday: String, $lowerPrice: money, $upperPrice: money) {
  events(
    order_by:[{start_time: asc}, {event_like_aggregate: {count: desc_nulls_last}}]
    limit: $eventLimit
    offset: $eventOffset
    where: {
      _and: [
        {event_type: {_eq: $type}},
        {category: {_like: $category}},
        {city: {_ilike: $city}},
        {state: {_ilike: $state}},
        {_and: [
        	{price: {_gte: $lowerPrice}}
          {price: {_lte: $upperPrice}}
        ]},
        {
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
        }
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
  ${EVENT_FRAGMENT}
`
const QUERY_LANDING_FEED = gql`
query landing_feed($limit: Int, $offset: Int, $city: String, $state: String, $date: date, $weekday:String) {
  events(
    limit: $limit
    offset: $offset
    order_by: {id: desc}
    where: {_and: [
      {city: {_eq: $city}},
      {state: {_eq: $state}},
      {event_type: {_eq: "local"}},
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
          }
      	}
      ]
    }) {
      ...EventFragment
      shared_event_aggregate {
        aggregate {
          count
        }
      }
      shared_event {
        user_id
      }
  }
  deals(
    limit: $limit
    offset: $offset
    order_by: {id: desc}
    where: {_and: [
      {city: {_eq: $city}},
      {state: {_eq: $state}},
			{_or:[
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
      }
    ]
    } 
  ) {
    ...DealFragment
  }
}
${EVENT_FRAGMENT}
${DEAL_FRAGMENT}
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
  query fetch_event_info($eventId: Int!) {
    events(where: {id: {_eq: $eventId}}) {
      id
      name
      description
      location_name
      event_type

      event_date {
        start_date
        end_date
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
      guest_invites 
      invite_only 
      host_approval
      updated_at
      event_date_id

      latitude
      longitude

      views
      impressions

      cover_pic
      image {
        id
        image_uuid
      }
      user {
        id
        auth0_id
        picture
        name
        full_name
      }

      event_invites(where: {_or: [{response: {_eq: 1}}, {response: {_eq: 0}}]}) {
        response
        invited{
          id
          name
          full_name
          auth0_id
          picture
          entity
          followers{
            status
            user_id
          }
        }
      }

      event_invites_aggregate(where: {response: {_eq: 1}}) {
        aggregate{
          count
        }
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

      shared_event {
        user_id
        user {
          id
          name
        }
      }
    
      shared_event_aggregate {
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
      shared_event {
        user_id
      }
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
      shared_event {
        user_id
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
      shared_event {
        user_id
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
      shared_event {
        user_id
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
        shared_event {
          user_id
        }
      }
    }
  }
  ${EVENT_FRAGMENT}
`

const FETCH_SAVED_EVENTS = gql`
  query savedEvents($eventLimit: Int, $eventOffset: Int, $userId: String) {
    user_saved_events(
      where: {user_id: {_eq: $userId}}
      order_by: {time_saved: desc}
      limit: $eventLimit
      offset: $eventOffset
      )
    {
      event{
        ...EventFragment
        shared_event(where: {
          _or: [
            {user_id: {_eq: $userId}},
            {user: {followers: {user_id: {_eq: $userId}}}}
          ]}
          order_by: {time_shared : desc}
        )
        {
          user_id
          user{
            id
            name
            full_name
          }
        }
        event_invites(where: {
          _or: [
            {invited_id: {_eq: $userId}},
            {_and: [
              {response: {_eq: 1}},
              {invited: {followers: {user_id: {_eq: $userId}}}}
            ]}
          ]
        })
        {
          response
          invited{
            id
            name
            full_name
            auth0_id
          }
          inviter {
            id
            name
          }
        }
      }
    }
  }

  ${EVENT_FRAGMENT}
`

const FETCH_CREATED_EVENTS = gql`
query created_events($eventLimit: Int, $eventOffset: Int, $userId: String) {
  events(
    where: {creator_id: {_eq: $userId}}
    order_by: {created_at: desc}
    limit: $eventLimit
    offset: $eventOffset
    )
  {
		...EventFragment
    shared_event{
      user_id
      user{
        id
        name
        full_name
      }
    }
    event_invites{
      response
      invited{
        id
        name
        full_name
        auth0_id
      }
      inviter {
        id
        name
      }
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
        id
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
mutation update_event($eventId: Int!, $eventDateId: Int, $name: String, $locationName: String, $street: String, $city: String, $state: String, $startDate: date, $endDate: date, $isRecurring: Boolean, $weekday: String, $startTime: time, $endTime: time, $description: String, $category: String, $coverPic: Int, $webUrl: String, $price: money){
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
      category: $category,
      cover_pic: $coverPic,

      web_url: $webUrl,
      price: $price
    }
  ) {
    affected_rows
    returning{
      id
    }
  }
  update_event_dates(
    where: {id: {_eq: $eventDateId}}
    _set: {
      start_date: $startDate
      end_date: $endDate
      is_recurring: $isRecurring
      weekday: $weekday
    }
  ){
    returning{
      event_id
    }
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
mutation like_event($eventId: Int, $userId: String, $objects: [notifications_insert_input!]!) {
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

  insert_notifications(
    objects: $objects 
    on_conflict: {
      update_columns: time_created, 
      constraint: notifications_user_id_activity_type_source_id_other_user_id_key
    }
  ){
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
mutation repost_event($eventId: Int, $userId: String, $objects: [notifications_insert_input!]!) {
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
  
  insert_notifications(
    objects: $objects 
    on_conflict: {
      update_columns: time_created, 
      constraint: notifications_user_id_activity_type_source_id_other_user_id_key
    }
  ){
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

const ADD_GEOCODE_EVENT = gql`
  mutation update_event_geolocation($itemId: Int!, $latitude: numeric, $longitude: numeric) {
    update_events(where: {id: {_eq: $itemId}}, _set: {latitude: $latitude longitude: $longitude}) {
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

const QUERY_RELATED_EVENTS = gql`
query related_events($eventId: Int, $city: String, $state: String, $date: date, $weekday: String) {
  events(
    order_by: [{event_like_aggregate: {count: desc}}, {views: desc}]    
    limit: 50
    where: {
      _and: [
        {id: {_neq: $eventId}}
        {event_type: {_eq: "local"}},
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
  ){
    id
    name
    category
    location_name
    start_time
    price
    event_date{
      start_date
      is_recurring
      weekday
    }
    image{
      id
      image_uuid
    }
    user {
      id
      name
    }
  }
}
`

// Adding/Deleting Friends
const MUTATION_FOLLOW_REQUEST = gql`
mutation insert_follower($objects: [follower_insert_input!]!) {
  insert_follower(
    objects: $objects, 
    on_conflict: {
      update_columns: status, 
      constraint: following_pkey
    }) {
    affected_rows
  }
}
`;
const MUTATION_FOLLOW_DELETE = gql`
  mutation delete_follower($userId: String!, $followingId: String!) {
    delete_follower(where: {_and: [{user_id: {_eq: $userId}}, {is_following_id: {_eq: $followingId}}]}) {
      affected_rows
    }
  }
`;

// Fetching friends
const QUERY_ACCEPTED_FRIENDS = gql`
  query fetch_accepted_friends($userId: String!) {
    follower(
      where: {
        _and: [
          {is_following_id: {_eq: $userId}},
          {status: {_eq: 1}}
        ]
      }
      order_by: {user: {name: asc}}
    ) {
      user{
        auth0_id
        id
        name
        full_name
        picture
        entity
        followers{
          user_id
          status
        }
      }
    }
  }
`;

const QUERY_ACCEPTED_FOLLOWING = gql`
  query fetch_accepted_following($userId: String!) {
    follower(
      where: {
        _and: [
          {user_id: {_eq: $userId}},
          {status: {_eq: 1}}
        ]
      }
      order_by: {is_following: {name: asc}}
    ) {
      is_following{
        auth0_id
        id
        name
        full_name
        picture
        entity
        followers{
          user_id
          status
        }
      }
    }
  }
`;

const QUERY_CHECK_FRIEND = gql`
query check_following ($userId: String!, $profileId: String!) {
  follower(
    where: {
      _and: [
        {user_id: {_eq: $userId}},
        {is_following_id: {_eq: $profileId}},
      ]
    }
  ) {
    status
  }
}
`

const QUERY_BOTTOM_NAV = gql`
subscription fetch_user_nav($userId: String) {
  users(
    where: {auth0_id: { _eq: $userId }}
  ) {
    id
    followers_aggregate(where: {status: {_eq: 0}}) {
      aggregate {
        count
      }
    }
    notifications_aggregate(where: {seen: {_eq: false}}) {
      aggregate {
        count
      }
    }
    event_invites_aggregate(where: {response: {_eq: 0}}) {
      aggregate {
        count
      }
    }
  }
}
`


// ----------MOMENTS----------
const QUERY_EVENT_PAGE_MOMENTS = gql`
query query_event_memories($eventId: Int!, $limit: Int, $offset: Int) {
  events(limit: $limit, offset: $offset, where: {id: {_eq: $eventId}}) {
    moments (order_by: {time_posted: asc, id: asc}){
      time_posted
      source_id
      user{
        name
        picture
      }
      moment_likes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
}
`

const MUTATION_ADD_MOMENT = gql`
mutation add_moment($eventId: Int!, $sourceId: String!, $creatorId: String!){
  insert_moments(
    objects:{
      event_id: $eventId,
      source_id: $sourceId,
      creator_id: $creatorId
    }
  ) {
    returning{
      event_id
      source_id
      creator_id
    }
  }
}
`

// -------------- DEALS -------------
const MUTATION_DEAL_ADD = gql`
  mutation insert_deal($objects: [deals_insert_input!]!){
    insert_deals(objects: $objects){
      affected_rows
      returning{
        id
        name
      }
    }
  }
`
const MUTATION_DEAL_UPDATE = gql`
mutation update_deal($dealId: Int!, $name: String, $locationName: String, $street: String, $city: String, $state: String, $startTime: time, $endTime: time,$startDate: date, $endDate: date, $isRecurring: Boolean, $weekday:String, $description: String, $point1: String, $point2: String, $coverPic: String, $webUrl:String, $savings: String, $lat: numeric, $long: numeric){
  update_deals(
    where: {id: {_eq: $dealId}}
    _set: {
      name: $name,
      location_name: $locationName,
      street: $street,
      city: $city,
      state: $state,
      
      start_time: $startTime,
      end_time: $endTime,
      start_date: $startDate,
      end_date: $endDate,
      is_recurring: $isRecurring,
      weekday: $weekday,
      
      point_1: $point1,
      point_2: $point2,
      description: $description,
      cover_pic: $coverPic,
      web_url: $webUrl,
      savings: $savings,
      latitude: $lat,
      longitude: $long
    }
  ) {
    affected_rows
    returning{
      id
    }
  }
}
`
const MUTATION_DEAL_DELETE = gql`
  mutation delete_deal($dealId: Int) {
    delete_events(where: { id: { _eq: $dealId } }) {
      affected_rows
    }
  }
`;

const QUERY_DEAL_INFO = gql`
query query_deal_info($dealId: Int!) {
  deals(where: {id: {_eq: $dealId}}) {
    name
    point_1
    point_2
    description
    location_name

    start_date
    end_date
    is_recurring
    weekday
  

    start_time
    end_time

    category

    city
    state
    street
    savings
    web_url

    latitude
    longitude

    views
    impressions

    cover_pic
    user {
      id
      auth0_id
      picture
      name
      full_name
    }

    user_saved_deals {
      user_id
    }

    deal_likes {
      user {
        id
        name
      }
    }
    deal_likes_aggregate {
      aggregate {
        count
      }
    }
  }
}
`

const QUERY_DEAL_FEED = gql`
  query query_deal_feed($limit: Int, $offset: Int, $userId: String, $city: String, $state: String, $date: date, $weekday: String) {
    deals(
      order_by: [{deal_likes_aggregate: {count: desc}}, {id: desc}]    
      limit: $limit
      offset: $offset
      where: {
        _and: [
          {city: {_ilike: $city}},
          {state: {_ilike: $state}},
          {_or:[
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
          }
        ]
      }
    )
    {
      ...DealFragment
    }
  }
  ${DEAL_FRAGMENT}
`

const QUERY_RELATED_DEALS = gql`
query related_deals($dealId: Int, $city: String, $state: String, $date: date, $weekday: String) {
  deals(
    order_by: {views: desc}
    limit: 50
    where: {
      _and: [
        {id: {_neq: $dealId}}
        {city: {_ilike: $city}},
        {state: {_ilike: $state}},
        {
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
        }
      ]
    }
  ){
    id
    name
    location_name
    start_time
    savings

    start_date
    is_recurring
    weekday
    
    cover_pic

    user {
      id
      name
    }
  }
}
`

const MUTATION_DEAL_VIEW = gql`
  mutation update_deals_mutation($dealId: Int!) {
    update_deals(
      where: {id: {_eq: $dealId}},
      _inc: {views: 1}
    ) {
      affected_rows
    }
  }
`

const ADD_GEOCODE_DEAL = gql`
  mutation update_deal_geolocation($itemId: Int!, $latitude: numeric, $longitude: numeric) {
    update_deals(where: {id: {_eq: $itemId}}, _set: {latitude: $latitude longitude: $longitude}) {
      affected_rows
    }
  }
`


// --------------ANONYMOUS USER REQUESTS--------------

const USER_FRAGMENT_ANONYMOUS = gql`
  fragment UserFragmentAnonymous on users {
    auth0_id
    full_name
    name
    email
    biography
    picture
    verified
    entity
    
    followers_aggregate(where: {status: {_eq: 1}}) {
      aggregate {
        count
      }
    }

    following_aggregate(where: {status: {_eq: 1}}) {
      aggregate {
        count
      }
    }
  }
`;

// Fetch Users
const QUERY_USER_PROFILE_ANONYMOUS = gql`
  query fetch_user($username: String!) {
    users(
      where: {name: { _eq: $username }}
    ) {  
      ...UserFragmentAnonymous
    }
  }
  ${USER_FRAGMENT_ANONYMOUS}
`;

const QUERY_DEAL_INFO_ANONYMOUS = gql `
query query_deal_info($dealId: Int!) {
  deals(where: {id: {_eq: $dealId}}) {
    name
    point_1
    point_2
    description
    location_name

    start_date
    end_date
    is_recurring
    weekday
  
    start_time
    end_time

    category

    city
    state
    street
    savings
    web_url

    latitude
    longitude


    cover_pic
    user {
      id
      auth0_id
      picture
      name
      full_name
    }

    deal_likes_aggregate {
      aggregate {
        count
      }
    }
  }
}
`

const GET_ANNOUNCEMENT = gql`
query get_announcement($announcementId: Int) {
  announcements(where: {id: {_eq: $announcementId}}) {
    id
    name
    description
    date
    timestamp
    picture_id
    city
    state
    
    announcement_deals{
      description
      deal{
        id
        name
        cover_pic
      }
    }
    announcement_events{
      description
      event{
        id
        name
        image{
          image_uuid
        }
      }
    }
    
  }
}
`

export {
  QUERY_FILTERED_EVENT,
  FETCH_FOLLOWING_FEED,
  FETCH_LANDING_FEED,
  QUERY_LANDING_FEED,
  QUERY_USER_PROFILE,
  QUERY_PROFILE_EVENTS,
  FETCH_IF_ENTITY,
  MUTATION_EDIT_USER,
  REFETCH_USER_INFO,
  FETCH_NOTIFICATIONS,
  SEE_NOTIFICATION,
  USER_SEARCH,
  FETCH_FOLLOW_REQUESTS,
  FETCH_EVENT_INVITES,
  MUTATION_REMOVE_INVITE,

  MUTATION_REMOVE_COHOST,
  MUTATION_ADD_COHOST,

  MUTATION_EVENT_SAVE,
  MUTATION_EVENT_UNDO_SAVE,
  REFETCH_EVENT_SAVES,
  MUTATION_EVENT_GOING,
  MUTATION_EVENT_UNDO_GOING,
  REFETCH_EVENT_GOING,

  MUTATION_EVENT_RESPONSE,

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
  FETCH_SAVED_EVENTS,
  FETCH_CREATED_EVENTS,
  

  MUTATION_EVENT_ADD,
  MUTATION_EVENT_UPDATE,
  MUTATION_EVENT_DELETE,
  MUTATION_UNLIKE_EVENT,
  MUTATION_LIKE_EVENT,
  MUTATION_EVENT_IMPRESSION,
  MUTATION_EVENT_VIEW,
  MUTATION_REPOST_EVENT,
  MUTATION_UNPOST_EVENT,

  QUERY_RELATED_EVENTS,

  MUTATION_FOLLOW_REQUEST,
  MUTATION_FOLLOW_DELETE,
  ADD_GEOCODE_EVENT,

  MUTATION_DEAL_ADD,
  MUTATION_DEAL_UPDATE,
  MUTATION_DEAL_DELETE,
  QUERY_DEAL_INFO,
  MUTATION_DEAL_VIEW,
  ADD_GEOCODE_DEAL,
  QUERY_DEAL_FEED,
  QUERY_RELATED_DEALS,
  
  SUBSCRIPTION_EVENT_LOCAL_LIST,
  QUERY_ACCEPTED_FRIENDS,
  QUERY_ACCEPTED_FOLLOWING,
  QUERY_CHECK_FRIEND,
  QUERY_BOTTOM_NAV,
  QUERY_EVENT_PAGE_MOMENTS,
  MUTATION_ADD_MOMENT,

  QUERY_USER_PROFILE_ANONYMOUS,
  QUERY_DEAL_INFO_ANONYMOUS,

  GET_ANNOUNCEMENT
};


/*
Hasura GraphQL event search filter Test: 
// Not Ready Yet





*/