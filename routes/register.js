const express = require('express');
const router = express.Router();
const downloadManger = require('../bin/downloadManager');
const dataManager = require('../data/dataManager');
const videoObject = require('../models/Video');

router.get('/:videoId/:name?/', function (req, res) {

    let {videoId, name} = req.params;
    videoId = decodeURIComponent(videoId);
    name = name ? decodeURIComponent(name) : videoId;

    let video = new videoObject(name, videoId, new Date());

    if (dataManager.addVideo(video)) {

        downloadManger.addToQueue(video);
        downloadManger.startDownload().then();
    }

    res.send(`${dataManager.domain}/watch/${videoId}`);
});

module.exports = router;
