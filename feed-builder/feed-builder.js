const fs = require("fs");
const github = require("./github");
const stackoverflow = require("./stackoverflow");
const medium = require("./medium");
const pocket = require("./pocket");
const instagram = require("./instagram");
const twitter = require("./twitter");
var config = require("../server-config").config.feed;

function getAll() {
  return Promise.all([
    github.github(),
    stackoverflow.stackoverflow(),
    pocket.pocket(),
    // medium.medium(),
    instagram.instagram()
    // twitter.twitter()
  ]).catch(error => {
    console.log(error);
  });
}

/**
 * Merge following githubPush entries (if they are on the same repo), taking most recent date.
 */
function mergeGithub(items) {
  var mergedItems = [];
  var lastItem = null;

  items.forEach(item => {
    if (
      item.type == "githubPush" &&
      lastItem &&
      lastItem.type == "githubPush" &&
      item.data.repoName == lastItem.data.repoName
    ) {
      item.data.messages.forEach(message => {
        lastItem.data.messages.push(message);
      });
    } else {
      if (lastItem) {
        mergedItems.push(lastItem);
        lastItem = null;
      }
      if (item.type != "githubPush") {
        mergedItems.push(item);
      } else {
        lastItem = item;
      }
    }
  });

  if (lastItem) {
    mergedItems.push(lastItem);
  }

  return mergedItems;
}

getAll().then(results => {
  var feed = [];

  // concatenate all results into one feed
  results.forEach(item => {
    feed = feed.concat(item);
  });

  // sort them by date
  feed = feed.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });

  // merge contiguous items of the same type in one item
  feed = mergeGithub(feed);

  // only keep the most recent entries
  feed = feed.slice(0, config.maxElements);

  var filePath = __dirname + "/../public/feed.json";
  console.log("Writing feed to " + filePath);

  fs.writeFileSync(filePath, JSON.stringify(feed));

  console.log("Done!");
});
