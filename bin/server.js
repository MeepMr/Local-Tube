#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from './app.js';
import http from 'http';
import {serverConfiguration} from './dataManager.js';

/**
 * Get port from environment and store in Express.
 */
app.set('port', serverConfiguration.port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(serverConfiguration.port);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {

    console.log(`Listening to ${serverConfiguration.domain}:${serverConfiguration.port}`);
}
