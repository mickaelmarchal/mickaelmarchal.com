var request = require('request');

/**
 * To use, create a medium-access-token.js file in the same directory
 * with the following content:
 * exports.token = 'YOUR_MEDIUM_API_ACCESS_TOKEN_HERE';
 */
var accessToken = require('./medium-access-token');

/**
 * Get profile info from medium
 * 
 * USELESS at the moment, the API does not return posts written
 * maybe check https://github.com/enginebai/PyMedium instead, or RSS feeds
 */
exports.medium = function () {

    const options = {
        method: 'GET',
        uri: 'https://api.medium.com/v1/users/190c90ed6a75f8b4c3ea42ce6778380cad253d5f5fc09d0f14c0e6c3587995c5b/publications',
        gzip: true,
        headers: {
            accept: 'application/json',
            'User-Agent': 'NodeJS',
            'Accept-Encoding': 'gzip,deflate',
            'Authorization': 'Bearer ' + accessToken.token
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