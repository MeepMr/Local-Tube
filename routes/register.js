const express = require('express');
const router = express.Router();
const youTubeDl = require('../bin/getYouTube-dl');
const videoData = require('../data/dataManager');
const videoObject = require('../models/Video');
const fs = require('fs');

router.get('/:videoId/:name?/', function(req, res) {

  let {videoId, name} = req.params;
  videoId = decodeURIComponent(videoId);
  name = name ? decodeURIComponent(name) : videoId;

  let video = new videoObject(name, videoId, new Date());

  if(videoData.addVideo(video)) {

    let stream = fs.createWriteStream(`${videoData.videoDirectory}/${videoId}.mp4`);
    youTubeDl(videoId, stream);
  }

  res.send(`${videoData.domain}/watch/${videoId}`);
});

module.exports = router;
