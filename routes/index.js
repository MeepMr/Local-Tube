const express = require('express');
const IndexRouter = express.Router();
const dataManager = require('../bin/dataManager');

/* GET home page. */
IndexRouter.get('/', function (req, res) {

    let videoList = dataManager.getVideoList();

    res.render('index', {

        title: 'Local-Tube',
        videos: videoList
    });
});

module.exports = IndexRouter;
