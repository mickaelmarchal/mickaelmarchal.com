var https = require('https');

/**
 * Get profile info from github
 */
exports.github = function (onResult, onError) {

    const options = {
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

    let response = '';
    let req = https.request(options, function (res) {

        res.on('data', function (chunk) {
            response += chunk;
        });

        res.on('end', function () {
            let obj = JSON.parse(response);

            // TODO clear/standardize info
            onResult(obj);
        });

    });
    req.end();

    req.on('error', function (e) {
        onError(e);
    });
};