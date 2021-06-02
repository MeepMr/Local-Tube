import express from 'express';
const watchRouter = express.Router();
import {getVideo} from '../bin/fileSysem/dataManager.js';

watchRouter.get('/:videoId/', function (req, res) {

    let {videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    let video = getVideo(videoId);

    if (video === null) {

        res.render('watch', {
            error: true,
            errorMessage: 'Video is not registered',
            video: undefined,
            videoId: videoId
        });
    } else if (video.downloaded) {

        res.render('watch', {
            error: false,
            errorMessage: undefined,
            video: video,
            videoId: videoId
        });
    } else {

        if(video.failed > 0) {

            res.render('watch', {
                error: true,
                errorMessage: `Video is in the download-Queue. Download has failed ${video.failed} times`,
                video: undefined,
                videoId: videoId
            });
        } else {

            res.render('watch', {
                error: true,
                errorMessage: 'Video is still the download-Queue.',
                video: undefined,
                videoId: videoId
            });
        }
    }
});

watchRouter.get('/percent/:videoId/:percent', function (req, res) {

    let {videoId, percent} = req.params;
    videoId = decodeURIComponent(videoId);
    percent = decodeURIComponent(percent);

    getVideo(videoId).percentPlayed = percent;
    res.end();
});

watchRouter.get('/percent/:videoId', function (req, res) {

    let {videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    let percent = getVideo(videoId).percentPlayed;
    if (percent === undefined)
        percent = 0;

    res.type('application/json');
    res.json({percent});
});

export {watchRouter}
