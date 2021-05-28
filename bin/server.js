#!/usr/bin/env node

/**
 * Module dependencies.
 */
const app = require('./app');
const http = require('http');
const dataManager = require('./dataManager');

/**
 * Get port from environment and store in Express.
 */
app.set('port', dataManager.port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(dataManager.port);
server.on('listening', onListening);


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {

    console.log(`Listening to ${dataManager.domain}:${dataManager.port}`);
}
