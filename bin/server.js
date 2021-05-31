#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from './web-server/app.js';
import http from 'http';
import {serverConfiguration} from './fileSysem/dataFiles.js';
import express from "express";

app.set('port', serverConfiguration.port);

const server = http.createServer(app);

app.use('/stylesheets', express.static('./public/stylesheets'));
app.use('/thumbnails', express.static(serverConfiguration.videoDirectory));
app.use('/videos', express.static(serverConfiguration.videoDirectory));

server.listen(serverConfiguration.port);
server.on('listening', function () {

    console.log(`Listening to ${serverConfiguration.domain}:${serverConfiguration.port}`);
});
