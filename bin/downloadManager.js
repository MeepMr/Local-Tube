const youTubeDl = require('../bin/getYouTube-dl');
const dataManager = require('../data/dataManager');

/** @type {videoObject[]} */
let queue = [];

/** @type {boolean} */
let downloading = false;

/**
 * @param video {videoObject}
 */
let addToQueue = function (video) {

    queue.push(video);
};

let startDownload = async function () {

    if (!downloading) {

        downloading = true;
        console.log('Download Called');

        while (queue.length > 0) {

            let nextVideo = queue.pop();
            let videoId = nextVideo.identifier;

            await youTubeDl(videoId, `${dataManager.videoDirectory}/${videoId}`);

            nextVideo.downloaded = true;
        }

        console.log('Finished');
        downloading = false;
    }
};

module.exports.startDownload = startDownload;
module.exports.addToQueue = addToQueue;
