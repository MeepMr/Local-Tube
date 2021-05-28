const express = require('express');
const router = express.Router();
const youTubeDl = require('../bin/getYouTube-dl');
const dataManager = require('../data/dataManager');
const fs = require('fs');

router.get('/:videoId/:name?/', async function (req, res) {

    let {videoId, name} = req.params;
    videoId = decodeURIComponent(videoId);
    name = name ? decodeURIComponent(name) : videoId;

    /* response attachment for triggering download instead of stream */
    res.attachment(`${name}.mp4`);

    if (dataManager.findVideo(videoId) !== -1) {

        res.sendFile(`${dataManager.videoDirectory}/${name}.mp4`);
    } else {

        await youTubeDl(videoId, `${dataManager.videoDirectory}/temp/${name}`);

        res.sendFile(`${dataManager.videoDirectory}/temp/${name}.mp4`);

        //Delete the downloaded file after the time specified in the config-File in seconds
        setTimeout(() => {

            fs.unlinkSync(`${dataManager.videoDirectory}/temp/${name}.mp4`);
        }, dataManager.tempDuration * 1000);
    }
});

module.exports = router;
