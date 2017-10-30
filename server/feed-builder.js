const fs = require('fs');
const github = require('./github');
const stackoverflow = require('./stackoverflow');



function getAll() {
    return Promise.all([
        github.github(),
        stackoverflow.stackoverflow()
    ]);
}

getAll().then(results => {

    var concatResults = []
    results.forEach((item) => {        
        concatResults = concatResults.concat(item);
    });

    concatResults = concatResults.sort((a, b) => {
        return b.date.getTime() - a.date.getTime(); 
    });

    fs.writeFileSync('./feed.json', JSON.stringify(concatResults));
});