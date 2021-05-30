const express = require('express');
const router = express.Router();

const youTubeDl = require('../bin/downloadManager').youTubeDl;
const dataManager = require('../bin/dataManager');
const fs = require('fs');

router.get('/:videoId/:name?/', async function (req, res) {

    let {videoId, name} = req.params;
    videoId = decodeURIComponent(videoId);
    name = name ? decodeURIComponent(name) : videoId;

    if (dataManager.findVideo(videoId) !== -1) {

        sendDownloadedVideo(res, videoId, name, true);

    } else {

        await youTubeDl(videoId, `${dataManager.videoDirectory}/temp/${videoId}`).catch(error => `YouTube-Dl errored with ${error}`);
        res.redirect(`/download/file/${videoId}/${name}`);

        //Delete the downloaded file after the time specified in the config-File in seconds
        setTimeout(() => {

            fs.unlinkSync(`${dataManager.videoDirectory}/temp/${videoId}.mp4`);
        }, dataManager.tempDuration * 1000);
    }
});

router.get('/file/:videoId/:name/', function (req, res) {

    let {videoId, name} = req.params;
    videoId = decodeURIComponent(videoId);
    name = decodeURIComponent(name);

    sendDownloadedVideo(res, videoId, name, false);
});

/**
 * @param res {Response}
 * @param videoId {String}
 * @param fileName {String}
 * @param registered {Boolean} Was the Video already registered?
 */
let sendDownloadedVideo = function(res, videoId, fileName, registered) {

    res.attachment(`${fileName}.mp4`);

    if(registered)
        res.sendFile(`${dataManager.videoDirectory}/${videoId}.mp4`);
    else
        res.sendFile(`${dataManager.videoDirectory}/temp/${videoId}.mp4`);
};

module.exports = router;
