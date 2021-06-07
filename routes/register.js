import express from 'express';
const registerRouter = express.Router();
import {addToQueue, tryDownload} from '../bin/download/downloadManager.js';
import {addVideo} from '../bin/fileSystem/dataManager.js';
import {videoObject} from '../models/Video.js';

registerRouter.get('/:videoId/:name?/', function (req, res) {

    let {videoId, name} = req.params;
    videoId = decodeURIComponent(videoId);
    name = name ? decodeURIComponent(name) : videoId;

    let video = new videoObject(name, videoId, new Date());

    if (addVideo(video)) {

        addToQueue(video);
        tryDownload().catch();
    }

    res.redirect(`/#${videoId}`);
});

export {registerRouter}
