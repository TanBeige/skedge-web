import gql from "graphql-tag";

const EVENT_FRAGMENT = gql`
  fragment TodoFragment on events {
    id
    description
    created_at
    is_public
  }
`;

const USER_FRAGMENT = gql`
  fragment UserFragment on user {
    username
  }
`;

const QUERY_PRIVATE_EVENT = gql`
  query events($userId: String!) {
    events(
      where: { is_public: { _eq: false }, creator_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      ...TodoFragment
    }
  }
  ${EVENT_FRAGMENT}
`;

const QUERY_PUBLIC_EVENT = gql`
  query fetch_events($eventLimit: Int, $eventId: Int) {
    events(
      where: { is_public: { _eq: true }, id: { _gt: $eventId } }
      order_by: { created_at: desc }
      limit: $eventLimit
    ) {
      ...TodoFragment
      users {
        ...UserFragment
      }
    }
  }
  ${EVENT_FRAGMENT}
  ${USER_FRAGMENT}
`;

const QUERY_FEED_PUBLIC_EVENT = gql`
  query fetch_events($eventId: Int) {
    events(
      where: { is_public: { _eq: true }, id: { _gt: $eventId } }
      order_by: { created_at: desc }
    ) {
      ...TodoFragment
      users {
        ...UserFragment
      }
    }
  }
  ${EVENT_FRAGMENT}
  ${USER_FRAGMENT}
`;

const QUERY_FEED_PUBLIC_OLD_EVENT = gql`
  query fetch_events($eventId: Int) {
    events(
      where: { is_public: { _eq: true }, id: { _lt: $eventId } }
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

const MUTATION_EVENT_ADD = gql`
  mutation insert_events($objects: [events_insert_input!]!) {
    insert_events(objects: $objects) {
      affected_rows
      returning {
        id
        description
        updated_at
        is_public
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

const SUBSCRIPTION_EVENT_PUBLIC_LIST = gql`
  subscription($eventId: Int) {
    events(
      where: { is_public: { _eq: true }, id: { _gt: $eventId } }
      order_by: { created_at: desc }
      limit: 1
    ) {
      id
      text
      is_completed
      created_at
      is_public
    }
  }
`;

export {
  QUERY_PRIVATE_EVENT,
  QUERY_PUBLIC_EVENT,
  QUERY_FEED_PUBLIC_EVENT,
  QUERY_FEED_PUBLIC_OLD_EVENT,
  MUTATION_EVENT_ADD,
  MUTATION_EVENT_UPDATE,
  MUTATION_EVENT_DELETE,
  SUBSCRIPTION_EVENT_PUBLIC_LIST
};
