const express = require('express');
const router = express.Router() 

var request = require("request");

var options = {
    method: 'PATCH',
    url: 'https://skedge.auth0.com/api/v2/users/USER_ID',
    headers: {authorization: 'Bearer ABCD', 'content-type': 'application/json'},
    body: {user_metadata: {picture: 'https://example.com/some-image.png'}},
    json: true
};
  
/*
request(options, function (error, response, body) {

    if (error) throw new Error(error);
    console.log(body);
});*/


/* GET home page. */
router.post('/changepic', function(req, res, next) {
    var user_id = req.body.id;
    var token = req.body.token;
    var url = req.body.url;

    res.send(user_id + ' ' + token + ' ' + url);
});

module.exports = router;
