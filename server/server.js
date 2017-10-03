const express = require('express');
const github = require('./github');
const stackoverflow = require('./stackoverflow');

const app = express();

app.get('/', function (req, res) {

    github.github(response => { res.send(response)}, error => { console.log(error)});
    //stackoverflow.stackoverflow(response => { res.send(response) }, error => { console.log(error) });

});

app.listen(3000, function () {
    console.log('Listening on port 3000!')
});
