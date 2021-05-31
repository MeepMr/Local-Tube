import express from 'express';
import {serverConfiguration} from "../fileSysem/dataFiles.js";
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
app.use('/stylesheets', express.static('./public/stylesheets'));
app.use('/thumbnails', express.static(serverConfiguration.videoDirectory));

//Manage Routers
import {indexRouter, deleteRouter, downloadRouter, watchRouter, registerRouter, managementRouter} from './routerManager.js';
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/watch', watchRouter);
app.use('/download', downloadRouter);
app.use('/delete', deleteRouter);
app.use('/man', managementRouter);

export default app;
