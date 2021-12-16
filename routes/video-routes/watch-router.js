import express from 'express';
import {getVideo} from '../../bin/fileSystem/dataManager.js';
import {videoList} from "../../bin/fileSystem/dataFiles.js";
import {spliceVideoId} from "../../bin/web-server/module-loader.js";

const watchRouter = express.Router();

watchRouter.get('/:videoId/', function (req, res) {

    let {videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    const video = getVideo(videoId);

    if (video === undefined)
        sendWatchErrorPage(res, videoId, 'Video is not registered');

    else if (video.downloaded)
        sendWatchPage(res, video);

    else if(video.failed > 0)
            sendWatchErrorPage(res, videoId, `Video is in the download-Queue. Download has failed ${video.failed} times`);

    else
        sendWatchErrorPage(res, videoId, 'Video is still the download-Queue.');
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

/**
 * @param res {Response}
 * @param videoId {String}
 * @param errorMessage {String}
 */
const sendWatchErrorPage = function (res, videoId, errorMessage) {

    res.render('watch', {
        error: true,
        errorMessage: errorMessage,
        video: undefined,
        videoId: videoId,
        videoList: videoList,
        videoUrl: undefined,
        moduleName: undefined
    });
};

/**
 * @param res {Response}
 * @param video {videoObject}
 */
const sendWatchPage = function (res, video) {

    const {module} = spliceVideoId(video.identifier);

    res.render('watch', {
        error: false,
        errorMessage: undefined,
        video: video,
        videoId: video.identifier,
        videoList: videoList,
        videoUrl: module.getUrl(video),
        moduleName: module.moduleName
    });
};

export {watchRouter}
