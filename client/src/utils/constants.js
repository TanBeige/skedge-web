require('dotenv').config({ path: '.env' });

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

export const webUrl = `https://secret-journey-62331.herokuapp.com`;
//export const webUrl = 'http://192.168.0.5:3000'
//export const webUrl = `http://localhost:3000`;
export const callbackUrl = `${webUrl}/callback`;
//export const backendUrl = 'http://localhost:9000';
export const backendUrl = `https://secret-journey-62331.herokuapp.com:9000`;

export const s3Url = process.env.S3URL;
