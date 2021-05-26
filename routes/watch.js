const express = require('express');
const router = express.Router();
const videoData = require('../data/dataManager');

router.get('/:videoId/', function(req, res) {

  let {videoId} = req.params;
  videoId = decodeURIComponent(videoId);

  if(videoData.findVideo(videoId) !== -1) {

    res.sendFile(`${videoData.videoDirectory}/${videoId}.mp4`);
  } else {

    res.send('Video is not registered');
  }
});

module.exports = router;
