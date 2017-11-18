var request = require('request');
var config = require('../server-config').config.feed.github;

/**
 * Get profile info from github
 */
exports.github = function () {

    const options = {
        method: 'GET',
        uri: 'https://api.github.com/users/' + config.username +'/events',
        gzip: true,
        headers: {
            accept: 'application/json',
            'User-Agent': 'NodeJS',
            'Accept-Encoding': 'gzip,deflate'
        }
    };

    /**
     * Process results
     * 
     * @param [] result 
     */
    function processResult(result) {

        var feed = [];

        result.forEach((element) => {

            let item = null;

            // Github push.
            if(element.type === 'PushEvent') {
                
                messages = [];
                element.payload.commits.forEach(commit => {
                    messages.push(commit.message);
                });

                item = {
                    type: 'githubPush',
                    date: new Date(element.created_at),
                    data: {
                        repoName: element.repo.name,
                        repoUrl: element.repo.url,
                        branch: element.payload.ref.substr(element.payload.ref.lastIndexOf('/') + 1),
                        messages: messages,
                    }
                }
            }

            // Github create repo/branch/tag
            else if(element.type === 'CreateEvent') {
                
                item = {
                    type: 'githubCreate',
                    date: new Date(element.created_at),
                    data: {
                        repoName: element.repo.name,
                        repoUrl: element.repo.url,
                        createdType: element.payload.ref_type,
                        createdName: element.payload.ref_type === 'repository' ?
                            element.payload.description : element.payload.ref
                    }
                }
            }

            if(item) {
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