var https = require('https');
var fs = require('fs');

var github = function() {

  var options = {
    host: 'api.github.com',
    port: 443,
    path: '/users/mickaelmarchal/events',
    method: 'GET',
    headers: {
      accept: 'application/json'
    },
    headers: {
      accept: 'application/json',
      'User-Agent': 'NodeJS'
    }
  };

  var req = https.request(options, function (res) {
    console.log(res.statusCode);
    res.on('data', function (d) {
      process.stdout.write(d);
    });
  });
  req.end();

  req.on('error', function (e) {
    console.log('Github');
    console.error(e);
  });

};


var stackoverflow = function() {

  var options = {
    host: 'api.stackexchange.com',
    port: 443,
    path: '/2.2/users/8545056/network-activity',
    method: 'GET',
    headers: {
      accept: 'application/json',
      'User-Agent': 'NodeJS'
    }
  };

  var req = https.request(options, function (res) {
    console.log(res.statusCode);
    res.on('data', function (d) {
      process.stdout.write(d);
    });
  });
  req.end();

  req.on('error', function (e) {
    console.log('Stackoverflow');
    console.error(e);
  });

};


github();
//stackoverflow();
