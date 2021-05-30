import {exec} from 'child_process';
import {delay} from './meep-utils.js';
import {cleanUpAndExit, configurationFile, formatString, saveLists, serverConfiguration} from './dataManager.js';

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
        await delay(30*1000);
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
        saveLists();
    }

    if(saveShutdown) {

        cleanUpAndExit();
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

        await Promise.race([youTubeDl(videoId, `${serverConfiguration.videoDirectory}/${videoId}`),
                                    delay(configurationFile.downloadTimeout*60*1000, true, 'Download timed out')]);
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

        exec(`youtube-dl 'https://www.youtube.com/watch?v=${videoId}' -f '${formatString}' -r '${configurationFile.bitrate}' -o '${output}'`,
            (error, buffer) => error ? reject(error) : resolve(buffer));
    });
};

export {queue, saveShutdown}
export {tryDownload, addToQueue, youTubeDl}
