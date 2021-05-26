const express = require('express');
const router = express.Router();
const videoData = require('../data/dataManager');

router.get('/:videoId/', function (req, res) {

    let {videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    let video = videoData.getVideo(videoId);

    if (video === null) {

        res.send('Video is not registered');
    } else if (video.downloaded) {

        res.sendFile(`${videoData.videoDirectory}/${videoId}.mp4`);
    } else {

        res.send('Video is still being downloaded');
    }
});

module.exports = router;
