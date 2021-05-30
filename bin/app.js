const express = require('express');
const path = require('path');



const dataManager = require('./dataManager');
const app = express();

//Exit and Restart-Management
process.on('exit', dataManager.cleanUpAndExit);
process.on('uncaughtException', dataManager.cleanUpAndExit);
process.on('SIGINT', dataManager.cleanUpAndExit);
process.on('SIGTERM', dataManager.cleanUpAndExit);
dataManager.restoreProgress();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/stylesheets', express.static(`${__dirname}/../public/stylesheets`));

//Manage Routers
const indexRouter = require('../routes');
app.use('/', indexRouter);

const registerRouter = require('../routes/register');
app.use('/register', registerRouter);

const watchRouter = require('../routes/watch');
app.use('/watch', watchRouter);

const downloadRouter = require('../routes/download');
app.use('/download', downloadRouter);

const deleteRouter = require('../routes/management').deleteRouter;
app.use('/delete', deleteRouter);

const managementRouter = require('../routes/management').managementRouter;
app.use('/man', managementRouter);

module.exports = app;
