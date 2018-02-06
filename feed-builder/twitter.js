var request = require('request');
var Twitter = require('twitter');
var config = require('../server-config').config.feed.twitter;

/**
 * Get latest tweets from twitter
 */
exports.twitter = function () {

    /**
     * Process results : retrieve all tweets posted and group them
     * if they have been written less than 4hr apart.
     * 
     * @param [] result 
     */
    function processResult(result) {

        var feed = [];
        var firstTimestamp = null;
        var item = null;
        
        result.forEach((element) => {

            var elementTimestamp = new Date(element.created_at);
            elementTimestamp = elementTimestamp.getTime();

            // Replace links-in-text with actual links
            var tweetText = element.text ? element.text : null;
            var offsetToAdd = 0;
            for(var i = 0; i < element.entities.urls.length; i++) {

                var url = element.entities.urls[i];
                var link = '<a href="'+ url.expanded_url+'">'+ url.url +'</a>';
                tweetText = tweetText.substr(0, url.indices[0] + offsetToAdd)
                          + link
                          + tweetText.substr(url.indices[1] + 1 + offsetToAdd);
                offsetToAdd += link.length;
            }
            tweetText = tweetText.replace(new RegExp('\r?\n','g'), '<br />');


            // new element is less than 4hr before previous one : group them
            if(firstTimestamp && firstTimestamp - elementTimestamp < (3600*4*1000)) {
                item.data.tweets.push({
                    text: tweetText
                });
            } else {
                if(item) {
                    feed.push(item);
                }

                firstTimestamp = elementTimestamp;
                item = {
                    type: 'tweet',
                    date: new Date(elementTimestamp),
                    data: {
                        tweets: [{
                            text: tweetText
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
        
        var client = new Twitter({
            consumer_key: config.consumerKey,
            consumer_secret: config.consumerSecret,
            access_token_key: config.accessTokenKey,
            access_token_secret: config.accessTokenSecret
        });

        client.get('https://api.twitter.com/1.1/statuses/user_timeline.json', {
            screen_name: config.screenName
        }, function (error, response, body) {
            if(error) {
                reject(error);
            } else {
                resolve(processResult(JSON.parse(body.body)));
            }
        });
    });

};