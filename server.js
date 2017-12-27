const express = require('express');
const fs = require('fs');
const request = require('request');
var config = require('./server-config').config;
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

/**
 * Callback for contact form
 */
app.post('/send-message', function(req, res) {
    
    var send = require('gmail-send')(config.gmailSend);
    var text = 
        'Name:  ' + req.body.name + "\n"
        + 'Email: ' + req.body.email + "\n"
        + 'Message: ' + "\n----------------------------------\n"
        + req.body.message + "\n----------------------------------\n";
    
    send({text: text}, function (err, result) {
        var isXhr = req.headers['x-requested-with'] === "XMLHttpRequest";
        if(err) {
            console.log('Error when sending email:' + err);
            if(isXhr) {
                res.json({success: false});                
            } else {
                res.send('<h1>An error has occurred</h1><p>Your message could not be sent.</p><p><a href="/">Back</a></p>');
            }
        } else {
            if(isXhr) {
                res.json({success: true});                
            } else {
                res.send('<h1>Message sent !</h1><p><a href="/">Back</a></p>');
            }
        }
    });
});

/**
 * Instagram oAuth2 authentication
 */
app.get('/instagram-auth', function(req, res) {

    res.send(
          '<h1>Instagram authentication</h1>'
        + '<p><a href="https://api.instagram.com/oauth/authorize/?client_id=' + config.feed.instagram.clientId
        + '&redirect_uri=' + encodeURIComponent(config.global.baseUrl) + '%2Finstagram-auth-landing&response_type=code">Click here</a></p>'
    );
});

/**
 * Instagram oAuth2 landing page
 */
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
        if(error) {
            res.send('<h1>Error</h1><pre>'+ error + '</pre>');
        } else {    
            var json = JSON.parse(body);
            res.send('Paste this token into server-config.js @ feed.instagram.accessToken: <br />' + json.access_token);
        }
    });
});


app.listen(3000, function () {
    console.log('Listening on port 3000!');
});
