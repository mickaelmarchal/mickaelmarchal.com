var request = require('request');
var cheerio = require('cheerio');
var config = require('../server-config').config.feed.medium;

/**
 * Get last articles info from medium
 */
exports.medium = function () {

    /**
     * Process results
     * 
     * @param [] result 
     */
    function processResult(result) {

        var feed = [];       
        result.forEach((element) => {

            let item = {
                type: 'mediumArticle',
                date: new Date(element.timeISO),
                data: {
                    title: element.title,
                    url: element.url,
                    excerpt: element.excerpt,
                    image: element.image
                }
            }
            
            if (item) {
                feed.push(item);
            }

        });

        return feed;
    }

    return new Promise((resolve, reject) => {
        request(`https://medium.com/@${config.username}/latest`, (error, response, html) => {
          
            if (error) {
                reject(error);
            }

            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                var posts = [];
                $('.streamItem--postPreview').each((index, article) => {
                    var image = $(article).find('.graf-image').first().data('image-id');
                    posts.push({
                        title: $(article).find('.graf--title').text(),
                        excerpt: $(article).find('.graf--trailing').text(),            
                        time: $(article).find('time').text(),
                        timeISO: $(article).find('time').attr('datetime'),
                        image: image ? `https://cdn-images-1.medium.com/max/640/${image}` : null,
                        url: $(article).find('.postArticle-readMore').find('a').attr('href').split('?')[0]
                    });
                });
        
                resolve(processResult(posts));
            }
        });
    });
};