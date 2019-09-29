var express = require('express');
var router = express.Router();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const {
    AUTHDOMAIN,
    AUDIENCE,
} = require('../config');


const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${AUTHDOMAIN}/.well-known/jwks.json`
    }),

    audience: AUDIENCE,
    issuer: `https://${AUTHDOMAIN}/`,
    algorithm: ["RS256"]
});
  
  // Define an endpoint that must be called with an access token
router.get("/external", checkJwt, (req, res) => {
res.send({
    msg: "Your Access Token was successfully validated!"
});
});

module.exports = router;
