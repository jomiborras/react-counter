const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js"
];

const CACHE_NAME = "v2_cache_contador_react";

self.addEventListener("install", (event) => {    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            cache.addAll(CACHE_ELEMENTS).then(() => {
                self.skipWaiting();
            }).catch(err => console.log(err));
        })
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhiteList = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            //console.log(cacheNames);
            return Promise.all(cacheNames.map((cacheName) => {
                return (
                    cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName)
                );
            })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    // console.log(event.request);
    event.respondWith(
        caches.match(event.request).then((res) => {
            if(res){
                return res;
            }
            return fetch(event.request);
            // (res ? res : fetch(event.request))
        })
    );
});