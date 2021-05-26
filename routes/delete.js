const express = require('express');
const router = express.Router();
const dataManager = require('../data/dataManager');

router.get('/all/', function (req, res) {

    dataManager.deleteAllVideos();

    res.send('deleted all videos');
});

router.get('/:vid/', function (req, res) {

    let {vid: videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    dataManager.deleteVideo(videoId);

    res.send('deleted');
});

module.exports = router;
