const express = require('express');
const fs = require('fs');
const request = require('request');
var config = require('./server-config').config;

const app = express();

app.use(express.static('public'));



app.get('/instagram-auth', function(req, res) {

    res.send(
          '<h1>Instagram authentication</h1>'
        + '<p><a href="https://api.instagram.com/oauth/authorize/?client_id=' + config.feed.instagram.clientId
        + '&redirect_uri=' + encodeURIComponent(config.global.baseUrl) + '%2Finstagram-auth-landing&response_type=code">Click here</a></p>'
    );

});
app.get('/instagram-auth-landing', function(req, res) {

    var code = req.query.code;

    const options = {
        method: 'POST',
        uri: 'https://api.instagram.com/oauth/access_token',
        gzip: true,
        headers: {
            accept: 'application/json',
            'User-Agent': 'NodeJS',
            'Accept-Encoding': 'gzip,deflate'
        },
        form: {
            client_id: config.feed.instagram.clientId,
            client_secret: config.feed.instagram.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: config.global.baseUrl + '/instagram-auth-landing',
            code: code
        }
    };

    request(options, function (error, response, body) {
        console.log(body);     
        if(error) {
            console.log(error);
            res.send('<h1>Error</h1><pre>'+ error + '</pre>');
        } else {    
            var json = JSON.parse(body);
            console.log(json);
            console.log(body);         
            res.send('Paste this token into server-config.js feed.instagram.accessToken: <br />'+json.access_token);
        }
    });


})

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});
