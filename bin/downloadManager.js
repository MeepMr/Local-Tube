const exec = require('child_process').exec;
const dataManager = require('./dataManager');

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

let tryDownload = async function () {

    if (!downloading) {

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

    downloading = false;
};

/**
 * @param video {videoObject}
 */
let downloadVideo = async function (video) {

    let videoId = video.identifier;
    await youTubeDl(videoId, `${dataManager.videoDirectory}/${videoId}`);
};

/**
 * @param videoId {String}
 * @param output {String}
 */
let youTubeDl = async function (videoId, output) {

    return new Promise( function (resolve, reject) {

        exec(`youtube-dl 'https://www.youtube.com/watch?v=${videoId}' -f '${dataManager.formatString}' -o '${output}'`,
            (error, buffer) => error ? reject(error) : resolve(buffer));
    });
};

module.exports.startDownload = tryDownload;
module.exports.addToQueue = addToQueue;

module.exports.youTubeDl = youTubeDl;
