var request = require('request');
var config = require('../server-config').config.feed.pocket;


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
            consumer_key: config.consumerKey,
            access_token: config.accessToken,
            state: 'all',
            favorite: 1,
            count: 20,
            sort: "newest",
            detailType: "complete"
        }
    };

    /**
     * Process results
     * 
     * @param [] result 
     */
    function processResult(result) {

console.log(result);

        var feed = [];
        Object.keys(result.list).forEach((key) => {

            var element = result.list[key];

            var tags = [];
            var allowElement = true;
            if (element.tags) {
                Object.keys(element.tags).forEach((tagKey) => {
                    var tag = element.tags[tagKey];
                    tags.push(tag.tag);

                    // only allow some tags
                    if(! tag.tag.startsWith('archi/')
                        && ! tag.tag.startsWith('dev/')
                        && ! tag.tag.startsWith('devtools/')
                        && ! tag.tag.startsWith('ops/')
                        && ! tag.tag.startsWith('pro/')
                        && ! tag.tag.startsWith('web/')
                    ) {
                        allowElement = false;
                    }
                });
            }

            if(allowElement && tags.length) {
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