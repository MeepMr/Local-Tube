const express = require('express');
const dataManager = require('../data/dataManager');

const deleteRouter = express.Router();

deleteRouter.get('/all/', function (req, res) {

    dataManager.deleteAllVideos();

    res.send('deleted all videos');
});

deleteRouter.get('/:vid/', function (req, res) {

    let {vid: videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    dataManager.deleteVideo(videoId);

    res.send('deleted');
});

module.exports.deleteRouter = deleteRouter;

const managementRouter = express.Router();

managementRouter.get('/newVideos', function (req, res) {

    let newVideosString = dataManager.getNewVideosList();

    res.send(newVideosString);
});

managementRouter.get('/cleanUp/:interval?', function (req, res) {

    let {interval} = req.params;
    interval = interval ? decodeURIComponent(interval) : 2;

    res.send(`Deleted ${dataManager.deleteOldVideos(interval)} Videos`);
});

module.exports.managementRouter = managementRouter;
