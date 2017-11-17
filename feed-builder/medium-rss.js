var Feed = require('rss-to-json');

/**
 * Get last articles info from medium
 * 
 */
exports.medium = function () {

    /**
     * Process results
     * 
     * @param [] result 
     */
    function processResult(result) {

        var feed = [];
        
            result.items.forEach((element) => {
    
                let item = {
                    type: 'mediumArticle',
                    date: new Date(element.created),
                    data: {
                        title: element.title,
                        url: element.url.substr(0, element.url.indexOf('?')),
                    }
                }
                
                if (item) {
                    feed.push(item);
                }
    
            });
    
            return feed;
    }

    return new Promise((resolve, reject) => {
        
        Feed.load('https://medium.com/feed/@mickaelmarchal', function(error, rss) {
            if(error) {
                reject(error);
            } else {         
                resolve(processResult(rss));
            }
        });
    });

};