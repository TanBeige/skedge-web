import { authDomain, authClientId, callbackUrl, webUrl } from "../utils/constants";

export const AUTH_CONFIG = {
  domain: authDomain,
  clientId: authClientId,
  callbackUrl: callbackUrl,
  webUrl: webUrl,
  audience: "https://skedge-web.herokuapp.com/v1/graphql"
};
