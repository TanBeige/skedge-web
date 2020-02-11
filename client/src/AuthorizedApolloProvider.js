// import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from '@apollo/link-context';
import React, {useEffect} from 'react';

//OLD IMPORTS
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';

import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";


import { GRAPHQL_URL, REALTIME_GRAPHQL_URL } from "./utils/constants";
import { useAuth0 } from './Authorization/react-auth0-wrapper.js';

const AuthorizedApolloProvider = ({ children }) => {
  const { getTokenSilently, loading, isAuthenticated, user } = useAuth0();
  useEffect(()=>{
    console.log("apollo: ", user)
  }, [loading])
  console.log("loading: " , loading)

  const getHeaders = async () => {
    const headers = {};
    let token = ""
    if(isAuthenticated) {
      token = await getTokenSilently();
    }
  
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };
  
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    fetch,
    headers: getHeaders()
  });

  const wsLink = new WebSocketLink(
    new SubscriptionClient(REALTIME_GRAPHQL_URL, {
      reconnect: true,
      timeout: 30000,
      connectionParams: () => {
        return { headers: getHeaders() };
      },
      connectionCallback: err => {
        if (err) {
          wsLink.subscriptionClient.close(false, false);
        }
      }
    })
  );

  // New Link
  // const authLink = setContext(async () => {
  //   const token = await getTokenSilently();
  //   return {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   };
  // });

  // Old Link
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );
  
  const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
    connectToDevTools: true
  });

  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
};

export default AuthorizedApolloProvider;