import {exec} from 'child_process';
import {delay} from '../meep-utils.js';
import {
    addVideoToList,
    configurationFile,
    formatString,
    serverConfiguration
} from '../fileSystem/dataManager.js';
import {addToFailedList, getReadyVideos} from "./failedDownloads.js";
import {failedDownloads, newVideos} from "../fileSystem/dataFiles.js";
import {spliceVideoId} from "../web-server/module-loader.js";
import {cleanUpAndExit} from "../web-server/startup-exit.js";

/** @type {Boolean} disable Downloads for development reasons*/
let enableDownloads = true;

/** @type {videoObject[]} */
const queue = [];

/** @type {Boolean} */
let downloading = false;

/** @type {Boolean} */
let saveShutdown = false;

/**
 * @param video {videoObject}
 */
const addToQueue = function (video) {

    queue.push(video);
};

const tryDownload = async function () {

    if (!downloading && enableDownloads) {

        await startDownload();
    } else if(!enableDownloads) {

        //Simulate a download of 10 Seconds
        console.log('Download Started');
        queue.pop();
        await delay(10*1000);
        console.log('Download Completed');
    }
};

const startDownload = async function () {

    downloading = true;
    let nextVideo;

    await downloadThumbnails(queue);
    while (queue.length > 0) {

        nextVideo = queue.pop();
        const {module, identifier} = spliceVideoId(nextVideo.identifier);

        const success = await downloadVideo(module.getUrl(nextVideo, identifier), module.getOutPut(nextVideo.identifier));
        if(success) {
            nextVideo.downloaded = true;
            if(nextVideo.lastDownload !== null) {

                nextVideo.date = new Date();
                addVideoToList(nextVideo, newVideos);
            }
        } else {

            nextVideo.failed++;

            if(nextVideo.failed < 10)
                queue.push(nextVideo);
             else
                addToFailedList(nextVideo);
        }

        if(queue.length === 0 && failedDownloads.length > 0 ) {

            getReadyVideos().forEach(addToQueue);
        }
    }

    if(saveShutdown) {

        cleanUpAndExit();
    }

    downloading = false;
};

/**
 * @param url {String}
 * @param outPut {String}
 * @returns {Boolean}
 */
const downloadVideo = async function (url, outPut) {

    try {

        console.log(`Downloading video: ${url}`);
        await Promise.race([youTubeDl(url, `${serverConfiguration.videoDirectory}/${outPut}`, `-f '${formatString}'`),
                            delay(configurationFile.downloadTimeout*60*1000, true, 'Video-Download timed out')]);
        return true;
    } catch (error) {

        console.log(`Download Errored: ${error}`);
        return false;
    }
};

/**
 * @param videoArray {videoObject[]}
 */
const downloadThumbnails = async function (videoArray) {

    for (let video of videoArray) {

        const {module, identifier} = spliceVideoId(video.identifier);
        await downloadThumbnail(module.getUrl(video, identifier), module.getOutPut(video.identifier));
    }
};

/**
 * @param url {String}
 * @param outPut {String}
 * @returns {Boolean}
 */
const downloadThumbnail = async function (url, outPut) {

    try {

        console.log(`Downloading Thumbnail for: ${url}`);
        await Promise.race([youTubeDl(url, `${serverConfiguration.videoDirectory}/${outPut}`, `--write-thumbnail --skip-download -f 'best[ext=webp]/best[ext=jpg]/best'`),
                            delay(configurationFile.downloadTimeout*60*1000, true, 'Thumbnail-Download timed out')]);
        return true;
    } catch (error) {

        console.log(`Download Errored: ${error}`);
        return false;
    }
};

/**
 * @param url {String}
 * @param output {String}
 * @param [options] {String}
 * @returns {Promise.<String>}
 */
const youTubeDl = async function (url, output, options = '') {

    return new Promise( function (resolve, reject) {

        exec(`youtube-dl '${url}' -r '${configurationFile.bitrate}' ${options} -o '${output}'`,
            (error, buffer) => error ? reject(error) : resolve(buffer));
    });
};

const disableDownloads = function () {

    enableDownloads = false;
};

export {queue, saveShutdown, disableDownloads}
export {tryDownload, addToQueue, youTubeDl}
