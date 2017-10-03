var https = require('https');

/**
 * Get profile info from stackoverflow
 */
exports.stackoverflow = function (onResult, onError) {

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

    let response = '';
    let req = https.request(options, function (res) {

        res.on('data', function (chunk) {
            response += chunk;
        });

        res.on('end', function () {
            let obj = JSON.parse(response);

            // TODO clear/standardize info
            // TODO does not come out as JSON string, investigate this. 
            onResult(obj);
        });

    });
    req.end();

    req.on('error', function (e) {
        onError(e);
    });
};