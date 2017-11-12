var request = require('request');

/**
 * To use, create a pocket-access-token.js file in the same directory
 * with the following content:
 * exports.token = 'YOUR_POCKET_API_ACCESS_TOKEN_HERE';
 */
var accessToken = require('./pocket-access-token');


/**
 * Get last items from pocket
 */
exports.pocket = function () {

    const options = {
        method: 'POST',
        uri: 'https://getpocket.com/v3/get',
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        form: {
            consumer_key : "71958-8f110d43eefe00ddc4ee3a92",
            access_token : accessToken.token,
            state        : 'unread',
            count: 20,
            sort: "newest",
            detailType: "complete",
            // TODO enable this once cleaning in pocket is done :)
            // favorite: 1
        }
    };

    /**
     * Process results
     * 
     * @param [] result 
     */
    function processResult(result) {

        var feed = [];
        Object.keys(result.list).forEach((key) => {

            var element = result.list[key];

            var tags = [];
            if (element.tags) {
                Object.keys(element.tags).forEach((tagKey) => {
                    var tag = element.tags[tagKey];
                    tags.push(tag.tag);
                });
            }

            item = {
                type: 'pocketAdd',
                date: new Date(element.time_added * 1000),
                data: {
                    title: element.resolved_title ? element.resolved_title : element.given_title,
                    url: element.resolved_url ? element.resolved_url : element.given_url,
                    excerpt: element.excerpt && element.excerpt.length >= 20 ? element.excerpt : null,
                    imageUrl: element.image && element.image.src ? element.image.src : null,
                    tags: tags
                }
            };

            if(item && item.data.title.length >= 5 && item.data.url.length >= 10) {
                feed.push(item);
            }

        });

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