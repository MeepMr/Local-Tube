const spawn = require('child_process').spawn;

const dataManager = require('./dataManager');

/** @type {Boolean} disable Downloads for development reasons*/
const enableDownloads = true;

/** @type {videoObject[]} */
let queue = [];

/** @type {Boolean} */
let downloading = false;

/** @type {Boolean} */
let saveShutdown = false;

/**
 * @param video {videoObject}
 */
let addToQueue = function (video) {

    queue.push(video);
};

let tryDownload = async function () {

    if (!downloading && enableDownloads) {

        await startDownload();
    }
};

let startDownload = async function () {

    downloading = true;

    while (queue.length > 0) {

        let nextVideo = queue.pop();
        await downloadVideo(nextVideo);
        nextVideo.downloaded = true;
        dataManager.saveState();
    }

    if(saveShutdown) {

        dataManager.cleanUpAndExit();
    }

    downloading = false;
};

/**
 * @param video {videoObject}
 */
let downloadVideo = async function (video) {

    let videoId = video.identifier;
    await youTubeDl(videoId, `${dataManager.videoDirectory}/${videoId}`).catch(error => console.log(`YouTube-Dl exited with error ${error}`));
};

/**
 * @param videoId {String}
 * @param output {String}
 */
let youTubeDl = async function (videoId, output) {

    return new Promise( function (resolve, reject) {

        const dl = spawn('youtube-dl', [`https://www.youtube.com/watch?v=${videoId}`, '-f', `${dataManager.formatString}`, '-o', `${output}`]);

        dl.on('error', reject);
        dl.on('exit', resolve);
    });
};

module.exports.queue = queue;
module.exports.saveShutdown = saveShutdown;

module.exports.startDownload = tryDownload;
module.exports.addToQueue = addToQueue;

module.exports.youTubeDl = youTubeDl;
