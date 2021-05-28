const express = require('express');
const path = require('path');

//Import routers
const indexRouter = require('../routes');
const registerRouter = require('../routes/register');
const watchRouter = require('../routes/watch');
const downloadRouter = require('../routes/download');
const deleteRouter = require('../routes/management').deleteRouter;
const managementRouter = require('../routes/management').managementRouter;

const dataManager = require('./dataManager');
const app = express();

//Exit and Restart-Management
process.on('exit', dataManager.cleanUpAndExit);
process.on('uncaughtException', dataManager.cleanUpAndExit);
process.on('SIGINT', dataManager.cleanUpAndExit);
process.on('SIGTERM', dataManager.cleanUpAndExit);
dataManager.restoreProgress();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//Register the Routers
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/watch', watchRouter);
app.use('/download', downloadRouter);
app.use('/delete', deleteRouter);
app.use('/man', managementRouter);

module.exports = app;
