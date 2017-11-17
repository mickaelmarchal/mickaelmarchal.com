const fs = require('fs');
const github = require('./github');
const stackoverflow = require('./stackoverflow');
const medium = require('./medium-rss');
const pocket = require('./pocket');
const instagram = require('./instagram');

function getAll() {
    return Promise.all([
        github.github(),
        stackoverflow.stackoverflow(),
        pocket.pocket(),
        medium.medium(),
        instagram.instagram(),

        //TODO instagram, twitter
        /*
        A mettre :
    - commits Github
    - questions / réponses Stackoverflow
    - ajouts Pocket
    - stars github
    - favoris / coups de coeur Medium
    - photos instagram
    - news custom
    - limiter à X résultats
    - pouvoir bloquer un item tout en haut du feed
*/
    ]);
}

/**
 * Merge following githubPush entries (if they are on the same repo), taking most recent date.
 */
function mergeGithub(items) {

    var mergedItems = [];
    var lastItem = null;

    items.forEach((item) => {

        if(item.type == 'githubPush' && lastItem && lastItem.type == 'githubPush' && item.data.repoName == lastItem.data.repoName) {
            item.data.messages.forEach((message) => {
                lastItem.data.messages.push(message);
            });
        } else {
            if(lastItem) {
                mergedItems.push(lastItem);
            }
            if(item.type != 'githubPush') {
                mergedItems.push(item);
            } else {
               lastItem = item;
            }
        }
    });

    if(lastItem) {
        mergedItems.push(lastItem);
    }

    return mergedItems;
}


getAll().then(results => {

    var feed = [];
    
    // concatenate all results into one feed
    results.forEach((item) => {        
        feed = feed.concat(item);
    });

    // sort them by date
    feed = feed.sort((a, b) => {
        return b.date.getTime() - a.date.getTime(); 
    });

    // merge contiguous items of the same type in one item
    feed = mergeGithub(feed);

    // only keep the 20 most recent enties
    feed = feed.slice(0, 20);


    var filePath = __dirname + '/../public/feed.json';
    console.log('Writing feed to ' + filePath);
    
    fs.writeFileSync(filePath, JSON.stringify(feed));
    
    console.log('Done!');
});