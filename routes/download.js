const express = require('express');
const router = express.Router();
const youTubeDl = require('../bin/getYouTube-dl');

router.get('/:vid/:name?/', function(req, res) {

    let {vid, name} = req.params;
    vid = decodeURIComponent(vid);
    name = name ? decodeURIComponent(name) : vid;

    /* response attachment for triggering download instead of stream */
    res.attachment(`${name}.mp4`);

    youTubeDl(vid, res);
});

module.exports = router;