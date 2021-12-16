import express from "express";
import registerVideo from "../../bin/video-management/registration.js";

const apiRegisterRouter = express.Router();

apiRegisterRouter.get('/:videoId', function (req, res) {

    let {videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    res.send(registerVideo(videoId, videoId, true));
});

export {apiRegisterRouter}
