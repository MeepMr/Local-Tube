import express from 'express';
import {cleanUpAndExit, deleteAllVideos, deleteOldVideos, deleteVideo, getNewVideosList} from '../bin/dataManager.js';
import {queue, saveShutdown} from '../bin/downloadManager.js';

const deleteRouter = express.Router();

deleteRouter.get('/all/', function (req, res) {

    deleteAllVideos();

    res.send('deleted all videos');
});

deleteRouter.get('/:vid/', function (req, res) {

    let {vid: videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    deleteVideo(videoId);

    res.send('deleted');
});

const managementRouter = express.Router();

managementRouter.get('/newVideos', function (req, res) {

    let newVideosString = getNewVideosList();

    res.send(newVideosString);
});

managementRouter.get('/cleanUp/:interval?', function (req, res) {

    let {interval} = req.params;
    interval = interval ? decodeURIComponent(interval) : 2;

    res.send(`Deleted ${deleteOldVideos(interval)} Videos`);
});

managementRouter.get('/exit', function (req, res) {

    res.send('Shut down server');
    cleanUpAndExit();
});

managementRouter.get('/saveExit', function (req, res) {

    saveShutdown = true;
    res.send(`Waiting for ${queue.length} downloads to complete and then shut down`);
});

export {managementRouter, deleteRouter}
