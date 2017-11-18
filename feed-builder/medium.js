var request = require('request');
var config = require('../server-config').config.feed.medium;

/**
 * Get profile info from medium
 * 
 * USELESS at the moment, the API does not return posts written
 * maybe check https://github.com/enginebai/PyMedium instead, or RSS feeds
 */
exports.medium = function () {

    const options = {
        method: 'GET',
        uri: 'https://api.medium.com/v1/users/' + config.userId + '/publications',
        gzip: true,
        headers: {
            accept: 'application/json',
            'User-Agent': 'NodeJS',
            'Accept-Encoding': 'gzip,deflate',
            'Authorization': 'Bearer ' + config.accessToken
        }
    };

    /**
     * Process results
     * 
     * @param [] result 
     */
    function processResult(result) {
        return result;
    }

    return new Promise((resolve, reject) => {     
        request(options, function (error, response, body) {
            if(error) {
                reject(error);
            } else {         
                resolve(processResult(JSON.parse(body)));
            }
        });
    });

};