const HASURA_GRAPHQL_ENGINE_HOSTNAME = "skedge-web.herokuapp.com";

const scheme = proto => {
  return window.location.protocol === "https:" ? `${proto}s` : proto;
};

export const GRAPHQL_URL = `${scheme(
  "http"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
export const REALTIME_GRAPHQL_URL = `${scheme(
  "ws"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
export const authClientId = "RH47tlmwwW28QH44WrohPJ1YyjAAEEbd";
export const authDomain = "skedge.auth0.com";
export const callbackUrl = `https://secret-journey-62331.herokuapp.com/callback`//`http://localhost:3000/callback`;


//https://skedge.auth0.com/login?client=RH47tlmwwW28QH44WrohPJ1YyjAAEEbd&protocol=oauth2&response_type=token%20id_token&redirect_uri=https://localhost:3000/callback&scope=openid%20profile