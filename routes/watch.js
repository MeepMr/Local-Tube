const express = require('express');
const router = express.Router();
const videoData = require('../data/dataManager');

router.get('/:videoId/', function(req, res) {

  let {videoId} = req.params;
  videoId = decodeURIComponent(videoId);

  if(videoData.findVideo(videoId)) {

    res.sendFile(`${videoData.videoDirectory}/${videoId}.mp4`);
  }
});

module.exports = router;
