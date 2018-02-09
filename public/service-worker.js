const CACHE_NAME = "mm-cache-v1";
const urlsToCache = [
  "/",
  "/favicon.png",
  "/fond.png",
  "/font-awesome-animation.min.css",
  "/profile-img.png",
  "/styles.css",
  "https://code.jquery.com/jquery-3.2.1.min.js",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/moment.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/locale/fr.js",
  "https://cdn.jsdelivr.net/npm/jquery-lazy@1.7.7/jquery.lazy.min.js"
];

// Listen for the install event, which fires when the service worker is installing
self.addEventListener("install", event => {
  // Ensures the install event doesn't complete until after the cache promise resolves
  // This is so we don't move on to other events until the critical initial cache is done
  event.waitUntil(precache());
});

// Listen for the activate event, which is fired after installation
// Activate is when the service worker actually takes over from the previous
// version, which is a good time to clean up old caches
self.addEventListener("activate", event => {
  console.log("Finally active. Ready to serve!");
  event.waitUntil(
    // Get the keys of all the old caches
    caches
      .keys()
      // Ensure we don't resolve until all the promises do (i.e. each key has been deleted)
      .then(keys =>
        Promise.all(
          keys
            // Remove any cache that matches the current cache name
            .filter(key => key !== CACHE_NAME)
            // Map over the array of old cache names and delete them all
            .map(key => caches.delete(key))
        )
      )
  );
});

// On fetch, use cache but update the entry with the latest contents from the server.
self.addEventListener("fetch", function(evt) {
  console.log("The service worker is serving the asset.");

  // Try network and if it fails, go for the cached copy.
  evt.respondWith(
    fromNetwork(evt.request, 400).catch(function() {
      return fromCache(evt.request);
    })
  );
});

// Open a cache and use addAll() with an array of assets to add all of them to the cache. Return a promise resolving when all the assets are added.
function precache() {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  });
}

// Time limited network request. If the network fails or the response is not served before timeout, the promise is rejected.
function fromNetwork(request, timeout) {
  return new Promise(function(fulfill, reject) {
    // Reject in case of timeout.

    var timeoutId = setTimeout(reject, timeout);

    // Fulfill in case of success.

    fetch(request).then(function(response) {
      clearTimeout(timeoutId);
      fulfill(response);
      // Reject also if network fetch rejects.
    }, reject);
  });
}

// Open the cache where the assets were stored and search for the requested resource. Notice that in case of no matching, the promise still resolves but it does with undefined as value.
function fromCache(request) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.match(request).then(function(matching) {
      return matching || Promise.reject("no-match");
    });
  });
}
