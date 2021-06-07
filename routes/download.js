import express from 'express';
const downloadRouter = express.Router();

import {youTubeDl} from '../bin/download/downloadManager.js';
import {configurationFile, findVideo, serverConfiguration} from '../bin/fileSystem/dataManager.js';
import fs from 'fs'
import {spliceVideoId} from "../bin/web-server/module-loader.js";
import {videoObject} from "../models/Video.js";

downloadRouter.get('/:videoId/:name?/', async function (req, res) {

    let {videoId, name} = req.params;
    videoId = decodeURIComponent(videoId);
    name = name ? decodeURIComponent(name) : videoId;

    if (findVideo(videoId) !== -1) {

        sendDownloadedVideo(res, videoId, name, true);

    } else {

        res.render('download', {

            link: `${serverConfiguration.domain}/download/file/${videoId}/${name}`,
            videoId: videoId,
            name: name,
        });

        let video = new videoObject(name, videoId, new Date());
        let {module, identifier} = spliceVideoId(videoId);

        await youTubeDl(module.getUrl(video, identifier), `${serverConfiguration.videoDirectory}/temp/${module.getOutPut(videoId)}`).catch(error => `YouTube-Dl errored with ${error}`);

        //Delete the downloaded file after the time specified in the config-File in minutes
        setTimeout(() => {

            fs.unlinkSync(`${serverConfiguration.videoDirectory}/temp/${videoId}.mp4`);
        }, configurationFile.temporaryDuration * 60 * 1000);
    }
});

downloadRouter.get('/file/:videoId/:name/', function (req, res) {

    let {videoId, name} = req.params;
    videoId = decodeURIComponent(videoId);
    name = decodeURIComponent(name);

    if(fs.existsSync(`${serverConfiguration.videoDirectory}/temp/${videoId}.mp4`)) {

        sendDownloadedVideo(res, videoId, name, false);
    } else {

        res.send('Video is still being downloaded');
    }
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
        res.sendFile(`${serverConfiguration.videoDirectory}/${videoId}.mp4`);
    else
        res.sendFile(`${serverConfiguration.videoDirectory}/temp/${videoId}.mp4`);
};

export {downloadRouter}
