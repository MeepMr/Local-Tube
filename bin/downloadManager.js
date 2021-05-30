const exec = require('child_process').exec;
const meepUtils = require('../bin/meep-utils');
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
    } else if(!enableDownloads) {

        //Simulate a download of 30 Seconds
        console.log('Download Started');
        await meepUtils.delay(30*1000);
        console.log('Download Completed');
    }
};

let startDownload = async function () {

    downloading = true;

    while (queue.length > 0) {

        let nextVideo = queue.pop();
        let success = await downloadVideo(nextVideo);
        if(success) {
            nextVideo.downloaded = true;
        } else {

            nextVideo.failed++;
            queue.push(nextVideo);
        }
        dataManager.saveState();
    }

    if(saveShutdown) {

        dataManager.cleanUpAndExit();
    }

    downloading = false;
};

/**
 * @param video {videoObject}
 * @returns {Boolean}
 */
let downloadVideo = async function (video) {

    let videoId = video.identifier;
    try {

        await Promise.race([youTubeDl(videoId, `${dataManager.videoDirectory}/${videoId}`),
                                    meepUtils.delay(dataManager.downloadTimeout*60*1000, true, 'Download timed out')]);
        return true;
    } catch (error) {

        console.log(`Download Errored: ${error}`);
        return false;
    }
};

/**
 * @param videoId {String}
 * @param output {String}
 * @returns {Promise.<String>}
 */
let youTubeDl = async function (videoId, output) {

    return new Promise( function (resolve, reject) {

        exec(`youtube-dl 'https://www.youtube.com/watch?v=${videoId}' -f '${dataManager.formatString}' -r '${dataManager.bitrate}' -o '${output}'`,
            (error, buffer) => error ? reject(error) : resolve(buffer));
    });
};

module.exports.queue = queue;
module.exports.saveShutdown = saveShutdown;

module.exports.startDownload = tryDownload;
module.exports.addToQueue = addToQueue;

module.exports.youTubeDl = youTubeDl;
