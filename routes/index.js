import express from 'express';
import {videoList} from "../bin/fileSystem/dataFiles.js";
const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function (req, res) {

    res.render('index', {

        title: 'Local-Tube',
        videos: videoList
    });
});

export {indexRouter}
