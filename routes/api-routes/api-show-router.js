import express from "express";
import {getNewVideosList} from "../../bin/fileSystem/dataManager.js";
import {videoList} from "../../bin/fileSystem/dataFiles.js";

const apiShowRouter = express.Router();

apiShowRouter.get('/newVideos', function (req, res) {

    res.send(getNewVideosList());
});

apiShowRouter.get('/randomVideo', function (req, res) {

    let videoId;
    let number = Math.floor( Math.random() * 100 ) % videoList.size;

    for (let video of videoList.values()) {

        if(number === 0) {

            videoId = video.identifier;
            break;
        } else {

            number--;
        }
    }

    res.send(videoId);
});

export {apiShowRouter}
