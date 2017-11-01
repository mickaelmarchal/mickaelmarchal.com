const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

/*app.get('/feed', function (req, res) {

    fs.readFile('./feed.json', (err, data) => {
        if(err) {
            console.log(err);
        } else {
            res.contentType = 'application/json';
            res.json(JSON.parse(data));
        }

    })
});*/

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});
