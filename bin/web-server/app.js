import express from 'express';
const app = express();

//Exit and Restart-Management
import {cleanUpAndExit, restoreProgress} from './startup-exit.js';
process.on('exit', cleanUpAndExit);
process.on('uncaughtException', cleanUpAndExit);
process.on('SIGINT', cleanUpAndExit);
process.on('SIGTERM', cleanUpAndExit);
restoreProgress();

// view engine setup
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Manage Routers
import {indexRouter, deleteRouter, downloadRouter, watchRouter, registerRouter, managementRouter} from './routerManager.js';
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/watch', watchRouter);
app.use('/download', downloadRouter);
app.use('/delete', deleteRouter);
app.use('/man', managementRouter);

export default app;
