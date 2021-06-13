import express from 'express';
import registerVideo from "../../bin/video-management/registration.js";
const registerRouter = express.Router();

registerRouter.get('/:videoId/:name?/', function (req, res) {

    let {videoId, name} = req.params;
    videoId = decodeURIComponent(videoId);
    name = name ? decodeURIComponent(name) : videoId;

    registerVideo(name, videoId);

    res.redirect(`/#${videoId}`);
});

export {registerRouter}
