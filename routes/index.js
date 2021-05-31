import express from 'express';
const indexRouter = express.Router();
import {getVideoList} from '../bin/fileSysem/dataManager.js';

/* GET home page. */
indexRouter.get('/', function (req, res) {

    let videoList = getVideoList();

    res.render('index', {

        title: 'Local-Tube',
        videos: videoList
    });
});

export {indexRouter}
