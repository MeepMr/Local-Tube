#!/usr/bin/env node

/**
 * Module dependencies.
 */
import https from 'https';
import http from 'http';
import express from "express";
import fs from "fs";
import localTube from './web-server/local-tube.js';
import {serverConfiguration} from './fileSystem/dataFiles.js';

localTube.set('port', serverConfiguration.httpsPort);
localTube.use(express.json());

const options = {
    key: fs.readFileSync('./data/certificates/key.pem', 'utf-8'),
    cert: fs.readFileSync('./data/certificates/cert.pem', 'utf-8')
};

const LocalTubeServer = https.createServer(options, localTube);

http.createServer((req, res) => {

    res.writeHead(301, {Location: `https://${serverConfiguration.domain}`});
    res.end();
}).listen(serverConfiguration.httpPort);

localTube.use('/stylesheets', express.static('./public/stylesheets'));
localTube.use('/javascript', express.static('./public/javascript'));
localTube.use('/images', express.static('./public/images'));
localTube.use('/favicons', express.static('./public/images/favicons'));
localTube.use('/thumbnails', express.static(serverConfiguration.videoDirectory));
localTube.use('/videos', express.static(serverConfiguration.videoDirectory));

LocalTubeServer.listen(serverConfiguration.httpsPort);
LocalTubeServer.on('listening', function () {

    console.log(`Listening to https://${serverConfiguration.domain}:${serverConfiguration.httpsPort}`);
});



import feedbackServer from './feedback-server/feedback-server.js';

const FeedBackServer = http.createServer(feedbackServer);
feedbackServer.use('/stylesheets', express.static('./public/stylesheets'));

FeedBackServer.listen(3090);
FeedBackServer.on('listening', function () {

    console.log('Feedback-Server started');
});

export {localTube}
