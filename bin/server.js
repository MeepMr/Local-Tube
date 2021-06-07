#!/usr/bin/env node

/**
 * Module dependencies.
 */
import http from 'http';
import express from "express";

import localTube from './web-server/local-tube.js';

import {serverConfiguration} from './fileSystem/dataFiles.js';
localTube.set('port', serverConfiguration.port);
localTube.use(express.json());


const LocalTubeServer = http.createServer(localTube);


localTube.use('/stylesheets', express.static('./public/stylesheets'));
localTube.use('/javascript', express.static('./public/javascript'));
localTube.use('/thumbnails', express.static(serverConfiguration.videoDirectory));
localTube.use('/videos', express.static(serverConfiguration.videoDirectory));

LocalTubeServer.listen(serverConfiguration.port);
LocalTubeServer.on('listening', function () {

    console.log(`Listening to ${serverConfiguration.domain}:${serverConfiguration.port}`);
});



import feedbackServer from './feedback-server/feedback-server.js';

const FeedBackServer = http.createServer(feedbackServer);
feedbackServer.use('/stylesheets', express.static('./public/stylesheets'));

FeedBackServer.listen(3090);
FeedBackServer.on('listening', function () {

    console.log('Feedback-Server started');
});

export {localTube}
