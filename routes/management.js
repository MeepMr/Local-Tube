import express from 'express';
import {deleteAllVideos, deleteOldVideos, deleteVideo, getNewVideosList} from '../bin/fileSystem/dataManager.js';
import {addToQueue, queue, saveShutdown, tryDownload} from '../bin/download/downloadManager.js';
import {restoreDownloads} from "../bin/download/failedDownloads.js";
import {cleanUpAndExit} from "../bin/web-server/startup-exit.js";

const deleteRouter = express.Router();

deleteRouter.get('/all/', function (req, res) {

    deleteAllVideos();

    res.redirect('/');
});

deleteRouter.get('/:vid/', function (req, res) {

    let {vid: videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    deleteVideo(videoId);

    res.redirect('/');
});

const managementRouter = express.Router();

managementRouter.get('/newVideos', function (req, res) {

    let newVideosString = getNewVideosList();

    res.send(newVideosString);
});

managementRouter.get('/cleanUp/:interval?/:days?', function (req, res) {

    let {interval, days} = req.params;
    days = days ? decodeURIComponent(days) : 0;
    interval = interval ? decodeURIComponent(interval) : 2;

    res.send(`Deleted ${deleteOldVideos(interval, days)} Videos`);
});

managementRouter.get('/exit', function (req, res) {

    res.send('Shut down server');
    cleanUpAndExit();
});

managementRouter.get('/saveExit', function (req, res) {

    saveShutdown = true;
    res.send(`Waiting for ${queue.length} downloads to complete and then shut down`);
});

managementRouter.get('/restoreDownloads', function (req, res) {

    for (let video of restoreDownloads().values()) {

        addToQueue(video);
    }

    tryDownload().catch();

    res.redirect('/');
});

export {managementRouter, deleteRouter}
