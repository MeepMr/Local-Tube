const express = require('express');
const router = express.Router();
const youTubeDl = require('../bin/getYouTube-dl');
const dataManager = require('../data/dataManager');
const videoObject = require('../models/Video');

router.get('/:videoId/:name?/', function(req, res) {

  let {videoId, name} = req.params;
  videoId = decodeURIComponent(videoId);
  name = name ? decodeURIComponent(name) : videoId;

  let video = new videoObject(name, videoId, new Date());

  if(dataManager.addVideo(video)) {

    youTubeDl(videoId, `${dataManager.videoDirectory}/${videoId}`)
        .then(exitCode => console.log(`YouTube-dl exited with code ${exitCode}`))
        .catch(errorCode => console.log(`YouTube-dl crashed with error ${errorCode}`));
  }

  res.send(`${dataManager.domain}/watch/${videoId}`);
});

module.exports = router;
