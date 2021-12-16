import express from "express";
import {deleteAllVideos, deleteVideo} from "../../bin/fileSystem/dataManager.js";

const deleteRouter = express.Router();

deleteRouter.get('/all/', function (req, res) {

    deleteAllVideos();
    res.redirect('/');
});

deleteRouter.get('/:vid/', function (req, res) {

    let {vid: videoId} = req.params;
    videoId = decodeURIComponent(videoId);

    deleteVideo(videoId);
    res.redirect('/');
});

export {deleteRouter};
