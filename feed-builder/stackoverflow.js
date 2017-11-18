var request = require('request');
var config = require('../server-config').config.feed.stackoverflow;

/**
 * Get profile info from stackoverflow
 */
exports.stackoverflow = function () {

    const options = {
        method: 'GET',
        uri: 'https://api.stackexchange.com/2.2/users/' + config.userId + '/network-activity',
        gzip: true,
        headers: {
            accept: 'application/json',
            'User-Agent': 'NodeJS',
            'Accept-Encoding': 'gzip,deflate'
        }
    };

    /**
     * Process result
     * 
     * @param [] result 
     */
    function processResult(result) {

        var feed = [];

        result.items.forEach((element) => {

            let item = null;

            // Answer posted
            if (element.activity_type === 'answer_posted') {
                item = {
                    type: 'stackoverflowAnswer',
                    date: new Date(element.creation_date * 1000),
                    data: {
                        answerLink: element.link,
                        answerDescription: element.description,
                        questionTitle: element.title,
                        questionTags: element.tags
                    }
                }
            }

            // Badge earned
            if (element.activity_type === 'badge_earned') {
                item = {
                    type: 'stackoverflowBadge',
                    date: new Date(element.creation_date * 1000),
                    data: {
                        badgeTitle: element.title
                    }
                }
            }
            
            if (item) {
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