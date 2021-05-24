const express = require('express');
const router = express.Router();
const ytdl = require('../bin/getYouTube-dl');

router.get('/:vid/', function(req, res, next) {

    let {vid} = req.params;
    vid = decodeURIComponent(vid);

    /* response attachment for triggering download instead of stream */
    res.attachment(`${vid}.mp4`);

    ytdl(vid, res);
});

module.exports = router;