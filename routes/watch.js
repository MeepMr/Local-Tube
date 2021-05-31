import express from 'express';
const watchRouter = express.Router();
import {getVideo, serverConfiguration} from '../bin/fileSysem/dataManager.js';

watchRouter.get('/:videoId/', function (req, res) {

    let {videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    let video = getVideo(videoId);

    if (video === null) {

        res.send('Video is not registered');
    } else if (video.downloaded) {

        res.sendFile(`${serverConfiguration.videoDirectory}/${videoId}.mp4`);
    } else {

        if(video.failed > 0) {

            res.send(`Video is in the download-Queue. Download has failed ${video.failed} times`);
        } else {

            res.send('Video is still being downloaded');
        }
    }
});

export {watchRouter}
