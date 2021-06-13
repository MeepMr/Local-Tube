import express from 'express';
const watchRouter = express.Router();
import {getVideo} from '../../bin/fileSystem/dataManager.js';
import {videoList} from "../../bin/fileSystem/dataFiles.js";

watchRouter.get('/:videoId/', function (req, res) {

    let {videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    let video = getVideo(videoId);

    if (video === undefined) {

        res.render('watch', {
            error: true,
            errorMessage: 'Video is not registered',
            video: undefined,
            videoId: videoId,
            videoList: videoList
        });
    } else if (video.downloaded) {

        res.render('watch', {
            error: false,
            errorMessage: undefined,
            video: video,
            videoId: videoId,
            videoList: videoList
        });
    } else {

        if(video.failed > 0) {

            res.render('watch', {
                error: true,
                errorMessage: `Video is in the download-Queue. Download has failed ${video.failed} times`,
                video: undefined,
                videoId: videoId,
                videoList: videoList
            });
        } else {

            res.render('watch', {
                error: true,
                errorMessage: 'Video is still the download-Queue.',
                video: undefined,
                videoId: videoId,
                videoList: videoList
            });
        }
    }
});

watchRouter.get('/watchedTime/:videoId/:watchedSeconds', function (req, res) {

    let {videoId, watchedSeconds} = req.params;
    videoId = decodeURIComponent(videoId);
    watchedSeconds = decodeURIComponent(watchedSeconds);

    getVideo(videoId).watchedSeconds = watchedSeconds;
    res.end();
});

watchRouter.get('/duration/:videoId/:videoDuration', function (req, res) {

    let {videoId, videoDuration} = req.params;
    videoId = decodeURIComponent(videoId);
    videoDuration = decodeURIComponent(videoDuration);

    getVideo(videoId).duration = videoDuration;
    res.end();
});

watchRouter.get('/watchedTime/:videoId', function (req, res) {

    let {videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    let watchedSeconds = getVideo(videoId).watchedSeconds;
    watchedSeconds = watchedSeconds === undefined ? 0 : watchedSeconds;

    res.type('application/json');
    res.json({watchedSeconds});
});

export {watchRouter}
