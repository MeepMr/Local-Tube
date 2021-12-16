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

let LocalTubeServer;
let port;

if(serverConfiguration.useHttps) {

    localTube.set('port', serverConfiguration.httpsPort);

    const options = {
        key: fs.readFileSync('./data/certificates/LocalTube.key', 'utf-8'),
        cert: fs.readFileSync('./data/certificates/LocalTube.crt', 'utf-8')
    };

    LocalTubeServer = https.createServer(options, localTube);
    port = serverConfiguration.httpsPort;

    http.createServer((req, res) => {

        res.writeHead(301, {Location: `https://${serverConfiguration.domain}`});
        res.end();
    }).listen(serverConfiguration.httpPort);
} else {

    localTube.set('port', serverConfiguration.httpPort);
    port = serverConfiguration.httpPort;
    LocalTubeServer = http.createServer(localTube);
}

localTube.use('/stylesheets', express.static('./public/stylesheets'));
localTube.use('/javascript', express.static('./public/javascript'));
localTube.use('/images', express.static('./public/images'));
localTube.use('/favicons', express.static('./public/images/favicons'));
localTube.use('/thumbnails', express.static(serverConfiguration.videoDirectory));
localTube.use('/videos', express.static(serverConfiguration.videoDirectory));

LocalTubeServer.listen(port);
LocalTubeServer.on('listening', function () {

    console.log(`Listening to https://${serverConfiguration.domain}:${port}`);
});

export {localTube}
