const express = require('express');
const router = express.Router();

router.get('/:videoId', function(req, res) {

  let {videoId} = req.params;
  videoId = decodeURIComponent(videoId);

  res.render('video', {title:videoId, videoId:videoId});
});

module.exports = router;
