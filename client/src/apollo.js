import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { persistCache } from 'apollo-cache-persist';


import { GRAPHQL_URL, REALTIME_GRAPHQL_URL } from "./utils/constants";


const getHeaders = (tok) => {

  const headers = {};
  //const token = auth.getIdToken();
  const token = tok;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};


// await before instantiating ApolloClient, else queries might run before the cache is persisted

const makeApolloClient = (token) => {
  // Create an http link:
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    fetch,
    headers: getHeaders(token)
  });

  // Create a WebSocket link:
  const wsLink = new WebSocketLink(
    new SubscriptionClient(REALTIME_GRAPHQL_URL, {
      reconnect: true,
      timeout: 30000,
      connectionParams: () => {
        return { headers: getHeaders(token) };
      },
      connectionCallback: err => {
        if (err) {
          wsLink.subscriptionClient.close(false, false);
        }
      }
    })
  );
  // const wsLink = new WebSocketLink({
  //   uri: REALTIME_GRAPHQL_URL,
  //   connectionParams: {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //      }
  //   },
  //   options: {
  //     reconnect: true,
  //     timeout: 60000
  //   }
  // });

  // chose the link to use based on operation
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );

  /* Holding Cache so wehn refreshed the queue doesn't dissapear
  const cache = new InMemoryCache({
    addTypename: true
  })
  persistCache({
    cache,
    storage: window.localStorage,
  });*/
  
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
      addTypename: true
    }),
    connectToDevTools: true
  });
  

  return client;
};

export default makeApolloClient;
