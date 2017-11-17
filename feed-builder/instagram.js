var request = require('request');


https://api.instagram.com/oauth/authorize/?client_id=9b4e4d243e174cefbafaf54427e7c075&redirect_uri=localhost&response_type=code

/**
 * To use:
 * - create a instagram-access-token.js file in the same directory
 * - go to /instagram-auth, login to your account and get the token 
 * - past the following content in instagram-access-token.js :
 * exports.token = 'YOUR_INSTAGRAM_API_ACCESS_TOKEN_HERE';
 */
var accessToken = require('./instagram-access-token');

/**
 * Get latest pictures from instagram
 */
exports.instagram = function () {

    const options = {
        method: 'GET',
        uri: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken.token,
        gzip: true,
        headers: {
            accept: 'application/json',
            'User-Agent': 'NodeJS',
            'Accept-Encoding': 'gzip,deflate'
        }
    };

    /**
     * Process results : retrieve all instagram pictures posted and group them
     * if they have been taken less than 72hr apart.
     * 
     * @param [] result 
     */
    function processResult(result) {

        var feed = [];

        var firstTimestamp = null;
        var item = null;
        
        result.data.forEach((element) => {

            var elementTimestamp = element.created_time;

            // new element is less than 72hr before previous one : group them
            if(firstTimestamp && firstTimestamp - elementTimestamp < (86400*3)) {
                item.data.images.push({
                    url: element.images.standard_resolution.url,
                    width: element.images.standard_resolution.width,
                    height: element.images.standard_resolution.height,
                    location: (element.location ? element.location.name : null)
                });
            } else {
                if(item) {
                    feed.push(item);
                }

                firstTimestamp = element.created_time;
                item = {
                    type: 'instagramPicture',
                    date: new Date(element.created_time * 1000),
                    data: {
                        images: [{
                            url: element.images.standard_resolution.url,
                            width: element.images.standard_resolution.width,
                            height: element.images.standard_resolution.height,
                            location: (element.location ? element.location.name : null)
                        }]
                    }
                }
            }
        });

        if(item) {
            feed.push(item);
        }

        return feed;
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