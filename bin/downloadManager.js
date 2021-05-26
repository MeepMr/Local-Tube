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
    console.log(queue);
};

let startDownload = async function () {

    if (!downloading) {

        downloading = true;
        console.log('Download Called');

        while (queue.length > 0) {

            console.log('Current Queue: ');
            console.log(queue);

            let nextVideo = queue.pop();
            let videoId = nextVideo.identifier;

            youTubeDl(videoId, `${dataManager.videoDirectory}/${videoId}`);

            nextVideo.downloaded = true;
        }

        console.log('Finished');
        downloading = false;
    }
};

module.exports.startDownload = startDownload;
module.exports.addToQueue = addToQueue;
